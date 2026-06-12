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
    {
        id: 'p1',
        type: 'mcq',
        question: 'What body parts work together to create movement?',
        options: [
            'Muscles and joints',
            'Hair and skin',
            'Teeth and nails',
            'Eyes and ears'
        ],
        correctOption: 0,
    },

    {
        id: 'p2',
        type: 'mcq',
        question: 'What does smoother movement usually indicate?',
        options: [
            'Less coordination',
            'Better coordination',
            'More fatigue',
            'Greater weight'
        ],
        correctOption: 1,
    },

    {
        id: 'p3',
        type: 'mcq',
        question: 'Why does the phone record vibration during the activity?',
        options: [
            'To measure movement quality',
            'To make noise',
            'To charge the phone',
            'To increase speed'
        ],
        correctOption: 0,
    },

    {
        id: 'p4',
        type: 'calculation',
        question: 'Attempt 1 took 20 seconds and Attempt 2 took 5 seconds. How many seconds faster was Attempt 2?',
        formula: 'Difference = larger time - smaller time',
        hint: '20 - 5',
        correctAnswer: 15,
        unit: 's',
    },

    {
        id: 'p5',
        type: 'mcq',
        question: 'What often happens when movements become faster?',
        options: [
            'Control improves',
            'Control may decrease',
            'Muscles disappear',
            'The phone becomes heavier'
        ],
        correctOption: 1,
    },

    {
        id: 'p6',
        type: 'mcq',
        question: 'Why should students repeat the movement several times?',
        options: [
            'To compare results and improve performance',
            'To make the phone vibrate more',
            'To increase gravity',
            'To reduce muscle use'
        ],
        correctOption: 0,
    },

    {
        id: 'p7',
        type: 'calculation',
        question: 'A student completed 3 movement attempts. The times were 18 s, 15 s, and 12 s. How many seconds faster was the final attempt than the first?',
        formula: 'Improvement = first time - final time',
        hint: '18 - 12',
        correctAnswer: 6,
        unit: 's',
    },

    {
        id: 'p8',
        type: 'mcq',
        question: 'What is range of motion?',
        options: [
            'The distance a joint can move',
            'The speed of a phone',
            'The size of a muscle',
            'The weight of a person'
        ],
        correctOption: 0,
    },

    {
        id: 'p9',
        type: 'calculation',
        question: 'Attempt 1 recorded 8 mm of movement and Attempt 2 recorded 5 mm. By how many millimetres was the movement reduced?',
        formula: 'Reduction = first measurement - second measurement',
        hint: '8 - 5',
        correctAnswer: 3,
        unit: 'mm',
    },

    {
        id: 'p10',
        type: 'mcq',
        question: 'What can phone sensors help students learn about?',
        options: [
            'Biomechanics and movement',
            'Weather forecasting',
            'Plant growth',
            'Electric circuits'
        ],
        correctOption: 0,
    },
];

export default function Quiz5() {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [showHint, setShowHint] = useState<Record<string,boolean>>({});
    const scrollViewRef = useRef<ScrollView>(null);

    const { theme } = useTheme();

    const {teamID} = useAuth();

    const themed = quizColors[theme as ThemeKey];
    const globalthemed = globalColors[theme as ThemeKey];
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

        const roomData = await getRoomByTeamAndActivity(teamID, '5');
        if (roomData) {
            await completeActivity(teamID, '5', roomData?.id, score);
        } else {
            await completeActivity(teamID, '5', null, score);
        }
    };

    const handleRetry = () => {
        setAnswers({});
        setSubmitted(false);
        setShowHint({});
        handleScrollToTop();
    };

    const handleComplete = () => {
        router.push('/pages/student/activities/leaderboards/5')
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
        <SafeAreaView style={[globalthemed.page, localStyles.page]}>
            <View style={localStyles.header}>
                <TouchableOpacity 
                style={[globalthemed.back, globalStyles.back_button]}
                onPress={() => router.back()}>
                    <Text style={[globalthemed.text, globalStyles.text]}>{'<'}</Text>
                </TouchableOpacity>
                <View style={localStyles.header_title_container}>
                    <Text style={[globalthemed.text, localStyles.header_title]}>
                        Activity 5 · Exercises
                    </Text>
                    <Text style={[globalthemed.text, localStyles.header_subtitle]}>
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