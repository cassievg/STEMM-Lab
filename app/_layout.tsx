import { Stack, useRouter } from "expo-router";
import React, { useEffect } from 'react';

import { ActivityIndicator } from "react-native";
import { AuthProvider, useAuth } from '../src/context/AuthContext.js';
import { ThemeProvider } from '../src/context/ThemeContext.js';

import { loadInterstitial } from "@/src/services/adServices";
import { initDatabase } from "@/src/services/databaseServices";
import { requestPemissions } from "@/src/services/notificationsServices";
import { SQLiteProvider } from "expo-sqlite";

export default function Layout() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <SQLiteProvider databaseName="stemm.db">
                    <RootLayout />
                </SQLiteProvider>
            </ThemeProvider>
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
            return;
        } 

        if (userDoc === null) return;

        if (userDoc?.role === 'student') {
            router.replace('/pages/student/menu/homescreen');
        } 
    }, [currentUser, router, userDoc])

    useEffect(() => {
        const setup = async () => {
            await initDatabase();
        }

        loadInterstitial();
        setup();
        requestPemissions();
    }, [])

    if (currentUser === undefined) return <ActivityIndicator style={{ flex: 1 }} />

    return <Stack screenOptions={{ headerShown: false }} />
}