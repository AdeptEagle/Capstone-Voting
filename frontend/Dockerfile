# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Expose port
EXPOSE 4173

# Create the simplest possible test server
RUN echo 'const http = require("http"); const port = process.env.PORT || 4173; console.log("Starting minimal test server..."); console.log("Port:", port); const server = http.createServer((req, res) => { console.log("Request received:", req.method, req.url); res.writeHead(200, {"Content-Type": "text/html"}); res.end("<h1>Frontend Test Server Working!</h1><p>Port: " + port + "</p><p>Request: " + req.url + "</p>"); }); server.listen(port, "0.0.0.0", () => { console.log("Server is running on port " + port); console.log("Ready for requests!"); });' > test-server.cjs

# Start the application
CMD ["node", "test-server.cjs"] 