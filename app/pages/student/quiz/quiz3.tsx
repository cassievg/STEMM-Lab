import { globalColors, globalStyles } from '@/app/styles';
import { useAuth } from '@/src/context/AuthContext';
import { useTheme } from '@/src/context/ThemeContext';
import { ThemeKey } from '@/src/context/ThemeContext.d';
import { completeActivity, getRoomByTeamAndActivity } from '@/src/services/firebaseServices';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
const FONT_FAMILY = 'Trebuchet MS, Roboto, sans-serif';

const PRIMARY_QUESTIONS: Question[] = [
    {
        id: 'p1',
        type: 'mcq',
        question: 'What causes the paper to move during the experiment?',
        options: [
            'Gravity',
            'Air moving from the fan',
            'Magnetism',
            'Heat'
        ],
        correctOption: 1,
    },

    {
        id: 'p2',
        type: 'mcq',
        question: 'Why are different fan designs tested?',
        options: [
            'To use more materials',
            'To compare how design affects air movement',
            'To make the paper heavier',
            'To reduce the effect of air'
        ],
        correctOption: 1,
    },

    {
        id: 'p3',
        type: 'mcq',
        question: 'Which material is expected to bend the least?',
        options: [
            'Thin printer paper',
            'Card stock',
            'Thin cardboard',
            'Corrugated cardboard'
        ],
        correctOption: 3,
    },

    {
        id: 'p4',
        type: 'calculation',
        question: 'A sheet of paper bends by 30°. Convert the angle to radians.',
        formula: 'θ = degrees × π / 180',
        hint: '30 × π ÷ 180',
        correctAnswer: 0.524,
        unit: 'rad',
    },

    {
        id: 'p5',
        type: 'mcq',
        question: 'What happens to the force required to bend a material as stiffness increases?',
        options: [
            'It decreases',
            'It stays the same',
            'It increases',
            'It becomes zero'
        ],
        correctOption: 2,
    },

    {
        id: 'p6',
        type: 'calculation',
        question: 'Thin paper has k = 0.05 N/rad and bends by 0.524 rad. Calculate the force.',
        formula: 'F = k × θ',
        hint: '0.05 × 0.524',
        correctAnswer: 0.026,
        unit: 'N',
    },

    {
        id: 'p7',
        type: 'mcq',
        question: 'Why should the distance from the fan be controlled during testing?',
        options: [
            'To make the test fair',
            'To increase gravity',
            'To reduce stiffness',
            'To stop air movement'
        ],
        correctOption: 0,
    },

    {
        id: 'p8',
        type: 'mcq',
        question: 'What is the main variable being observed in this activity?',
        options: [
            'Paper colour',
            'Bend angle of the material',
            'Table height',
            'Room temperature'
        ],
        correctOption: 1,
    },

    {
        id: 'p9',
        type: 'calculation',
        question: 'A cardboard sheet has k = 0.5 N/rad and bends by 0.524 rad. Calculate the force.',
        formula: 'F = k × θ',
        hint: '0.5 × 0.524',
        correctAnswer: 0.262,
        unit: 'N',
    },

    {
        id: 'p10',
        type: 'mcq',
        question: 'What would most likely happen if the fan is moved farther away from the paper?',
        options: [
            'The paper bends more',
            'The paper bends less',
            'The stiffness increases',
            'The mass increases'
        ],
        correctOption: 1,
    },
];

export default function Quiz3() {
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [showHint, setShowHint] = useState<Record<string,boolean>>({});
    const scrollViewRef = useRef<ScrollView>(null);

    const { theme, changeTheme } = useTheme();

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

        const roomData = await getRoomByTeamAndActivity(teamID, '3');
        if (roomData) {
            await completeActivity(teamID, '3', roomData?.id, score);
        } else {
            await completeActivity(teamID, '3', null, score);
        }
    };

    const handleRetry = () => {
        setAnswers({});
        setSubmitted(false);
        setShowHint({});
        handleScrollToTop();
    };

    const handleComplete = () => {
        router.push('/pages/student/activities/leaderboards/3')
        console.log(`Score: ${score}`)
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
                        Activity 3 · Exercises
                    </Text>
                    <Text style={[globalthemed.text, localStyles.header_subtitle]}>
                        Quiz
                    </Text>
                </View>

                <View style={[globalthemed.simple_button, localStyles.progressContainer]}>
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

const localStyles = StyleSheet.create({
    scroll: {
        flex: 1,
    },

    scroll_content: {
        padding: 16,
    },

    score_card: {
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
        fontWeight: '600',
    },

    button: {
        flexDirection: 'row',
        gap: 16,
    },

    retry_button: {
        marginTop: 8,
        borderRadius: 10,
        paddingHorizontal: 24,
        paddingVertical: 10,
    },

    retry_text: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
    },

    question_card: {
        borderRadius: 14,
        borderWidth: 1,
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
        alignItems: 'center',
        justifyContent: 'center',
    },

    question_number_text: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
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
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderLeftWidth: 3,
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
        flexShrink: 0,
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
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        fontFamily: FONT_FAMILY,
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
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },

    unit_text: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
    },

    correct_answer_text: {
        fontSize: 14,
        fontFamily: FONT_FAMILY,
        color: GREEN,
        fontWeight: '600',
    },

    submit_button: {
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
    },

    submit_text: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        fontWeight: '800',
        letterSpacing: 0.5,
    },

    progressContainer: {
        width: 64,
        height: 64,
        borderRadius: 26,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },

    progressText: {
        fontSize: 16,
        fontFamily: FONT_FAMILY,
        fontWeight: '700',
        textAlign: 'center'
    },
});