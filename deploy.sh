#!/bin/bash

# Voting System Deployment Script
# This script automates the deployment process for the voting system

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="voting-system"
ENVIRONMENT=${1:-production}
DOMAIN=${2:-localhost}

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_requirements() {
    log_info "Checking deployment requirements..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Check if .env file exists
    if [ ! -f ".env" ]; then
        log_warning ".env file not found. Creating from template..."
        cp backend/env.example .env
        log_warning "Please edit .env file with your configuration before continuing."
        exit 1
    fi
    
    log_success "Requirements check passed"
}

setup_environment() {
    log_info "Setting up environment variables..."
    
    # Load environment variables
    if [ -f ".env" ]; then
        export $(cat .env | grep -v '^#' | xargs)
    fi
    
    # Set default values if not provided
    export NODE_ENV=${NODE_ENV:-production}
    export DB_HOST=${DB_HOST:-localhost}
    export DB_USER=${DB_USER:-root}
    export DB_PASSWORD=${DB_PASSWORD:-root}
    export DB_NAME=${DB_NAME:-voting_system}
    export JWT_SECRET=${JWT_SECRET:-$(openssl rand -base64 32)}
    export CORS_ORIGIN=${CORS_ORIGIN:-http://$DOMAIN}
    
    log_success "Environment variables configured"
}

create_directories() {
    log_info "Creating necessary directories..."
    
    mkdir -p backend/logs
    mkdir -p backend/uploads
    mkdir -p backend/backups
    mkdir -p ssl
    mkdir -p monitoring
    
    log_success "Directories created"
}

setup_ssl() {
    if [ "$ENVIRONMENT" = "production" ] && [ "$DOMAIN" != "localhost" ]; then
        log_info "Setting up SSL certificates..."
        
        if [ ! -f "ssl/cert.pem" ] || [ ! -f "ssl/key.pem" ]; then
            log_warning "SSL certificates not found. Generating self-signed certificates..."
            
            # Generate self-signed certificate
            openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
                -keyout ssl/key.pem \
                -out ssl/cert.pem \
                -subj "/C=US/ST=State/L=City/O=Organization/CN=$DOMAIN"
        fi
        
        log_success "SSL certificates configured"
    fi
}

setup_monitoring() {
    if [ "$ENVIRONMENT" = "production" ]; then
        log_info "Setting up monitoring configuration..."
        
        # Create Prometheus configuration
        cat > monitoring/prometheus.yml << EOF
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'voting-system-backend'
    static_configs:
      - targets: ['backend:3000']
    metrics_path: '/metrics'

  - job_name: 'voting-system-frontend'
    static_configs:
      - targets: ['frontend:80']
    metrics_path: '/health'
EOF
        
        log_success "Monitoring configuration created"
    fi
}

build_images() {
    log_info "Building Docker images..."
    
    # Build backend image
    log_info "Building backend image..."
    docker build -t voting-system-backend ./backend
    
    # Build frontend image
    log_info "Building frontend image..."
    docker build -t voting-system-frontend ./frontend
    
    log_success "Docker images built successfully"
}

deploy_services() {
    log_info "Deploying services..."
    
    # Stop existing containers
    docker-compose down --remove-orphans
    
    # Start services
    if [ "$ENVIRONMENT" = "production" ]; then
        docker-compose --profile monitoring up -d
    else
        docker-compose up -d
    fi
    
    log_success "Services deployed successfully"
}

wait_for_services() {
    log_info "Waiting for services to be ready..."
    
    # Wait for MySQL
    log_info "Waiting for MySQL..."
    timeout=60
    while ! docker-compose exec -T mysql mysqladmin ping -h"localhost" --silent; do
        if [ $timeout -le 0 ]; then
            log_error "MySQL failed to start within timeout"
            exit 1
        fi
        sleep 2
        timeout=$((timeout-2))
    done
    
    # Wait for Redis
    log_info "Waiting for Redis..."
    timeout=30
    while ! docker-compose exec -T redis redis-cli ping; do
        if [ $timeout -le 0 ]; then
            log_error "Redis failed to start within timeout"
            exit 1
        fi
        sleep 2
        timeout=$((timeout-2))
    done
    
    # Wait for Backend
    log_info "Waiting for Backend..."
    timeout=60
    while ! curl -f http://localhost:3000/health; do
        if [ $timeout -le 0 ]; then
            log_error "Backend failed to start within timeout"
            exit 1
        fi
        sleep 2
        timeout=$((timeout-2))
    done
    
    # Wait for Frontend
    log_info "Waiting for Frontend..."
    timeout=30
    while ! curl -f http://localhost/health; do
        if [ $timeout -le 0 ]; then
            log_error "Frontend failed to start within timeout"
            exit 1
        fi
        sleep 2
        timeout=$((timeout-2))
    done
    
    log_success "All services are ready"
}

initialize_database() {
    log_info "Initializing database..."
    
    # Run database creation script
    docker-compose exec backend node scripts/create-database.js
    
    log_success "Database initialized successfully"
}

show_status() {
    log_info "Deployment Status:"
    echo "=================="
    
    # Show running containers
    docker-compose ps
    
    echo ""
    log_info "Service URLs:"
    echo "Frontend: http://$DOMAIN"
    echo "Backend API: http://$DOMAIN/api"
    if [ "$ENVIRONMENT" = "production" ]; then
        echo "Monitoring: http://$DOMAIN:9090"
        echo "Grafana: http://$DOMAIN:3001"
    fi
    
    echo ""
    log_info "Default Login Credentials:"
    echo "Superadmin: superadmin / superadmin123"
    echo "Admin: admin1 / admin123"
    
    echo ""
    log_info "Useful Commands:"
    echo "View logs: docker-compose logs -f"
    echo "Stop services: docker-compose down"
    echo "Restart services: docker-compose restart"
    echo "Update services: ./deploy.sh update"
}

update_services() {
    log_info "Updating services..."
    
    # Pull latest changes
    git pull origin main
    
    # Rebuild and restart services
    build_images
    deploy_services
    wait_for_services
    
    log_success "Services updated successfully"
}

backup_database() {
    log_info "Creating database backup..."
    
    timestamp=$(date +%Y%m%d_%H%M%S)
    backup_file="backup_${timestamp}.sql"
    
    docker-compose exec mysql mysqldump -u root -p${DB_PASSWORD} ${DB_NAME} > "backend/backups/$backup_file"
    
    log_success "Database backup created: backend/backups/$backup_file"
}

# Main deployment process
main() {
    case "$1" in
        "update")
            update_services
            ;;
        "backup")
            backup_database
            ;;
        "stop")
            log_info "Stopping services..."
            docker-compose down
            log_success "Services stopped"
            ;;
        "logs")
            docker-compose logs -f
            ;;
        "restart")
            log_info "Restarting services..."
            docker-compose restart
            log_success "Services restarted"
            ;;
        *)
            log_info "Starting deployment process..."
            check_requirements
            setup_environment
            create_directories
            setup_ssl
            setup_monitoring
            build_images
            deploy_services
            wait_for_services
            initialize_database
            show_status
            log_success "Deployment completed successfully!"
            ;;
    esac
}

# Run main function with all arguments
main "$@" 