import { Accelerometer, Gyroscope } from 'expo-sensors';
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BLUE, DARK, FONT_FAMILY, WHITE } from '../activities/activityStyles';


export default function Sensors() {
    const [acceleration, setAcceleration] = useState({x: 0, y: 0, z: 0});
    const [gyro, setGyro] = useState({x: 0, y: 0, z:0});
    const [active, setActive] = useState(false);

    useEffect(() => {
        if (!active) {
            return;
        };
        Accelerometer.setUpdateInterval(200);
        Gyroscope.setUpdateInterval(200);
        const accelSub = Accelerometer.addListener(setAcceleration);
        const gyroSub = Gyroscope.addListener(setGyro);
        return () => {
            accelSub.remove();
            gyroSub.remove();
        };
    }, [active])

    const magnitude = Math.sqrt(acceleration.x ** 2 + acceleration.y ** 2 + acceleration.z ** 2);
    const gForce = (magnitude).toFixed(2);

    const Bar = ({value}: {value: number}) => {
        const pct = Math.min(Math.abs(value) / 2,1);
        return (
            <View style={localStyles.bar_background}>
                <View style={[localStyles.bar_fill, {width: `${pct * 100}` as any}]}/>
            </View>
        );
    };

    return (
        <View style={localStyles.container}>
            <TouchableOpacity
                style={[localStyles.toggle, active && localStyles.toggle_active]}
                onPress={() => setActive(!active)}>

                <Text style={localStyles.toggle_text}>
                    {active ? '⏹ Stop Sensors' : '▶ Start Sensors'}
                </Text>
            </TouchableOpacity>

            <View style={localStyles.gforce_container}>
                <Text style={localStyles.gforce_label}>
                    Current G-Force
                </Text>
                <Text style={localStyles.gforce_value}>
                    {gForce}
                </Text>
            </View>

            <Text style={localStyles.section}>
                📱 Accelerometer (g)
            </Text>
            {(['x', 'y', 'z'] as const).map((axis) => (
                <View key={axis} style={localStyles.axis_row}>
                    <Text style={localStyles.axis_label}>
                        {axis.toUpperCase()}
                    </Text>
                    <Bar value={acceleration[axis]}/>
                    <Text style={localStyles.axis_value}>
                        {acceleration[axis].toFixed(3)}
                    </Text>
                </View>
            ))}

            <Text style={localStyles.section}>
                🔄 Gyroscope (rad/s)
            </Text>
            {(['x', 'y', 'z'] as const).map((axis) => (
                <View key={axis} style={localStyles.axis_row}>
                    <Text style={localStyles.axis_label}>
                        {axis.toUpperCase()}
                    </Text>
                    <Bar value={gyro[axis]}/>
                    <Text style={localStyles.axis_value}>
                        {gyro[axis].toFixed(3)}
                    </Text>
                </View>
            ))}
        </View>
    );
}

const localStyles = StyleSheet.create({
    container: {
        gap: 8
    },

    toggle: {
        backgroundColor: BLUE,
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
    },

    toggle_active: {
        backgroundColor: '#e05c5c',
    },

    toggle_text: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        color: WHITE,
        fontWeight: '700',
    },

    gforce_container: {
        backgroundColor: DARK,
        borderRadius: 12,
        padding: 14,
        alignItems: 'center',
    },

    gforce_label: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        color: 'rgba(255,255,255,0.6)',
        marginBottom: 4,
    },

    gforce_value: {
        fontSize: 36,
        fontFamily: FONT_FAMILY,
        fontWeight: '800',
        color: WHITE,
    },

    section: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
        color: DARK,
        marginTop: 4,
    },

    axis_row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    axis_label: {
        width: 20,
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
        color: BLUE,
    },

    bar_background: {
        flex: 1,
        height: 10,
        backgroundColor: '#e8f0f7',
        borderRadius: 5,
        overflow: 'hidden',
    },

    bar_fill: {
        height: '100%',
        backgroundColor: BLUE,
        borderRadius: 5,
    },

    axis_value: {
        width: 52,
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        color: DARK,
        fontWeight: '600',
        textAlign: 'right',
    },
})