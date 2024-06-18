require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectToMongoDB, connectToMySQL } = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const publicationRoutes = require("./routes/publicationsTop"); 
const eventRoutes = require("./routes/eventslist");
const profRoutes = require("./routes/profile");
const orgRoutes = require("./routes/organizationlist");
const profileRoutes = require('./routes/profiles'); // Include profiles route


const app = express();
app.use(express.json());
app.use(cors());

let mysqlConnection;

// database connections
connectToMongoDB();

const setupRoutes = () => {
  app.use("/api/users", userRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/publications", publicationRoutes(mysqlConnection));
  app.use("/api", profileRoutes(mysqlConnection)); // Pass mysqlConnection to profileRoutes
  app.use("/api/eventlist", eventRoutes(mysqlConnection)); 
  app.use("/api/home", profRoutes(mysqlConnection));
  app.use("/api/organizationlist", orgRoutes(mysqlConnection));
};

connectToMySQL()
  .then((connection) => {
    mysqlConnection = connection;
    setupRoutes();
  })
  .catch((err) => {
    console.error('Failed to connect to MySQL:', err);
  });

const port = 8080;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
