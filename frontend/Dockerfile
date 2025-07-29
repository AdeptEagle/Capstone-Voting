# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Expose port
EXPOSE 4173

# Create server exactly like Railway's documentation example
RUN echo 'const http = require("http"); const port = process.env.PORT || 4173; console.log("Starting server exactly like Railway docs..."); const server = http.createServer((req, res) => { console.log("Request:", req.method, req.url); res.writeHead(200, {"Content-Type": "text/plain"}); res.end("Hello from Railway!"); }); server.listen(port, "0.0.0.0", function () { console.log("Server running on port " + port); });' > server.cjs

# Start the application
CMD ["node", "server.cjs"] 