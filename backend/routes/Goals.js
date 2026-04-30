const express = require('express');
const router = express.Router();

const sqlFileDriver = require('../dbDrivers/sqlDriver.js');

const helper = require('./helpers/GoalsHelper.js');

//starts by getting the goals of users
router.get("/:user_id", helper.getGoals);

//sets goals for the user
router.put("/set_goal", helper.setGoals);

//adds goasl for the user 
router.post("/add_goal", helper.addGoals);

//removes goals for the user
router.delete("/remove_goal", helper.removeGoals);

module.exports = router