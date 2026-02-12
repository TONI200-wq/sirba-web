const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  console.log("Request:", req.url);

  // 🔥 Nettoyage URL
  let filePath = req.url === "/" ? "index.html" : req.url.slice(1);

  const fullPath = path.join(__dirname, "public", filePath);

  const extname = path.extname(fullPath).toLowerCase();

  const contentTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".ico": "image/x-icon"
  };

  const contentType = contentTypes[extname] || "text/plain";

  fs.readFile(fullPath, (err, content) => {
    if (err) {
      console.log("File not found:", fullPath);
      res.writeHead(404);
      return res.end("Page non trouvée");
    }

    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  });
});

const PORT = process.env.PORT;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 SIRBA Web démarré sur le port ${PORT}`);
});
