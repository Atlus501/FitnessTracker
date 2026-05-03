const db = require('../../dbDrivers/db');
const getDate = require('./Date.js');

const progressHelper = {
    getProgress: async (req, res) => {
        const {user_id} = req.params;
        const today = getDate();
        const query = "SELECT * FROM DailyProgressOfGoals WHERE user_id=$1 AND date=$2";

        try{
            const result = await db.query(query, [user_id, today]);

            return res.status(200).json(result.rows);

        }catch(err){
            return res.status(400).json({error : err.message});
        }
    },

    updateProgress : async (req, res) => {
        const {user_id} = req.body;
        const today = getDate();

        var query = `SELECT * FROM HasManyGoals h JOIN Goals g ON h.goal_id = g.id WHERE user_id=$1`;

        try{
            const goals = await db.query(query, [user_id]);

            if(goals.rowCount === 0)
                return res.status(200).json({message : "you have no goals"});

            query = `WITH userActivity AS (
                        SELECT * FROM DoesDailyActivity 
                        WHERE user_id = $1 AND date = $2
                        )
                        SELECT ua.amount_done, 
                            a.amount,
                            a.caloric_gain, 
                            f.protein, 
                            f.fiber FROM userActivity ua
                        JOIN Activities a ON a.name = ua.activity
                        LEFT JOIN Foods f ON f.name = a.name`;

            const dailyActivities = await db.query(query, [user_id, today]);

            if(dailyActivities.rowCount === 0){
                query = "UPDATE DailyProgressOfGoals SET daily_progress = 0 WHERE user_id=$1 AND date=$2";
                await db.query(query, [user_id, today]);

                return res.status(200).json({message : "you have zero activities for today"});
            }

            const goalsDict = {};

            for(let goal of goals.rows){
                goalsDict[goal.type] = 0;
            }

            for (let activity of dailyActivities.rows){
                let modifer = activity.amount_done / activity.amount;

                if("calorie" in goalsDict)
                    goalsDict.calorie += activity.caloric_gain * modifer;

                if(activity.protein === null){
                    continue;
                }

                if("protein" in goalsDict)
                    goalsDict.protein += activity.protein * modifer;

                if("fiber" in goalsDict)
                    goalsDict.fiber += activity.fiber * modifer;
            }

            for(let goal of goals.rows){
                goalsDict[goal.type] = goal.recommend_value > 0 ? (goalsDict[goal.type] / goal.recommend_value) : 0;

                query = `INSERT INTO DailyProgressOfGoals (user_id, goal_id, daily_progress, date)
                    VALUES ($1, $2, $3, $4)
                    ON CONFLICT (user_id, goal_id, date) 
                    DO UPDATE SET daily_progress = EXCLUDED.daily_progress`;

                await db.query(query, [user_id, goal.id, goalsDict[goal.type], today]);
            }

            return res.status(200).json({message : "progress successfully updated"});

        }catch(err){
            return res.status(400).json({error : err.message});
        }

    },
};

module.exports = progressHelper;