import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';

const BLUE = '#97b9d6';
const DARK = '#1a2e3d';
const WHITE = '#ffffff';
const RED = '#e05c5c';

export default function MapTool() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getLocation();
    }, []);

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

    return (
        <View style={styles.container}>

            {loading && (
                <View style={styles.loading_box}>
                    <ActivityIndicator color={BLUE} size="large" />
                    <Text style={styles.loading_text}>Getting your location...</Text>
                </View>
            )}

            {!loading && errorMsg && (
                <View style={styles.error_box}>
                    <Text style={styles.error_icon}>📍</Text>
                    <Text style={styles.error_text}>{errorMsg}</Text>
                    <TouchableOpacity
                        style={styles.retry_btn}
                        onPress={getLocation}
                        activeOpacity={0.8}>
                        <Text style={styles.retry_btn_text}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            )}

            {!loading && location && (
                <>
                    <View style={styles.coords_card}>
                        <Text style={styles.coords_icon}>📍</Text>
                        <Text style={styles.coords_title}>Current Location</Text>
                        <Text style={styles.coords_value}>
                            {location.coords.latitude.toFixed(6)}
                        </Text>
                        <Text style={styles.coords_label}>Latitude</Text>
                        <View style={styles.divider} />
                        <Text style={styles.coords_value}>
                            {location.coords.longitude.toFixed(6)}
                        </Text>
                        <Text style={styles.coords_label}>Longitude</Text>
                    </View>

                    <View style={styles.info_grid}>
                        <View style={styles.info_chip}>
                            <Text style={styles.info_chip_label}>Accuracy</Text>
                            <Text style={styles.info_chip_value}>
                                ±{Math.round(location.coords.accuracy ?? 0)}m
                            </Text>
                        </View>
                        <View style={styles.info_chip}>
                            <Text style={styles.info_chip_label}>Altitude</Text>
                            <Text style={styles.info_chip_value}>
                                {location.coords.altitude !== null
                                    ? `${Math.round(location.coords.altitude ?? 0)}m`
                                    : '—'}
                            </Text>
                        </View>
                        <View style={styles.info_chip}>
                            <Text style={styles.info_chip_label}>Speed</Text>
                            <Text style={styles.info_chip_value}>
                                {location.coords.speed !== null && location.coords.speed! > 0
                                    ? `${(location.coords.speed!).toFixed(1)} m/s`
                                    : '0 m/s'}
                            </Text>
                        </View>
                    </View>

                    {address && (
                        <View style={styles.address_box}>
                            <Text style={styles.address_label}>🏠 Address</Text>
                            <Text style={styles.address_text}>{address}</Text>
                        </View>
                    )}

                    <View style={styles.timestamp_box}>
                        <Text style={styles.timestamp_text}>
                            🕐 Last updated: {new Date(location.timestamp).toLocaleTimeString()}
                        </Text>
                    </View>
                </>
            )}

            {!loading && (
                <TouchableOpacity
                    style={styles.refresh_btn}
                    onPress={getLocation}
                    activeOpacity={0.8}>
                    <Text style={styles.refresh_btn_text}>↺ Refresh Location</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        gap: 10 
    },

    loading_box: {
        height: 120, 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: 10, 
        backgroundColor: '#f4f8fc', 
        borderRadius: 14,
    },

    loading_text: { 
        fontSize: 14, 
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
        fontSize: 13, 
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
        color: WHITE, 
        fontWeight: '700',
         fontSize: 13 
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
        fontSize: 12, 
        color: 'rgba(255,255,255,0.5)', 
        fontWeight: '600',
        textTransform: 'uppercase', 
        letterSpacing: 0.5, 
        marginBottom: 8,
    },

    coords_value: {
        fontSize: 28, 
        fontWeight: '800', 
        color: WHITE, 
        fontVariant: ['tabular-nums'],
    },

    coords_label: {
        fontSize: 12, 
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
        backgroundColor: WHITE, 
        borderRadius: 10,
        borderWidth: 1, 
        borderColor: '#dde8f0',
        paddingVertical: 10, 
        paddingHorizontal: 6, 
        alignItems: 'center', 
        gap: 3,
    },

    info_chip_label: {
        fontSize: 10, 
        color: '#888', 
        fontWeight: '600', 
        textTransform: 'uppercase',
    },

    info_chip_value: { 
        fontSize: 14, 
        fontWeight: '700', 
        color: DARK 
    },
    
    address_box: {
        backgroundColor: '#eaf4fd', 
        borderRadius: 10, 
        padding: 12,
        borderLeftWidth: 3, 
        borderLeftColor: BLUE, 
        gap: 4,
    },

    address_label: {
        fontSize: 12, 
        fontWeight: '700', 
        color: BLUE,
        textTransform: 'uppercase', 
        letterSpacing: 0.5,
    },

    address_text: { 
        fontSize: 14, 
        color: DARK, 
        lineHeight: 18 },

    timestamp_box: { 
        alignItems: 'center' 
    },

    timestamp_text: { 
        fontSize: 12, 
        color: '#aaa' 
    },

    refresh_btn: {
        backgroundColor: DARK, 
        borderRadius: 12, 
        paddingVertical: 12, 
        alignItems: 'center',
    },

    refresh_btn_text: { 
        color: WHITE, 
        fontWeight: '700', 
        fontSize: 14 
    },
});