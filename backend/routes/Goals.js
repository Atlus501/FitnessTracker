const express = require('express');
const router = express.Router();

const sqlFileDriver = require('../dbDrivers/sqlDriver.js');

const helper = require('./helpers/GoalsHelper.js');

//starts by getting the goals of users
router.get("/:user_id", helper.getGoals);

//sets goals for the user
router.post("/set_goal", helper.setGoals);

module.exports = router