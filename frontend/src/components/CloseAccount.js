import React, { useState } from 'react';
import axiosConfig from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const CloseAccount = () => {
  const { logout } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCloseAccount = async () => {
    if (!username || !password) return alert('Enter your username and password');
    if (!window.confirm('Are you sure you want to close your account? This action is irreversible.')) return;

    setLoading(true);
    try {
      // POST request to backend /user/close-account route
      const response = await axiosConfig.post('/user/close-account', { username, password });
      alert(response.data.message || 'Account closed successfully');
      logout();
    } catch (err) {
      console.error('Error closing account', err);
      alert(err.response?.data?.message || 'Failed to close account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card transaction-card">
      <h3>Close Account</h3>
      <p>Warning: Your account balance must be zero to close your account.</p>

      <div className="form-group">
        <label>Username</label>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        onClick={handleCloseAccount}
        className="btn btn-danger w-full"
        disabled={loading}
      >
        {loading ? 'Closing Account...' : 'Close Account'}
      </button>
    </div>
  );
};

export default CloseAccount;
