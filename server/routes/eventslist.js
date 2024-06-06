const express = require('express');
const router = express.Router();

module.exports = (connection) => {
  router.get('/events', (req, res) => {
    const { page, pageSize, keyword, name, eventType, participant, sponsor } = req.query;

    let query = 'SELECT * FROM conference_engagements WHERE 1=1';
    if (keyword) query += ` AND (Event_Name LIKE '%${keyword}%' OR Description LIKE '%${keyword}%')`;
    if (name) query += ` AND (Event_Name  LIKE '%${name}%')`;
    if (eventType) {
      const eventTypes = eventType.split(',').map(e => `Event_Type LIKE '%${e.replace(/'/g, "''")}%'`).join(' OR ');
      query += ` AND (${eventTypes})`;
    }
    if (participant) {
      const participants = participant.split(',').map(p => `\`KOL Name\` LIKE '%${p.replace(/'/g, "''")}%'`).join(' OR ');
      query += ` AND (${participants})`;
    }
    if (sponsor) {
      const sponsors = sponsor.split(',').map(s => `Sponsor_Name LIKE '%${s.replace(/'/g, "''")}%'`).join(' OR ');
      query += ` AND (${sponsors})`;
    }

    const limit = parseInt(pageSize);
    const offset = (parseInt(page) - 1) * limit;
    query += ` LIMIT ${limit} OFFSET ${offset}`;

    connection.query(query, (error, results) => {
      if (error) throw error;
      res.json(results);
    });
  });

  router.get('/options/:type', (req, res) => {
    const type = req.params.type;
    let query = '';
    let columnName = '';

    switch (type) {
      case 'eventTypes':
        query = 'SELECT DISTINCT Event_Type FROM conference_engagements';
        columnName = 'Event_Type';
        break;
      case 'participants':
        query = 'SELECT DISTINCT `KOL Name` FROM conference_engagements';
        columnName = 'KOL Name';
        break;
      case 'sponsors':
        query = 'SELECT DISTINCT Sponsor_Name FROM conference_engagements';
        columnName = 'Sponsor_Name';
        break;
      default:
        res.status(400).send('Invalid type');
        return;
    }

    connection.query(query, (error, results) => {
      if (error) {
        console.error('Error fetching options:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      let uniqueValues = new Set();
      results.forEach(row => {
        row[columnName].split(';').forEach(value => {
          uniqueValues.add(value.trim());
        });
      });

      const allUniqueValues = Array.from(uniqueValues);
      const { page = 1, pageSize = 20 } = req.query;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + parseInt(pageSize);

      // Apply pagination after removing duplicates
      const paginatedValues = allUniqueValues.slice(startIndex, endIndex);
      res.json(paginatedValues);
    });
  });

  return router;
};