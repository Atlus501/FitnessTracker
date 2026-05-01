const express = require('express')
const router = express.Router();

const helper = require('./helpers/ProgressHelper.js');

//this function udpates the progress of the goals
router.post("/updateProgress", helper.updateProgress);

//this function gets the progress of the users
router.get("/:user_id", helper.getProgress);

module.exports = router;