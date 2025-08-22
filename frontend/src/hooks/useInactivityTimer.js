import { useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const INACTIVITY_TIME = 15 * 60 * 1000;

export const useInactivityTimer = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = useCallback(() => {
        if(user) { // Only logout if there is a user
            logout();
            alert('You have been logged out due to inactivity.');
            navigate('/login');
        }
    }, [logout, user, navigate]);

    useEffect(() => {
        let timer;
        const events = ['mousemove', 'keydown', 'scroll', 'click'];
        const resetTimer = () => {
            clearTimeout(timer);
            timer = setTimeout(handleLogout, INACTIVITY_TIME);
        };
        if (user) {
            events.forEach(event => window.addEventListener(event, resetTimer));
            resetTimer(); 
        }
        return () => {
            clearTimeout(timer);
            events.forEach(event => window.removeEventListener(event, resetTimer));
        };
    }, [handleLogout, user]);
};