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

// =====================
// CREATION TABLE
// (noms en minuscules !)
// =====================

async function initDB() {

  // ⚠️ TEMPORAIRE (1 seule fois)
  await pool.query('DROP TABLE IF EXISTS livraisons');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS livraisons (
      id SERIAL PRIMARY KEY,
      periode TEXT,
      client TEXT,
      bc TEXT,
      be TEXT,
      "dateCreation" TEXT,
      "dateEmission" TEXT,
      "datePrevision" TEXT,
      "typeProduit" TEXT,
      designation TEXT,
      "quantiteEnlever" INTEGER,
      "dateLivraison" TEXT,
      bl TEXT,
      "quantiteLivree" INTEGER,
      reste INTEGER,
      "heureChargement" TEXT,
      "slumpDepart" TEXT,
      transporteur TEXT,
      camion TEXT,
      conducteur TEXT,
      "heureDepart" TEXT,
      "heureArrivee" TEXT,
      "slumpArrivee" TEXT
    )
  `);

  console.log("✅ Table créée");
}

initDB().catch(console.error);



pool.query(`
CREATE TABLE IF NOT EXISTS livraisons (
  id SERIAL PRIMARY KEY,
  periode TEXT,
  client TEXT,
  bc TEXT,
  be TEXT,
  datecreation TEXT,
  dateemission TEXT,
  dateprevision TEXT,
  typeproduit TEXT,
  designation TEXT,
  quantiteenlever INTEGER,
  datelivraison TEXT,
  bl TEXT,
  quantitelivree INTEGER,
  reste INTEGER,
  heurechargement TEXT,
  slumpdepart TEXT,
  transporteur TEXT,
  camion TEXT,
  conducteur TEXT,
  heuredepart TEXT,
  heurearrivee TEXT,
  slumparrivee TEXT
)
`).catch(console.error);


// =====================
// SERVEUR HTTP
// =====================
const server = http.createServer(async (req, res) => {

  console.log("Request:", req.method, req.url);

  // =====================
  // TEST DATABASE
  // =====================
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

  // =====================
  // GET LIVRAISONS
  // =====================
  if (req.url === "/api/livraisons" && req.method === "GET") {
    try {
      const result = await pool.query(
        "SELECT * FROM livraisons ORDER BY id ASC"
      );

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(result.rows));

    } catch (err) {
      console.error(err);
      res.writeHead(500);
      return res.end("DB ERROR");
    }
  }

  // =====================
  // POST LIVRAISON
  // =====================
  if (req.url === "/api/livraisons" && req.method === "POST") {

    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        const d = JSON.parse(body);

        await pool.query(
          `INSERT INTO livraisons (
            periode, client, bc, be,
            datecreation, dateemission, dateprevision,
            typeproduit, designation,
            quantiteenlever, datelivraison, bl,
            quantitelivree, reste,
            heurechargement, slumpdepart,
            transporteur, camion, conducteur,
            heuredepart, heurearrivee, slumparrivee
          )
          VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,
            $12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22
          )`,
          [
            d.periode,
            d.client,
            d.bc,
            d.be,
            d.dateCreation,
            d.dateEmission,
            d.datePrevision,
            d.typeProduit,
            d.designation,
            d.quantiteEnlever,
            d.dateLivraison,
            d.bl,
            d.quantiteLivree,
            d.reste,
            d.heureChargement,
            d.slumpDepart,
            d.transporteur,
            d.camion,
            d.conducteur,
            d.heureDepart,
            d.heureArrivee,
            d.slumpArrivee
          ]
        );

        res.writeHead(200);
        res.end("OK");

      } catch (err) {
        console.error("INSERT ERROR:", err);
        res.writeHead(500);
        res.end("DB ERROR");
      }
    });

    return;
  }

  // =====================
  // FICHIERS STATIQUES
  // =====================
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
const PORT = process.env.PORT || 3000;

server.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 SIRBA Web démarré sur le port", PORT);
});
