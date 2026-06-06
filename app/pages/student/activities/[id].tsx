import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';


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

    const [equipment, setEquipment] = useState<string[]>();
    const [instruction, setInstruction] = useState<string[]>();
    const [writeup, setWriteup] = useState<string[]>();
    const [primaryFocus, setPrimaryFocus] = useState<string[]>();
    const [highFocus, setHighFocus] = useState<string[]>();

    const { id } = useLocalSearchParams();

    const toggleCheck = (id: string) => {
        setCheckedItems((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
    };

    return (
        <></>
    );    
}