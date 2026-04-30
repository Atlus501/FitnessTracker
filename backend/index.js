const express = require("express")
const app = express();
const cors = require("cors");

const sqlFileDriver = require('./dbDrivers/sqlDriver.js');

const goalRouter = require('./routes/Goals.js');
const activityRouter = require('./routes/Activities.js');

app.use(express.json());
app.use(cors());

app.use("/goals", goalRouter);
app.use("/activities", activityRouter);

//initialily create the tables once the app in initialized
app.listen(3001, async () => {
  try {
        console.log("Initializing database...");
        const results = await sqlFileDriver(["create_tables.sql", "insert_data.sql"]);
        console.log("DB Init Results:", results);
    } catch (err) {
        console.error("Failed to initialize database:", err);
    }
});