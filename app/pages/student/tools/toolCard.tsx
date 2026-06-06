import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { FONT_FAMILY, LIGHT_BLUE, WHITE } from "../activities/activityStyles";


type ToolCardProps = {
    title: string;
    description: string;
    icon: string;
    onPress: () => void;
};

export default function ToolCard({
    title,
    description,
    icon,
    onPress,
}: ToolCardProps) {
    return (
        <Pressable
            style={localStyles.card}
            onPress={onPress}>

            <Text style={localStyles.icon}>
                {icon}
            </Text>
            <View>
                <Text style={localStyles.title}>
                    {title}
                </Text>
                <Text style={localStyles.description}>
                    {description}
                </Text>
            </View>
        </Pressable>
    )
}

const localStyles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: WHITE,
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 2,
    },
    
    icon: {
        fontSize: 30,
        marginRight: 16,
    },

    title: {
        fontSize: 18,
        fontFamily: FONT_FAMILY,
        fontWeight: '600',
    },

    description: {
        color: LIGHT_BLUE,
        marginTop: 4,
    },
})