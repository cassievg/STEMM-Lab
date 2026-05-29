import { firestore } from '@/backend/firebase/config';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { signIn, signOut } from '../../backend/firebase/auth';

import { auth } from '@/backend/firebase/config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(undefined);
    const [userDoc, setUserDoc] = useState(null);

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(async (user) => {
            if (user) {
                const userDoc = await firestore().collection('users').doc(user.uid).get()
                setUserDoc(userDoc.data());
            } else {
                setUserDoc(null);
            }

            setCurrentUser(user ?? null);
        })

        return unsubscribe
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, userDoc, login: signIn, logout: signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);