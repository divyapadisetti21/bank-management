import React, { useState, useEffect } from 'react';
import axiosConfig from '../api/axiosConfig';

const Movements = ({ refreshTrigger }) => {
    const [movements, setMovements] = useState([]);
    const [sort, setSort] = useState('date_desc');

    useEffect(() => {
        const fetchMovements = async () => {
            try {
                const { data } = await axiosConfig.get('/transactions');
                setMovements(data);
            } catch (error) {
                console.error("Failed to fetch movements", error);
            }
        };
        fetchMovements();
    }, [refreshTrigger]);

    const sortedMovements = [...movements].sort((a, b) => {
        switch (sort) {
            case 'date_asc':
                return new Date(a.created_at) - new Date(b.created_at);
            case 'amount_desc':
                return Math.abs(b.amount) - Math.abs(a.amount);
            case 'amount_asc':
                return Math.abs(a.amount) - Math.abs(b.amount);
            default:
                return new Date(b.created_at) - new Date(a.created_at);
        }
    });

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>All Movements</h3>
                <div className="sorting-controls">
                    <select value={sort} onChange={(e) => setSort(e.target.value)}>
                        <option value="date_desc">Sort by Date (Newest)</option>
                        <option value="date_asc">Sort by Date (Oldest)</option>
                        <option value="amount_desc">Sort by Amount (High-Low)</option>
                        <option value="amount_asc">Sort by Amount (Low-High)</option>
                    </select>
                </div>
            </div>
            <ul className="movements-list">
                {sortedMovements.length > 0 ? (
                    sortedMovements.map((mov, i) => (
                        <li
                            key={i}
                            className={`movement-item ${mov.amount > 0 ? 'deposit' : 'withdrawal'}`}
                        >
                            <div className="movement-type">
                                <span className="type-text">{mov.type.replace('_', ' ')}</span>
                                <span className="type-date">{new Date(mov.created_at).toLocaleDateString()}</span>
                            </div>
                            <span className="movement-amount">${parseFloat(mov.amount).toFixed(2)}</span>
                        </li>
                    ))
                ) : (
                    <li>No transactions yet.</li>
                )}
            </ul>
        </div>
    );
};

export default Movements;
