import { FONT_FAMILY } from '@/app/styles';
import { useTheme } from '@/src/context/ThemeContext';
import { ThemeKey } from '@/src/context/ThemeContext.d';
import * as Battery from 'expo-battery';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, } from 'react-native';
import { activityColors } from '../activities/activityStyles';

const BLUE = '#97b9d6';
const DARK = '#1a2e3d';
const WHITE = '#ffffff';
const GREEN = '#4caf7d';
const RED = '#e05c5c';
const YELLOW = '#f0b429';

const getBatteryColor = (level: number): string => {
    if (level > 0.5) return GREEN;
    if (level > 0.2) return YELLOW;
    return RED;
};

const getBatteryLabel = (level: number): string => {
    if (level > 0.8) return 'Good';
    if (level > 0.5) return 'Moderate';
    if (level > 0.2) return 'Low';
    return '⚠️ Critical';
};

const getStateLabel = (state: Battery.BatteryState): string => {
    switch (state) {
        case Battery.BatteryState.CHARGING:    return '⚡ Charging';
        case Battery.BatteryState.FULL:        return '✅ Full';
        case Battery.BatteryState.UNPLUGGED:   return '🔋 Unplugged';
        default:                               return 'Unknown';
    }
};

export default function BatteryTool() {
    const [level, setLevel] = useState<number | null>(null);
    const [state, setState] = useState<Battery.BatteryState>(Battery.BatteryState.UNKNOWN);
    const [lowPowerMode, setLowPowerMode] = useState<boolean>(false);
    const { theme } = useTheme();
    const themed = activityColors[theme as ThemeKey];

    useEffect(() => {
        const load = async () => {
            const lvl = await Battery.getBatteryLevelAsync();
            const st = await Battery.getBatteryStateAsync();
            const lpm = await Battery.isLowPowerModeEnabledAsync();
            setLevel(lvl);
            setState(st);
            setLowPowerMode(lpm);
        };
        load();

        const levelSub = Battery.addBatteryLevelListener(({ batteryLevel }) => {
            setLevel(batteryLevel);
        });
        const stateSub = Battery.addBatteryStateListener(({ batteryState }) => {
            setState(batteryState);
        });
        const lpmSub = Battery.addLowPowerModeListener(({ lowPowerMode: lpm }) => {
            setLowPowerMode(lpm);
        });

        return () => {
            levelSub.remove();
            stateSub.remove();
            lpmSub.remove();
        };
    }, []);

    const pct = level !== null ? Math.round(level * 100) : null;
    const color = level !== null ? getBatteryColor(level) : BLUE;
    const isCharging = state === Battery.BatteryState.CHARGING || state === Battery.BatteryState.FULL;

    return (
        <View style={localStyles.container}>
            <View style={localStyles.battery_card}>
                <View style={localStyles.battery_icon_wrap}>
                    <View style={localStyles.battery_body}>
                        <View style={[
                            localStyles.battery_fill,
                            {
                                width: `${pct ?? 0}%` as any,
                                backgroundColor: color,
                            }
                        ]} />
                        <Text style={localStyles.battery_pct_overlay}>
                            {pct !== null ? `${pct}%` : '...'}
                        </Text>
                    </View>
                    <View style={localStyles.battery_tip} />
                </View>

                <View style={localStyles.status_row}>
                    <Text style={[localStyles.status_label, { color }]}>
                        {pct !== null ? getBatteryLabel(level!) : 'Loading...'}
                    </Text>
                    <Text style={localStyles.status_state}>
                        {getStateLabel(state)}
                    </Text>
                </View>
            </View>

            <View style={localStyles.info_grid}>
                <View style={[themed.info_chip, localStyles.info_chip]}>
                    <Text style={localStyles.info_chip_label}>Level</Text>
                    <Text style={[localStyles.info_chip_value, { color }]}>
                        {pct !== null ? `${pct}%` : '—'}
                    </Text>
                </View>
                <View style={[themed.info_chip, localStyles.info_chip]}>
                    <Text style={localStyles.info_chip_label}>Status</Text>
                    <Text style={localStyles.info_chip_value}>
                        {isCharging ? '⚡' : '🔋'} {isCharging ? 'Charging' : 'Unplugged'}
                    </Text>
                </View>
                <View style={[themed.info_chip, localStyles.info_chip]}>
                    <Text style={localStyles.info_chip_label}>Low Power</Text>
                    <Text style={[
                        localStyles.info_chip_value,
                        { color: lowPowerMode ? YELLOW : GREEN }
                    ]}>
                        {lowPowerMode ? '⚠️ On' : '✅ Off'}
                    </Text>
                </View>
            </View>

            {pct !== null && pct <= 20 && (
                <View style={localStyles.warning_box}>
                    <Text style={localStyles.warning_text}>
                        ⚠️ Battery is low. Plug in before starting a long activity to avoid losing your data.
                    </Text>
                </View>
            )}

            {lowPowerMode && (
                <View style={localStyles.warning_box}>
                    <Text style={localStyles.warning_text}>
                        ⚡ Low Power Mode is on. Some sensors and features may be limited.
                    </Text>
                </View>
            )}
        </View>
    );
}

const localStyles = StyleSheet.create({
    container: {
        gap: 12,
    },

    battery_card: {
        backgroundColor: DARK,
        borderRadius: 14,
        padding: 20,
        gap: 14,
        alignItems: 'center',
    },

    battery_icon_wrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },

    battery_body: {
        width: 220,
        height: 50,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
        overflow: 'hidden',
        position: 'relative',
        justifyContent: 'center',
    },

    battery_fill: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        borderRadius: 8,
    },

    battery_pct_overlay: {
        fontSize: 20,
        fontFamily: FONT_FAMILY,
        fontWeight: '800',
        color: WHITE,
        textAlign: 'center',
        zIndex: 1,
        textShadowColor: 'rgba(0,0,0,0.4)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },

    battery_tip: {
        width: 8,
        height: 20,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },

    status_row: {
        alignItems: 'center',
        gap: 4,
    },
    status_label: {
        fontSize: 18,
        fontFamily: FONT_FAMILY,
        fontWeight: '800',
    },
    status_state: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        color: 'rgba(255,255,255,0.6)',
        fontWeight: '500',
    },

    info_grid: {
        flexDirection: 'row',
        gap: 8,
    },


    info_chip: {
        flex: 1,
        borderRadius: 10,
        borderWidth: 1,
        paddingVertical: 10,
        paddingHorizontal: 8,
        alignItems: 'center',
        gap: 4,
    },

    info_chip_label: {
        fontSize: 12,
        fontFamily: FONT_FAMILY,
        color: '#888',
        fontWeight: '600',
        textTransform: 'uppercase',
    },

    info_chip_value: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
        color: DARK,
        textAlign: 'center',
    },

    warning_box: {
        backgroundColor: '#fff8e6',
        borderRadius: 10,
        padding: 12,
        borderLeftWidth: 3,
        borderLeftColor: YELLOW,
    },

    warning_text: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        color: '#7a5c00',
        lineHeight: 18,
    },
});