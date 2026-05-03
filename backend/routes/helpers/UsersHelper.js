const crypto = require('crypto');
const db = require('../../dbDrivers/db');

const hashPassword = (password) =>
    crypto.createHash('sha256').update(String(password)).digest('hex');

const publicUserFields = 'id, name, is_male, age, weight, height';

const UsersHelper = {
    register: async (req, res) => {
        const { name, password, is_male, age, weight, height } = req.body;

        if (!name || !password || is_male === undefined || !age || !weight || !height) {
            return res.status(400).json({ error: 'name, password, gender, age, weight, and height are required' });
        }

        try {
            const existingUser = await db.query('SELECT id FROM Users WHERE name = $1', [name]);

            if (existingUser.rowCount > 0) {
                return res.status(409).json({ error: 'That username is already taken' });
            }

            const result = await db.query(
                `INSERT INTO Users (name, password, is_male, age, weight, height)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING ${publicUserFields}`,
                [name, hashPassword(password), is_male, age, weight, height]
            );

            return res.status(201).json(result.rows[0]);
        } catch (err) {
            if (err.code === '23505') {
                return res.status(409).json({ error: 'That username is already taken' });
            }

            return res.status(500).json({ error: err.message });
        }
    },

    login: async (req, res) => {
        const { name, password } = req.body;

        try {
            const result = await db.query(
                `SELECT ${publicUserFields} FROM Users WHERE name = $1 AND password = $2`,
                [name, hashPassword(password)]
            );

            if (result.rowCount === 0) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }

            return res.status(200).json(result.rows[0]);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    },

    getUser: async (req, res) => {
        const { user_id } = req.params;

        try {
            const result = await db.query(
                `SELECT ${publicUserFields} FROM Users WHERE id = $1`,
                [user_id]
            );

            if (result.rowCount === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            return res.status(200).json(result.rows[0]);
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    }
};

module.exports = UsersHelper;
