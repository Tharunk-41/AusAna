const express = require('express');
const router = express.Router();

module.exports = (mysqlConnection) => {
  router.get('/specializations', (req, res) => {
    const query = 'SELECT DISTINCT Specialty FROM bio';
    mysqlConnection.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching specializations:', err);
        return res.status(500).send('Error fetching specializations');
      }
      const specializations = results.map(row => row.Specialty.trim()).filter(s => s);
      res.json(specializations);
    });
  });

  router.get('/data', (req, res) => {
    const table = req.query.table;
    const specialization = req.query.specialization;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    if (!table) {
      return res.status(400).send('Table name is required');
    }

    const query = `
      SELECT bio.*, img.\`Image Link\` AS image_link
      FROM ?? AS bio
      LEFT JOIN image AS img ON bio.\`KOL ID\` = img.\`KOL ID\`
      WHERE bio.Specialty LIKE ?
      LIMIT ? OFFSET ?
    `;

    mysqlConnection.query(query, [table, `%${specialization}%`, limit, offset], (err, results) => {
      if (err) {
        console.error('Error fetching data:', err);
        return res.status(500).send('Error fetching data');
      }
      res.json(results);
    });
  });

  return router;
};
