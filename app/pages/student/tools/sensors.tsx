import React from "react"
import { StyleSheet, Text, View } from "react-native"


export default function SensorsScreen() {
    return (
        <View style={localStyles.container}>
            <Text>
                Sensors
            </Text>
        </View>
    )
}

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})