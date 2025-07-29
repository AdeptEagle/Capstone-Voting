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

# Create a minimal server script
RUN echo 'const http = require("http"); const fs = require("fs"); const path = require("path"); const port = process.env.PORT || 4173; console.log("Starting server on port:", port); const server = http.createServer((req, res) => { console.log("Request:", req.method, req.url); if (req.url === "/health") { res.writeHead(200, {"Content-Type": "text/plain"}); res.end("healthy"); return; } let filePath = path.join(__dirname, "dist", req.url === "/" ? "index.html" : req.url); if (!fs.existsSync(filePath)) { filePath = path.join(__dirname, "dist", "index.html"); } const ext = path.extname(filePath); const contentType = {".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".gif": "image/gif", ".svg": "image/svg+xml", ".ico": "image/x-icon"}[ext] || "application/octet-stream"; fs.readFile(filePath, (err, content) => { if (err) { console.error("Error:", err.message); res.writeHead(500, {"Content-Type": "text/plain"}); res.end("Error: " + err.message); } else { res.writeHead(200, {"Content-Type": contentType}); res.end(content); } }); }); server.listen(port, "0.0.0.0", () => { console.log("Server running at http://0.0.0.0:" + port); });' > server.js

# Start the application
CMD ["node", "server.js"] 