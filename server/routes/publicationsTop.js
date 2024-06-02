const express = require('express');
const router = express.Router();

module.exports = (mysqlConnection) => {
  router.get('/topPublicationTopics', (req, res) => {
    mysqlConnection.query('SELECT `key topics` FROM publications WHERE `key topics` != "NULL"', (error, results) => {
      if (error) {
        console.error('Error fetching publication topics:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      // Split topics and count occurrences
      const topicCounts = {};
      results.forEach(row => {
        const topics = row['key topics'].split(';');
        topics.forEach(topic => {
          const trimmedTopic = topic.trim();
          if (trimmedTopic) {
            topicCounts[trimmedTopic] = (topicCounts[trimmedTopic] || 0) + 1;
          }
        });
      });

      // Convert object to array and sort by count
      const sortedTopics = Object.entries(topicCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([topic, count]) => ({ topic, count }));

      res.json(sortedTopics);
    });
  });

  return router;
};
