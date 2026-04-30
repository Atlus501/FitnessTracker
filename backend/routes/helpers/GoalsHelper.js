const db = require('./db');

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
    getGoals : async (req, res) => {
        const { user_id } = req.params;
        try {
            const result = await db.query(
                `SELECT * FROM hasManyGoals h JOIN Users u ON h.user_id = u.id
                JOIN Goals g ON h.goal_id = g.id WHERE u.id = $1 AND recommend_value`

                ,[user_id]
            );

            for (row of result.rows){
                if(!row.recommend_value)
                    row.recommend_value = await calRecommend(row);
            }

            return res.json(result.rows);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    },

    setGoals : async (req, res) => {
        const {user_id, goal_id, recommend_value} = req.query;

        try{
            const result = await db.query("UPDATE hasManyGoals SET recommend_value=$1 WHERE user_id=$2 AND goal_id=$3", 
            [recommend_value, user_id, goal_id]);

            return res.status(200).json({message : "goal updated"});
        }catch(err){
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

    addGoals : async (req, res) => {
        const {user_id, goal_id} = req.query;

        try{
            const result = await db.query(`INSERT INTO hasManyGoals (user_id, goal_id) VALUES 
                ($1, $2)`, 
            [user_id, goal_id]);

            return res.status(200).json({message : "goal updated"});
        }catch(err){
            return res.status(500).json({ error: err.message });
        }
    }
}

module.exports = GoalsHelper;