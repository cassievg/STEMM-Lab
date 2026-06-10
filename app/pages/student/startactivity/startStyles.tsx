import { StyleSheet } from "react-native";

const WHITE = '#ffffff';
const FONT_FAMILY = 'Trebuchet MS, Roboto, sans-serif';

export const localStyles = StyleSheet.create({
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

    back_button: {
        borderWidth: 1,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginRight: 16,
        borderRadius: 4,
        zIndex: 1,
    },

    header_title_container: {
        flex: 1,
    },

    header_title: {
        fontSize: 16,
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
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

    header_progress: {
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },

    header_progress_text: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
    },

    tab_row: {
        flexDirection: 'row',
    },

    tab_complete: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        marginBottom: 2,
    },
    
    attempt_description_container: {
        paddingHorizontal: 12,
        paddingVertical: 6,
    },

    attempt_description: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontStyle: 'italic',
    },

    scroll: {
        flex: 1,
    },

    scroll_content: {
        paddingTop: 0,
        padding: 16,
    },

    section_heading: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginTop: 20,
        marginBottom: 10,
    },

    video_preview_container: {
        borderRadius: 12,
        overflow: 'hidden',
        gap: 8,
    },

    video_preview: {
        width: '100%',
        height: 200,
        borderRadius: 12,
    },

    video_retake_button: {
        borderRadius: 10,
        borderWidth: 1,
        paddingVertical: 10,
        alignItems: 'center',
        marginTop: 8,
    },

    video_retake_text: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontWeight: '600',
    },

    video_subtext: {
        fontSize: 12,
        marginTop: 2,
    },

    video_button: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderRadius: 12,
        borderWidth: 1.5,
        borderStyle: 'dashed',
        padding: 14,
    },

    video_icon: {
        fontSize: 20,
    },

    video_text: {
        fontSize: 14,
        fontWeight: '600',
    },

    timer_container: {
        borderRadius: 14,
        padding: 16,
        alignItems: 'center',
        gap: 12,
    },

    timer_display: {
        fontSize: 48,
        fontWeight: '800',
        color: WHITE,
        letterSpacing: 2,
        fontVariant: ['tabular-nums'],
    },

    timer_button: {
        flexDirection: 'row',
        gap: 12,
    },

    timer_button_start: {
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },
    
    timer_button_stop: {
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },

    timer_button_reset: {
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },

    timer_button_use: {
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 8,
    },

    timer_button_text: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
    },

    input_container: {
        marginBottom: 16,
    },

    input_label: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontWeight: '600',
        marginBottom: 6,
    },

    input_row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    input: {
        flex: 1,
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        fontFamily: FONT_FAMILY,
    },

    input_unit: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        fontWeight: '600',
        width: 50,
    },

    input_multiline: {
        height: 80,
        textAlignVertical: 'top',
    },

    toggle_row: {
        flexDirection: 'row',
        gap: 10,
    },

    toggle_button: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1.5,
        alignItems: 'center',
    },

    toggle_text: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
    },

    toggle_text_active: {
        fontWeight: '700',
    },

    footer: {
        padding: 16,
        paddingTop: 4,
        borderTopWidth: 1,
        borderColor: 'transparent',
    },

    next_button: {
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
    },

    next_button_text: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        fontWeight: '800',
        color: WHITE,
        letterSpacing: 0.5,
    },

    submit_button: {
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
    },

    submit_button_text: {
        fontSize: 18,
        fontFamily: FONT_FAMILY,
        fontWeight: '800',
        color: WHITE,
        letterSpacing: 0.5,
    },

    card: {
        borderRadius: 12,
        borderWidth: 0.5,
        padding: 16,
        marginBottom: 16,
    },

    cardLabel: {
        fontSize: 12,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 12,
    },

    timeDisplay: {
        fontSize: 32,
        fontFamily: FONT_FAMILY,
        fontWeight: '800',
        textAlign: 'center',
        marginBottom: 12,
    },

    button: {
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
    },

    buttonText: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
    },

    hint: {
        fontSize: 13,
        fontFamily: FONT_FAMILY,
        textAlign: 'center',
        marginTop: 8,
    },
});

export const localColors = {
    light: StyleSheet.create({
        start_button: {
            backgroundColor: '#4caf7d',
        },

        stop_button: {
            backgroundColor: '#e05c5c',
        },

        reset_button: {
            backgroundColor: 'rgb(156, 156, 156)',
        },

        timer_container: {
            backgroundColor: '#1a2e3d',
        },

        header_container: {
            backgroundColor: '#97b9d6'
        }
    }),
    dark: StyleSheet.create({
        start_button: {
            backgroundColor: '#4caf7d',
        },

        stop_button: {
            backgroundColor: '#e05c5c',
        },

        reset_button: {
            backgroundColor: '#3b3b3b',
        },

        timer_container: {
            backgroundColor: '#374f61',
        },

        header_container: {
            backgroundColor: '#435565'
        }
    }),
};