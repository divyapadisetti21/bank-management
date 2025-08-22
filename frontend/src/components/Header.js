import React from 'react';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const { user, logout } = useAuth();
    return (
        <header className="header">
            <div className="logo">Bankist</div>
            {user && (
                 <div className="user-info">
                    <span>Welcome, {user.full_name}!</span>
                    <button onClick={logout} className="logout-btn">Logout</button>
                </div>
            )}
        </header>
    );
};

export default Header;