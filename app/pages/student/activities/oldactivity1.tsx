import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { activityStyles } from './activityStyles';

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

export default function Activity1() {
    const [activeSection, setActiveSection] = useState<SectionKey>('overview');
    const [checkedItems, setCheckedItems] = useState<string[]>([]);

    const toggleCheck = (id: string) => {
        setCheckedItems((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
    };

    return (
        <SafeAreaView style={activityStyles.page}>
            <View style={activityStyles.header}>
                <TouchableOpacity 
                style={activityStyles.back_button}
                onPress={() => router.push('/pages/student/menu/activityselection')}>
                    <Text>{'<'}</Text>
                </TouchableOpacity>
                <View style={activityStyles.header_title_container}>
                    <Text style={activityStyles.header_title}>
                        Engineering · Activity 1
                    </Text>
                    <Text style={activityStyles.header_subtitle}>
                        Parachute Drop Challenge
                    </Text>
                </View>
            </View>

            <View style={activityStyles.tab_row}>
                {SECTIONS.map((sect) => (
                    <TouchableOpacity
                        key={sect.key}
                        style={[activityStyles.tab, activeSection === sect.key && activityStyles.tab_active]}
                        onPress={() => setActiveSection(sect.key)}
                        activeOpacity={0.75}>
                            <Text style={activityStyles.tab_icon}>
                                {sect.icon}
                            </Text>
                            <Text style={[activityStyles.tab_label, activeSection === sect.key && activityStyles.tab_label_active]}>
                                {sect.label}
                            </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView
                style={activityStyles.scroll}
                contentContainerStyle={activityStyles.scroll_content}
                showsVerticalScrollIndicator={false}>

                {activeSection === 'overview' && (
                    <View>
                        <Text style={activityStyles.body}>
                            Students design, build, and test a parachute, for a small toy to reduce its landing 
                            speed and impact force. Teams iterate their designs under time and material constraints,
                            aiming to achieve the slowest and safest landing within a target area.
                        </Text>
                        <Text style={activityStyles.section_heading}>
                            Learning Goals
                        </Text>
                        <View style={activityStyles.chip_row}>
                            {['Design Thinking', 'Physics', 'Teamwork', 'Iteration'].map((chip) => (
                                <View key={chip} style={activityStyles.chip}>
                                    <Text style={activityStyles.chip_text}>
                                        {chip}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        <Text style={activityStyles.section_heading}>
                            Curriculum Links
                        </Text>
                        {CURRICULUM.map((item) => (
                            <View key={item.code} style={activityStyles.curriculum_row}>
                                <View style={activityStyles.curriculum_icon}>
                                    <Text style={activityStyles.curriculum_code}>
                                        {item.code}
                                    </Text>
                                </View>
                                <Text style={activityStyles.curriculum_description}>
                                    {item.description}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {activeSection === 'equipment' && (
                    <View>
                        <Text style={activityStyles.body}>
                            Gather the following items before you start:
                        </Text>
                        <Text style={activityStyles.progress_text}>
                            {checkedItems.length}/{equipment.length} items ready
                        </Text>
                        {equipment.map((item) => {
                            const checked = checkedItems.includes(item.id);
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[activityStyles.equipment_row, checked && activityStyles.equipment_row_checked]}
                                    onPress={() => toggleCheck(item.id)}
                                    activeOpacity={0.7}>
                                        <Image
                                            source={item.image}
                                            style={[activityStyles.equipment_image, checked && activityStyles.equipment_image_checked]}
                                            resizeMode='contain'/>
                                        <Text style={[activityStyles.equipment_name, checked && activityStyles.equipment_name_checked]}>
                                            {checked ? (<Text style={{textDecorationLine:'line-through'}}>
                                                {item.name}
                                            </Text>): (item.name)}
                                        </Text>
                                        
                                        <View style={[activityStyles.checkbox, checked && activityStyles.checkbox_checked]}>
                                            {checked && <Text style={activityStyles.checkbox_tick}>✓</Text>}
                                        </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}

                {activeSection === 'instruction' && (
                    <View>
                        {instruction.map((step, i) => (
                            <View key={i} style={activityStyles.step_row}>
                                <View style={activityStyles.step_number_wrap}>
                                    <Text style={activityStyles.step_number}>
                                        {i+1}
                                    </Text>
                                </View>
                                <Text style={activityStyles.step_text}>
                                    {step}
                                </Text>
                            </View>
                        ))}

                        <View style={activityStyles.info_box}>
                            <Text style={activityStyles.info_box_title}>
                                📄Write-up (On paper)
                            </Text>
                            {writeUp.map((item,i) => (
                                <View key={i} style={activityStyles.list_row}>
                                    <View style={activityStyles.list_dot}/>
                                    <Text style={activityStyles.list_text}>
                                        {item}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {activeSection === 'discussion' && (
                    <View>
                        <Text style={activityStyles.section_heading}>
                            Parachute and Forces
                        </Text>
                        <Text style={activityStyles.body}>
                            Gravity pulls objects downard, causing to speed up as they fall. A parachute increases
                            air resistance (also called drag). Drag acts upward, opposing the motion and slowing
                            the fall. A slower fall reduces the force when the toy hits the ground, making the
                            landing safer. Engineers improve parachute designs through repeated testing and redesign
                        </Text>

                        <Text style={activityStyles.section_heading}>
                            Forces Acting on the Toy
                        </Text>
                        <View style={activityStyles.table}>
                            <View style={activityStyles.table_header_row}>
                                <Text style={[activityStyles.table_cell, activityStyles.table_header, {flex: 1.2}]}>
                                    Forces
                                </Text>
                                <Text style={[activityStyles.table_cell, activityStyles.table_header, {flex: 2}]}>
                                    Formula
                                </Text>
                            </View>
                            {FORMULA.map((item, i) => (
                                <View key={i} style={[activityStyles.table_row, i%2 === 0 && activityStyles.table_row_alt]}>
                                    <Text style={[activityStyles.table_cell, activityStyles.table_cell, {flex: 1.2}]}>
                                        {item.force}
                                    </Text>
                                    <Text style={[activityStyles.table_cell, activityStyles.table_cell, {flex: 2}]}>
                                        {item.equation}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        <Text style={activityStyles.section_heading}>
                            Student Focus
                        </Text>
                        <View style={activityStyles.focus_grid}>
                            <View style={activityStyles.focus_card}>
                                <Text style={activityStyles.focus_level}>
                                    🎒 Primary
                                </Text>
                                {primaryFocus.map((t, i) => (
                                    <View key={i} style={activityStyles.list_row}>
                                        <View style={activityStyles.list_dot}/>
                                        <Text style={activityStyles.list_text}>
                                            {t}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                            
                            <View style={activityStyles.focus_card}>
                                <Text style={activityStyles.focus_level}>
                                    🎓 High School
                                </Text>
                                {highFocus.map((t,i) => (
                                    <View key={i} style={activityStyles.list_row}>
                                        <View style={activityStyles.list_dot}/>
                                        <Text style={activityStyles.list_text}>
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

            <View style={activityStyles.footer}>
                <TouchableOpacity 
                    style={activityStyles.start_button}
                    activeOpacity={0.85}
                    onPress={() => router.push('/pages/student/startactivity/start1')}>

                    <Text style={activityStyles.start_button_text}>
                        Start Activity
                    </Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );    
}