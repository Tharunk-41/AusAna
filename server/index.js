require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { connectToMongoDB, connectToMySQL } = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const publicationRoutes = require("./routes/publicationsTop"); 
const eventRoutes = require("./routes/eventslist");

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
  app.use("/api/publications", publicationRoutes(mysqlConnection));
  app.use("/api/eventlist", eventRoutes(mysqlConnection)); 
};

const port = 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
