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

# Create a wrapper script that uses Railway's PORT
RUN echo '#!/bin/sh\nPORT=${PORT:-4173}\necho "Starting serve on port: $PORT"\nexec serve -s dist -l $PORT' > start.sh && chmod +x start.sh

# Start the application
CMD ["./start.sh"] 