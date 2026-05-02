const db = require('../../dbDrivers/db');
const getDate = require('./Date.js');

const ActivitiesHelper = {
    getActivityList : async (req, res) =>{
        const query = "SELECT * FROM Activities ORDER BY name";

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
        const query = `SELECT a.*, e.type, e.weight
            FROM Activities a
            JOIN Exercises e ON e.name = a.name
            ORDER BY a.name;`;

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

            await db.query(query, [user_id, activity, amount_done, today]);

            return res.status(200).json({message: "successfully inserted daily activity"});

        }catch(err){
            return res.status(500).json({error : err.message});
        }
    },

    getDailyActivity : async (req, res) => {
        const {user_id} = req.params;
        const today = getDate();

        const query = "SELECT * FROM DoesDailyActivity WHERE user_id = $1 AND DATE = $2";

        try{
            const response = await db.query(query, [user_id, today]);
            return res.status(200).json(response.rows);

        }catch(err){
            return res.status(500).json({error : err.message});
        }
    },

    removeDailyActivity : async (req, res) => {
        const {user_id, activity} = req.query;
        const today = getDate();

        const query = activity
            ? "DELETE FROM DoesDailyActivity WHERE user_id = $1 AND DATE = $2 AND activity = $3"
            : "DELETE FROM DoesDailyActivity WHERE user_id = $1 AND DATE = $2";

        try{
            const params = activity ? [user_id, today, activity] : [user_id, today];
            const response = await db.query(query, params);
            return res.status(200).json({message: "daily activity removed", removed: response.rowCount});

        }catch(err){
            return res.status(500).json({error : err.message});
        }
    }
};

module.exports = ActivitiesHelper;
