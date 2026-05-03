const express = require('express');
const router = express.Router();

const helper = require('./helpers/GoalsHelper.js');

//gets every available goal type
router.get("/", helper.getGoalTypes);

//adds or updates goals for the user 
router.post("/record_goal", helper.recordGoals);

//removes goals for the user
router.delete("/remove_goal", helper.removeGoals);

//starts by getting the goals of users
router.get("/:user_id", helper.getGoals);

module.exports = router
