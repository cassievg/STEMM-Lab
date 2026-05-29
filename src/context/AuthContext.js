// src/Context/AuthContext.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadToken = async () => {
            try {
                const user = await AsyncStorage.getItem('user');
                if (user) {
                    setCurrentUser(user);
                    setLoading(false);
                }
            } catch (e) {
                console.log("Failed to load token, " + e);
                setLoading(false);
            }
        }
    }, []);

    const login = async (userData) => {
        setCurrentUser(userData);
        AsyncStorage.setItem('user', userData);
    };

    const logout = async () => {
        setCurrentUser(null);
        AsyncStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};