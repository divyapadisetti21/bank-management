import React, { useState } from 'react';
import axiosConfig from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const Loan = ({ onTransaction }) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');

  const requestLoan = async () => {
    if (!amount || parseFloat(amount) <= 0) return alert('Enter valid loan amount');
    try {
      await axiosConfig.post('/transactions/loan', {
        userId: user.id,
        amount: parseFloat(amount),
      });
      alert('Loan requested successfully');
      setAmount('');
      if (onTransaction) onTransaction();
    } catch (err) {
      console.error('Error requesting loan', err);
      alert(err.response?.data?.message || 'Loan request failed');
    }
  };

  return (
    <div className="card transaction-card">
      <h3>Request Loan</h3>
      <div className="form-group">
        <label>Loan Amount</label>
        <input
          type="number"
          placeholder="Enter Loan Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <button onClick={requestLoan} className="btn btn-primary w-full">
        Request Loan
      </button>
    </div>
  );
};

export default Loan;
