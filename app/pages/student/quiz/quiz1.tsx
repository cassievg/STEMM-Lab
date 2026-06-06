import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { activityStyles } from '../activities/activityStyles';


type LevelKey = 'primary' | 'highschool';
type QuestionType = 'mcq' | 'calculation';
type Question = {
    id: string;
    type: QuestionType;
    question: string;
    hint?: string;
    options?: string[];
    correctOption?: number;
    correctAnswer?: number;
    errorMargin?: number;
    unit?: string;
    formula?: string;
};

const BLUE = '#97b9d6';
const LIGHT_BLUE = '#afdaff';
const DARK = '#1a2e3d';
const GREEN = '#4caf7d';
const RED = '#e05c5c';
const WHITE = '#ffffff';
const FONT_FAMILY = 'Trebuchet MS, Roboto, sans-serif';

const PRIMARY_QUESTIONS: Question[] = [
    {id: 'p1', type: 'mcq', 
        question: 'What force pulls the toy downard when it falls?',
        options: [
            'Drag', 
            'Gravity', 
            'Friction', 
            'Other',
        ],
        correctOption: 1,
    },
    {id: 'p2', type: 'mcq', 
        question: 'What does a parachute do to the falling toy?',
        options: [
            'Makes it fall faster',
            'Has no effect', 
            'Slows it down', 
            'Pushes it sideways',
        ],
        correctOption: 2,
    },
    {id: 'p3', type: 'mcq', 
        question: 'Which parachute design is likely to slow the toy the most?',
        options: [
            'A very small parachute', 
            'No parachute', 
            'A large wide parachute', 
            'Pushes it sideways',
        ],
        correctOption: 2,
    },
    {id: 'p4', type: 'calculation', 
        question: 'The toy fell 2.0 m in 0.5 s. Calculate the final speed.',
        formula: 'Speed = distance / time',
        hint: 'Divide the distance (2.0 m) by the time (0.5 s)',
        correctAnswer: 4.0,
        unit: 'm/s',
    },
    {
    id: 'p5', type: 'mcq',
        question: 'Why was the toy dropped from the same height each time?',
        options: [
            'To make the toy heavier',
            'To make the test fair',
            'To increase gravity',
            'To save time'
            ],
            correctOption: 1,
    },
    {id: 'p6', type: 'calculation', 
        question: 'A ball fell with a speed of 3.0 m/s and it took 2.0 s to hit the floor, what is the distance travelled by the ball?',
        formula: 'Distance = speed × time',
        hint: 'Multiply the speed (3 m/s) by the time (2.0 s) ',
        correctAnswer: 6.0,
        unit: 'm',
    },
    {id: 'p7', type: 'mcq',
    question: 'What is drag?',
    options: [
        'A force that speeds objects up',
        'A force that opposes motion through air',
        'The same as gravity',
        'A type of parachute'
        ],
        correctOption: 1,
    },
    {id: 'p8', type: 'mcq',
    question: 'Why do engineers test more than one parachute design?',
    options: [
        'To make the toy heavier',
        'To use more materials',
        'To improve the design and compare results',
        'To make the toy fall faster'
        ],
        correctOption: 2,
    },
    {id: 'p9', type: 'calculation',
        question: 'A toy falls 6.0 m with speed of 2.0 m/s . What is the time taken to fall the distance?',
        formula: 'Time = Speed ÷ time',
        correctAnswer: 3.0,
        unit: 's',
    },
    {id: 'p10', type: 'mcq',
        question: 'Which force pulls the toy toward Earth?',
        options: [
            'Drag',
            'Gravity',
            'Lift',
            'Magnetism'
            ],
            correctOption: 1,
    },
]

const HIGH_QUESTIONS: Question[] = [
    {id: 'h1', type: 'calculation', 
        question: 'A toy is dropped from resting position and hits the floor with the final velocity of 4.0 m/s and time of 2.0 s. Calculate the acceleration',
        formula: 'Acceleration = (final velocity - initial velocity) / time',
        hint: 'When the toy is at rest, does it move?',
        correctAnswer: 2.0,
        unit: 'm/s²',
    },
    {id: 'h2', type: 'calculation', 
        question: 'An apple has a mass of 0.20kg and acceleration of 4.0 m/s². Calculate the net force.',
        formula: 'Net Force = mass × acceleration',
        correctAnswer: 0.80,
        unit: 'N',
    },
    {id: 'h3', type: 'calculation', 
        question: 'A watermelon has a mass 10.0 kg. Calculate the weight of the watermelon.',
        formula: 'Weight = mass × g',
        hint: 'What is the gravity on Earth?',
        correctAnswer: 98.1,
        errorMargin: 0.1,
        unit: 'N',
    },
    {id: 'h4', type: 'mcq', 
        question: 'A g-force of 25 g on impact is in which injury range?',
        options: [
            'High risk of servere injury', 
            'Possible bruising', 
            'Serious injuries possible', 
            'Life-threatening injuries likely',
        ],
        correctOption: 2,
    },
    {id: 'h5', type: 'calculation', 
        question: 'A person with weight of 588.6 N with a net force of 200 N. Calculate the drag force.',
        formula: 'Drag Force = Weight - Net Force',
        correctAnswer: 388.6,
        unit: 'N',
    },
    {id: 'h6', type: 'mcq', 
        question: 'Why does bouncing increase the g-force compared to no bounce?',
        options: [
            'The toy is heavier when it bounces', 
            'The velocity changes when it rebound', 
            'The contact time is longer', 
            'Gravity increases during a bounce',
        ],
        correctOption: 1,
    },
    {id: 'h7', type: 'mcq', 
        question: "According to Newton's Second Law, if net force increases and mass stays the same, what happens to acceleration?",
        options: [
            'Mass must change',
            'Acceleration decreases', 
            'Acceleration stays the same', 
            'Acceleration increases', 
        ],
        correctOption: 3,
    },
    {id: 'h8', type: 'calculation',
        question: 'A toy has a mass of 0.30 kg and an acceleration of 5.0 m/s². Calculate the net force.',
        formula: 'Net Force = mass × acceleration',
        correctAnswer: 1.5,
        unit: 'N',
    },
    {id: 'h9', type: 'calculation',
        question: 'A toy has a weight of 4.9 N and a net force of 1.5 N. Calculate the drag force.',
        formula: 'Drag Force = Weight − Net Force',
        correctAnswer: 3.4,
        unit: 'N',
    },
    {id: 'h10',type: 'mcq',
        question: 'Why does a larger parachute usually reduce landing force?',
        options: [
            'It increases gravity',
            'It decreases the toy mass',
            'It increases drag force',
            'It removes acceleration'
            ],
            correctOption: 2,
    },
]

export default function Quiz1() {
    const [level, setLevel] = useState<LevelKey>('primary');
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [showHint, setShowHint] = useState<Record<string,boolean>>({});

    const questions = level === 'primary' ? PRIMARY_QUESTIONS : HIGH_QUESTIONS;

    const setAnswer = (id: string, value: string) => {
        setAnswers((prev) => ({...prev, [id]: value}));
    };

    const toggleHint = (id: string) => {
        setShowHint((prev) => ({...prev, [id]: !prev[id]}));
    };

    const checkAnswer = (q: Question): boolean => {
        const raw = answers[q.id];
        if (raw === undefined || raw === ''){
            return false;
        };
        if (q.type === 'mcq'){
            return parseInt(raw) === q.correctOption;
        };
        if (q.type === 'calculation'){
            const val = parseFloat(raw);
            if (isNaN(val)){
                return false;
            };
            return Math.abs(val - (q.correctAnswer ?? 0)) <= (q.errorMargin ?? 0.01);
        }
        return false;
    };

    const score = submitted ? questions.filter((q) => checkAnswer(q)).length : 0;

    const allAnswered = questions.every((q) => answers[q.id] !== undefined && answers[q.id] !== '');

    const handleSubmit = () => setSubmitted(true);
    const handleRetry = () => {
        setAnswers({});
        setSubmitted(false);
        setShowHint({});
    };

    const getScoreColor = () => {
        const ratio = score / questions.length;
        if (ratio >= 0.8){
            return GREEN;
        };
        if (ratio >= 0.5){
            return BLUE;
        };
        return RED;

    }
    return (
        <SafeAreaView style={activityStyles.page}>
            <View style={activityStyles.header}>
                <TouchableOpacity 
                style={activityStyles.back_button}
                onPress={() => router.push('/pages/student/startactivity/start1')}>
                    <Text>{'<'}</Text>
                </TouchableOpacity>
                <View style={activityStyles.header_title_container}>
                    <Text style={activityStyles.header_title}>
                        Activity 1 · Exercises
                    </Text>
                    <Text style={activityStyles.header_subtitle}>
                        Quiz & Calculations
                    </Text>
                </View>
            </View>

            <View style={localStyles.level_row}>
                <TouchableOpacity
                    style={[localStyles.level_button, level === 'primary' && localStyles.level_button_active]}
                    onPress={() => {setLevel('primary'); handleRetry();}}
                    activeOpacity={0.8}>

                    <Text style={localStyles.level_icon}>
                        🎒
                    </Text>
                    <Text style={[localStyles.level_label, level === 'primary' && localStyles.level_label_active]}>
                        Primary
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[localStyles.level_button, level === 'highschool' && localStyles.level_button_active]}
                    onPress={() => {setLevel('highschool'); handleRetry();}}
                    activeOpacity={0.8}>

                    <Text style={localStyles.level_icon}>
                        🎓
                    </Text>
                    <Text style={[localStyles.level_label, level === 'highschool' && localStyles.level_label_active]}>
                        High School
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={localStyles.scroll}
                contentContainerStyle={localStyles.scroll_content}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps='handled'>

                {submitted && (
                    <View style={[localStyles.score_card, {borderColor: getScoreColor()}]}>
                        <Text style={[localStyles.score_number, {color: getScoreColor()}]}>
                            {score}/{questions.length}
                        </Text>
                        <Text style={localStyles.score_label}>
                            {score === questions.length ? '🎉 Pefect Score!' 
                            : score >= questions.length * 0.8 ? '🌟 Great work!'
                            : score >= questions.length * 0.5 ? '👍 Good effort!'
                            : '📚 Keep practising!'}
                        </Text>
                        <TouchableOpacity
                            style={localStyles.retry_button}
                            onPress={handleRetry}>

                            <Text style={localStyles.retry_text}>
                                ↺ Try Again
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {questions.map((q, index) => {
                    const answered = answers[q.id] !== undefined && answers[q.id] !== '';
                    const correct = submitted && checkAnswer(q);
                    const wrong = submitted && answered && !checkAnswer(q);

                    return (
                        <View
                            key={q.id}
                            style={[localStyles.question_card, 
                                submitted && correct && localStyles.question_card_correct,
                                submitted && wrong && localStyles.question_card_wrong]}>

                            <View style={localStyles.question_header}>
                                <View style={[localStyles.question_number, 
                                    submitted && correct && {backgroundColor: GREEN},
                                    submitted && wrong && {backgroundColor: RED}]}>
                                    
                                    <Text style={localStyles.question_number_text}>
                                        {submitted ? (correct ? '✓' : '✗') : index + 1}
                                    </Text>
                                </View>
                                <View style={localStyles.question_type_icon}>
                                    <Text style={localStyles.question_type_text}>
                                        {q.type === 'mcq' ? '🔘 MCQ' : '🔢 Calculation'}
                                    </Text>
                                </View>
                            </View>

                            <Text style={localStyles.question_text}>
                                {q.question}
                            </Text>

                            {q.formula && (
                                <View style={localStyles.formula_chip}>
                                    <Text style={localStyles.formula_text}>
                                        📐 {q.formula}
                                    </Text>
                                </View>
                            )}

                            {q.hint && !submitted && (
                                <TouchableOpacity
                                    onPress={() => toggleHint(q.id)}
                                    style={localStyles.hint_button}>

                                    <Text style={localStyles.hint_button_text}>
                                        {showHint[q.id] ? 'Hide hint' : 'Show hint'}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            {showHint[q.id] && !submitted && (
                                <View style={localStyles.hint_container}>
                                    <Text style={localStyles.hint_text}>
                                        {q.hint}
                                    </Text>
                                </View>
                            )}

                            {q.type === 'mcq' && q.options && (
                                <View style={localStyles.option_list}>
                                    {q.options.map((mcq, i) => {
                                        const selected = answers[q.id] === String(i);
                                        const isCorrect = i === q.correctOption;

                                        return (
                                            <TouchableOpacity
                                                key={i}
                                                style={[localStyles.option,
                                                    selected && localStyles.option_selected,
                                                    submitted && isCorrect && localStyles.option_correct,
                                                    submitted && selected && !isCorrect && localStyles.option_wrong,]}
                                                onPress={() => !submitted && setAnswer(q.id, String(i))}
                                                activeOpacity={submitted ? 1 : 0.7}>

                                                <View style={[
                                                    localStyles.option_dot,
                                                    selected && localStyles.option_dot_selected,
                                                    submitted && isCorrect && {backgroundColor: GREEN, borderColor: GREEN},
                                                    submitted && selected && !isCorrect && {backgroundColor: RED, borderColor: RED},]}/>
                                                
                                                <Text style={[
                                                    localStyles.option_text,
                                                    submitted && isCorrect && {color: GREEN, fontWeight: '700'},
                                                    submitted && selected && !isCorrect && {color: RED},]}>
                                                    {mcq}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            )}

                            {(q.type === 'calculation') && (
                                <View style={localStyles.calculation_row}>
                                    <TextInput
                                        style={[
                                            localStyles.calculation_input,
                                            submitted && correct && localStyles.calculation_input_correct,
                                            submitted && !correct && answers[q.id] && localStyles.calculation_input_wrong,]}
                                        placeholder='Your answer'
                                        placeholderTextColor='#969696'
                                        keyboardType='decimal-pad'
                                        value={answers[q.id] ?? ''}
                                        onChangeText={(value) => !submitted && setAnswer(q.id, value)}
                                        editable={!submitted}/>
                                    
                                    {q.unit && (
                                        <View style={localStyles.unit_icon}>
                                            <Text style={localStyles.unit_text}>
                                                {q.unit}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            )}

                            {submitted && wrong && q.type !== 'mcq' && (
                                <Text style={localStyles.correct_answer_text}>
                                    ✓ Correct answer: {q.correctAnswer} {q.unit}
                                </Text>
                            )}

                        </View>
                    )
                })}

                {!submitted && (
                    <TouchableOpacity
                        style={[localStyles.submit_button, !allAnswered && localStyles.submit_button_disabled]}
                        onPress={handleSubmit}
                        disabled={!allAnswered}
                        activeOpacity={0.85}>

                        <Text style={localStyles.submit_text}>
                            {allAnswered ? 'Submit Answers' : `Answer all ${questions.length} questions to submit`}
                        </Text>
                    </TouchableOpacity>
                )}

                <View style={{height: 8}}/>
            </ScrollView>
        </SafeAreaView>
    );    
}

const localStyles = StyleSheet.create({
    level_row: {
        flexDirection: 'row',
        backgroundColor: WHITE,
        borderBottomWidth: 1,
        borderBottomColor: WHITE,
    },

    level_button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        gap: 6,
        borderBottomWidth: 2,
        borderColor: 'transparent',
    },

    level_button_active: {
        borderBottomColor: BLUE,
    },

    level_icon: {
        fontSize: 18,
    },

    level_label: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        fontWeight: '500',
    },

    level_label_active: {
        fontSize: 18,
        fontFamily: FONT_FAMILY,
        color: BLUE,
        fontWeight: '700',
    },

    scroll: {
        flex: 1,
    },

    scroll_content: {
        padding: 16,
    },

    score_card: {
      borderBlockColor: WHITE,
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
        color: DARK,
        fontWeight: '600',
    },

    retry_button: {
        marginTop: 8,
        backgroundColor: BLUE,
        borderRadius: 10,
        paddingHorizontal: 24,
        paddingVertical: 10,
    },

    retry_text: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
        color: WHITE,
    },

    question_card: {
        backgroundColor: WHITE,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: LIGHT_BLUE,
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
        backgroundColor: BLUE,
        alignItems: 'center',
        justifyContent: 'center',
    },

    question_number_text: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        color: WHITE,
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
        backgroundColor: LIGHT_BLUE,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderLeftWidth: 3,
        borderLeftColor: BLUE,
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
        color: BLUE,
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
        borderColor: LIGHT_BLUE,
    },

    option_selected:{
        borderColor: BLUE,
        backgroundColor: LIGHT_BLUE,
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
        borderColor: DARK,
        flexShrink: 0,
    },

    option_dot_selected: {
        backgroundColor: BLUE,
        borderColor: BLUE,
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
        borderColor: LIGHT_BLUE,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        color: DARK,
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
        backgroundColor: BLUE,
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },

    unit_text: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        color: WHITE,
        fontWeight: '700',
    },

    correct_answer_text: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        color: GREEN,
        fontWeight: '600',
    },

    submit_button: {
        backgroundColor: WHITE,
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
    },

    submit_button_disabled: {
        backgroundColor: '#b0c8d8',
    },

    submit_text: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        color: DARK,
        fontWeight: '800',
        letterSpacing: 0.5,
    }
    
});