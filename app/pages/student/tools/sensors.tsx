import { FONT_FAMILY } from '@/app/styles';
import { useTheme } from '@/src/context/ThemeContext';
import { ThemeKey } from '@/src/context/ThemeContext.d';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { activityColors } from '../activities/activityStyles';

const UPDATE_INTERVAL_MS = 100;
const SMOOTH_WINDOW = 8;
const BAR_MAX_ACCELERATION = 4;
const BAR_MAX_GYRO = 6;
const SMOOTH_WINDOW_GYRO = 8;

type Vec3 = {x: number;y: number;z: number};

function pushWindow(buffer: Vec3[], val: Vec3, size: number): Vec3[] {
    const next = [...buffer, val];
    return (next.length > size ? next.slice(next.length - size) : next);
}

function avgVec3(buffer: Vec3[]): Vec3 {
    if (buffer.length === 0){
        return {x: 0,y: 0,z: 0};
    }
    const sum = buffer.reduce((a,b) => ({x: a.x + b.x, y: a.y + b.y, z:a.z + b.z}), {x: 0,y: 0,z: 0});
    return ({x: sum.x / buffer.length, y:sum.y / buffer.length,z: sum.z / buffer.length});
}

function magnitudeVariance(buffer: Vec3[]): number {
    if (buffer.length < 2){
        return 0;
    };

    const magnitudes = buffer.map(v => Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2));
    const mean = magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length;
    return (magnitudes.reduce((a, b) => a + (b - mean) ** 2, 0) / magnitudes.length);
};

function smoothnessScore(variance: number): number {
    return (Math.max(0, Math.round(100 - variance * 1000)));
};

function gForceColor(g: number): string {
    if (g < 1.3){
        return '#4caf50';
    };
    if (g < 2.0){
        return '#ff9800';
    };
    return '#e05c5c';
};

function smoothnessColor(score: number): string {
    if (score >= 70){
        return '#4caf50';
    };
    if (score >= 40){
        return '#ff9800'
    };
    return '#e05c5c';
};

export default function Sensors() {
    const [active, setActive] = useState(false);
    const [acceleration, setAcceleration] = useState<Vec3>({x: 0, y: 0, z: 0});
    const [gyro, setGyro] = useState<Vec3>({x: 0, y: 0, z:0});
    const [smoothAcceleration, setSmoothAcceleration] = useState<Vec3>({x: 0, y: 0, z: 0});
    const [smoothGyro, setSmoothGyro] = useState<Vec3>({x: 0, y: 0, z: 0});
    const [calibrateOffset, setCalibrateOffset] = useState<Vec3>({x: 0, y: 0, z: 0});
    const [peakG, setPeakG] = useState(0);
    const [avgG, setavgG] = useState(0);
    const avgGSum = useRef(0);
    const avgCount = useRef(0);
    const [smoothScore, setSmoothScore] = useState(100);
    const accelerationBuffer = useRef<Vec3[]>([]);
    const gyroBuffer = useRef<Vec3[]>([]);

    const { theme } = useTheme();
    const themed = activityColors[theme as ThemeKey];

    useEffect(() => {
        if (!active) {
            return;
        };
        Accelerometer.setUpdateInterval(UPDATE_INTERVAL_MS);
        Gyroscope.setUpdateInterval(UPDATE_INTERVAL_MS);

        const accelerationSub = Accelerometer.addListener((raw) => {
            setAcceleration(raw);
            accelerationBuffer.current = pushWindow(accelerationBuffer.current, raw, SMOOTH_WINDOW);
            const avg = avgVec3(accelerationBuffer.current);
            setSmoothAcceleration(avg);

            const cx = avg.x - calibrateOffset.x;
            const cy = avg.y - calibrateOffset.y;
            const cz = avg.z - calibrateOffset.z;
            const g = Math.sqrt(cx ** 2 + cy ** 2 + cz ** 2);
            setPeakG(prev => Math.max(prev, parseFloat(g.toFixed(2))));

            avgGSum.current += g;
            avgCount.current += 1;
            setavgG(parseFloat((avgGSum.current / avgCount.current).toFixed(2)));
        });

        const gyroSub = Gyroscope.addListener((raw) => {
            setGyro(raw);
            gyroBuffer.current = pushWindow(gyroBuffer.current, raw, SMOOTH_WINDOW_GYRO);
            setSmoothGyro(avgVec3(gyroBuffer.current));
            const variance = magnitudeVariance(gyroBuffer.current);
            setSmoothScore(smoothnessScore(variance));
        });

        return () => {
            accelerationSub.remove();
            gyroSub.remove();
        }
    }, [active, calibrateOffset]);

    const calibrated = {
        x: smoothAcceleration.x - calibrateOffset.x,
        y: smoothAcceleration.y - calibrateOffset.y,
        z: smoothAcceleration.z - calibrateOffset.z,
    };
    const currentG = parseFloat(Math.sqrt(calibrated.x ** 2 + calibrated.y ** 2 + calibrated.z ** 2).toFixed(2));
    const gColor = gForceColor(currentG);
    const smoothColor = smoothnessColor(smoothScore);
    
    const handleToggle = () => {
        if (active){
            accelerationBuffer.current = [];
            gyroBuffer.current = [];
        } else {
            setPeakG(0);
            setavgG(0);
            avgGSum.current = 0;
            avgCount.current = 0;
            setSmoothScore(100);
        }
        setActive(v => !v);
    };

    const handleCalibrate = () => {
        setCalibrateOffset({...smoothAcceleration});
        setPeakG(0);
        setavgG(0);
        avgGSum.current = 0;
        avgCount.current = 0;
    };

    const Bar = ({value, max}: {value: number; max: number}) => {
        const pct = Math.min(Math.abs(value) / max, 1);
        return (
            <View style={localStyles.bar_background}>
                <View style={[[themed.sensor_toggle, localStyles.bar_fill], {width: `${pct * 100}` as any}]}/>
            </View>
        );
    };

    return (
        <View style={localStyles.container}>
            <View style={localStyles.control_row}>
                <TouchableOpacity
                    style={[[themed.sensor_toggle, localStyles.toggle], active && localStyles.toggle_active, {flex: 1}]}
                    onPress={handleToggle}>

                    <Text style={[themed.sensor_toggle_text, localStyles.toggle_text]}>
                        {active ? '⏹ Stop Sensors' : '▶ Start Sensors'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[[themed.sensor_toggle, localStyles.toggle, localStyles.calibrate_button], !active && localStyles.button_disabled]}
                    onPress={handleCalibrate}
                    disabled={!active}>
                        
                    <Text style={[themed.sensor_toggle_text, localStyles.toggle_text]}>
                        ⊙ Calibrate
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={localStyles.card_grid}>
                <View style={[themed.sensor_gforce_container, localStyles.card]}>
                    <Text style={[themed.sensor_toggle_text, localStyles.card_label]}>
                        Current G-Force
                    </Text>
                    <Text style={[localStyles.card_value, {color: gColor}]}>
                        {currentG.toFixed(2)}
                    </Text>
                    <Text style={[themed.sensor_toggle_text, localStyles.card_sub]}>
                        current
                    </Text>
                </View>

                <View style={[themed.sensor_gforce_container, localStyles.card]}>
                    <Text style={[themed.sensor_toggle_text, localStyles.card_label]}>
                        Peak G
                    </Text>
                    <Text style={[localStyles.card_value, {color: '#e05c5c'}]}>
                        {peakG.toFixed(2)}
                    </Text>
                    <Text style={[themed.sensor_toggle_text, localStyles.card_sub]}>
                        this session
                    </Text>
                </View>

                <View style={[themed.sensor_gforce_container, localStyles.card]}>
                    <Text style={[themed.sensor_toggle_text, localStyles.card_label]}>
                        Avg G
                    </Text>
                    <Text style={[localStyles.card_value, {color: gForceColor(avgG)}]}>
                        {avgG.toFixed(2)}
                    </Text>
                    <Text style={[themed.sensor_toggle_text, localStyles.card_sub]}>
                        this session
                    </Text>
                </View>

                <View style={[themed.sensor_gforce_container, localStyles.card]}>
                    <Text style={[themed.sensor_toggle_text, localStyles.card_label]}>
                        Smoothness
                    </Text>
                    <Text style={[localStyles.card_value, {color: smoothColor}]}>
                        {smoothScore}
                    </Text>
                    <Text style={[themed.sensor_toggle_text, localStyles.card_sub]}>
                        / 100
                    </Text>
                </View>
            </View>

            <Text style={[themed.sensor_text, localStyles.section]}>
                📱 Accelerometer (g) - Movement Intensity
            </Text>
            {(['x', 'y', 'z'] as const).map((axis) => (
                <View key={axis} style={localStyles.axis_row}>
                    <Text style={[themed.sensor_axis_label, localStyles.axis_label]}>
                        {axis.toUpperCase()}
                    </Text>
                    <Bar value={calibrated[axis]} max={BAR_MAX_ACCELERATION}/>
                    <Text style={[themed.sensor_text, localStyles.axis_value]}>
                        {calibrated[axis].toFixed(3)}
                    </Text>
                </View>
            ))}

            <Text style={[themed.sensor_text, localStyles.section]}>
                🔄 Gyroscope (rad/s)
            </Text>
            {(['x', 'y', 'z'] as const).map((axis) => (
                <View key={axis} style={localStyles.axis_row}>
                    <Text style={[themed.sensor_axis_label, localStyles.axis_label]}>
                        {axis.toUpperCase()}
                    </Text>
                    <Bar value={smoothGyro[axis]} max={BAR_MAX_GYRO}/>
                    <Text style={[themed.sensor_text, localStyles.axis_value]}>
                        {smoothGyro[axis].toFixed(3)}
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

    control_row: {
        flexDirection: 'row',
        gap: 8,
    },

    toggle: {
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
    },

    toggle_active: {
        backgroundColor: '#e05c5c',
    },

    calibrate_button: {
        flex: 0,
        paddingHorizontal: 14,
    },

    button_disabled: {
        opacity: 0.4,
    },

    toggle_text: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
    },

    card_grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },

    card: {
        width: '48%',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
    },

    card_label: {
        fontSize: 12,
        fontFamily: FONT_FAMILY,
        fontWeight: '600',
        marginBottom: 2,
    },

    card_value: {
        fontSize: 28,
        fontFamily: FONT_FAMILY,
        fontWeight: '800',
    },

    card_sub: {
        fontSize: 12,
        fontFamily: FONT_FAMILY,
        opacity: 0.6,
        marginTop: 2,
    },

    section: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
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
        borderRadius: 5,
    },

    axis_value: {
        width: 52,
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontWeight: '600',
        textAlign: 'right',
    },
})