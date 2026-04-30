const express = require('express');
const router = express.Router();

const activities_helper = require('./helpers/ActivitiesHelper.js');

//gets a list of activities
router.get("/", activities_helper.getActivityList);

//gets a list of foods and their information
router.get("/foods", activities_helper.getFoodList);

//gets a list of exercises and their information
router.get("/exercises", activities_helper.getExerciseList);

//records user activity for the day
router.post("/record", activities_helper.recordActivity);

//removes user activity for the day
router.delete("/remove", activities_helper.removeDailyActivity);

//update user activity for the day
router.put("/update", activities_helper.updateDailyActivity);

//gets daily activity
router.get("/:user_id", activities_helper.getDailyActivity);


module.exports = router;