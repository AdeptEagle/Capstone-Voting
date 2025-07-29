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

# Create a simple test server that just responds
RUN echo 'const http = require("http"); const port = process.env.PORT || 4173; console.log("Starting test server on port:", port); const server = http.createServer((req, res) => { console.log("Request:", req.method, req.url); res.writeHead(200, {"Content-Type": "text/html"}); res.end("<h1>Frontend Test Server Working!</h1><p>Port: " + port + "</p><p>Request: " + req.url + "</p>"); }); server.listen(port, "0.0.0.0", () => { console.log("Test server running at http://0.0.0.0:" + port); });' > test-server.cjs

# Start the application
CMD ["node", "test-server.cjs"] 