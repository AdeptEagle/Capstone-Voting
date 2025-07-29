# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the Vite application
RUN npm run build

# Install serve globally
RUN npm install -g serve

# Remove dev dependencies to reduce image size
RUN npm prune --production

# Expose port
EXPOSE 4173

# Start the application with serve using Railway's PORT
CMD ["sh", "-c", "PORT=${PORT:-4173} && echo 'Starting serve on port: $PORT' && serve -s dist -l $PORT"] 