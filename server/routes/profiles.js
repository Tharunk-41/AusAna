const express = require('express');
const router = express.Router();

module.exports = (mysqlConnection) => {
  // Fetch profiles with filters
  router.get('/profiles', (req, res) => {
    const { keyword, name, filters } = req.query;

    let query = `
      SELECT b.\`KOL ID\`, i.\`Image Link\` as imageLink, b.\`KOL Name\`, b.Gender, b.Profession, 
             b.Specialty, b.\`Career Status\`
      FROM image i
      JOIN bio b ON i.\`KOL ID\` = b.\`KOL ID\`
      WHERE 1=1
    `;

    const values = [];

    if (keyword) {
      query += ` AND (b.\`KOL Name\` LIKE ? OR b.Profession LIKE ? OR b.Specialty LIKE ? OR b.\`Career Status\` LIKE ? OR b.Gender LIKE ?)`;
      values.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }

    if (name) {
      query += ` AND b.\`KOL Name\` LIKE ?`;
      values.push(`%${name}%`);
    }

    // Process dynamic filters
    if (filters) {
      const filterObject = JSON.parse(filters); // assuming filters are sent as a JSON string
      for (const [key, value] of Object.entries(filterObject)) {
        if (Array.isArray(value) && value.length > 0) {
          const filterValues = value.map(val => mysqlConnection.escape(val)).join(',');
          query += ` AND b.\`${key}\` IN (${filterValues})`;
        }
      }
    }

    mysqlConnection.query(query, values, (error, results) => {
      if (error) {
        console.error('Error fetching profiles:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json(results);
    });
  });

  // Fetch detailed profile
  router.get('/profile/:id', (req, res) => {
    const { id } = req.params;

    const query = `
      SELECT i.\`Image Link\` as imageLink, b.\`KOL Name\`, b.Gender, b.Profession, 
             b.Specialty, b.\`Career Status\`, b.\`Bio_Summary\`
      FROM image i
      JOIN bio b ON i.\`KOL ID\` = b.\`KOL ID\`
      WHERE b.\`KOL ID\` = ?
    `;

    mysqlConnection.query(query, [id], (error, results) => {
      if (error) {
        console.error('Error fetching profile details:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      res.json(results[0]);
    });
  });

  // Fetch filter options
  router.get('/filters', (req, res) => {
    const columns = [
      'Profession', 'Gender', 'TD or HD KOL', 'Career Status', 
      'Specialty', 'Parent Organization', 'Department', 'City', 'State'
    ];

    const options = {};

    const fetchOptions = (column, callback) => {
      const sql = `SELECT DISTINCT ?? FROM bio`;
      mysqlConnection.query(sql, [column], (error, results) => {
        if (error) {
          callback(error);
        } else {
          options[column] = results.map(row => row[column]);
          callback(null);
        }
      });
    };

    let completed = 0;

    columns.forEach(column => {
      fetchOptions(column, (error) => {
        if (error) {
          console.error('Error fetching filter options:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          completed++;
          if (completed === columns.length) {
            res.json(options);
          }
        }
      });
    });
  });

  return router;
};
