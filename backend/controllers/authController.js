const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.registerUser = async (req, res) => {
    const { fullName, username, email, password } = req.body;
    if (!fullName || !username || !email || !password) {
        return res.status(400).json({ message: 'Please fill all fields' });
    }
    try {
        const [existingUser] = await pool.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email]);
        if (existingUser.length > 0) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const [result] = await pool.query(
            'INSERT INTO users (full_name, username, email, password_hash) VALUES (?, ?, ?, ?)',
            [fullName, username, email, passwordHash]
        );
        const userId = result.insertId;

        await pool.query('INSERT INTO movements (user_id, type, amount) VALUES (?, ?, ?)', [userId, 'deposit', 100.00]);
        res.status(201).json({ message: "Registration successful! Please log in." });
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
        
        const token = generateToken(user.id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 15 * 60 * 1000 // 15 minutes, matching the inactivity timer
        });

        res.json({ id: user.id, fullName: user.full_name, username: user.username });
    } catch (error) {
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
};

exports.logoutUser = (req, res) => {
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: 'Logged out successfully' });
};

exports.getLoggedInUser = async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, full_name, username, balance FROM users WHERE id = ?', [req.user.id]);
        if (users.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(users[0]);
    } catch (error) {
         res.status(500).json({ message: 'Server error', error: error.message });
    }
};