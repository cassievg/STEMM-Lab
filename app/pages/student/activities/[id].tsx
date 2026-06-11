import { useAuth } from '@/src/context/AuthContext';
import { createRoom, getRoomByTeamAndActivity, getRoomTeamsNames, getTeamDetails, joinRoom, leaveRoom } from '@/src/services/firebaseServices';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { globalStyles } from '../../../styles';
import { activityStyles, modalStyles } from './activityStyles';

import { useThemedStyles } from '@/hooks/use-theme-style';
import ToolsPanel from '../tools/panel';
import activities from './activitiesIndex';

const FONT_FAMILY = 'Trebuchet MS, Roboto, sans-serif';

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

export type ActivityData = {
    id: number,
    name: string,
    course: string,
    overview: string,
    equipment: string[],
    instruction: {
        step: number,
        text: string,
    } [],
    writeUp: {
        question: string[],
    },
    experimentTable: {
        columns: string[],
        rows: {
            id: number,
            label: string,
        }[],
    },
    discussion: {
        title: string,
        description: string[],
    },
    customSection?: {
        physics?: {
            newtonsSecondLaw: {
                name: string,
                formula: string,
            },
            forceTable: {
                force: string,
                formula: string,
            }[],
        },
        calculations?: {
            step: number,
            title: string,
            description: string | string[],
        }[],
        gForce?: {
            description: string,
            slowMotionInstruction: string[],
        },
        cases?: {
            id: number,
            title: string,
            description: string,
            velocityChange: string,
            formula: string,
            example: string[],
            observation?: string,
            additonalCalculation?: {
                title: string,
                description: string,
                formula: string,
            },
        }[],
        tips?: string[],
    },
    riskTable: {
        title: string,
        columns: string[],
        rows: {
            range: string,
            example: string,
            effect: string,
        }[],
        important: string,
    },
    studentFocus: {
        primarySchool: string[],
        highSchool: string[],
    },
    curriculumLinks: {
        subject: string,
        outcomes: {
            code: string,
            description: string,
        }[],
    }[],
}



type SectionKey = 'overview' | 'equipment' | 'instruction' | 'discussion';

const SECTIONS: {key: SectionKey; label: string; icon: string}[] = [
    {key: 'overview', label: 'Overview', icon:'📋'},
    {key: 'equipment', label: 'Equipment', icon:'🧰'},
    {key: 'instruction', label: 'Instruction', icon:'📝'},
    {key: 'discussion', label: 'Discussion', icon:'💡'},
]

function SectionHeading({ children}: {children: string}){
    const { themed, globalThemed } = useThemedStyles();
    
    return <Text style={[globalThemed.text, activityStyles.section_heading]}>{children}</Text>
}

function BulletList({ items }: {items: string[]}){
    const { themed, globalThemed } = useThemedStyles();
    return(
        <View style={styles.list_wrap}>
            {items.map((item, i) => (
                <View key={i} style={styles.list_row}>
                    <View style={[themed.list_dot, styles.list_dot]}/>
                    <Text style={[globalThemed.text, styles.list_text]}>
                        {item}
                    </Text>
                </View> 
            ))}
        </View>
    )
}

function InfoBox({ title, children }: {title?: string; children: React.ReactNode}){
    const { themed, globalThemed } = useThemedStyles();
    return (
        <View style={activityStyles.info_box}>
            {title && <Text style={[globalThemed.text, activityStyles.info_box_title]}>{title}</Text>}
            {children}
        </View>
    )
}

function OverviewTab({data}: {data: ActivityData}){
    const { themed, globalThemed } = useThemedStyles();

    return(
        <View>
            <Text style={[globalThemed.text, styles.body]}>
                {data.overview}
            </Text>

            <SectionHeading>
                Learning Goals
            </SectionHeading>
            <View style={styles.chip_row}>
                {['Design Thinking', 'Physics', 'Teamwork', 'Iteration'].map((chip) => (
                    <View key={chip} style={[themed.chip, styles.chip]}>
                        <Text style={[globalThemed.text, styles.chip_text]}>
                            {chip}
                        </Text>
                    </View>
                ))}
            </View>

            <SectionHeading>
                Student Focus
            </SectionHeading>
            <View style={styles.focus_grid}>
                <View style={[themed.focus_card, styles.focus_card]}>
                    <Text style={[globalThemed.text, styles.focus_level]}>
                        🎒 Primary
                    </Text>
                    <BulletList items={data.studentFocus.primarySchool}/>
                </View>
                <View style={[themed.focus_card, styles.focus_card]}>
                    <Text style={[globalThemed.text, styles.focus_level]}>
                        🎓 High School
                    </Text>
                    <BulletList items={data.studentFocus.highSchool}/>
                </View>
            </View>

            <SectionHeading>
                Curriculum Links
            </SectionHeading>
            {data.curriculumLinks.map((subject) => (
                <View key={subject.subject} style={styles.curriculum_subject}>
                    <Text style={[globalThemed.text, styles.curriculum_subject_title]}>
                        {subject.subject}
                    </Text>
                    {subject.outcomes.map((outcome) => (
                        <View key={outcome.code} style={styles.curriculum_row}>
                            <View style={[themed.curriculum_icon, styles.curriculum_icon]}>
                                <Text style={[globalThemed.text, styles.curriculum_code]}>
                                    {outcome.code}
                                </Text>
                            </View>
                            <Text style={[globalThemed.text, styles.curriculum_description]}>
                                {outcome.description}
                            </Text>
                        </View>
                    ))}
                </View>    
            ))}
        </View>
    )
}

function EquipmentTab({ data }: {data: ActivityData}){
    const [checked, setChecked] = useState<number[]>([]);
    const { themed, globalThemed } = useThemedStyles();

    const toggle = (i: number) => (
        setChecked((prev) => (
            prev.includes(i) ? prev.filter((x) => x !== i): [...prev, i]
        ))
    )

    return (
        <View>
            <Text style={[globalThemed.text, styles.body]}>
                Gather the following items before you start:
            </Text>
            <Text style={[globalThemed.text, styles.progress_text]}>
                {checked.length}/{data.equipment.length} items ready
            </Text>
            {data.equipment.map((item, i) => {
                const isChecked = checked.includes(i);

                return (
                    <TouchableOpacity
                        key={i}
                        style={[[themed.equipment_row, styles.equipment_row], isChecked && [themed.equipment_row_checked]]}
                        onPress={() => toggle(i)}
                        activeOpacity={0.7}>

                        <View style={[[themed.equipment_image, styles.equipment_icon_box], isChecked && [themed.equipment_image]]}>
                            <Text style={styles.equipment_icon}>
                                📦
                            </Text>
                        </View>

                        <Text style={[[globalThemed.text, styles.equipment_name], isChecked && [themed.equipment_name_checked, styles.equipment_name_checked]]}>
                            {isChecked ? <Text style={{textDecorationLine: 'line-through'}}>{item}</Text> : item}
                        </Text>

                        <View style={[[themed.checkbox, styles.checkbox], isChecked && themed.checkbox_checked]}>
                            {isChecked && <Text style={[globalThemed.text, styles.checkbox_tick]}>✓</Text>}
                        </View>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}

function InstructionTab({data} : {data: ActivityData}){
    const { themed, globalThemed } = useThemedStyles();
    return (
        <View>
            {data.instruction.map((step) => (
                <View key={step.step} style={styles.step_row}>
                    <View style={[themed.step_number_wrap, styles.step_number_wrap]}>
                        <Text style={[themed.step_number, styles.step_number]}>
                            {step.step}
                        </Text>
                    </View>
                    <Text style={[globalThemed.text, styles.step_text]}>
                        {step.text}
                    </Text>
                </View>
            ))}

            <InfoBox title="📄 Write-Up (On paper)">
                <BulletList items={data.writeUp.question}/>
            </InfoBox>

            <SectionHeading>
                Experiment Results Table
            </SectionHeading>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}>

                <View style={[themed.table, styles.table]}>
                    <View style={[themed.table_header_row, styles.table_header_row]}>
                        <View style={[styles.table_cell_wrap, styles.table_cell_label]}>
                            <Text style={[globalThemed.text, styles.table_cell_text, styles.table_header_text]}>
                                Action
                            </Text>
                        </View>

                        {data.experimentTable.columns.map((col) => (
                            <View key={col} style={styles.table_cell_wrap}>
                                <Text style={[globalThemed.text, styles.table_cell_text, styles.table_header_text]}>
                                    {col}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {data.experimentTable.rows.map((row, i) => (
                        <View
                            key={row.id}
                            style={[styles.table_row, i % 2 !== 0 && [themed.table_row]]}>
                        
                            <View style={[styles.table_cell_wrap, styles.table_cell_label]}>
                                <Text style={[globalThemed.text, styles.table_cell_text, {fontWeight: '600'}]}>
                                    {row.label}
                                </Text>
                            </View>

                            {data.experimentTable.columns.map((col) => (
                                <View key={col} style={styles.table_cell_wrap}>
                                    <Text style={[globalThemed.text, styles.table_cell_text]}>
                                        —
                                    </Text>
                                </View> 
                            ))}
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    )
}

function DiscussionTab({data}: {data: ActivityData}){
    const [expandedCase, setExpandedCase] = useState<number | null>(null);
    const {customSection, riskTable, discussion} = data;
    const { themed, globalThemed } = useThemedStyles();

    return (
        <View>
            <SectionHeading>
                {discussion.title}
            </SectionHeading>
            {discussion.description.map((para, i) => (
                <Text key={i} style={[globalThemed.text, styles.body]}>
                    {para}
                </Text>
            ))}

            <SectionHeading>
                {riskTable.title}
            </SectionHeading>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}>

                <View style={styles.table}>
                    <View style={[themed.table_header_row, styles.table_header_row]}>
                        {riskTable.columns.map((col) => (
                            <View key={col} style={[styles.table_cell_wrap]}>
                                <Text style={[globalThemed.text, styles.table_cell_text, styles.table_header_text]}>
                                    {col}
                                </Text>
                            </View>
                        ))}
                    </View>
                    {riskTable.rows.map((row, i) => (
                        <View key={i} style={[[styles.table_row], i % 2 !== 0 && [themed.table_row]]}>
                            <View style={[styles.table_cell_wrap]}>
                                <Text style={[globalThemed.text, styles.table_cell_text, {fontWeight: '700'}]}>
                                    {row.range}
                                </Text>
                            </View>
                            <View style={[styles.table_cell_wrap]}>
                                <Text style={[globalThemed.text, styles.table_cell_text]}>
                                    {row.example}
                                </Text>
                            </View>
                            <View style={[styles.table_cell_wrap]}>
                                <Text style={[globalThemed.text, styles.table_cell_text]}>
                                    {row.effect}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
            <Text style={[themed.table_important_text, styles.important_text]}>
                ⚠️ {riskTable.important}
            </Text>
        </View>
    )
}

function ActivityDetail({ data } : {data: ActivityData}){
    const [activeSection, setActiveSection] = useState<SectionKey>('overview');
    const [team, setTeam] = useState<TeamRow | null>(null);
    const [teamMembers, setTeamMembers] = useState<string[]>([]);
    const [teamModalVisible, setTeamModalVisible] = useState(false);

    const [room, setRoom] = useState<RoomRow | null>(null);
    const [roomCode, setRoomCode] = useState('');
    const [roomTeamNames, setRoomTeamNames] = useState<string[]>([]);

    const [enterRoomModalVisible, setEnterRoomModalVisible] = useState(false);
    const [roomDetailsModalVisible, setRoomDetailsModalVisible] = useState(false);

    const { id } = useLocalSearchParams<{id: string}>();
    const { userDoc, teamID } = useAuth();

    const { themed, globalThemed } = useThemedStyles();

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

    if (!data){
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.not_found}>
                    <Text style={[globalThemed.text, styles.not_found_text]}>
                        Activity not found.
                    </Text>
                    <TouchableOpacity
                        style={styles.start_button}
                        onPress={() => router.back()}>

                        <Text style={[globalThemed.text, styles.start_button_text]}>
                            Go Back
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        )
    }

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
        <SafeAreaView style={[themed.page, styles.container]}>
            <View style={activityStyles.header}>
                <TouchableOpacity 
                style={[globalThemed.back, globalStyles.back_button]}
                onPress={() => router.push('/pages/student/menu/activityselection')}>
                    <Text style={[globalThemed.text, globalStyles.text]}>{'<'}</Text>
                </TouchableOpacity>
                <View style={activityStyles.header_title_container}>
                    <Text style={[globalThemed.text, activityStyles.header_title]}>
                        {data.course} · Activity {data.id}
                    </Text>
                    <Text style={[globalThemed.text, activityStyles.header_subtitle]}>
                        {data.name}
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

                <Modal
                    visible={teamModalVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setTeamModalVisible(false)}
                >
                    <View style={modalStyles.overlay}>
                        <View style={[themed.modal, modalStyles.container]}>
                            <Text style={[globalThemed.text, modalStyles.title]}>
                                {team?.name ?? 'No Team'} {team ? `#${team.discriminator}` : ''}
                            </Text>

                            {teamMembers.length === 0 ? (
                                <Text style={modalStyles.empty}>No members found</Text>
                            ) : (
                                teamMembers.map((member, i) => (
                                    <View key={i} style={modalStyles.memberRow}>
                                        <Text style={[globalThemed.text, modalStyles.memberIcon]}>👤</Text>
                                        <Text style={[globalThemed.text, modalStyles.memberName]}>{member}</Text>
                                    </View>
                                ))
                            )}

                            <Pressable
                                style={[themed.modal_button, modalStyles.closeButton]}
                                onPress={() => setTeamModalVisible(false)}
                            >
                                <Text style={[globalThemed.text, modalStyles.closeText]}>Close</Text>
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
                        <View style={[themed.modal, modalStyles.container]}>
                            <Text style={[globalThemed.text, modalStyles.title]}>Join a Room</Text>

                            <Text style={[globalThemed.text, modalStyles.label]}>Enter Room Code</Text>
                            <TextInput
                                style={[themed.modal_input, modalStyles.input]}
                                value={roomCode}
                                onChangeText={(text) => setRoomCode(text.toUpperCase())}
                                placeholder="e.g. AB12"
                                placeholderTextColor='#969696'
                                maxLength={4}
                                autoCapitalize="characters"
                            />
                            <Pressable
                                style={[themed.modal_button, modalStyles.primaryButton]}
                                onPress={handleJoinRoom}
                            >
                                <Text style={[globalThemed.text, modalStyles.primaryText]}>Join Room</Text>
                            </Pressable>

                            <View style={modalStyles.divider}>
                                <View style={[globalThemed.separator, modalStyles.dividerLine]}/>
                                <Text style={[globalThemed.text, modalStyles.dividerText]}>or</Text>
                                <View style={[globalThemed.separator, modalStyles.dividerLine]}/>
                            </View>

                            <Pressable
                                style={[themed.modal_button, modalStyles.secondaryButton]}
                                onPress={handleCreateRoom}
                            >
                                <Text style={[globalThemed.text, modalStyles.secondaryText]}>Create Room</Text>
                            </Pressable>

                            <Pressable
                                style={[themed.modal_button, modalStyles.closeButton]}
                                onPress={() => setEnterRoomModalVisible(false)}
                            >
                                <Text style={[globalThemed.text, modalStyles.secondaryText]}>Solo (No Room)</Text>
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
                        <View style={[themed.modal, modalStyles.container]}>
                            <Text style={[globalThemed.text, modalStyles.title]}>Room Details</Text>

                            <View style={[themed.modal_code_box, modalStyles.codeBox]}>
                                <Text style={[globalThemed.text, modalStyles.codeLabel]}>Room Code</Text>
                                <Text style={[globalThemed.text, modalStyles.code]}>{room?.code ?? '-'}</Text>
                            </View>

                            <Text style={[globalThemed.text, modalStyles.label]}>Teams in Room</Text>
                            {roomTeamNames.length === 0 ? (
                                <Text style={modalStyles.empty}>No teams yet</Text>
                            ) : (
                                roomTeamNames.map((name, i) => (
                                    <View key={i} style={modalStyles.teamRow}>
                                        <Text style={[globalThemed.text, modalStyles.teamIcon]}>🏷️</Text>
                                        <Text style={[globalThemed.text, modalStyles.teamName]}>{name}</Text>
                                    </View>
                                ))
                            )}

                            <View style={modalStyles.buttonRow}>
                                <Pressable
                                    style={[themed.modal_button, modalStyles.leaveButton]}
                                    onPress={handleLeaveRoom}
                                >
                                    <Text style={[globalThemed.text, modalStyles.leaveText]}>Leave Room</Text>
                                </Pressable>

                                <Pressable
                                    style={[themed.modal_button, modalStyles.closeButton]}
                                    onPress={() => setRoomDetailsModalVisible(false)}
                                >
                                    <Text style={[globalThemed.text, modalStyles.closeText]}>Close</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>


            <View style={[globalThemed.tab_bar, activityStyles.tab_bar]}>
                {SECTIONS.map((sect) => (
                    <TouchableOpacity
                        key={sect.key}
                        style={[globalStyles.tab, activeSection === sect.key && globalThemed.tab_active]}
                        onPress={() => setActiveSection(sect.key)}
                        activeOpacity={0.75}>

                        <Text style={[globalThemed.tab_label, globalStyles.tab_label]}>
                            {sect.icon}
                        </Text>
                        <Text style={[
                            [globalThemed.tab_label, globalStyles.tab_label],
                            activeSection === sect.key && [globalThemed.tab_label_active, globalStyles.tab_label_active],
                        ]}>
                            {sect.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <ScrollView
                style={[themed.scroll, styles.scroll]}
                contentContainerStyle={[themed.scroll, styles.scroll_content]}
                showsVerticalScrollIndicator={false}>

                {activeSection === 'overview' && <OverviewTab data={data}/>}
                {activeSection === 'equipment' && <EquipmentTab data={data}/>}
                {activeSection === 'instruction' && <InstructionTab data={data}/>}
                {activeSection === 'discussion' && <DiscussionTab data={data}/>}
                <View style={{height: 16}}/>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[themed.button, styles.start_button]}
                    onPress={() => router.push(`/pages/student/startactivity/start${data.id}` as any)}
                    activeOpacity={0.85}>

                    <Text style={[globalThemed.text, styles.start_button_text]}>
                        Start Activity    
                    </Text>        
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default function ActivityPage() {
    const {id} = useLocalSearchParams<{id: string}>();
    const data = activities[id];

    return (
        <>
            <ActivityDetail data={data ?? null} />
            <ToolsPanel/>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    body: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        lineHeight: 22,
        marginBottom: 8,
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
        fontWeight: '600',
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

    not_found: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: 16, 
        padding: 32,
    },

    not_found_text: { 
        fontSize: 16, 
        fontFamily: FONT_FAMILY,
        fontWeight: '600' 
    },

    important_text: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontStyle: 'italic',
        marginTop: 8,
        lineHeight: 18,
    },

    list_wrap: {
        gap: 6,
    },

    list_row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },

    list_dot: {
        width: 8,
        height: 8,
        borderRadius: 5,
        marginTop: 8,
        flexShrink: 0,
    },

    list_text: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        lineHeight: 22,
        flex: 1,
    },

    curriculum_subject: {
        marginBottom: 12,
    },
    
    curriculum_subject_title: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
        marginBottom: 6,
    },

    curriculum_row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        gap: 8,
    },

    curriculum_icon: {
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },

    curriculum_code: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
    },

    curriculum_description: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        flex: 1,
    },

    progress_text: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        fontWeight: '600',
        marginBottom: 12,
        alignSelf: 'center',
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

    equipment_icon_box: {
        width: 44,
        height: 44,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },

    equipment_icon: {
        fontSize: 22,
    },

    equipment_name: {
        flex: 1,
        fontSize: 16,
    },

    equipment_name_checked: {
        flex: 1,
        fontSize: 16,
        fontFamily: FONT_FAMILY,
    },

    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },

    checkbox_tick: {
        fontSize: 14,
        fontWeight: '700',
    },

    table: {
        borderRadius: 10,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#cde',
        marginBottom: 8,
    },  

    table_row: {
        flexDirection: 'row',
    },

    table_header_row: {
        flexDirection: 'row',
    },

    table_cell_wrap: {
        width: 120,
        paddingVertical: 10,
        paddingHorizontal: 8,
        justifyContent: 'center',
    },

    table_cell_label: {
        width: 180,
    },

    table_cell_text: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        lineHeight: 18,
    },

    table_header_text: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
    },

    scroll: {
        flex: 1,
        width: '100%',
    },

    scroll_content: {
        padding: 16,
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
        borderRadius: 16,
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
    },

    footer: {
        width: '100%',
        paddingHorizontal: 16,
        paddingTop: 6,
        paddingBottom: 12,
    },

    start_button: {
        width: '100%',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
    },

    start_button_text: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        fontWeight: '800',
        letterSpacing: 0.3,
    },

})