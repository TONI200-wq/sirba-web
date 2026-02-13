const { Pool } = require("pg");
const http = require("http");
const fs = require("fs");
const path = require("path");


// =====================
// CONNEXION DATABASE
// =====================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// création automatique de la table
pool.query(`
CREATE TABLE IF NOT EXISTS livraisons (
  id SERIAL PRIMARY KEY,
  client TEXT,
  bc TEXT,
  be TEXT,
  quantite INTEGER
)
`);


// =====================
// SERVEUR HTTP
// =====================
const server = http.createServer(async (req, res) => {
  console.log("Request:", req.url);

  // 🔥 ROUTE TEST DATABASE
  if (req.url === "/test-db") {
    try {
      const result = await pool.query("SELECT NOW()");
      res.writeHead(200, { "Content-Type": "text/plain" });
      return res.end("DB connected: " + result.rows[0].now);
    } catch (err) {
      console.error(err);
      res.writeHead(500);
      return res.end("DB ERROR");
    }
  }

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


// =====================
// START SERVER
// =====================
const PORT = process.env.PORT;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 SIRBA Web démarré sur le port ${PORT}`);
});
