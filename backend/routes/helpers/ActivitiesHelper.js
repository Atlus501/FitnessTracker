const db = require('./db');

const ActivitiesHelper = {
    getActivityList : async (req, res) =>{
        const query = "SELECT name FROM Activities";

        try{
            const response = await db.query(query);
            return res.status(200).json(response.rows);
        }catch(err){
            return res.status(500).json({error : err.message});
        }
    },

    getFoodList : async (req, res) =>{
        const query = "SELECT * FROM Activities NATURAL JOIN Foods";

        try{
            const response = await db.query(query);
            return res.status(200).json(response.rows);
        }catch(err){
            return res.status(500).json({error : err.message});
        }
    },

    getExerciseList : async (req, res) =>{
        const query = "SELECT * FROM Exercises NATURAL JOIN Activities";

        try{
            const response = await db.query(query);
            return res.status(200).json(response.rows);
        }catch(err){
            return res.status(500).json({error : err.message});
        }
    },

    recordActivity : async (req, res) => {
        const {amount_done, activity, user_id} = req.body;
        const today = new Date();

        const query = "INSERT INTO DoesDailyActivity (user_id, activity, amount_done, date) VALUES ($1, $2, $3, $4)";

        try{
            const response = await db.query(query, [user_id, activity, amount_done, today.toISOString().split('T')[0]]);
            return res.status(200).json({status: "successfully inserted daily activity"});

        }catch(err){
            return res.status(500).json({error : err.message});
        }
    },

    getDailyActivity : async (req, res) => {
        const {user_id} = req.params;
        const today = new Date();

        const query = "SELECT * FROM DoesDailyActivity WHERE user_id = $1 AND DATE = $2";

        try{
            const response = await db.query(query, [user_id, today.toISOString().split('T')[0]]);
            return res.status(200).json({status: "successfully inserted daily activity"});

        }catch(err){
            return res.status(500).json({error : err.message});
        }
    },

    removeDailyActivity : async (req, res) => {
        const {user_id} = req.query;
        const today = new Date();

        const query = "DELETE FROM DoesDailyActivity WHERE user_id = $1 AND DATE = $2";

        try{
            const response = await db.query(query, [user_id, today.toISOString().split('T')[0]]);
            return res.status(200).json({status: "successfully inserted daily activity"});

        }catch(err){
            return res.status(500).json({error : err.message});
        }
    },

    updateDailyActivity : async (req, res) => {
        const {activity, amount_done, user_id, activity_prev} = req.body;
        const today = new Date();

        const query = `UPDATE DoesDailyActivity SET activity = $1, amount_done = $2 
            WHERE user_id = $3 AND DATE = $4 AND activity = $5`;

        try{
            const response = await db.query(query, [activity, amount_done, user_id, today.toISOString().split('T')[0], activity_prev]);
            return res.status(200).json({status: "successfully inserted daily activity"});

        }catch(err){
            return res.status(500).json({error : err.message});
        }
    }
};

module.exports = ActivitiesHelper;