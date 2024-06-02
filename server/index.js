// index.js
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { connectToMongoDB, connectToMySQL } = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");

// database connections
connectToMongoDB();
let mysqlConnection;
connectToMySQL()
  .then((connection) => {
    mysqlConnection = connection;
    setupRoutes();
  })
  .catch((err) => {
    console.error('Failed to connect to MySQL:', err);
  });

// middlewares
app.use(express.json());
app.use(cors());

const setupRoutes = () => {
  // routes
  app.use("/api/users", userRoutes);
  app.use("/api/auth", authRoutes);

  app.get('/api/topPublicationTopics', (req, res) => {
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
};

const port = 8080;
app.listen(port, console.log(`Listening on port ${port}...`));