const express = require('express');
const router = express.Router();

// Function to setup routes with MySQL connection
module.exports = (pool) => {
  // Endpoint to fetch options for organization types
  router.get('/eventlist/options/organizationTypes', (req, res) => {
    const query = `SELECT DISTINCT Organization_Type FROM professional_activities`;

    pool.query(query, (error, results) => {
      if (error) {
        console.error('Error fetching organization types:', error);
        res.status(500).send('Internal Server Error');
      } else {
        const organizationTypes = results.map(item => item.Organization_Type);
        res.json(organizationTypes);
      }
    });
  });

  // Endpoint to fetch options for regions
  router.get('/eventlist/options/region', (req, res) => {
    const query = `SELECT DISTINCT Country FROM professional_activities`;

    pool.query(query, (error, results) => {
      if (error) {
        console.error('Error fetching regions:', error);
        res.status(500).send('Internal Server Error');
      } else {
        const regions = results.map(item => item.Country);
        res.json(regions);
      }
    });
  });

  // Endpoint to get professional activities with filters and pagination
  router.get('/professional_activities', (req, res) => {
    const { name, organizationType, location, region, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    let query = `SELECT Organization_Type, Organization_Name, City, State, Country, COUNT(*) AS Profile_Count 
                 FROM professional_activities 
                 WHERE 1=1`;
    let queryParams = [];

    if (name) {
      query += ` AND \`Organization_Name\` LIKE ?`;
      queryParams.push(`%${name}%`);
    }
    if (region) {
      query += ` AND \`Country\` LIKE ?`;
      queryParams.push(`%${region}%`);
    }

    if (organizationType && organizationType.length > 0) {
      query += ` AND Organization_Type IN (?)`;
      queryParams.push(organizationType.split(','));
    }

    if (location) {
      const locations = location.split(',').map(loc => loc.trim());
      const conditions = locations.map(loc => `(City LIKE ? OR State LIKE ? OR Country LIKE ?)`).join(' OR ');
      query += ` AND (${conditions})`;
      locations.forEach(loc => {
        queryParams.push(`%${loc}%`, `%${loc}%`, `%${loc}%`);
      });
    }

    // Grouping and ordering
    query += ` GROUP BY Organization_Type, Organization_Name, City, State, Country`;

    // Add limit and offset for pagination
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(parseInt(limit), parseInt(offset));

    // Execute the main query
    pool.query(query, queryParams, (error, results) => {
      if (error) {
        console.error('Error fetching professional activities', error);
        res.status(500).send('Internal Server Error');
      } else {
        // Count distinct entries with the same filters
        let countQuery = `SELECT COUNT(DISTINCT Organization_Type, Organization_Name, City, State, Country) AS total 
                          FROM professional_activities 
                          WHERE 1=1`;
        let countParams = [];

        if (name) {
          countQuery += ` AND \`Organization_Name\` LIKE ?`;
          countParams.push(`%${name}%`);
        }
        if (region) {
          countQuery += ` AND \`Country\` LIKE ?`;
          countParams.push(`%${region}%`);
        }

        if (organizationType && organizationType.length > 0) {
          countQuery += ` AND Organization_Type IN (?)`;
          countParams.push(organizationType.split(','));
        }

        if (location) {
          const locations = location.split(',').map(loc => loc.trim());
          const conditions = locations.map(loc => `(City LIKE ? OR State LIKE ? OR Country LIKE ?)`).join(' OR ');
          countQuery += ` AND (${conditions})`;
          locations.forEach(loc => {
            countParams.push(`%${loc}%`, `%${loc}%`, `%${loc}%`);
          });
        }

        // Execute the count query
        pool.query(countQuery, countParams, (countError, countResults) => {
          if (countError) {
            console.error('Error counting professional activities', countError);
            res.status(500).send('Internal Server Error');
          } else {
            const total = countResults[0].total;
            const totalPages = Math.ceil(total / limit);
            res.json({ results, totalPages, currentPage: parseInt(page) });
          }
        });
      }
    });
  });

  return router;
};
