import { useAuth } from '@/src/context/AuthContext';
import { ThemeKey } from '@/src/context/ThemeContext.d';
import { createRoom, getRoomByTeamAndActivity, getRoomTeamsNames, getTeamDetails, joinRoom, leaveRoom } from '@/src/services/firebaseServices';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalColors, globalStyles } from '../../../styles';
import { activityColors, activityStyles, modalStyles } from './activityStyles';

import { useTheme } from '@/src/context/ThemeContext';

type TeamRow = {
    id: string,
    hostId: string,
    discriminator: string,
    grade: string,
    members: string[],
    name: string,
}

type RoomRow = {
    id: string,
    code: string,
    activityId: string,
    createdAt: string,
    hostTeamId: string, 
    status: string,
    teams: string[]
}

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
    const { theme, changeTheme } = useTheme();

    const themed = activityColors[theme as ThemeKey];
    const globalThemed = globalColors[theme as ThemeKey];

    const [activeSection, setActiveSection] = useState<SectionKey>('overview');
    const [checkedItems, setCheckedItems] = useState<string[]>([]);

    const [team, setTeam] = useState<TeamRow | null>(null);
    const [teamMembers, setTeamMembers] = useState<string[]>([]);
    const [teamModalVisible, setTeamModalVisible] = useState(false);

    const [room, setRoom] = useState<RoomRow | null>(null);
    const [roomCode, setRoomCode] = useState('');
    const [roomTeam, setRoomTeam] = useState<string[]>([]);
    const [roomTeamNames, setRoomTeamNames] = useState<string[]>([]);

    const [enterRoomModalVisible, setEnterRoomModalVisible] = useState(false);
    const [roomDetailsModalVisible, setRoomDetailsModalVisible] = useState(false);

    const { id } = useLocalSearchParams<{id: string}>();
    const { userDoc, teamID } = useAuth();

    const toggleCheck = (id: string) => {
        setCheckedItems((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
    };

    useEffect(() => {
        console.log('id from params:', id);
        console.log('teamID:', teamID);
    }, [id, teamID])

    useEffect(() => {
        console.log(id); 

        const loadRoom = async () => {
            console.log(teamID);

            if (!teamID || !id) return;

            const roomData = await getRoomByTeamAndActivity(teamID, id);
            if (roomData) {
                setRoom(roomData);
            }
        }

        loadRoom();
    }, [teamID, id])

    const handleCreateRoom = async () => {
        const res = await createRoom(id, teamID);
        if (res) {
            const roomData = await getRoomByTeamAndActivity(teamID, id);
            setRoom(roomData);
            setEnterRoomModalVisible(false);
            openRoomDetails(roomData);
        }
    }

    const handleLeaveRoom = async () => {
        if (room?.id) {
            await leaveRoom(room!.id, teamID);
            setRoom(null);
            setRoomDetailsModalVisible(false);
        } else {
            console.log("room doesnt exist");
        }
    }

    const handleJoinRoom = async () => {
        if (!teamID) {
            alert("no team found.");
            return;
        }
        if (!roomCode || roomCode.length < 4) {
            alert('invalid room code');
            return;
        }

        const roomId = await joinRoom(roomCode, id, teamID);
        if (roomId) {
            const roomData = await getRoomByTeamAndActivity(teamID, id);
            setRoom(roomData);
            setEnterRoomModalVisible(false);
            openRoomDetails(roomData);
        } else {
            alert('Room not found. Check the code and try again.');
        }
    }

    const openRoomDetails = async (roomData?: RoomRow | null) => {
        const target = roomData ?? room;
        if (!room?.id) return null;

        const names = await getRoomTeamsNames(room.id);
        setRoomTeamNames(names);

        setRoomDetailsModalVisible(true);
    }

    const loadTeam = async () => {
        if (!teamID) {
            setTeamModalVisible(true);
            return;
        }

        const teamData = await getTeamDetails(teamID);
        if (teamData) {
            setTeam(teamData);
            setTeamMembers(teamData.members);
        }

        setTeamModalVisible(true);
    }

    return (
        <SafeAreaView style={[themed.page, activityStyles.page]}>
            <View style={activityStyles.header}>
                <TouchableOpacity 
                style={[globalThemed.back, globalStyles.back_button]}
                onPress={() => router.push('/pages/student/menu/activityselection')}>
                    <Text style={[globalThemed.text, globalStyles.text]}>{'<'}</Text>
                </TouchableOpacity>
                <View style={activityStyles.header_title_container}>
                    <Text style={[globalThemed.text, activityStyles.header_title]}>
                        Engineering · Activity 1
                    </Text>
                    <Text style={[globalThemed.text, activityStyles.header_subtitle]}>
                        Parachute Drop Challenge
                    </Text>
                </View>

                {userDoc?.role === 'student' && (
                    <TouchableOpacity 
                        style={[themed.button, activityStyles.button]}
                        onPress={loadTeam}>
                        <Text>👥</Text>
                    </TouchableOpacity>
                )}

                {userDoc?.role === 'student' && (
                    <TouchableOpacity 
                        style={[themed.button, activityStyles.button]}
                        onPress={() => room ? openRoomDetails(room) : setEnterRoomModalVisible(true)}>
                        <Text>🏠</Text>
                    </TouchableOpacity>
                )}
            </View>

            <Modal
                visible={teamModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setTeamModalVisible(false)}
            >
                <View style={modalStyles.overlay}>
                    <View style={modalStyles.container}>
                        <Text style={modalStyles.title}>
                            {team?.name ?? 'No Team'} {team ? `#${team.discriminator}` : ''}
                        </Text>

                        {teamMembers.length === 0 ? (
                            <Text style={modalStyles.empty}>No members found</Text>
                        ) : (
                            teamMembers.map((member, i) => (
                                <View key={i} style={modalStyles.memberRow}>
                                    <Text style={modalStyles.memberIcon}>👤</Text>
                                    <Text style={modalStyles.memberName}>{member}</Text>
                                </View>
                            ))
                        )}

                        <Pressable
                            style={modalStyles.closeButton}
                            onPress={() => setTeamModalVisible(false)}
                        >
                            <Text style={modalStyles.closeText}>Close</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={enterRoomModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setEnterRoomModalVisible(false)}
            >
                <View style={modalStyles.overlay}>
                    <View style={modalStyles.container}>
                        <Text style={modalStyles.title}>Join a Room</Text>

                        <Text style={modalStyles.label}>Enter Room Code</Text>
                        <TextInput
                            style={modalStyles.input}
                            value={roomCode}
                            onChangeText={(text) => setRoomCode(text.toUpperCase())}
                            placeholder="e.g. AB12"
                            placeholderTextColor='#969696'
                            maxLength={4}
                            autoCapitalize="characters"
                        />
                        <Pressable
                            style={modalStyles.primaryButton}
                            onPress={handleJoinRoom}
                        >
                            <Text style={modalStyles.primaryText}>Join Room</Text>
                        </Pressable>

                        <View style={modalStyles.divider}>
                            <View style={modalStyles.dividerLine}/>
                            <Text style={modalStyles.dividerText}>or</Text>
                            <View style={modalStyles.dividerLine}/>
                        </View>

                        <Pressable
                            style={modalStyles.secondaryButton}
                            onPress={handleCreateRoom}
                        >
                            <Text style={modalStyles.secondaryText}>Create Room</Text>
                        </Pressable>

                        <Pressable
                            style={modalStyles.cancelButton}
                            onPress={() => setEnterRoomModalVisible(false)}
                        >
                            <Text style={modalStyles.cancelText}>Solo (No Room)</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={roomDetailsModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setRoomDetailsModalVisible(false)}
            >
                <View style={modalStyles.overlay}>
                    <View style={modalStyles.container}>
                        <Text style={modalStyles.title}>Room Details</Text>

                        <View style={modalStyles.codeBox}>
                            <Text style={modalStyles.codeLabel}>Room Code</Text>
                            <Text style={modalStyles.code}>{room?.code ?? '-'}</Text>
                        </View>

                        <Text style={modalStyles.label}>Teams in Room</Text>
                        {roomTeamNames.length === 0 ? (
                            <Text style={modalStyles.empty}>No teams yet</Text>
                        ) : (
                            roomTeamNames.map((name, i) => (
                                <View key={i} style={modalStyles.teamRow}>
                                    <Text style={modalStyles.teamIcon}>🏷️</Text>
                                    <Text style={modalStyles.teamName}>{name}</Text>
                                </View>
                            ))
                        )}

                        <View style={modalStyles.buttonRow}>
                            <Pressable
                                style={modalStyles.leaveButton}
                                onPress={handleLeaveRoom}
                            >
                                <Text style={modalStyles.leaveText}>Leave Room</Text>
                            </Pressable>

                            <Pressable
                                style={modalStyles.closeButton}
                                onPress={() => setRoomDetailsModalVisible(false)}
                            >
                                <Text style={modalStyles.closeText}>Close</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={[globalThemed.tab_bar, activityStyles.tab_bar]}>
                {SECTIONS.map((sect) => (
                    <TouchableOpacity
                        key={sect.key}
                        style={[globalStyles.tab, activeSection === sect.key && [globalThemed.tab_active]]}
                        onPress={() => setActiveSection(sect.key)}
                        activeOpacity={0.75}>
                            <Text style={[globalThemed.tab_label, globalStyles.tab_label]}>
                                {sect.icon}
                            </Text>
                            <Text style={[[globalThemed.tab_label, globalStyles.tab_label], activeSection === sect.key && [globalThemed.tab_label_active, globalStyles.tab_label_active]]}>
                                {sect.label}
                            </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView
                style={[themed.scroll, activityStyles.scroll]}
                contentContainerStyle={activityStyles.scroll_content}
                showsVerticalScrollIndicator={false}>

                {activeSection === 'overview' && (
                    <View>
                        <Text style={[globalThemed.text, [globalThemed.text, activityStyles.body]]}>
                            Students design, build, and test a parachute, for a small toy to reduce its landing 
                            speed and impact force. Teams iterate their designs under time and material constraints,
                            aiming to achieve the slowest and safest landing within a target area.
                        </Text>
                        <Text style={[globalThemed.text, activityStyles.section_heading]}>
                            Learning Goals
                        </Text>
                        <View style={activityStyles.chip_row}>
                            {['Design Thinking', 'Physics', 'Teamwork', 'Iteration'].map((chip) => (
                                <View key={chip} style={[themed.chip, activityStyles.chip]}>
                                    <Text style={[globalThemed.text, activityStyles.chip_text]}>
                                        {chip}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        <Text style={[globalThemed.text, activityStyles.section_heading]}>
                            Curriculum Links
                        </Text>
                        {CURRICULUM.map((item) => (
                            <View key={item.code} style={activityStyles.curriculum_row}>
                                <View style={[themed.curriculum_icon, activityStyles.curriculum_icon]}>
                                    <Text style={[globalThemed.text, activityStyles.curriculum_code]}>
                                        {item.code}
                                    </Text>
                                </View>
                                <Text style={[globalThemed.text, activityStyles.curriculum_description]}>
                                    {item.description}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}

                {activeSection === 'equipment' && (
                    <View>
                        <Text style={[globalThemed.text, activityStyles.body]}>
                            Gather the following items before you start:
                        </Text>
                        <Text style={[globalThemed.text, activityStyles.progress_text]}>
                            {checkedItems.length}/{equipment.length} items ready
                        </Text>
                        {equipment.map((item) => {
                            const checked = checkedItems.includes(item.id);
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[[themed.equipment_row, activityStyles.equipment_row], checked && [themed.equipment_row_checked]]}
                                    onPress={() => toggleCheck(item.id)}
                                    activeOpacity={0.7}>
                                        <Image
                                            source={item.image}
                                            style={[[themed.equipment_image, activityStyles.equipment_image], checked && activityStyles.equipment_image_checked]}
                                            resizeMode='contain'/>
                                        <Text style={[[globalThemed.text, activityStyles.equipment_name], checked && [themed.equipment_name_checked, activityStyles.equipment_name_checked]]}>
                                            {checked ? (<Text style={{textDecorationLine:'line-through'}}>
                                                {item.name}
                                            </Text>): (item.name)}
                                        </Text>
                                        
                                        <View style={[[themed.checkbox, activityStyles.checkbox], checked && [themed.checkbox_checked]]}>
                                            {checked && <Text style={[themed.checkbox_tick, activityStyles.checkbox_tick]}>✓</Text>}
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
                                <View style={[themed.step_number_wrap, activityStyles.step_number_wrap]}>
                                    <Text style={[themed.step_number, activityStyles.step_number]}>
                                        {i+1}
                                    </Text>
                                </View>
                                <Text style={[globalThemed.text, activityStyles.step_text]}>
                                    {step}
                                </Text>
                            </View>
                        ))}

                        <View style={[themed.info_box, activityStyles.info_box]}>
                            <Text style={[globalThemed.text, activityStyles.info_box_title]}>
                                📄Write-up (On paper)
                            </Text>
                            {writeUp.map((item,i) => (
                                <View key={i} style={activityStyles.list_row}>
                                    <View style={[themed.list_dot, activityStyles.list_dot]}/>
                                    <Text style={[globalThemed.text, activityStyles.list_text]}>
                                        {item}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {activeSection === 'discussion' && (
                    <View>
                        <Text style={[globalThemed.text, activityStyles.section_heading]}>
                            Parachute and Forces
                        </Text>
                        <Text style={[globalThemed.text, activityStyles.body]}>
                            Gravity pulls objects downard, causing to speed up as they fall. A parachute increases
                            air resistance (also called drag). Drag acts upward, opposing the motion and slowing
                            the fall. A slower fall reduces the force when the toy hits the ground, making the
                            landing safer. Engineers improve parachute designs through repeated testing and redesign
                        </Text>

                        <Text style={[globalThemed.text, globalThemed.text, activityStyles.section_heading]}>
                            Forces Acting on the Toy
                        </Text>
                        <View style={[themed.table, activityStyles.table]}>
                            <View style={[themed.table_header_row, activityStyles.table_header_row]}>
                                <Text style={[activityStyles.table_cell, globalThemed.text, activityStyles.table_header, {flex: 1.2}]}>
                                    Forces
                                </Text>
                                <Text style={[activityStyles.table_cell, globalThemed.text, activityStyles.table_header, {flex: 2}]}>
                                    Formula
                                </Text>
                            </View>
                            {FORMULA.map((item, i) => (
                                <View key={i} style={[[themed.table_row, activityStyles.table_row], i%2 === 0 && themed.table_row_alt]}>
                                    <Text style={[activityStyles.table_cell, globalThemed.text, {flex: 1.2}]}>
                                        {item.force}
                                    </Text>
                                    <Text style={[activityStyles.table_cell, globalThemed.text, {flex: 2}]}>
                                        {item.equation}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        <Text style={[globalThemed.text, activityStyles.section_heading]}>
                            Student Focus
                        </Text>
                        <View style={activityStyles.focus_grid}>
                            <View style={[themed.focus_card, activityStyles.focus_card]}>
                                <Text style={[globalThemed.text, activityStyles.focus_level]}>
                                    🎒 Primary
                                </Text>
                                {primaryFocus.map((t, i) => (
                                    <View key={i} style={activityStyles.list_row}>
                                        <View style={[themed.list_dot, activityStyles.list_dot]}/>
                                        <Text style={[globalThemed.text, activityStyles.list_text]}>
                                            {t}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                            
                            <View style={[themed.focus_card, activityStyles.focus_card]}>
                                <Text style={[globalThemed.text, activityStyles.focus_level]}>
                                    🎓 High School
                                </Text>
                                {highFocus.map((t,i) => (
                                    <View key={i} style={activityStyles.list_row}>
                                        <View style={[themed.list_dot, activityStyles.list_dot]}/>
                                        <Text style={[globalThemed.text, activityStyles.list_text]}>
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
                    onPress={() => router.push('./pages/student/startactivity/start1')}>

                    <Text style={activityStyles.start_button_text}>
                        Start Activity
                    </Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );    
}