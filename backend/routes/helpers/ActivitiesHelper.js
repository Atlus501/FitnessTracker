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

        const query = `INSERT INTO DoesDailyActivity (user_id, activity, amount_done, date)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (user_id, activity, date) 
            DO UPDATE SET amount_done = EXCLUDED.amount_done;`;

        try{

            const response = await db.query(query, [user_id, activity, today.toISOString().split('T')[0]], amount_done);

            return res.status(200).json({message: "successfully inserted daily activity"});

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
    }
};

module.exports = ActivitiesHelper;