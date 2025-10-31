// AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    user: { username: string } | null;
    login: (username: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<{ username: string } | null>(null);

    const login = (username: string) => {
        // In a real application, you'd make an API call here to authenticate the user
        // and store a token (e.g., in localStorage)
        setIsAuthenticated(true);
        setUser({ username });
    };

    const logout = () => {
        // Clear any stored tokens/user data
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};