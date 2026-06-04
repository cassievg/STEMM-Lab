import { auth, firestore } from '@/backend/firebase/config';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { signIn, signOut } from '../../backend/firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(undefined);
    const [userDoc, setUserDoc] = useState(null);

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(async (user) => {
            setCurrentUser(user ?? null);

            if (!user) {
                setUserDoc(null);
                return;
            }

            return firestore().collection("users").doc(user.uid).onSnapshot((doc) => {
                if (!doc) {
                    setUserDoc(null);
                    return;
                }

                if (doc.exists) {
                    setUserDoc(doc.data());
                } else {
                    setUserDoc(null);
                }
            });
        });

        return unsubscribe
    }, []);

    return (
        <AuthContext.Provider value={{ currentUser, userDoc, login: signIn, logout: signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);