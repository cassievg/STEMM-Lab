import { StyleSheet } from "react-native";

const FONT_FAMILY = 'Trebuchet MS, Roboto, sans-serif';

const BLUE = '#97b9d6';
const LIGHT_BLUE = '#afdaff';
const DARK = '#1a2e3d';
const WHITE = '#ffffff';

const ALT_BLUE = '#435565';
const ALT_LIGHT_BLUE = '#474747';
const ALT_DARK = '#2b2b2b';
const ALT_WHITE = '#d8d8d8';

export const activityColors = {
    light : StyleSheet.create({
        page: {
            backgroundColor: BLUE,
        },

        modal_input: {
            backgroundColor: WHITE,
            borderColor: "#ccc"
        }, 

        modal_close_button: {
            backgroundColor: '#007AFF',
        },

        start_button_text: {
            color: WHITE
        },

        table_row: {
            backgroundColor: WHITE
        },

        scroll: {
            backgroundColor: WHITE
        },

        chip: {
            borderColor:LIGHT_BLUE,
            backgroundColor: BLUE,
        },

        curriculum_icon: {
            backgroundColor: BLUE,
        },

        list_dot: {
            backgroundColor: BLUE,
        },

        progress_text: {
            color: BLUE,
        },

        modal_code_input: {
            backgroundColor: WHITE
        }, 

        equipment_row: {
            backgroundColor: WHITE,
            borderColor:LIGHT_BLUE,
        },
        
        modal_button: {
            backgroundColor: LIGHT_BLUE,
        },

        equipment_row_checked: {
            backgroundColor:LIGHT_BLUE,
            borderColor: BLUE,
        },

        equipment_image: {
            backgroundColor: BLUE
        },

        equipment_name_checked: {
            color: '#aaaaaa',
        },

        checkbox: {
            borderColor: BLUE,
        },

        checkbox_checked: {
            backgroundColor: BLUE, 
        },

        checkbox_tick: {
            color: WHITE,
        },

        step_number_wrap: {
            backgroundColor: BLUE,
        },

        table_header: {
            color: WHITE,
        },

        step_number: {
            color: WHITE,
        },

        start_button: {
            backgroundColor: BLUE,
        },

        info_box: {
            backgroundColor: WHITE,
            borderLeftColor: BLUE,
        },

        table: {
            borderColor:LIGHT_BLUE
        },

        modal_leave_button: {
            backgroundColor: '#FF3B30',
        },

        table_header_row: {
            backgroundColor: BLUE,
        },

        focus_card: {
            backgroundColor: WHITE,
            borderColor:LIGHT_BLUE,
        },

        table_row_alt: {
            backgroundColor:LIGHT_BLUE
        },

        modal_code_box: {
            backgroundColor: '#f0f0f0',
        },

        button: {
            backgroundColor:LIGHT_BLUE,
            borderColor: BLUE,
        },

        modal_secondary_text: {
            color: '#333',
        },

        modal: {
            backgroundColor: WHITE
        },

        fab: {
            backgroundColor: LIGHT_BLUE
        },

        panel: {
            backgroundColor: WHITE
        },

        panel_title: {
            color: ALT_DARK
        },

        back_button_text: {
            color: ALT_DARK,
        },

        close_button: {
            backgroundColor: '#eaf4fd',
        },

        close_button_text: {
            color: '#666666',
        },

        tool_card: {
            backgroundColor: '#eaf4fd'
        },

        tool_label: {
            color: '#0f2a3f'
        },

        tool_header_label: {
            color: '#0f2a3f',
        },

        calculator_display_wrap: {
            backgroundColor: BLUE
        },

        calculation_button_equal: {
            backgroundColor: BLUE
        },

        calculator_button: {
            backgroundColor: '#f0f4f8',
        },

        calculator_button_operator: {
            backgroundColor: LIGHT_BLUE,
        },

        calculator_display: {
            color: WHITE,
        },

        calculator_button_text: {
            color: ALT_BLUE,
        },

        ruler_info_chip: {
            backgroundColor: LIGHT_BLUE,
        },

        ruler_tick_major:{
            backgroundColor: DARK,
        },
        
        ruler_note: {
            color: '#555555',
        },

        ruler_cm_label: {
            color: '#888888',
        },

        ruler_info_text: {
            color: DARK,
        },

        sensor_toggle: {
            backgroundColor: BLUE,
        },

        sensor_toggle_text: {
            color: LIGHT_BLUE
        },

        sensor_axis_label: {
            color: BLUE
        },

        sensor_gforce_container:{
            backgroundColor: BLUE,
        },

        sensor_text: {
            color: DARK,
        },

        camera_button: {
            backgroundColor: BLUE,
            borderColor: LIGHT_BLUE
        },

        camera_button_text: {
            color: WHITE
        },

        sound_button: {
            backgroundColor: BLUE,
        },

        sound_button_text: {
            color: WHITE
        },

        sound_graph_wrap: {
            backgroundColor: WHITE,
        },

        sound_button_reset: {
            backgroundColor: '#f0f4f8',
        },

        sound_button_reset_text: {
            color: DARK
        },

        sound_meter_box: {
            backgroundColor: DARK
        },

        sound_graph_title: {
            color: DARK
        },

        sound_info_text: {
            color: DARK
        },
        
        sound_info_box: {
            borderLeftColor: BLUE,
            backgroundColor: '#eaf4fd',
        },

        table_important_text: {
            color: '#888888'
        },
        
}),
    dark : StyleSheet.create({
        page: {
            backgroundColor: ALT_BLUE,
        },

        modal_secondary_text: {
            color: '#a6a6a6',
        },

        modal_code_box: {
            backgroundColor: ALT_LIGHT_BLUE,
        },

        table_row: {
            backgroundColor: ALT_DARK
        },

        table_row_alt: {
            backgroundColor:ALT_LIGHT_BLUE
        },

        scroll: {
            backgroundColor: ALT_LIGHT_BLUE,
        },

        chip: {
            borderColor: ALT_LIGHT_BLUE,
            backgroundColor: ALT_BLUE,
        },

        modal_button: {
            backgroundColor: ALT_BLUE,
        },

        start_button: {
            backgroundColor: ALT_DARK,
        },

        curriculum_icon: {
            backgroundColor: ALT_BLUE,
        },

        list_dot: {
            backgroundColor: ALT_BLUE,
        },

        progress_text: {
            color: ALT_BLUE,
        },

        modal_input: {
            backgroundColor: ALT_WHITE,
            borderColor: "#435565"
        }, 

        equipment_row: {
            backgroundColor: '#333333',
            borderColor:ALT_DARK,
        },

        equipment_row_checked: {
            backgroundColor:ALT_LIGHT_BLUE,
            borderColor: ALT_BLUE,
        },

        equipment_image: {
            backgroundColor: ALT_BLUE
        },

        equipment_name_checked: {
            color: ALT_WHITE, 
        },

        start_button_text: {
            color: ALT_WHITE
        },

        checkbox: {
            borderColor: ALT_BLUE,
        },
        
        checkbox_checked: {
            backgroundColor: ALT_BLUE, 
        },

        focus_card: {
            backgroundColor: ALT_BLUE,
            borderColor:ALT_LIGHT_BLUE,
        },

        checkbox_tick: {
            color: ALT_WHITE,
        },

        step_number_wrap: {
            backgroundColor: ALT_BLUE,
        },

        step_number: {
            color: ALT_WHITE,
        },

        info_box: {
            backgroundColor: '#333333',
            borderLeftColor: ALT_BLUE,
        },

        table: {
            borderColor:ALT_DARK
        },

        table_header_row: {
            backgroundColor: ALT_DARK,
        },

        button: {
            backgroundColor:ALT_LIGHT_BLUE,
            borderColor: ALT_DARK,
        },

        modal: {
            backgroundColor: ALT_LIGHT_BLUE
        },

        fab: {
            backgroundColor: ALT_BLUE
        },

        panel: {
            backgroundColor: ALT_DARK
        },

        panel_title: {
            color: ALT_WHITE,
        },

        back_button_text: {
            color: ALT_WHITE,
        },

        close_button: {
            backgroundColor: ALT_BLUE,
        },

        close_button_text: {
            color: ALT_WHITE,
        },

        tool_card: {
            backgroundColor: ALT_BLUE
        },

        tool_label: {
            color: ALT_WHITE
        },

        tool_header_label: {
            color: ALT_WHITE,
        },

        calculator_button: {
            backgroundColor: ALT_BLUE,
        },

        calculation_button_equal: {
            backgroundColor: ALT_BLUE
        },

        calculator_display_wrap: {
            backgroundColor: ALT_BLUE
        },

        calculator_button_operator: {
            backgroundColor: ALT_WHITE,
        },

        calculator_display: {
            color: ALT_WHITE,
        },

        calculator_button_text: {
            color: ALT_BLUE,
        },

        ruler_info_chip: {
            backgroundColor: ALT_BLUE,
        },

        ruler_tick_major:{
            backgroundColor: ALT_WHITE,
        },

        ruler_note: {
            color: ALT_WHITE,
        },

        ruler_cm_label: {
            color: ALT_WHITE,
        },

        ruler_info_text: {
            color: ALT_WHITE,
        },

        sensor_toggle: {
            backgroundColor: ALT_BLUE,
        },

        sensor_toggle_text: {
            color: ALT_WHITE
        },

        sensor_axis_label: {
            color: ALT_BLUE
        },

        sensor_gforce_container:{
            backgroundColor: ALT_BLUE,
        },

        sensor_text: {
            color: ALT_WHITE,
        },

        camera_button: {
            backgroundColor: ALT_BLUE,
            color: ALT_WHITE,
        },

        camera_button_text: {
            color: ALT_WHITE
        },

        sound_button: {
            backgroundColor: ALT_LIGHT_BLUE,
        },

        sound_button_text: {
            color: ALT_WHITE
        },

        sound_graph_wrap: {
            backgroundColor: '#333333',
        },

        sound_button_reset_text: {
            color: ALT_WHITE
        },

        sound_button_reset: {
            backgroundColor: ALT_LIGHT_BLUE,
        },

        sound_meter_box: {
            backgroundColor: ALT_BLUE
        },
                
        sound_graph_title: {
            color: ALT_WHITE
        },

        sound_info_text: {
            color: ALT_WHITE
        },

        sound_info_box: {
            borderLeftColor: ALT_WHITE,
            backgroundColor: '#333333',
        },

        table_important_text: {
            color: '#aeaeae'
        },
    })
}

export const activityStyles = StyleSheet.create({
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
        width: '100%',
        marginBottom: 30,
    },

    scroll_content: {
        padding: 16,
    },

    section_heading: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
        marginTop: 20,
        marginBottom: 10,
        textTransform: 'uppercase',
    },

    body: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        lineHeight: 22,
        width: '100%',
    },

    chip_row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },

    chip: {
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderWidth: 1,
    },

    chip_text: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontWeight: '500',
    },

    curriculum_row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 10,
    },

    curriculum_icon: {
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },

    curriculum_code: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        flex: 1,
    },

    curriculum_description:{
        fontSize: 14,
        fontFamily: FONT_FAMILY,
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
        marginTop: 6,
        flexShrink: 0,
    },

    list_text: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        marginBottom: 14,
        gap: 12,
        lineHeight: 22,
    },

    progress_text: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 12,
        marginTop: 4,
    },

    equipment_row: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
        gap: 12,
    },

    equipment_image: {
        width: 52,
        height: 52,
        borderRadius: 8,
    },

    equipment_image_checked: {
        opacity: 0.5
    },

    equipment_name: {
        flex: 1,
        fontSize: 14,
        fontFamily: FONT_FAMILY,
    },

    equipment_name_checked: {
        textDecorationColor: 'line-through',
    },

    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 8,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },

    checkbox_tick: {
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
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },

    step_number: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
    },

    step_text: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        lineHeight: 22,
        flex: 1,
        paddingTop: 3,
        alignSelf: 'center',
    },

    info_box: {
        borderRadius: 12,
        padding: 14,
        marginTop: 16,
        borderLeftWidth: 3,
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
    },

    table_header_row: {
        flexDirection: 'row',
    },

    table_row: {
        flexDirection: 'row',
    },

    table_header: {
        fontFamily: FONT_FAMILY,
        marginLeft: 3,
        fontWeight: '700',
    },

    table_cell: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        paddingVertical: 10,
        paddingHorizontal: 10,
    },

    focus_grid: {
        flexDirection: 'row',
        gap: 12,
    },

    focus_card: {
        flex: 1,
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
    },

    focus_level: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
        marginBottom: 8,
    },

    footer: {
        width: '100%',
        borderColor: 'transparent',
        paddingBottom: 12,
        paddingHorizontal: 16,
    },

    start_button: {
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
    },

    button: {
        borderWidth: 1,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginRight: 16,
        borderRadius: 4,
        zIndex: 1,
    },

    tab_bar: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
    },
});

export const modalStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    container: {
        width: '80%',
        borderRadius: 10,
        padding: 20,
        gap: 8,
    },

    title: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 8,
    },

    empty: {
        color: 'gray',
        textAlign: 'center',
        paddingVertical: 8,
    },

    memberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        gap: 8,
    },

    memberIcon: {
        fontSize: 18,
    },

    memberName: {
        fontSize: 14,
    },
    
    closeButton: {
        marginTop: 12,
        padding: 10,
        borderRadius: 6,
        alignItems: 'center',
    },

    closeText: {
        color: 'white',
        fontWeight: 'bold',
    },

    leaveButton: {
        marginTop: 8,
        padding: 10,
        borderRadius: 6,
        alignItems: 'center',
    },

    leaveText: {
        fontWeight: 'bold',
    },

    label: {
        fontWeight: '500',
        fontSize: 14,
        marginTop: 4,
    },

    input: {
        borderWidth: 1,
        borderRadius: 6,
        padding: 10,
        fontSize: 16,
        letterSpacing: 4,
        textAlign: 'center',
    },

    codeBox: {
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
    },

    codeLabel: {
        fontSize: 12,
        marginBottom: 4,
    },

    code: {
        fontSize: 28,
        fontWeight: 'bold',
        letterSpacing: 8,
    },
    
    teamRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        gap: 8,
    },

    teamIcon: {
        fontSize: 16,
    },

    teamName: {
        fontSize: 14,
    },

    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    dividerLine: {
        flex: 1,
        height: 1
    },

    dividerText: {
        fontSize: 13,
    },

    primaryButton: {
        padding: 10,
        borderRadius: 6,
        alignItems: 'center',
    },

    primaryText: {
        fontWeight: 'bold',
    },

    secondaryButton: {
        padding: 10,
        borderRadius: 6,
        alignItems: 'center',
    },

    secondaryText: {
        fontWeight: '500',
    },

    cancelButton: {
        padding: 10,
        alignItems: 'center',
    },

    cancelText: {
        color: 'gray',
        fontSize: 13,
    },

    buttonRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 8,
    },
})