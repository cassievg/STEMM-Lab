import { FONT_FAMILY, SCREEN_HEIGHT, SCREEN_WIDTH } from "@/app/styles";
import { useTheme } from '@/src/context/ThemeContext';
import { ThemeKey } from '@/src/context/ThemeContext.d';
import React, { useRef, useState } from "react";
import { Animated, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { activityColors } from '../activities/activityStyles';
import BatteryTool from "./battery";
import Calculator from "./calculator";
import Camera from "./camera";
import MapTool from "./map";
import Ruler from "./ruler";
import Sensors from "./sensors";
import SoundMeter from "./soundmeter";
import Stopwatch from "./stopwatch";

type ToolKey = 'calculator' | 'ruler' | 'sensors' | 
                'stopwatch' | 'camera' | 'soundmeter' | 
                'battery'  | 'map'  |    null;

const TOOLS = [
    {key: 'calculator' as ToolKey, label: 'Calculator', icon: '🔢'},
    {key: 'ruler' as ToolKey, label: 'Ruler', icon: '📏'},
    {key: 'sensors' as ToolKey, label: 'Sensors', icon: '📡'},
    {key: 'soundmeter' as ToolKey, label: 'Sound Meter', icon: '🎙'},
    {key: 'camera' as ToolKey, label: 'Camera', icon: '🎥'},
    {key: 'stopwatch' as ToolKey, label: 'Stopwatch', icon: '⏱'},
    { key: 'battery' as ToolKey, icon: '🔋', label: 'Battery' },
    { key: 'map' as ToolKey, icon: '🗺️', label: 'Map' },
]

export default function ToolsPanel() {
    const [open, setOpen] = useState(false);
    const [activeTool, setActiveTool] = useState<ToolKey>(null);
    const scaleAnimation = useRef(new Animated.Value(0)).current;

    const openPanel = () => {
        setOpen(true);
        Animated.spring(scaleAnimation, {
            toValue: 1,
            useNativeDriver: true,
            tension: 80,
            friction: 8,
        }).start();
    };

    const closePanel = () => {
        Animated.timing(scaleAnimation, {
            toValue: 0,
            useNativeDriver: true,
            duration: 180,
        }).start(() => {
            setOpen(false);
            setActiveTool(null);
        });
    };

    const renderToolContent = () => {
        switch(activeTool){
            case 'calculator':
                return <Calculator />
            case 'ruler':
                return <Ruler />
            case 'sensors':
                return <Sensors />
            case 'soundmeter':
                return <SoundMeter />
            case 'camera':
                return <Camera />
            case 'stopwatch':
                return <Stopwatch />
            case 'battery':
                return <BatteryTool />
            case 'map':
                return <MapTool />
            default:
                return null;
        }
    };

    const activeToolData = TOOLS.find((t) => t.key === activeTool)

    const { theme } = useTheme();

    const themed = activityColors[theme as ThemeKey];

    return (
        <>
            <TouchableOpacity
                style={[themed.fab , localStyles.fab]}
                onPress={openPanel}
                activeOpacity={0.85}>

                <Text style={localStyles.fab_icon}>
                    🔧
                </Text>
            </TouchableOpacity>

            <Modal
                visible={open}
                transparent
                animationType="none"
                onRequestClose={closePanel}>

                <TouchableWithoutFeedback onPress={closePanel}>
                    <View style={localStyles.backdrop}/>
                </TouchableWithoutFeedback>

                <Animated.View
                    style={[
                        themed.panel ,localStyles.panel,
                        {
                            transform: [
                                {scale: scaleAnimation},
                                {

                                    translateY: scaleAnimation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [40, 0],
                                    }),
                                },
                            ],
                            opacity: scaleAnimation,
                        },
                    ]}>

                    <View style={localStyles.panel_header}>
                        {activeTool ? (
                            <TouchableOpacity
                                style={localStyles.back_button}
                                onPress={() => setActiveTool(null)}>

                                <Text style={[themed.back_button_text, localStyles.back_button_text]}>
                                    {"< Back"}
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <Text style={[themed.panel_title, localStyles.panel_title]}>
                                🔧 Tools
                            </Text>
                        )}
                        <TouchableOpacity 
                            style={[themed.close_button, localStyles.close_button]}
                            onPress={closePanel}>

                            <Text style={[themed.close_button_text, localStyles.close_button_text]}>
                                ✕
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {!activeTool && (
                        <View style={localStyles.tool_grid}>
                            {TOOLS.map((tool) => (
                                <TouchableOpacity
                                    key={tool.key}
                                    style={[themed.tool_card, localStyles.tool_card]}
                                    onPress={() => setActiveTool(tool.key)}
                                    activeOpacity={0.75}>

                                    <Text style={localStyles.tool_icon}>
                                        {tool.icon}
                                    </Text>
                                    <Text style={[themed.tool_label, localStyles.tool_label]}>
                                        {tool.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {activeTool && (
                        <>
                            <View style={localStyles.tool_header}>
                                <Text style={localStyles.tool_header_icon}>
                                    {activeToolData?.icon}
                                </Text>
                                <Text style={[themed.tool_header_label, localStyles.tool_header_label]}>
                                    {activeToolData?.label}
                                </Text>
                            </View>
                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps="handled">

                                {renderToolContent()}
                            </ScrollView>
                        </>
                    )}
                </Animated.View>
            </Modal>
        </>
    );
}

const localStyles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 140,
        right: 20,
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        zIndex: 100,
    },
    
    fab_icon: {
        fontSize: 24,
    },

    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rbga(0,0,0,0.4)'
    },

    panel: {
        position: 'absolute',
        bottom: 80,
        right: 16,
        width: SCREEN_WIDTH - 32,
        maxHeight: SCREEN_HEIGHT * 0.65,
        borderRadius: 20,
        padding: 16,
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 8},
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 12,
    },

    panel_header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
    },

    panel_title: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        fontWeight: '800',
    },

    back_button: {
        paddingVertical: 4,
        paddingHorizontal: 2,
    },

    back_button_text: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
    },

    close_button: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },

    close_button_text: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
    },

    tool_grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },

    tool_card: {
        width: (SCREEN_WIDTH - 32 - 32 - 12) / 2,
        borderRadius: 14,
        paddingVertical: 18,
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: '#c8e0f0',
    },

    tool_icon: {
        fontSize: 32,
    },

    tool_label: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
    },

    tool_header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eeeeee',
    },

    tool_header_icon: {
        fontSize: 20,
    },

    tool_header_label: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        fontWeight: '800',
    },
})