const pool = require('../config/database');
const bcrypt = require('bcryptjs');

exports.closeAccount = async (req, res) => {
  const { username, password } = req.body;
  const userId = req.user.id;

  try {
    const [users] = await pool.query(
      'SELECT id, username, password_hash, balance FROM users WHERE id = ? AND username = ?',
      [userId, username]
    );
    if (users.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    if (Number(user.balance) !== 0) {
      return res.status(400).json({ message: 'Account balance must be zero to close account.' });
    }

    await pool.query('DELETE FROM users WHERE id = ?', [userId]);

    res.cookie('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      expires: new Date(0),
      path: '/'
    });
    res.status(200).json({ message: 'Account closed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
