const { Pool } = require("pg");

// connexion Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = async (req, res) => {

  // =========================
  // GET -> lire les livraisons
  // =========================
  if (req.method === "GET") {
    try {
  
      const test = await pool.query(
        "SELECT current_database(), current_schema()"
      );
  
      return res.status(200).json(test.rows);
  
    } catch (err) {
      console.error("ERREUR DB :", err);
      return res.status(500).json({
        error: "Erreur lecture DB",
        detail: err.message
      });
    }
  }  

  // =========================
  // POST -> ajouter livraison
  // =========================
  if (req.method === "POST") {
    try {

      const d = req.body;

      const result = await pool.query(
        `INSERT INTO livraisons (
          periode, client, bc, be,
          datecreation, dateemission, dateprevision,
          typeproduit, designation,
          quantiteenlever, datelivraison,
          bl, quantitelivree, reste,
          heurechargement, slumpdepart,
          transporteur, camion, conducteur,
          heuredepart, heurearrivee, slumparrivee
        )
        VALUES (
          $1,$2,$3,$4,$5,$6,$7,
          $8,$9,$10,$11,$12,$13,$14,
          $15,$16,$17,$18,$19,$20,$21,$22
        )
        RETURNING *`,
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

      return res.status(200).json(result.rows[0]);

    } 
    
    catch (err) {
        console.error("ERREUR DB :", err);
        return res.status(500).json({ 
          error: "Erreur lecture DB",
          detail: err.message 
        });
      }      
  }

  // méthode non autorisée
  res.status(405).json({ error: "Method not allowed" });
};
