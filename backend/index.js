const express = require("express")
const app = express();

const sqlFileDriver = require('./dbDrivers/sqlDriver.js');

//initialily create the tables once the app in initialized
app.listen(3001, async () => {
  try {
        console.log("Initializing database...");
        const results = await sqlFileDriver(["create_tables.sql"]);
        console.log("DB Init Results:", results);
    } catch (err) {
        console.error("Failed to initialize database:", err);
    }
});