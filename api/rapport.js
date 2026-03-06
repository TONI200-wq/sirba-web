const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = async (req, res) => {

  /* =========================
     GET -> lire rapports
  ========================= */

  if (req.method === "GET") {

    try {

      const result = await pool.query(
        "SELECT * FROM rapport ORDER BY date_production DESC, id ASC"
      );

      return res.status(200).json(result.rows);

    } catch (err) {

      console.error("ERREUR DB :", err);

      return res.status(500).json({
        error: "Erreur lecture DB",
        detail: err.message
      });

    }

  }


  /* =========================
     POST -> ajouter rapport
  ========================= */

  if (req.method === "POST") {

    try {

      const d = req.body;

      const result = await pool.query(

        `INSERT INTO rapport (

          date_production,
          type_beton,
          volume,
          client,

          ciment_lafarge,
          ciment_cimbenin,
          ciment_chf,

          agre01,
          agre02,
          agre03,
          agre04,

          eau,

          adit1,
          adit2,
          adit3,
          adit4,
          adit5,
          adit6,
          adit7,

          observations,

          gra1,
          gra2,
          gra3,
          gra4

        )

        VALUES (

          $1,$2,$3,$4,
          $5,$6,$7,
          $8,$9,$10,$11,
          $12,
          $13,$14,$15,$16,$17,$18,$19,
          $20,
          $21,$22,$23,$24

        )

        RETURNING *`,

        [

          d.date_production,
          d.type_beton,
          d.volume,
          d.client,

          d.ciment_lafarge,
          d.ciment_cimbenin,
          d.ciment_chf,

          d.agre01,
          d.agre02,
          d.agre03,
          d.agre04,

          d.eau,

          d.adit1,
          d.adit2,
          d.adit3,
          d.adit4,
          d.adit5,
          d.adit6,
          d.adit7,

          d.observations,

          d.gra1,
          d.gra2,
          d.gra3,
          d.gra4

        ]

      );

      return res.status(200).json(result.rows[0]);

    } catch (err) {

      console.error("ERREUR DB :", err);

      return res.status(500).json({
        error: "Erreur insertion DB",
        detail: err.message
      });

    }

  }


  /* =========================
     DELETE -> supprimer ligne
  ========================= */

  if (req.method === "DELETE") {

    try {

      const { id } = req.query;

      await pool.query(
        "DELETE FROM rapport WHERE id = $1",
        [id]
      );

      return res.status(200).json({
        success: true
      });

    } catch (err) {

      console.error("ERREUR DB :", err);

      return res.status(500).json({
        error: "Erreur suppression"
      });

    }

  }


  res.status(405).json({
    error: "Method not allowed"
  });

};