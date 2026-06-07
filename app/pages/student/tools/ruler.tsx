import React from "react";
import { PixelRatio, StyleSheet, Text, View } from "react-native";
import { DARK, FONT_FAMILY, LIGHT_BLUE, SCREEN_WIDTH } from "../activities/activityStyles";

export default function Ruler() {
    const PPI = PixelRatio.get() * 160;
    const cmPerInch = 2.54;
    const pxPerCm = PPI / cmPerInch;
    const rulerWidth = SCREEN_WIDTH - 64;
    const totalCm = Math.floor(rulerWidth / pxPerCm);

    const tick = [];
    for (let i = 0; i <= totalCm * 10; i++){
        const isMajor = i % 10 === 0;
        const isMid = i % 5 === 0;
        tick.push({pos: i * (pxPerCm / 10), isMajor, isMid, val: i / 10});
    }

    return (
        <View style={localStyles.container}>
            <Text style={localStyles.note}>
                Hold an object along the ruler to measure.
            </Text>
            
            <View style={localStyles.ruler}>
                <View style={localStyles.ruler_edge}/>
                {tick.map((val,i) => (
                    <View
                        key={i}
                        style={[
                            localStyles.tick,
                            {left: val.pos},
                            val.isMajor && localStyles.tick_major,
                            val.isMid && !val.isMajor && localStyles.tick_mid,
                        ]}>
                    
                        {val.isMajor && (
                            <Text style={localStyles.tick_label}>
                                {val.val}
                            </Text>
                        ) }
                    </View>
                ))}
            </View>
            <Text style={localStyles.cm_label}>
                Centimeter (cm)
            </Text>
            <View style={localStyles.info_row}>
                <View style={localStyles.info_chip}>
                    <Text style={localStyles.info_text}>
                        Screen DPI: {Math.round(PPI)}
                    </Text>
                </View>
                
                <View style={localStyles.info_chip}>
                    <Text style={localStyles.info_text}>
                        Range: 0 - {totalCm} cm
                    </Text>
                </View>
            </View>
            <Text style={localStyles.disclaimer}>
                ⚠️ Accuracy depends on your devices reported screen density.
            </Text>
        </View>
    );
}

const localStyles = StyleSheet.create({
    container: {
        gap: 10,
    },

    note: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        color: '#555555',
        textAlign: 'center',
    },

    ruler: {
        height: 70,
        backgroundColor: '#fffbe6',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0c84a',
        position: 'relative',
        overflow: 'hidden',
    },

    ruler_edge: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: '#e0c84a',
    },


    tick: {
        position: 'absolute',
        top: 3,
        width: 1,
        height: 10,
        backgroundColor: '#999999',
    },  

    tick_mid: {
        height: 16,
        backgroundColor: '#666666',
    },

    tick_major: {
        height: 24,
        backgroundColor: DARK,
        width: 2,
    },

    tick_label: {
        position: 'absolute',
        top: 28,
        fontSize: 14,
        left: -11,
        width: 24,
        fontFamily: FONT_FAMILY,
        color: DARK,
        fontWeight: '600',
        textAlign: 'center',
    },

    cm_label: {
        fontSize: 12,
        color: '#888888',
        textAlign: 'center',
    },

    info_row: {
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
    },

    info_chip: {
        backgroundColor: LIGHT_BLUE,
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },

    info_text: {
        fontSize: 14,
        color: DARK,
        fontWeight: '600',
    },

    disclaimer: {
        fontSize: 12,
        color: '#aaaaaa',
        textAlign: 'center',
    },
})