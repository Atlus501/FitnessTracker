const express = require('express');
const router = express.Router();

const sqlFileDriver = require('../dbDrivers/sqlDriver.js');

const helper = require('./helpers/GoalsHelper.js');

//starts by getting the goals of users
router.get("/", async (req, res) => {

});

module.exports = router