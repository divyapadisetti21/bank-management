import React, { useState } from 'react';
import axiosConfig from '../api/axiosConfig';

const Transfer = ({ onTransaction }) => {
  const [recipientUsername, setRecipientUsername] = useState('');
  const [amount, setAmount] = useState('');

  const handleTransfer = async () => {
    if (!recipientUsername || !amount || parseFloat(amount) <= 0) return alert('Enter valid data');
    try {
      await axiosConfig.post('/transactions/transfer', {
        recipientUsername,
        amount: parseFloat(amount),
      });
      alert('Transfer successful');
      setRecipientUsername('');
      setAmount('');
      if (onTransaction) onTransaction();
    } catch (err) {
      console.error('Error transferring money', err);
      alert(err.response?.data?.message || 'Transfer failed');
    }
  };

  return (
    <div className="card transaction-card">
      <h3>Transfer Money</h3>
      <div className="form-group">
        <label>Receiver Username</label>
        <input
          type="text"
          placeholder="Enter Receiver Username"
          value={recipientUsername}
          onChange={(e) => setRecipientUsername(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Amount</label>
        <input
          type="number"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <button onClick={handleTransfer} className="btn btn-success w-full">
        Transfer
      </button>
    </div>
  );
};

export default Transfer;
