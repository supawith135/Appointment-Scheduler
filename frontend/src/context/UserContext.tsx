// UserContext.tsx
import React, { createContext, useContext, useState } from 'react';

interface UserContextType {
    role: string;
    setRole: (role: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [role, setRole] = useState<string>(() => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user).role : '';
    });

    return (
        <UserContext.Provider value={{ role, setRole }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
