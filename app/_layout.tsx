import { Stack } from "expo-router";
import React from 'react';

import { AuthProvider } from '../src/context/AuthContext.js';


export default function Layout() {
    return (
        <AuthProvider>
            <Stack screenOptions={{ headerShown: false }} />
        </AuthProvider>
    );
}