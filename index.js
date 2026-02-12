const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {

  // 🔥 NETTOYAGE DE L'URL (supprime ? et paramètres)
  const cleanUrl = req.url.split("?")[0];

  let filePath = cleanUrl === "/" ? "index.html" : cleanUrl.slice(1);
  const fullPath = path.join(__dirname, "Public", filePath);

  const extname = path.extname(fullPath);

  let contentType = "text/html";
  if (extname === ".css") contentType = "text/css";
  if (extname === ".js") contentType = "application/javascript";
  if (extname === ".png") contentType = "image/png";

  fs.readFile(fullPath, (err, content) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Page non trouvée");
      return;
    }

    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 SIRBA Web disponible sur http://localhost:${PORT}`);
});
