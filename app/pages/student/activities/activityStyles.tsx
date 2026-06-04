import { StyleSheet } from "react-native";

const BLUE = '#97b9d6';
const LIGHT_BLUE = '#afdaff';
const WHITE = '#ffffff';

export const activityStyles = StyleSheet.create({
    page: {
        backgroundColor: BLUE,
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
        borderColor: WHITE,
        backgroundColor: WHITE,
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

    tab_row: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: WHITE,
        borderBottomWidth: 1,
        borderBottomColor: WHITE,
    },

    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },

    tab_active: {
        borderBottomColor: LIGHT_BLUE,
    },

    tab_icon: {
        fontSize: 16,
        marginBottom: 2,
    },

    tab_label: {
        fontSize: 16,
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
        fontWeight: '500',
    },

    tab_label_active: {
        color: BLUE,
        fontWeight: '700',
    },

    scroll: {
        flex: 1,
        width: '100%',
        backgroundColor: WHITE,
    },

    scroll_content: {
        padding: 16,
    },

    section_heading: {
        fontSize: 16,
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
        fontWeight: '700',
        marginTop: 20,
        marginBottom: 10,
        textTransform: 'uppercase',
    },

    body: {
        fontSize: 16,
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
        lineHeight: 22,
        width: '100%',
    },

    chip_row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },

    chip: {
        backgroundColor: BLUE,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: LIGHT_BLUE,
    },

    chip_text: {
        fontSize: 14,
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
        fontWeight: '500',
    },

    curriculum_row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 10,
    },

    curriculum_icon: {
        backgroundColor: BLUE,
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },

    curriculum_code: {
        fontSize: 14,
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
        flex: 1,
    },

    curriculum_description:{
        fontSize: 14,
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
        flex: 1,
    },

    list_row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 8,
        gap: 8,
    },

    list_dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: BLUE,
        marginTop: 6,
        flexShrink: 0,
    },

    list_text: {
        fontSize: 16,
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
        marginBottom: 14,
        gap: 12,
        lineHeight: 22,
    },

    progress_text: {
        fontSize: 14,
        color: BLUE,
        fontWeight: '600',
        marginBottom: 12,
        marginTop: 4,
    },

    equipment_row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: WHITE,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: LIGHT_BLUE,
        padding: 10,
        marginBottom: 10,
        gap: 12,
    },

    equipment_row_checked: {
        backgroundColor: LIGHT_BLUE,
        borderColor: BLUE,
    },

    equipment_image: {
        width: 52,
        height: 52,
        borderRadius: 8,
        backgroundColor: BLUE
    },

    equipment_image_checked: {
        opacity: 0.5
    },

    equipment_name: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
    },

    equipment_name_checked: {
        textDecorationColor: 'line-through',
        color: '#aaaaaa',
    },

    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: BLUE,
        alignItems: 'center',
        justifyContent: 'center',
    },

    checkbox_checked: {
      backgroundColor: BLUE, 
    },

    checkbox_tick: {
        color: WHITE,
        fontSize: 14,
        fontWeight: '700',
    },

    step_row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 14,
        gap: 12,
    },

    step_number_wrap: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: BLUE,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },

    step_number: {
        fontSize: 16,
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
        color: WHITE,
        fontWeight: '700',
    },

    step_text: {
        fontSize: 16,
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
        lineHeight: 22,
        flex: 1,
        paddingTop: 3,
        alignSelf: 'center',
    },

    info_box: {
        backgroundColor: WHITE,
        borderRadius: 12,
        padding: 14,
        marginTop: 16,
        borderLeftWidth: 3,
        borderLeftColor: BLUE,
    },

    info_box_title: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 10,
    },

    table: {
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: LIGHT_BLUE
    },

    table_header_row: {
        flexDirection: 'row',
        backgroundColor: BLUE,
    },

    table_row: {
        flexDirection: 'row',
        backgroundColor: WHITE
    },

    table_row_alt: {
        backgroundColor: LIGHT_BLUE
    },

    table_header: {
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
        color: WHITE,
        marginLeft: 3,
        fontWeight: '700',
    },

    table_cell: {
        fontSize: 16,
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },

    focus_grid: {
        flexDirection: 'row',
        gap: 12,
    },

    focus_card: {
        flex: 1,
        backgroundColor: WHITE,
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: LIGHT_BLUE,
    },

    focus_level: {
        fontSize: 16,
        fontFamily: 'Trebuchet MS, Roboto, sans-serif',
        fontWeight: '700',
        marginBottom: 8,
    },

    footer: {
        width: '100%',
        backgroundColor: WHITE,
        borderColor: 'transparent',
        paddingBottom: 12,
        paddingHorizontal: 16,
    },

    start_button: {
        backgroundColor: BLUE,
        paddingVertical: 16,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },

    start_button_text: {
        fontSize: 16,
        fontWeight: '800',
        alignSelf: 'center',
        letterSpacing: 0.3,
        color: WHITE,
    }

});