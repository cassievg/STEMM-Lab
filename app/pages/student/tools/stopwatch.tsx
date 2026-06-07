import React from "react"
import { StyleSheet, Text, View } from "react-native"


export default function Stopwatch() {
    return (
        <View style={localStyles.container}>
            <Text>
                Stopwatch
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