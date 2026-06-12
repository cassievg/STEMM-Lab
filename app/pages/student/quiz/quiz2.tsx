import { globalColors, globalStyles } from '@/app/styles';
import { useAuth } from '@/src/context/AuthContext';
import { useTheme } from '@/src/context/ThemeContext';
import { ThemeKey } from '@/src/context/ThemeContext.d';
import { completeActivity, getRoomByTeamAndActivity } from '@/src/services/firebaseServices';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { quizColors, quizStyle } from './quizStyle';

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

const GREEN = '#4caf7d';
const RED = '#e05c5c';

const PRIMARY_QUESTIONS: Question[] = [
    {id: 'p1', type: 'mcq', 
        question: 'What unit is used to measure sound level?',
        options: [
            'Hertz (Hz)', 
            'Decibel (dB)', 
            'Newton (N)', 
            'Meter (m)',
        ],
        correctOption: 1,
    },
    {id: 'p2', type: 'mcq', 
        question: 'What does "sound intensity" depend on?',
        options: [
            'Only the colour of the object making the sound',
            'The energy of the sound and the surfaces around it', 
            'Only the size of the room', 
            'The temperature of the air',
        ],
        correctOption: 1,
    },
    {id: 'p3', type: 'mcq', 
        question: 'A library has a sound level of around 25 dB. What is the hearing risk?',
        options: [
            'Hearing damage likely after short exposure', 
            'Painful; immediate damage possible', 
            'Safe for long periods', 
            'No risk',
        ],
        correctOption: 3,
    },
    {id: 'p4', type: 'mcq', 
        question: 'A normal classroom conversation sits around 45 dB. What is the risk level?',
        options: [
            'Safe for long periods', 
            'No risk', 
            'Hearing damage possible after long exposure', 
            'Serious hearing damage in minutes',
        ],
        correctOption: 0,
    },
    {
    id: 'p5', type: 'mcq',
        question: 'A lawnmower produces roughly 88 dB. What is the likely hearing risk?',
        options: [
            'No risk',
            'Safe for long periods',
            'Hearing damage possible after long exposure',
            'Instant, permanent hearing damage'
            ],
            correctOption: 2,
    },
    {
    id: 'p6', type: 'mcq',
        question: 'You are standing near an active siren at close range. What should you expect?',
        options: [
            'No risk — it is only a siren',
            'Safe for long periods',
            'Hearing damage likely after short exposure',
            'Painful; immediate damage possible'
            ],
            correctOption: 2,
    },
    {id: 'p7', type: 'mcq',
    question: 'A dance club measures 105 dB. How quickly can serious hearing damage occur?',
    options: [
        'Only after many hours',
        'In a matter of minutes',
        'Only if you are standing right next to a speaker',
        'Never — music is not dangerous'
        ],
        correctOption: 1,
    },
    {id: 'p8', type: 'mcq',
    question: 'Which sound source is most likely to cause INSTANT permanent hearing damage?',
    options: [
        'Vacuum cleaner',
        'Power drill',
        'Rock concert',
        'Rocket Explosion'
        ],
        correctOption: 3,
    },
    {id: 'p9', type: 'mcq',
    question: 'Which sound source is most likely to cause INSTANT permanent hearing damage?',
    options: [
        'It only affects elderly people',
        'It has no effect on concentration',
        'It can impact health and concentration',
        'It only matters if you can feel it vibrating'
        ],
        correctOption: 2,
    },
    {id: 'p10', type: 'mcq',
        question: 'Why does the activity ask students to map "loud and quiet zones" around the classroom?',
        options: [
            'To find the best spots for the teacher to stand',
            'To identify areas of high sound exposure that could affect health or focus',
            'Because sound cannot travel between rooms',
            'To measure the size of the room'
            ],
            correctOption: 1,
    },
]

export default function Quiz2() {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [showHint, setShowHint] = useState<Record<string,boolean>>({});
    const scrollViewRef = useRef<ScrollView>(null);

    const { theme } = useTheme();

    const {teamID} = useAuth();
    
    const themed = quizColors[theme as ThemeKey];
    const globalthemed = globalColors[theme as ThemeKey];
    const activityStyles = quizStyle;
    const localStyles = quizStyle;

    const questions = PRIMARY_QUESTIONS;

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

    const handleScrollToTop = () => {
        scrollViewRef.current?.scrollTo({
            y: 0,
            animated: true,
        });
    };

    const score = submitted ? questions.filter((q) => checkAnswer(q)).length : 0;

    const allAnswered = questions.every((q) => answers[q.id] !== undefined && answers[q.id] !== '');

    const answeredCount = questions.filter((q) => answers[q.id] !== undefined && answers[q.id] !== '').length;

    const handleSubmit = async () => {
        setSubmitted(true);
        const score =  questions.filter((q) => checkAnswer(q)).length * 10;

        const roomData = await getRoomByTeamAndActivity(teamID, '2');
        if (roomData) {
            await completeActivity(teamID, '2', roomData?.id, score);
        } else {
            await completeActivity(teamID, '2', null, score);
        }
    };

    const handleRetry = () => {
        setAnswers({});
        setSubmitted(false);
        setShowHint({});
        handleScrollToTop();
    };

    const handleComplete = () => {
        router.push('/pages/student/activities/leaderboards/2')
    };

    useEffect(() => {
    if (submitted) {
        handleScrollToTop();
        }
    }, [submitted]);

    const getScoreColor = () => {
        const ratio = score / questions.length;
        if (ratio >= 0.8){
            return GREEN;
        };
        if (ratio >= 0.5){
            return '#97b9d6';
        };
        return RED;
    }



    return (
        <SafeAreaView style={[globalthemed.page, activityStyles.page]}>
            <View style={activityStyles.header}>
                <TouchableOpacity 
                style={[globalthemed.back, globalStyles.back_button]}
                onPress={() => router.back()}>
                    <Text style={[globalthemed.text, globalStyles.text]}>{'<'}</Text>
                </TouchableOpacity>
                <View style={activityStyles.header_title_container}>
                    <Text style={[globalthemed.text, activityStyles.header_title]}>
                        Activity 2 · Exercises
                    </Text>
                    <Text style={[globalthemed.text, activityStyles.header_subtitle]}>
                        Quiz
                    </Text>
                </View>

                <View style={[themed.header_progress, localStyles.progressContainer]}>
                    <Text style={[globalthemed.text, localStyles.progressText]}>
                        {answeredCount}/{questions.length}
                    </Text>
                </View>
            </View>

            <ScrollView
                ref={scrollViewRef}
                style={localStyles.scroll}
                contentContainerStyle={localStyles.scroll_content}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps='handled'>

                {submitted && (
                    <View style={[localStyles.score_card, {borderColor: getScoreColor()}]}>
                        <Text style={[localStyles.score_number, {color: getScoreColor()}]}>
                            {score}/{questions.length}
                        </Text>
                        <Text style={[globalthemed.text, localStyles.score_label]}>
                            {score === questions.length ? '🎉 Pefect Score!' 
                            : score >= questions.length * 0.8 ? '🌟 Great work!'
                            : score >= questions.length * 0.5 ? '👍 Good effort!'
                            : '📚 Keep practising!'}
                        </Text>
                        <View style={localStyles.button}>
                            <TouchableOpacity
                                style={[themed.retry_button, localStyles.retry_button]}
                                onPress={handleRetry}>

                                <Text style={[globalthemed.text, localStyles.retry_text]}>
                                    ↺ Try Again
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[themed.retry_button, localStyles.retry_button]}
                                onPress={handleComplete}>

                                <Text style={[globalthemed.text, localStyles.retry_text]}>
                                    ✓ Complete
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {questions.map((q, index) => {
                    const answered = answers[q.id] !== undefined && answers[q.id] !== '';
                    const correct = submitted && checkAnswer(q);
                    const wrong = submitted && answered && !checkAnswer(q);

                    return (
                        <View
                            key={q.id}
                            style={[[themed.question_card, localStyles.question_card], 
                                submitted && correct && localStyles.question_card_correct,
                                submitted && wrong && localStyles.question_card_wrong]}>

                            <View style={localStyles.question_header}>
                                <View style={[[themed.question_number, localStyles.question_number], 
                                    submitted && correct && {backgroundColor: GREEN},
                                    submitted && wrong && {backgroundColor: RED}]}>
                                    
                                    <Text style={[globalthemed.text, localStyles.question_number_text]}>
                                        {submitted ? (correct ? '✓' : '✗') : index + 1}
                                    </Text>
                                </View>
                                <View style={localStyles.question_type_icon}>
                                    <Text style={[globalthemed.text, localStyles.question_type_text]}>
                                        {q.type === 'mcq' ? '🔘 MCQ' : '🔢 Calculation'}
                                    </Text>
                                </View>
                            </View>

                            <Text style={[globalthemed.text, localStyles.question_text]}>
                                {q.question}
                            </Text>

                            {q.formula && (
                                <View style={[themed.formula_chip, localStyles.formula_chip]}>
                                    <Text style={[globalthemed.text, localStyles.formula_text]}>
                                        📐 {q.formula}
                                    </Text>
                                </View>
                            )}

                            {q.hint && !submitted && (
                                <TouchableOpacity
                                    onPress={() => toggleHint(q.id)}
                                    style={localStyles.hint_button}>

                                    <Text style={[globalthemed.text, localStyles.hint_button_text]}>
                                        {showHint[q.id] ? 'Hide hint' : 'Show hint'}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            {showHint[q.id] && !submitted && (
                                <View style={localStyles.hint_container}>
                                    <Text style={[globalthemed.text, localStyles.hint_text]}>
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
                                                style={[[themed.option, localStyles.option],
                                                    selected && themed.option_selected,
                                                    submitted && isCorrect && localStyles.option_correct,
                                                    submitted && selected && !isCorrect && localStyles.option_wrong,]}
                                                onPress={() => !submitted && setAnswer(q.id, String(i))}
                                                activeOpacity={submitted ? 1 : 0.7}>

                                                <View style={[
                                                    localStyles.option_dot,
                                                    selected && themed.option_dot_selected,
                                                    submitted && isCorrect && {backgroundColor: GREEN, borderColor: GREEN},
                                                    submitted && selected && !isCorrect && {backgroundColor: RED, borderColor: RED},]}/>
                                                
                                                <Text style={[
                                                    [globalthemed.text, localStyles.option_text],
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
                                            [themed.option, localStyles.calculation_input],
                                            submitted && correct && localStyles.calculation_input_correct,
                                            submitted && !correct && answers[q.id] && localStyles.calculation_input_wrong,]}
                                        placeholder='Your answer'
                                        placeholderTextColor='#969696'
                                        keyboardType='decimal-pad'
                                        value={answers[q.id] ?? ''}
                                        onChangeText={(value) => !submitted && setAnswer(q.id, value)}
                                        editable={!submitted}/>
                                    
                                    {q.unit && (
                                        <View style={[themed.unit_icon, localStyles.unit_icon]}>
                                            <Text style={[globalthemed.text, localStyles.unit_text]}>
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
                        style={[[themed.submit_button, localStyles.submit_button], !allAnswered && themed.submit_button_disabled]}
                        onPress={handleSubmit}
                        disabled={!allAnswered}
                        activeOpacity={0.85}>

                        <Text style={[globalthemed.text, localStyles.submit_text]}>
                            {allAnswered ? 'Submit Answers' : `Answer all ${questions.length} questions to submit`}
                        </Text>
                    </TouchableOpacity>
                )}

                <View style={{height: 8}}/>
            </ScrollView>
        </SafeAreaView>
    );    
}