# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Expose port
EXPOSE 4173

# Create a server that follows Railway's exact specifications
RUN echo 'const http = require("http"); const port = process.env.PORT || 4173; console.log("Starting Railway-compatible server..."); console.log("PORT env var:", process.env.PORT); console.log("Using port:", port); const server = http.createServer((req, res) => { console.log("Request received:", req.method, req.url); try { res.writeHead(200, {"Content-Type": "text/html"}); res.end("<h1>Railway Frontend Server Working!</h1><p>Port: " + port + "</p><p>Request: " + req.url + "</p>"); } catch (error) { console.error("Error handling request:", error); res.writeHead(500, {"Content-Type": "text/plain"}); res.end("Internal Server Error"); } }); server.listen(port, "0.0.0.0", () => { console.log("Server listening on 0.0.0.0:" + port); console.log("Ready for Railway Edge Proxy!"); }); server.on("error", (error) => { console.error("Server error:", error); process.exit(1); });' > server.cjs

# Start the application
CMD ["node", "server.cjs"] 