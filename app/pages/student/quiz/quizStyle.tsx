import { StyleSheet } from "react-native";

const GREEN = '#4caf7d';
const RED = '#e05c5c';
const FONT_FAMILY = 'Trebuchet MS, Roboto, sans-serif';

export const quizColors = {
    light: StyleSheet.create({
        question_card: {
            backgroundColor: '#ffffff',
            borderColor: '#afdaff',
        },

        option_dot: {
            borderColor: '#1a2e3d',
        },

        calculation_input: {
            color: '#1a2e3d'
        },

        retry_button: {
            backgroundColor: '#97b9d6'
        },

        complete_button: {
            backgroundColor: '#afdaff'
        },

        question_number: {
            backgroundColor: '#97b9d6'
        },

        formula_chip: {
            backgroundColor: '#afdaff',
            borderLeftColor: '#97b9d6'
        },

        option_selected: {
            borderColor: '#97b9d6',
            backgroundColor: '#97b9d6'
        },

        option_dot_selected: {
            backgroundColor: '#97b9d6',
            borderColor: '#97b9d6',
        },

        unit_icon: {
            backgroundColor: '#97b9d6'
        },

        option: {
            borderColor: '#afdaff',
        },

        submit_button: {
            backgroundColor: '#afdaff'
        },

        submit_button_disabled: {
            backgroundColor: '#b0c8d8',
        },
    }),
    dark: StyleSheet.create({
        question_card: {
            backgroundColor: '#434343',
            borderColor: '#656565',
        },

        option_dot: {
            borderColor: '#d8d8d8',
        },

        calculation_input: {
            color: '#d8d8d8'
        },

        retry_button: {
            backgroundColor: '#435565'
        },

        complete_button: {
            backgroundColor: '#afdaff'
        },

        question_number: {
            backgroundColor: '#323232'
        },

        formula_chip: {
            backgroundColor: '#656565',
            borderLeftColor: '#434343'
        },

        option: {
            borderColor: '#435565',
        },

        option_selected: {
            borderColor: '#434343',
            backgroundColor: '#435565'
        },

        option_dot_selected: {
            backgroundColor: '#434343',
            borderColor: '#434343',
        },

        unit_icon: {
            backgroundColor: '#434343'
        },

        submit_button: {
            backgroundColor: '#435565'
        },

        submit_button_disabled: {
            backgroundColor: '#365067',
        },
    }),
};

export const quizStyle = StyleSheet.create({
    page: {
        flex: 1,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },

    header_title_container: {
        flex: 1,
    },

    header_title: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        fontWeight: '600',
        letterSpacing: 0.5,
        marginBottom: 4,
        textTransform: 'uppercase',
    },

    header_subtitle: {
        fontSize: 22,
        fontWeight: '800',
        lineHeight: 28,
    },

    scroll: {
        flex: 1,
    },

    scroll_content: {
        padding: 16,
    },

    score_card: {
      borderRadius: 16,
      borderWidth: 2,
      padding: 20,
      alignItems: 'center',
      marginBottom: 20,
      gap: 8,  
    },

    score_number: {
        fontSize: 48,
        fontWeight: '800'
    },

    score_label: {
        fontSize: 16,
        fontWeight: '600',
    },

    button: {
        flexDirection: 'row',
        gap: 16,
    },

    retry_button: {
        marginTop: 8,
        borderRadius: 10,
        paddingHorizontal: 24,
        paddingVertical: 10,
    },

    retry_text: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
    },

    question_card: {
        borderRadius: 14,
        borderWidth: 1,
        padding: 14,
        marginBottom: 14,
        gap: 10,
    },

    question_card_correct: {
        borderColor: GREEN,
    },

    question_card_wrong: {
        borderColor: RED,
    },

    question_header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    question_number:{
        width: 28,
        height: 28,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },

    question_number_text: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
    },

    question_type_icon: {
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },

    question_type_text: {
        fontSize: 12,
        fontFamily: FONT_FAMILY,
        color: '#969696',
        fontWeight: '600',
    },

    question_text: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        lineHeight: 22,
    },

    formula_chip: {
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderLeftWidth: 3,
    },
    
    formula_text: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontStyle: 'italic',
    },

    hint_button: {
        alignSelf: 'flex-start',
    },

    hint_button_text: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontWeight: '600',
    },

    hint_container: {
        backgroundColor: '#fffbe6',
        borderRadius: 8,
        padding: 10,
        borderLeftWidth: 3,
        borderLeftColor: '#f0b429',
    },

    hint_text: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        color: '#7a5c00',
    },

    option_list: {
        gap: 8,
    },

    option: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: 10,
        borderRadius: 10,
        borderWidth: 1.5,
    },

    option_correct: {
        borderColor: GREEN,
        backgroundColor: '#f0faf4',
    },

    option_wrong: {
        borderColor: RED,
        backgroundColor: '#fff5f5'
    },

    option_dot: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        flexShrink: 0,
    },

    option_text: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        flex: 1,
        lineHeight: 20,
    },

    calculation_row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    calculation_input: {
        flex: 1,
        backgroundColor: '#f4f8fc',
        borderRadius: 10,
        borderWidth: 1.5,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        fontWeight: '600',
    },

    calculation_input_correct: {
        borderColor: GREEN,
        backgroundColor: '#f0faf4',
    },

    calculation_input_wrong: {
        borderColor: RED,
        backgroundColor: '#fff5f5',
    },

    unit_icon: {
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },

    unit_text: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
    },

    correct_answer_text: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        color: GREEN,
        fontWeight: '600',
    },

    submit_button: {
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
    },

    submit_text: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        fontWeight: '800',
        letterSpacing: 0.5,
    },

    progressContainer: {
        width: 64,
        height: 64,
        borderRadius: 26,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },

    progressText: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
        textAlign: 'center'
    },
});