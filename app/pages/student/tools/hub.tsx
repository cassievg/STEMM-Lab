import { tools } from "@/src/tools/tools";
import { router } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FONT_FAMILY } from "../activities/activityStyles";
import ToolCard from "./toolCard";

export default function ToolsHubScreen() {
    return (
        <SafeAreaView style={localStyles.container}>
            <Text style={localStyles.header}>
                Tools
            </Text>
            
            <FlatList
                data={tools}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <ToolCard
                        title={item.title}
                        description={item.description}
                        icon={item.icon}
                        onPress={() => router.push(item.route as any)}
                    />
                )}
            />
        </SafeAreaView>
    );
}

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },

    header: {
        fontSize: 28,
        fontFamily: FONT_FAMILY,
        fontWeight: 'bold',
        marginBottom: 20,
    },
})