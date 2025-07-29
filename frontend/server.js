import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 4173;

console.log('Starting frontend server...');
console.log('Port:', port);
console.log('Directory:', __dirname);

try {
  const server = http.createServer((req, res) => {
    console.log(`Request: ${req.method} ${req.url}`);
    
    if (req.url === '/health') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('healthy');
      return;
    }
    
    let filePath = path.join(__dirname, 'dist', req.url === '/' ? 'index.html' : req.url);
    console.log('Looking for file:', filePath);
    
    if (!fs.existsSync(filePath)) {
      console.log('File not found, serving index.html');
      filePath = path.join(__dirname, 'dist', 'index.html');
    }
    
    const ext = path.extname(filePath);
    const contentType = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon'
    }[ext] || 'application/octet-stream';
    
    fs.readFile(filePath, (err, content) => {
      if (err) {
        console.error('Error reading file:', err.message);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error loading ' + req.url + ': ' + err.message);
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  });
  
  server.listen(port, '0.0.0.0', () => {
    console.log(`Frontend server running at http://0.0.0.0:${port}/`);
    console.log('Server is ready for requests!');
  });
  
  server.on('error', (err) => {
    console.error('Server error:', err.message);
    process.exit(1);
  });
  
} catch (error) {
  console.error('Startup error:', error.message);
  process.exit(1);
} 