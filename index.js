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
// CREATION TABLE (EXACTEMENT comme Excel)
// =====================
async function initDB() {
  try {

    await pool.query(`
      CREATE TABLE IF NOT EXISTS livraisons (
        id SERIAL PRIMARY KEY,
        "N° D'ORDRE" TEXT,
        "PERIODE" TEXT,
        "CLIENT" TEXT,
        "N° BC" TEXT,
        "N° BE" TEXT,
        "DATE CREATION" TEXT,
        "DATE EMISSION" TEXT,
        "DATE PREVISION LIVRAISON" TEXT,
        "TYPE PRODUIT" TEXT,
        "DESIGNATION" TEXT,
        "QTE A ENLEVER" INTEGER,
        "DATE LIVRAISON" TEXT,
        "N° BL" TEXT,
        "QTE LIVREE" INTEGER,
        "RESTE A LIVRER" INTEGER,
        "HEURE CHARGEMENT" TEXT,
        "SLUMP TEST DEPART" TEXT,
        "TRANSPORTEUR" TEXT,
        "N° CAMION" TEXT,
        "NOM CONDUCTEUR" TEXT,
        "HEURE DEPART" TEXT,
        "HEURE ARRIVEE" TEXT,
        "SLUMP TEST ARRIVEE" TEXT
      )
    `);

    console.log("✅ Table prête");

  } catch (err) {
    console.error("DB INIT ERROR:", err);
  }
}

initDB();

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

      const result = await pool.query(`
        SELECT
          id AS ordre,
          "PERIODE" AS periode,
          "CLIENT" AS client,
          "N° BC" AS bc,
          "N° BE" AS be,
          "DATE CREATION" AS "dateCreation",
          "DATE EMISSION" AS "dateEmission",
          "DATE PREVISION LIVRAISON" AS "datePrevision",
          "TYPE PRODUIT" AS "typeProduit",
          "DESIGNATION" AS designation,
          "QTE A ENLEVER" AS "quantiteEnlever",
          "DATE LIVRAISON" AS "dateLivraison",
          "N° BL" AS bl,
          "QTE LIVREE" AS "quantiteLivree",
          "RESTE A LIVRER" AS reste,
          "HEURE CHARGEMENT" AS "heureChargement",
          "SLUMP TEST DEPART" AS "slumpDepart",
          "TRANSPORTEUR" AS transporteur,
          "N° CAMION" AS camion,
          "NOM CONDUCTEUR" AS conducteur,
          "HEURE DEPART" AS "heureDepart",
          "HEURE ARRIVEE" AS "heureArrivee",
          "SLUMP TEST ARRIVEE" AS "slumpArrivee"
        FROM livraisons
        ORDER BY id ASC
      `);

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

        // ⚠️ A UTILISER UNE SEULE FOIS 
        await pool.query('DROP TABLE IF EXISTS livraisons');

        await pool.query(
          `INSERT INTO livraisons (
            "PERIODE",
            "CLIENT",
            "N° BC",
            "N° BE",
            "DATE CREATION",
            "DATE EMISSION",
            "DATE PREVISION LIVRAISON",
            "TYPE PRODUIT",
            "DESIGNATION",
            "QTE A ENLEVER",
            "DATE LIVRAISON",
            "N° BL",
            "QTE LIVREE",
            "RESTE A LIVRER",
            "HEURE CHARGEMENT",
            "SLUMP TEST DEPART",
            "TRANSPORTEUR",
            "N° CAMION",
            "NOM CONDUCTEUR",
            "HEURE DEPART",
            "HEURE ARRIVEE",
            "SLUMP TEST ARRIVEE"
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
