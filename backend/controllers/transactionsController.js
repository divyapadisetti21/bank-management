const pool = require('../config/database');

exports.getTransactions = async (req, res) => {
  try {
    const [movements] = await pool.query(
      'SELECT type, amount, created_at, counterparty_username FROM movements WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(movements);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.transferMoney = async (req, res) => {
  const { recipientUsername, amount } = req.body;
  const senderId = req.user.id;
  const transferAmount = Number.parseFloat(amount);

  if (!recipientUsername || !transferAmount || transferAmount <= 0) {
    return res.status(400).json({ message: 'Invalid transfer details' });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [senders] = await connection.query(
      'SELECT id, username, balance FROM users WHERE id = ? FOR UPDATE',
      [senderId]
    );
    const [recipients] = await connection.query(
      'SELECT id, username, balance FROM users WHERE username = ? FOR UPDATE',
      [recipientUsername]
    );

    const sender = senders[0];
    const recipient = recipients[0];

    if (!recipient) throw new Error('Recipient not found');
    if (sender.id === recipient.id) throw new Error('Cannot transfer to yourself');

    const senderBalance = Number(sender.balance);
    const recipientBalance = Number(recipient.balance);

    if (senderBalance < transferAmount) throw new Error('Insufficient funds');

    const newSenderBalance = senderBalance - transferAmount;
    const newRecipientBalance = recipientBalance + transferAmount;

    await connection.query('UPDATE users SET balance = ? WHERE id = ?', [newSenderBalance, senderId]);
    await connection.query('UPDATE users SET balance = ? WHERE id = ?', [newRecipientBalance, recipient.id]);

    await connection.query(
      'INSERT INTO movements (user_id, type, amount, counterparty_username) VALUES (?, ?, ?, ?)',
      [senderId, 'transfer_out', -transferAmount, recipient.username]
    );
    await connection.query(
      'INSERT INTO movements (user_id, type, amount, counterparty_username) VALUES (?, ?, ?, ?)',
      [recipient.id, 'transfer_in', transferAmount, sender.username]
    );

    await connection.commit();
    res.json({ message: 'Transfer successful', newBalance: newSenderBalance });
  } catch (error) {
    await connection.rollback();
    res.status(400).json({ message: error.message || 'Transfer failed' });
  } finally {
    connection.release();
  }
};

exports.requestLoan = async (req, res) => {
  const { amount } = req.body;
  const userId = req.user.id;
  const loanAmount = Number.parseFloat(amount);

  if (!loanAmount || loanAmount <= 0) {
    return res.status(400).json({ message: 'Invalid loan amount' });
  }

  try {
    // must have a deposit > 10% of requested loan
    const [deposits] = await pool.query(
      'SELECT id FROM movements WHERE user_id = ? AND amount > ? LIMIT 1',
      [userId, loanAmount * 0.10]
    );
    if (deposits.length === 0) {
      return res.status(400).json({
        message: 'Loan denied. You must have at least one deposit greater than 10% of the loan amount.'
      });
    }

    await pool.query('UPDATE users SET balance = balance + ? WHERE id = ?', [loanAmount, userId]);
    await pool.query('INSERT INTO movements (user_id, type, amount) VALUES (?, ?, ?)', [userId, 'loan', loanAmount]);

    const [users] = await pool.query('SELECT balance FROM users WHERE id = ?', [userId]);
    res.json({ message: 'Loan approved!', newBalance: Number(users[0].balance) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
