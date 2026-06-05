import { Stack, useRouter } from "expo-router";
import React, { useEffect } from 'react';

import { ActivityIndicator } from "react-native";
import { AuthProvider, useAuth } from '../src/context/AuthContext.js';

import { SQLiteProvider } from "expo-sqlite";
import { initDatabase } from "../src/database/databaseServices";

export default function Layout() {
    return (
        <AuthProvider>
            <SQLiteProvider databaseName="stemm.db">
                <RootLayout />
            </SQLiteProvider>
        </AuthProvider>
    );
}

function RootLayout() {
    const { currentUser, userDoc } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (currentUser === undefined) return;

        if (currentUser === null) {
            router.replace('/pages/student/menu/login');
        } else {
            if (userDoc?.role === 'teacher') {
                router.replace('/pages/teacher/teacherhome');
            } else if (userDoc?.role === 'student') {
                router.replace('/pages/student/menu/homescreen');
            } 
        }
    }, [currentUser, userDoc])

    useEffect(() => {
        initDatabase();
        console.log("database initialized.");
    }, [])

    if (currentUser === undefined) return <ActivityIndicator style={{ flex: 1 }} />

    return <Stack screenOptions={{ headerShown: false }} />
}