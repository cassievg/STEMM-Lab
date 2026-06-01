import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type SectionKey = 'overview' | 'equipment' | 'instruction' | 'discussion';

const equipment = [
    { id: '1', name: 'Mobile phone with STEMM Lab app', image: { uri: 'https://placehold.co/52' } },
    { id: '2', name: 'Small toy (e.g. army toy soldier)', image: { uri: 'https://placehold.co/52' } },
    { id: '3', name: 'Table or elevated surface', image: { uri: 'https://placehold.co/52' } },
    { id: '4', name: 'Paper or plastic', image: { uri: 'https://placehold.co/52' } },
    { id: '5', name: 'String', image: { uri: 'https://placehold.co/52' } },
    { id: '6', name: 'Scissors', image: { uri: 'https://placehold.co/52' } },
    { id: '7', name: 'Tape', image: { uri: 'https://placehold.co/52' } },
]

const instruction = [
    'Drop the toy without a parachute and record the fall (baseline test).',
    'Build a parachute using provided materials.',
    'Drop the toy from the same height and record the fall.',
    'Review speed and landing accuracy results in the app.',
    'Redesign and test up to three prototypes within 20 minutes.',
    'Upload videos, results, and  team reflections.'
]

const writeUp = [
    'Predict which parachute design was the best.',
    'Sketch each design.',
    'Record the times of each design.',
    'Were you correct in your design?',
    'What designs was easiest to make?',
]

const primaryFocus = [
    'Measure time',
    'Calculate final speed',
]

const highFocus = [
    'Final velocity',
    'Acceleration',
    'Net force',
    'Drag force',
    'G-force'
]

const SECTIONS: {key: SectionKey; label: string; icon: string}[] = [
    {key: 'overview', label: 'Overview', icon:'📋'},
    {key: 'equipment', label: 'Equipment', icon:'🧰'},
    {key: 'instruction', label: 'Instruction', icon:'📝'},
    {key: 'discussion', label: 'Discussion', icon:'💡'},
]

const CURRICULUM: {code: string; description: string}[] = [
    {code: 'ACSSU076 / ACSSU117', description: 'Forces affect motion' },
    {code: 'ACSIS124', description: 'Planning Investigations' },
    {code: 'ACTDEP036', description: 'Generate & test solutions' },
    {code: 'ACMMG108', description: 'Measuring speed' },
]

const FORMULA: {force: string; equation: string}[] = [
    {force: 'Downard (weight)', equation: 'Weight = mass × g'},
    {force: 'Upward (drag)', equation: 'Drag force from the parachute'},
    {force: 'Net (total) force', equation: 'Net Force = Weight - Drag Force'},
]

const BLUE = '#97b9d6';
const LIGHT_BLUE = '#afdaff';
const WHITE = '#ffffff';

export default function Activity1() {
    const [activeSection, setActiveSection] = useState<SectionKey>('overview');
    const [checkedItems, setCheckedItems] = useState<string[]>([]);

    const toggleCheck = (id: string) => {
        setCheckedItems((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
    };

    return (
        <SafeAreaView style={localStyles.page}>
            <View style={localStyles.header}>
                <TouchableOpacity 
                style={localStyles.back_button}
                onPress={() => router.push('/student/activityselection')}>
                    <Text>{'<'}</Text>
                </TouchableOpacity>
                <View style={localStyles.header_title_container}>
                    <Text style={localStyles.header_title}>
                        Engineering · Activity 1
                    </Text>
                    <Text style={localStyles.header_subtitle}>
                        Parachute Drop Challenge
                    </Text>
                </View>
            </View>

            <View style={localStyles.tab_row}>
                {SECTIONS.map((sect) => (
                    <TouchableOpacity
                        key={sect.key}
                        style={[localStyles.tab, activeSection === sect.key && localStyles.tab_active]}
                        onPress={() => setActiveSection(sect.key)}
                        activeOpacity={0.75}>
                            <Text style={localStyles.tab_icon}>
                                {sect.icon}
                            </Text>
                            <Text style={[localStyles.tab_label, activeSection === sect.key && localStyles.tab_label_active]}>
                                {sect.label}
                            </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView
                style={localStyles.scroll}
                contentContainerStyle={localStyles.scroll_content}
                showsVerticalScrollIndicator={false}>

                {activeSection === 'overview' && (
                    <View>
                        <Text style={localStyles.body}>
                            Students design, build, and test a parachute, for a small toy to reduce its landing 
                            speed and impact force. Teams iterate their designs under time and material constraints,
                            aiming to achieve the slowest and safest landing within a target area.
                        </Text>
                        <Text style={localStyles.section_heading}>
                            Learning Goals
                        </Text>
                        <View style={localStyles.chip_row}>
                            {['Design Thinking', 'Physics', 'Teamwork', 'Iteration'].map((chip) => (
                                <View key={chip} style={localStyles.chip}>
                                    <Text style={localStyles.chip_text}>
                                        {chip}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        <Text style={localStyles.section_heading}>
                            Curriculum Links
                        </Text>
                        {CURRICULUM.map((item) => (
                            <View key={item.code} style={localStyles.curriculum_row}>
                                <View style={localStyles.curriculum_icon}>
                                    <Text style={localStyles.curriculum_code}>
                                        {item.code}
                                    </Text>
                                </View>
                                <Text style={localStyles.curriculum_description}>
                                    {item.description}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {activeSection === 'equipment' && (
                    <View>
                        <Text style={localStyles.body}>
                            Gather the following items before you start:
                        </Text>
                        <Text style={localStyles.progress_text}>
                            {checkedItems.length}/{equipment.length} items ready
                        </Text>
                        {equipment.map((item) => {
                            const checked = checkedItems.includes(item.id);
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[localStyles.equipment_row, checked && localStyles.equipment_row_checked]}
                                    onPress={() => toggleCheck(item.id)}
                                    activeOpacity={0.7}>
                                        <Image
                                            source={item.image}
                                            style={[localStyles.equipment_image, checked && localStyles.equipment_image_checked]}
                                            resizeMode='contain'/>
                                        <Text style={[localStyles.equipment_name, checked && localStyles.equipment_name_checked]}>
                                            {checked ? (<Text style={{textDecorationLine:'line-through'}}>
                                                {item.name}
                                            </Text>): (item.name)}
                                        </Text>
                                        
                                        <View style={[localStyles.checkbox, checked && localStyles.checkbox_checked]}>
                                            {checked && <Text style={localStyles.checkbox_tick}>✓</Text>}
                                        </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}

                {activeSection === 'instruction' && (
                    <View>
                        {instruction.map((step, i) => (
                            <View key={i} style={localStyles.step_row}>
                                <View style={localStyles.step_number_wrap}>
                                    <Text style={localStyles.step_number}>
                                        {i+1}
                                    </Text>
                                </View>
                                <Text style={localStyles.step_text}>
                                    {step}
                                </Text>
                            </View>
                        ))}

                        <View style={localStyles.info_box}>
                            <Text style={localStyles.info_box_title}>
                                📄Write-up (On paper)
                            </Text>
                            {writeUp.map((item,i) => (
                                <View key={i} style={localStyles.list_row}>
                                    <View style={localStyles.list_dot}/>
                                    <Text style={localStyles.list_text}>
                                        {item}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {activeSection === 'discussion' && (
                    <View>
                        <Text style={localStyles.section_heading}>
                            Parachute and Forces
                        </Text>
                        <Text style={localStyles.body}>
                            Gravity pulls objects downard, causing to speed up as they fall. A parachute increases
                            air resistance (also called drag). Drag acts upward, opposing the motion and slowing
                            the fall. A slower fall reduces the force when the toy hits the ground, making the
                            landing safer. Engineers improve parachute designs through repeated testing and redesign
                        </Text>

                        <Text style={localStyles.section_heading}>
                            Forces Acting on the Toy
                        </Text>
                        <View style={localStyles.table}>
                            <View style={localStyles.table_header_row}>
                                <Text style={[localStyles.table_cell, localStyles.table_header, {flex: 1.2}]}>
                                    Forces
                                </Text>
                                <Text style={[localStyles.table_cell, localStyles.table_header, {flex: 2}]}>
                                    Formula
                                </Text>
                            </View>
                            {FORMULA.map((item, i) => (
                                <View key={i} style={[localStyles.table_row, i%2 === 0 && localStyles.table_row_alt]}>
                                    <Text style={[localStyles.table_cell, localStyles.table_cell, {flex: 1.2}]}>
                                        {item.force}
                                    </Text>
                                    <Text style={[localStyles.table_cell, localStyles.table_cell, {flex: 2}]}>
                                        {item.equation}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        <Text style={localStyles.section_heading}>
                            Student Focus
                        </Text>
                        <View style={localStyles.focus_grid}>
                            <View style={localStyles.focus_card}>
                                <Text style={localStyles.focus_level}>
                                    🎒 Primary
                                </Text>
                                {primaryFocus.map((t, i) => (
                                    <View key={i} style={localStyles.list_row}>
                                        <View style={localStyles.list_dot}/>
                                        <Text style={localStyles.list_text}>
                                            {t}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                            
                            <View style={localStyles.focus_card}>
                                <Text style={localStyles.focus_level}>
                                    🎓 High School
                                </Text>
                                {highFocus.map((t,i) => (
                                    <View key={i} style={localStyles.list_row}>
                                        <View style={localStyles.list_dot}/>
                                        <Text style={localStyles.list_text}>
                                            {t}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                )}

                <View style={{height: 32}}/>

            </ScrollView>

            <View style={localStyles.footer}>
                <TouchableOpacity 
                    style={localStyles.start_button}
                    activeOpacity={0.85}
                    onPress={() => router.push('/student/startactivity/start1')}>

                    <Text style={localStyles.start_button_text}>
                        Start Activity
                    </Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );    
}

const localStyles = StyleSheet.create({
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