import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Balance = ({ refreshTrigger }) => {
    const { user, refreshUser } = useAuth();

    useEffect(() => {
        refreshUser();
    }, [refreshTrigger, refreshUser]);

    return (
        <div className="card balance">
            <p>Current Balance</p>
            <h2>${user?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}</h2>
        </div>
    );
};

export default Balance;
