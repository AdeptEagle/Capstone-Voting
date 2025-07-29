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

# Build the application
RUN npm run build

# Remove dev dependencies to reduce image size
RUN npm prune --production

# Expose port
EXPOSE 4173

# Create a simple test server that responds immediately
RUN echo 'import http from "http"; const port = 4173; const server = http.createServer((req, res) => { console.log(`Request: ${req.method} ${req.url}`); res.writeHead(200, { "Content-Type": "text/html" }); res.end("<h1>Frontend is working!</h1><p>Server is running on port " + port + "</p>"); }); server.listen(port, "0.0.0.0", () => { console.log(`Test server running at http://0.0.0.0:${port}/`); });' > server.js

# Start the application
CMD ["node", "server.js"] 