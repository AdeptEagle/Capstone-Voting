# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Expose port
EXPOSE 4173

# Create the simplest possible server that just responds
RUN echo 'const http = require("http"); const port = process.env.PORT || 4173; console.log("Starting simple server on port:", port); const server = http.createServer((req, res) => { console.log("Request:", req.method, req.url); res.writeHead(200, {"Content-Type": "text/html"}); res.end("OK"); }); server.listen(port, "0.0.0.0", () => { console.log("Server ready on port", port); });' > server.cjs

# Start the application
CMD ["node", "server.cjs"] 