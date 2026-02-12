const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {

  let filePath = req.url === "/" ? "index.html" : req.url;

  const fullPath = path.join(__dirname, "public", filePath);

  const ext = path.extname(fullPath).toLowerCase();

  const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".png": "image/png",
    ".jpg": "image/jpeg"
  };

  const contentType = mimeTypes[ext] || "text/plain";

  fs.readFile(fullPath, (err, content) => {
    if (err) {
      res.writeHead(404);
      return res.end("Page non trouvée");
    }

    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  });
});

const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`🚀 SIRBA Web démarré sur le port ${PORT}`);
});
