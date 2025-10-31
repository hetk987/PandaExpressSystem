// Header.tsx
import React from 'react';
import { useAuth } from './auth-context';

const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <header>
            {isAuthenticated ? (
                <>
                    <span>Welcome, {user?.username}!</span>
                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <span>Please log in</span>
            )}
        </header>
    );
};

export default Header;