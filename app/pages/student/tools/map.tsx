import { FONT_FAMILY } from '@/app/styles';
import { useTheme } from '@/src/context/ThemeContext';
import { ThemeKey } from '@/src/context/ThemeContext.d';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { activityColors } from '../activities/activityStyles';

const BLUE = '#97b9d6';
const DARK = '#1a2e3d';
const WHITE = '#ffffff';
const RED = '#e05c5c';
const GREEN = '#4caf7d';
const YELLOW = '#f0b429';

const LOCATION_TASK = 'background-location-task';
const MAX_HISTORY = 20;

TaskManager.defineTask(LOCATION_TASK, async ({ data, error }: any) => {
    if (error) {
        console.error('Background location error:', error);
        return;
    }
});

type LocationPoint = {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: number;
};

export default function MapTool() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { theme } = useTheme();
    const themed = activityColors[theme as ThemeKey];

    const [tracking, setTracking] = useState(false);
    const [locationHistory, setLocationHistory] = useState<LocationPoint[]>([]);
    const watchRef = useRef<Location.LocationSubscription | null>(null);

    useEffect(() => {
        getLocation();
        checkTrackingStatus();
    }, []);

const checkTrackingStatus = async () => {
    try {
        const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK);
        if (hasStarted) {
            setTracking(true);
            watchRef.current = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 3000,
                    distanceInterval: 2,
                },
                (newLocation) => {
                    setLocation(newLocation);
                    setLocationHistory((prev) => {
                        const point: LocationPoint = {
                            latitude: newLocation.coords.latitude,
                            longitude: newLocation.coords.longitude,
                            accuracy: newLocation.coords.accuracy ?? 0,
                            timestamp: newLocation.timestamp,
                        };
                        const next = [...prev, point];
                        return next.length > MAX_HISTORY
                            ? next.slice(next.length - MAX_HISTORY)
                            : next;
                    });
                }
            );
        }
    } 
    catch (e) {
        setTracking(false);
        }
    };
    const getLocation = async () => {
        setLoading(true);
        setErrorMsg(null);
        setAddress(null);

        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Location permission denied. Please enable it in your device settings.');
                setLoading(false);
                return;
            }

            const loc = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });
            setLocation(loc);

            const geocode = await Location.reverseGeocodeAsync({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
            });

            if (geocode.length > 0) {
                const g = geocode[0];
                const parts = [g.name, g.street, g.city, g.region, g.country].filter(Boolean);
                setAddress(parts.join(', '));
            }
        } catch (e) {
            setErrorMsg('Could not get location. Make sure GPS is enabled.');
        }

        setLoading(false);
    };


    const startTracking = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Location permission required for tracking.');
                return;
            }

            const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();

            watchRef.current = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 10000,   
                    distanceInterval: 0,  
                },
                (newLocation) => {
                    setLocation(newLocation);
                    setLocationHistory((prev) => {
                        const point: LocationPoint = {
                            latitude: newLocation.coords.latitude,
                            longitude: newLocation.coords.longitude,
                            accuracy: newLocation.coords.accuracy ?? 0,
                            timestamp: newLocation.timestamp,
                        };
                        const next = [...prev, point];
                        return next.length > MAX_HISTORY
                            ? next.slice(next.length - MAX_HISTORY)
                            : next;
                    });
                }
            );

            if (bgStatus === 'granted') {
                await Location.startLocationUpdatesAsync(LOCATION_TASK, {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 10000,
                    distanceInterval: 0,
                    showsBackgroundLocationIndicator: true,
                    foregroundService: {
                        notificationTitle: 'STEMM Lab',
                        notificationBody: 'Tracking your location for the activity.',
                        notificationColor: BLUE,
                    },
                });
            }

            setTracking(true);
        } catch (e) {
            console.error('Tracking error:', e);
            setErrorMsg('Could not start tracking.');
        }
    };

    const stopTracking = async () => {
        try {
            if (watchRef.current) {
                watchRef.current.remove();
                watchRef.current = null;
            }
            const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK);
            if (hasStarted) {
                await Location.stopLocationUpdatesAsync(LOCATION_TASK);
            }
        } catch (e) {

        }
        setTracking(false);
    };

    const clearHistory = () => setLocationHistory([]);

    const getAccuracyColor = (accuracy: number): string => {
        if (accuracy <= 10) return GREEN;
        if (accuracy <= 30) return YELLOW;
        return RED;
    };

    const getAccuracyLabel = (accuracy: number): string => {
        if (accuracy <= 10) return 'High';
        if (accuracy <= 30) return 'Moderate';
        return 'Low';
    };

    return (
        <View style={localStyles.container}>

            {loading && (
                <View style={[themed.loading_box, localStyles.loading_box]}>
                    <ActivityIndicator color={BLUE} size="large" />
                    <Text style={localStyles.loading_text}>Getting your location...</Text>
                </View>
            )}

            {!loading && errorMsg && (
                <View style={localStyles.error_box}>
                    <Text style={localStyles.error_icon}>📍</Text>
                    <Text style={localStyles.error_text}>{errorMsg}</Text>
                    <TouchableOpacity
                        style={localStyles.retry_btn}
                        onPress={getLocation}
                        activeOpacity={0.8}>
                        <Text style={localStyles.retry_btn_text}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            )}

            {!loading && location && (
                <>
                    <View style={localStyles.coords_card}>
                        <Text style={localStyles.coords_icon}>📍</Text>
                        <Text style={localStyles.coords_title}>Current Location</Text>
                        <Text style={localStyles.coords_value}>
                            {location.coords.latitude.toFixed(6)}
                        </Text>
                        <Text style={localStyles.coords_label}>Latitude</Text>
                        <View style={localStyles.divider} />
                        <Text style={localStyles.coords_value}>
                            {location.coords.longitude.toFixed(6)}
                        </Text>
                        <Text style={localStyles.coords_label}>Longitude</Text>
                    </View>

                    <View style={localStyles.info_grid}>
                        <View style={[themed.info_chip, localStyles.info_chip]}>
                            <Text style={[localStyles.info_chip_label]}>Accuracy</Text>
                            <Text style={[
                                localStyles.info_chip_value,
                                { color: getAccuracyColor(location.coords.accuracy ?? 99) }
                            ]}>
                                ±{Math.round(location.coords.accuracy ?? 0)}m
                            </Text>
                            <Text style={[
                                localStyles.info_chip_sublabel,
                                { color: getAccuracyColor(location.coords.accuracy ?? 99) }
                            ]}>
                                {getAccuracyLabel(location.coords.accuracy ?? 99)}
                            </Text>
                        </View>
                        <View style={[themed.info_chip, localStyles.info_chip]}>
                            <Text style={localStyles.info_chip_label}>Altitude</Text>
                            <Text style={localStyles.info_chip_value}>
                                {location.coords.altitude !== null
                                    ? `${Math.round(location.coords.altitude ?? 0)}m`
                                    : '—'}
                            </Text>
                        </View>
                        <View style={[themed.info_chip, localStyles.info_chip]}>
                            <Text style={localStyles.info_chip_label}>Speed</Text>
                            <Text style={localStyles.info_chip_value}>
                                {location.coords.speed !== null && location.coords.speed! > 0
                                    ? `${(location.coords.speed!).toFixed(1)} m/s`
                                    : '0 m/s'}
                            </Text>
                        </View>
                    </View>

                    {address && (
                        <View style={[themed.address_box, localStyles.address_box]}>
                            <Text style={localStyles.address_label}>🏠 Address</Text>
                            <Text style={[themed.address_text ,localStyles.address_text]}>{address}</Text>
                        </View>
                    )}

                    <View style={localStyles.timestamp_box}>
                        <Text style={localStyles.timestamp_text}>
                            🕐 Last updated: {new Date(location.timestamp).toLocaleTimeString()}
                        </Text>
                    </View>
                </>
            )}

            <View style={localStyles.tracking_row}>
                <TouchableOpacity
                    style={[localStyles.track_btn, tracking && localStyles.track_btn_stop]}
                    onPress={tracking ? stopTracking : startTracking}
                    activeOpacity={0.8}>
                    <Text style={localStyles.track_btn_text}>
                        {tracking ? '⏹ Stop Tracking' : '▶ Start Tracking'}
                    </Text>
                </TouchableOpacity>

                {!tracking && (
                    <TouchableOpacity
                        style={localStyles.refresh_btn}
                        onPress={getLocation}
                        activeOpacity={0.8}
                        disabled={loading}>
                        <Text style={localStyles.refresh_btn_text}>↺</Text>
                    </TouchableOpacity>
                )}
            </View>

            {tracking && (
                <View style={localStyles.tracking_indicator}>
                    <View style={localStyles.tracking_dot} />
                    <Text style={localStyles.tracking_text}>
                        Live tracking active — updates every 10s
                    </Text>
                </View>
            )}

            {locationHistory.length > 0 && (
                <View style={[themed.history_wrap, localStyles.history_wrap]}>
                    <View style={localStyles.history_header}>
                        <Text style={localStyles.history_title}>
                            📜 Location History ({locationHistory.length})
                        </Text>
                        <TouchableOpacity onPress={clearHistory}>
                            <Text style={localStyles.history_clear}>Clear</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={localStyles.history_scroll}
                        showsVerticalScrollIndicator={false}>
                        {[...locationHistory].reverse().map((point, i) => (
                            <View key={i} style={localStyles.history_row}>
                                <View style={localStyles.history_index_wrap}>
                                    <Text style={localStyles.history_index}>
                                        {locationHistory.length - i}
                                    </Text>
                                </View>
                                <View style={localStyles.history_coords}>
                                    <Text style={localStyles.history_lat}>
                                        {point.latitude.toFixed(5)}, {point.longitude.toFixed(5)}
                                    </Text>
                                    <Text style={localStyles.history_time}>
                                        {new Date(point.timestamp).toLocaleTimeString()}
                                    </Text>
                                </View>
                                <Text style={[
                                    localStyles.history_accuracy,
                                    { color: getAccuracyColor(point.accuracy) }
                                ]}>
                                    ±{Math.round(point.accuracy)}m
                                </Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}

        </View>
    );
}

const localStyles = StyleSheet.create({
    container: { 
        gap: 10 
    },

    loading_box: {
        height: 120, 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: 10, 
        borderRadius: 14,
    },

    loading_text: { 
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        color: '#888' 
    },

    error_box: {
        backgroundColor: '#fff5f5', 
        borderRadius: 14, 
        padding: 20,
        alignItems: 'center', 
        gap: 10, 
        borderWidth: 1,
         borderColor: '#fcc',
    },

    error_icon: { 
        fontSize: 32 
    },

    error_text: { 
        fontSize: 14, 
        fontFamily: FONT_FAMILY,
        color: RED, 
        textAlign: 'center', 
        lineHeight: 20 
    },

    retry_btn: {
        backgroundColor: BLUE, 
        borderRadius: 8, 
        paddingHorizontal: 20, 
        paddingVertical: 8,
    },

    retry_btn_text: { 
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontWeight: '700', 
        color: WHITE, 
    },

    coords_card: {
        backgroundColor: DARK, 
        borderRadius: 14, 
        padding: 20, 
        alignItems: 'center', 
        gap: 4,
    },

    coords_icon: { 
        fontSize: 28,
        marginBottom: 4 
    },

    coords_title: {
        fontSize: 14, 
        fontFamily: FONT_FAMILY,
        color: 'rgba(255,255,255,0.5)', 
        fontWeight: '600',
        textTransform: 'uppercase', 
        letterSpacing: 0.5, 
        marginBottom: 8,
    },

    coords_value: {
        fontSize: 28, 
        fontFamily: FONT_FAMILY,
        fontWeight: '800',
        color: WHITE, 
        fontVariant: ['tabular-nums'],
    },

    coords_label: {
        fontSize: 12, 
        fontFamily: FONT_FAMILY,
        color: 'rgba(255,255,255,0.5)', 
        fontWeight: '600',
        textTransform: 'uppercase', 
        letterSpacing: 0.5,
    },
    divider: {
        width: '60%', 
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)', 
        marginVertical: 8,
    },

    info_grid: { 
        flexDirection: 'row', 
        gap: 8 
    },

    info_chip: {
        flex: 1, 
        borderRadius: 10,
        borderWidth: 1, 
        paddingVertical: 10, 
        paddingHorizontal: 6, 
        alignItems: 'center', 
        gap: 3,
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
        color: DARK 
    },

    info_chip_sublabel: { 
        fontSize: 10, 
        fontFamily: FONT_FAMILY,
        fontWeight: '600' 
    },

    address_box: {
        borderRadius: 10, 
        padding: 12,
        borderLeftWidth: 3,
        borderLeftColor: BLUE, 
        gap: 4,
    },

    address_label: {
        fontSize: 12, 
        fontFamily: FONT_FAMILY,
        fontWeight: '700', 
        color: BLUE,
        textTransform: 'uppercase', 
        letterSpacing: 0.5,
    },

    address_text: { 
        fontSize: 14, 
        fontFamily: FONT_FAMILY,
        lineHeight: 18 
    },

    timestamp_box: { 
        alignItems: 'center' 
    },

    timestamp_text: { 
        fontSize: 12, 
        fontFamily: FONT_FAMILY,
        color: '#aaa' 
    },

    tracking_row: { 
        flexDirection: 'row', 
        gap: 8 
    },

    track_btn: {
        flex: 1, 
        backgroundColor: GREEN, 
        borderRadius: 12,
        paddingVertical: 12, 
        alignItems: 'center',
    },

    track_btn_stop: { 
        backgroundColor: RED 
    },

    track_btn_text: { 
        fontSize: 14, 
        fontFamily: FONT_FAMILY,
        fontWeight: '700', 
        color: WHITE, 
    },

    refresh_btn: {
        backgroundColor: DARK, 
        borderRadius: 12,
        paddingVertical: 12, 
        paddingHorizontal: 16, 
        alignItems: 'center',
    },

    refresh_btn_text: { 
        fontSize: 18 ,
        fontFamily: FONT_FAMILY,
        color: WHITE, 
        fontWeight: '700', 
    },

    tracking_indicator: {
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 8,
        backgroundColor: '#f0faf4', 
        borderRadius: 10, 
        padding: 10,
        borderWidth: 1, 
        borderColor: GREEN,
    },

    tracking_dot: {
        width: 8, 
        height: 8, 
        borderRadius: 4, 
        backgroundColor: GREEN,
    },
    tracking_text: { 
        fontSize: 12, 
        fontFamily: FONT_FAMILY,
        fontWeight: '600', 
        color: GREEN, 
        flex: 1 },

    history_wrap: {
        borderRadius: 12,
        borderWidth: 1, 
        padding: 12, 
        gap: 8,
    },

    history_header: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
    },

    history_title: { 
        fontSize: 14, 
        fontWeight: '700', 
        color: DARK 
    },

    history_clear: { 
        fontSize: 12, 
        color: RED, 
        fontWeight: '600' 
    },

    history_scroll: {  

    },

    history_row: {
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 8,
        paddingVertical: 8, 
        borderBottomWidth: 1, 
        borderBottomColor: '#f0f4f8',
    },

    history_index_wrap: {
        width: 24, 
        height: 24, 
        borderRadius: 12,
        backgroundColor: BLUE, 
        alignItems: 'center', 
        justifyContent: 'center',
    },

    history_index: { 
        fontSize: 12, 
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
        color: WHITE, 
    },

    history_coords: { 
        flex: 1, 
        gap: 2 
    },

    history_lat: { 
        fontSize: 12,
        fontFamily: FONT_FAMILY, 
        fontWeight: '600', 
        color: DARK, 
        fontVariant: ['tabular-nums'] 
    },

    history_time: { 
        fontSize: 12, 
        fontFamily: FONT_FAMILY,
        color: '#aaa' 
    },

    history_accuracy: { 
        fontSize: 12, 
        fontFamily: FONT_FAMILY,
        fontWeight: '700' 
    },

    info_box: {
        backgroundColor: '#eaf4fd', 
        borderRadius: 10, 
        padding: 12,
        borderLeftWidth: 3, 
        borderLeftColor: BLUE,
    },

    info_box_text: { 
        fontSize: 12, 
        fontFamily: FONT_FAMILY,
        color: DARK, 
        lineHeight: 18 
    },

});