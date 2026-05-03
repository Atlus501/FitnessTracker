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

    const response = await db.query("SELECT * FROM Users WHERE id = $1", [data.user_id]);

    if (data.type === "calorie") value = calCalorie(response);
    else if (data.type === "protein") value = calProtein(response);
    else if (data.type === "fiber") value = calFiber(response);

    return value;
};

const GoalsHelper = {
    getGoalTypes : async (req, res) => {
        const query =  `SELECT * FROM Goals`;

        try{
            const response = await db.query(query);
            return res.status(200).json(response.rows);

        }catch(err){
            return res.status(400).json({error: err.message});
        }

    },

    getGoals : async (req, res) => {
        const { user_id } = req.params;
        try {
            const result = await db.query(
                `SELECT * FROM hasManyGoals h
                JOIN Goals g ON h.goal_id = g.id WHERE h.user_id = $1`

                ,[user_id]
            );

            for (let row of result.rows){
                if(!row.recommend_value)
                    row.recommend_value = await calRecommend(row);
            }

            return res.status(200).json(result.rows);
        } catch (err) {
            return res.status(400).json({ error: err.message });
        }
    },

    removeGoals : async (req, res) => {
        const {user_id, goal_id} = req.query;

        try{
            const result = await db.query("DELETE FROM hasManyGoals WHERE user_id=$1 AND goal_id=$2", 
            [ user_id, goal_id]);

            return res.status(200).json({message : "goal updated"});
        }catch(err){
            return res.status(400).json({ error: err.message });
        }
    },

    recordGoals : async (req, res) => {
        const {user_id, goal_id} = req.body;

        const recommend_value = await calRecommend({user_id: user_id, goal_id: goal_id});

        const query = `INSERT INTO hasManyGoals (user_id, goal_id, recommend_value) VALUES 
                ($1, $2, $3)
            ON CONFLICT (user_id, goal_id) 
            DO UPDATE SET recommend_value = EXCLUDED.recommend_value`;
        try{

            result = await db.query(query, [user_id, goal_id, recommend_value]);

            return res.status(200).json({message : "goal updated"});
        }catch(err){
            return res.status(400).json({ error: err.message });
        }
    }
}

module.exports = GoalsHelper;