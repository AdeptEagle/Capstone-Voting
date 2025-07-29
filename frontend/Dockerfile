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

# Create a simple HTTP server script using ES modules
RUN echo 'import http from "http"; import fs from "fs"; import path from "path"; import { fileURLToPath } from "url"; const __filename = fileURLToPath(import.meta.url); const __dirname = path.dirname(__filename); const port = 4173; const server = http.createServer((req, res) => { let filePath = path.join(__dirname, "dist", req.url === "/" ? "index.html" : req.url); if (!fs.existsSync(filePath)) { filePath = path.join(__dirname, "dist", "index.html"); } const ext = path.extname(filePath); const contentType = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".gif": "image/gif", ".svg": "image/svg+xml", ".ico": "image/x-icon" }[ext] || "application/octet-stream"; fs.readFile(filePath, (err, content) => { if (err) { res.writeHead(500); res.end("Error loading " + req.url); } else { res.writeHead(200, { "Content-Type": contentType }); res.end(content); } }); }); server.listen(port, "0.0.0.0", () => { console.log(`Server running at http://0.0.0.0:${port}/`); });' > server.js

# Start the application
CMD ["node", "server.js"] 