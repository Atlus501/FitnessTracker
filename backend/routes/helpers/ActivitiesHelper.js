const db = require('../../dbDrivers/db');
const getDate = require('./Date.js');

const ActivitiesHelper = {
    getActivityList : async (req, res) =>{
        const query = "SELECT name, units FROM Activities";

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
        const query = `SELECT * FROM Activities a
            WHERE NOT EXISTS (
                SELECT 1 
                FROM Foods f 
                WHERE f.name = a.name
            );`;

        try{
            const response = await db.query(query);
            return res.status(200).json(response.rows);
        }catch(err){
            return res.status(500).json({error : err.message});
        }
    },

    recordActivity : async (req, res) => {
        const {amount_done, activity, user_id} = req.body;
        const today = getDate();

        const query = `INSERT INTO DoesDailyActivity (user_id, activity, amount_done, date)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (user_id, activity, date) 
            DO UPDATE SET amount_done = EXCLUDED.amount_done;`;

        try{

            const response = await db.query(query, [user_id, activity, amount_done, today]);

            return res.status(200).json({message: "successfully inserted daily activity"});

        }catch(err){
            return res.status(500).json({error : err.message});
        }
    },

    getDailyActivity : async (req, res) => {
        const {user_id} = req.params;
        const today = getDate();

        const query = "SELECT * FROM DoesDailyActivity WHERE user_id = $1 AND date = $2";

        try{
            const response = await db.query(query, [user_id, today]);
            return res.status(200).json({status: "successfully inserted daily activity"});

        }catch(err){
            return res.status(500).json({error : err.message});
        }
    },

    removeDailyActivity : async (req, res) => {
        const {user_id, activity} = req.query;
        const today = getDate();

        const query = "DELETE FROM DoesDailyActivity d WHERE user_id = $1 AND d.date = $2 AND activity = $3";

        try{
            const response = await db.query(query, [user_id, today, activity]);
            return res.status(200).json({status: "successfully removed daily activity"});

        }catch(err){
            return res.status(500).json({error : err.message});
        }
    }
};

module.exports = ActivitiesHelper;