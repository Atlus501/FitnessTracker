const db = require('../../dbDrivers/db');

//calculates the calories needed
const calCalorie = (data) => {
    // Math.round keeps your database clean of decimals like 2050.6666
    let value = data.is_male ? 5 : -161;
    value += (10 * data.weight) + (6.25 * data.height) - (5 * data.age);
    return Math.round(value);
};

//calculates the recommended protein
const calProtein = (data) => Math.round(data.weight * 0.8)

//calcualtes the recommended fiber
const calFiber = (data) => data.is_male ? 38 : 25;

//calculates the recommended amounts
const calRecommend = async(data) => {
    var value = null;

    if (data.type === "calorie") value = calCalorie(data);
    else if (data.type === "protein") value = calProtein(data);
    else if (data.type === "fiber") value = calFiber(data);

    if (value !== null)
        await db.query("UPDATE hasManyGoals SET recommend_value=$1 WHERE user_id=$2 AND goal_id=$3", 
            [value, data.user_id, data.goal_id]);

    return value;
};

const GoalsHelper = {
    getGoalTypes: async (req, res) => {
        try {
            const result = await db.query('SELECT * FROM Goals ORDER BY id');
            return res.status(200).json(result.rows);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    },

    getGoals : async (req, res) => {
        const { user_id } = req.params;
        try {
            const result = await db.query(
                `SELECT h.user_id, h.goal_id, h.recommend_value, g.type, u.is_male, u.age, u.weight, u.height
                 FROM HasManyGoals h
                 JOIN Goals g ON h.goal_id = g.id
                 JOIN Users u ON h.user_id = u.id
                 WHERE h.user_id = $1
                 ORDER BY g.type`

                ,[user_id]
            );

            for (let row of result.rows){
                if(!row.recommend_value)
                    row.recommend_value = await calRecommend(row);
            }

            return res.json(result.rows);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    },

    removeGoals : async (req, res) => {
        const {user_id, goal_id} = req.query;

        try{
            const result = await db.query("DELETE FROM hasManyGoals WHERE user_id=$1 AND goal_id=$2", 
            [ user_id, goal_id]);

            return res.status(200).json({message : "goal updated"});
        }catch(err){
            return res.status(500).json({ error: err.message });
        }
    },

    recordGoals : async (req, res) => {
        const {user_id, goal_id} = req.body;
        const query = `SELECT u.id AS user_id, u.is_male, u.age, u.weight, u.height, g.id AS goal_id, g.type
            FROM Users u
            CROSS JOIN Goals g
            WHERE u.id = $1 AND g.id = $2`;

        try{
            const data = await db.query(query, [user_id, goal_id]);

            if(data.rowCount === 0)
                return res.status(404).json({error : "user or goal not found"});

            const recommend_value = await calRecommend(data.rows[0]);

            const result = await db.query(
                `INSERT INTO HasManyGoals (user_id, goal_id, recommend_value)
                 VALUES ($1, $2, $3)
                 ON CONFLICT (user_id, goal_id)
                 DO UPDATE SET recommend_value = EXCLUDED.recommend_value
                 RETURNING user_id, goal_id, recommend_value`,
                [user_id, goal_id, recommend_value]
            );

            return res.status(200).json({message : "goal updated", goal: result.rows[0]});
        }catch(err){
            return res.status(500).json({ error: err.message });
        }
    }
}

module.exports = GoalsHelper;
