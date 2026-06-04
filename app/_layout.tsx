import { Stack, useRouter } from "expo-router";
import React, { useEffect } from 'react';

import { ActivityIndicator } from "react-native";
import { AuthProvider, useAuth } from '../src/context/AuthContext.js';

import { useDatabase } from "../src/context/DBContext.js";
import { initDatabase } from "../src/database/databaseServices.js";

export default function Layout() {
    return (
        <AuthProvider>
            <RootLayout />
        </AuthProvider>
    );
}

function RootLayout() {
    const { currentUser, userDoc } = useAuth();
    const { db } = useDatabase();
    const router = useRouter();

    useEffect(() => {
        if (currentUser === undefined) return;

        if (currentUser === null) {
            router.replace('/login');
        } else {
            if (userDoc?.role === 'teacher') {
                router.replace('/teacher/teacherhome');
            } else if (userDoc?.role === 'student') {
                router.replace('/homescreen');
            } 
        }
    }, [currentUser, userDoc])

    useEffect(() => {
        initDatabase(db);
        console.log("database initialized.");
    }, [])

    if (currentUser === undefined) return <ActivityIndicator style={{ flex: 1 }} />

    return <Stack screenOptions={{ headerShown: false }} />
}