import { FONT_FAMILY, globalColors } from "@/app/styles";
import { useTheme } from '@/src/context/ThemeContext';
import { ThemeKey } from "@/src/context/ThemeContext.d";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { activityColors } from "../activities/activityStyles";


export default function Calculator() {
    const [display, setDsisplay] = useState("0");
    const [prev, setPrev] = useState<number | null>(null);
    const [operator, setOperator] = useState<string | null>(null);
    const [waiting, setWaiting] = useState(false);
    const [expression, setExpression] = useState("");

    const { theme, changeTheme } = useTheme();
    const themed = activityColors[theme as ThemeKey];
    const globalThemed = globalColors[theme as ThemeKey];

    const handleNumber = (n: string) => {
        if (waiting){
            setDsisplay(n);
            setWaiting(false);
        } else {
            setDsisplay(display === "0" ? n : display + n);
        }
    };

    const handleDecimal = () => {
        if (waiting){
            setDsisplay("0.");
            setWaiting(true);
            return;
        };
        if (!display.includes(".")){
            setDsisplay(display + ".");
        };
    };
    
    const calculate = (a: number, b: number, operator: string): number => {
        switch (operator) {
            case '+':
                return a + b;
            case '-':
                return a - b;
            case '×':
                return a * b;
            case '÷':
                return (b !== 0 ? a / b : 0);
            default:
                 return b;
        }
    }

    const handleOperator = (operator: string) => {
        const current = parseFloat(display);
        if (prev !== null && !waiting){
            const result = calculate(prev, current, operator!);

            setExpression(`${prev} ${operator} ${current} =`);
            setDsisplay(String(parseFloat(result.toFixed(8))));
            setPrev(result);
        } else {
            setPrev(current);
            setExpression(`${current} ${operator}`);
        }
        setOperator(operator);
        setWaiting(true);
    }

    const handleEquals = () => {
        if (prev === null || operator === null){
            return;
        }
        const current = parseFloat(display);
        const result = calculate(prev, current, operator);

        setExpression(`${prev} ${operator} ${current} =`);
        setDsisplay(String(parseFloat(result.toFixed(8))));
        setPrev(null);
        setOperator(null);
        setWaiting(false);
    };

    const handleClear = () => {
        setExpression("");
        setDsisplay("0");
        setPrev(null);
        setOperator(null);
        setWaiting(false);
    };

    const handleBackspace = () => {
        if (display.length <= 1){
            setDsisplay("0");
            return;
        };
        setDsisplay(display.slice(0, -1));
    };

    const handleToggleSign = () => {
        setDsisplay(String(parseFloat(display) * -1));
    };

    const handlePercent = () => {
        setDsisplay(String(parseFloat(display) / 100));
    };

    const button = [
        ['C', '±', '%', '÷'],
        ['7', '8', '9', '×'],
        ['4', '5', '6', '-'],
        ['1', '2', '3', '+'],
        ['⌫', '0', '.', '='],
    ];

    const isOperator = (b: string) => ['÷', '×', '-', '+', '='].includes(b);;

    const isExtra = (b: string) => ['C', '±', '%'].includes(b);

    return (
        <View style={localStyles.container}>
            <View style={[themed.calculator_display_wrap, localStyles.display_wrap]}>
                {expression !== "" && <Text style={localStyles.operator_indicator}>
                    {expression}</Text>}
                <Text
                    style={[themed.calculator_display, localStyles.display]}
                    numberOfLines={1}
                    adjustsFontSizeToFit>

                    {display}
                </Text>
            </View>

            {button.map((row, i) => (
                <View key={i} style={localStyles.row}>
                    {row.map((button) => (
                        <TouchableOpacity
                            key={button}
                            style={[
                                themed.calculator_button, localStyles.button, 
                                isOperator(button) && [themed.calculator_button_operator],
                                isExtra(button) && [localStyles.button_extra],
                                button === '=' && {backgroundColor: '#97b9d6'},
                                button === 'C' && {backgroundColor: '#e05c5c'}
                            ]}
                        onPress={() => {
                            if (button === 'C'){
                                handleClear();
                            } 
                            else if (button === '⌫'){
                                handleBackspace();
                            }
                            else if (button === '±'){
                                handleToggleSign();
                            }
                            else if (button === '%'){
                                handlePercent();
                            }
                            else if (button === '.'){
                                handleDecimal();
                            }
                            else if (button === '='){
                                handleEquals();
                            }
                            else if (isOperator(button)){
                                handleOperator(button);
                            }
                            else {
                                handleNumber(button);
                            }
                        }}
                        activeOpacity={0.7}>

                           <Text style={[
                                localStyles.button_text,
                                (isOperator(button) || isExtra(button)) && themed.calculator_button_text,
                                button === 'C' && {color: '#ffffff'},
                           ]}>
                                {button}
                           </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            ))}
        </View>
    )
}

const localStyles = StyleSheet.create({
    container: {
        gap: 6,
    },

    display_wrap: {
        borderRadius: 12,
        padding: 14,
        marginBottom: 4,
        alignItems: 'flex-end',
        minHeight: 70,
        justifyContent: 'flex-end',
    },

    operator_indicator: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 2,
    },

    display: {
        fontSize: 36,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
    },

    row: {
        flexDirection: 'row',
        gap: 6,
    },

    button: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },


    button_extra: {
        backgroundColor: '#97b9d6aa',
    },

    button_text: {
        fontSize: 18,
        fontFamily: FONT_FAMILY,
        fontWeight: '600',
    },
})