import { globalColors, globalStyles } from '@/app/styles';
import { useTheme } from '@/src/context/ThemeContext';
import { ThemeKey } from '@/src/context/ThemeContext.d';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, PanResponder, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ToolsPanel from '../tools/panel';
import { localColors, localStyles } from './startStyles';

type AttemptKey = 'action1' | 'action2' | 'action3';

type RTState = 'idle' | 'waiting' | 'ready' | 'result';

type AttemptData = {
    prediction: string,
    outcome: string,
    isUserCorrect: 'yes' | 'no' | null;
};

const TABS: {key: AttemptKey; label: string; description: string}[] = [
    {key: 'action1', label: 'Movement 1', description: 'First movement'},
    {key: 'action2', label: 'Movement 2', description: 'Second movement'},
    {key: 'action3', label: 'Movement 3', description: 'Third movement'},
];

const DEFAULT_ATTEMPT: AttemptData = {
    prediction: '',
    outcome: '',
    isUserCorrect: null,
};

const isAttemptComplete = (attempt: AttemptData) => 
    attempt.prediction.trim() !== '' &&
    attempt.outcome.trim() !== '' &&
    attempt.isUserCorrect !== null

type TracingState = 'idle'| 'countdown' | 'running' | 'done';

type Point = { x: number; y:number }

const CANVAS_WIDTH = 320;
const CANVAS_HEIGHT = 220;
const BALL_RADIUS = 16;
const TOTAL_STEPS = 15;
const STEP_MS = 800;
const PAD = 4;

function generatePath(): Point[] {
    const minX = PAD;
    const maxX = CANVAS_WIDTH - BALL_RADIUS * 2 - PAD;
    const minY = PAD;
    const maxY = CANVAS_HEIGHT - BALL_RADIUS * 2 - PAD;
 
    const points: Point[] = [];
    points.push({ x: minX, y: (CANVAS_HEIGHT - BALL_RADIUS * 2) / 2 });
 
    for (let i = 1; i < TOTAL_STEPS; i++) {
        const x = minX + (i / (TOTAL_STEPS - 1)) * (maxX - minX);
        const y = minY + Math.random() * (maxY - minY);
        points.push({ x, y });
    }
    return points;
}

function getAccuracy(ballPath: Point[], userPath: Point[]): number {
    if (userPath.length === 0) {
        return 0;
    };

    let matched = 0

    for (const bp of ballPath){
        let minDistance = Infinity;
        for (const up of userPath){
            const distance = Math.sqrt((bp.x - up.x) ** 2 + (bp.y - up.y) ** 2);
            if (distance < minDistance) {
                minDistance = distance;
            };
        }
        if (minDistance < 40){
            matched++;
        }
    }

    return Math.round((matched / ballPath.length) * 100);
}

function getDelay(ballTimestamps: number[], firstUserTouch: number | null): number {
    if (firstUserTouch === null || ballTimestamps.length === 0){
        return 0;
    };
    return Math.max(0, Math.round(firstUserTouch - ballTimestamps[0]));
}

type TracingResult = {
    accuracy: number;
    delay: number;
    rating: string;
};


function TracingChallenge({ onComplete } : {onComplete: (result: TracingResult) => void}){
    const { theme } = useTheme();
    const themed = globalColors[theme as ThemeKey];
    const localThemed = localColors[theme as ThemeKey];

    const [tracingState, setTracingState] = useState<TracingState>('idle');
    const [countdown, setCountdown] = useState(3);
    const [result, setResult] = useState<TracingResult | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const animRef = useRef<Animated.CompositeAnimation | null>(null);

    const ballAnimation = useRef(new Animated.ValueXY({
        x: BALL_RADIUS + 10,
        y: CANVAS_HEIGHT / 2,
    })).current;

    const pathRef = useRef<Point[]>([]);
    const userPathRef = useRef<Point[]>([]);
    const ballTimestampsRef = useRef<number[]>([]);
    const firstTouchRef = useRef<number | null>(null);
    const stepRef = useRef(0);
    const canvasRef = useRef<View>(null);

    const beginAnimation = () => {
        setTracingState('running');
        const path = pathRef.current;
        
        ballAnimation.setValue({x:path[0].x, y:path[0].y});
        ballTimestampsRef.current = [Date.now()];

        const steps = path.slice(1).map((point, i) =>(
            Animated.timing(ballAnimation, {
                toValue: {x: point.x, y:point.y},
                duration: STEP_MS,
                easing: Easing.inOut(Easing.ease),
                useNativeDriver: false,
            })
        ));

        let currentStep = 0;
        const id = ballAnimation.addListener(() => {
            const expectedStep = Math.floor((Date.now() - ballTimestampsRef.current[0]) / STEP_MS);
            if (expectedStep > currentStep && expectedStep < path.length){
                currentStep = expectedStep;
                ballTimestampsRef.current[currentStep] = Date.now();
            }
        });

        animRef.current = Animated.sequence(steps);
        animRef.current.start(({finished}) => {
            ballAnimation.removeListener(id);
            if (finished){
                finishRun();
            }
        })
    };

    const finishRun = () => {
        setTracingState('done');
        const accuracy = getAccuracy(pathRef.current, userPathRef.current);
        const delay = getDelay(ballTimestampsRef.current, firstTouchRef.current);
        const rating = 
            accuracy >= 95 ? 'Amazing!' :
            accuracy >= 80 ? 'Excellent!':
            accuracy >= 60 ? 'Good!' :
            accuracy >= 40 ? 'Not bad!' :
            'Keep Practicing!'

        const r: TracingResult = {accuracy: accuracy, delay, rating};
        setResult(r);
        onComplete(r);
    };

    const startRun = () => {
        if (animRef.current){
            animRef.current.stop();
        }
        pathRef.current = generatePath();
        userPathRef.current = [];
        ballTimestampsRef.current = [];
        firstTouchRef.current = null;
        setResult(null);
        setCountdown(3);
        setTracingState('countdown');

        ballAnimation.setValue({x: pathRef.current[0].x, y: CANVAS_HEIGHT / 2});
        stepRef.current = 0;

        let c = 3;
        const countdownInterval = setInterval(() => {
            c--;
            setCountdown(c);
            if (c <= 0){
                clearInterval(countdownInterval);
                beginAnimation();
            }
        }, 1000)
    }

    const tracingStateRef = useRef(tracingState);
    useEffect(() => {tracingStateRef.current =  tracingState;}, [tracingState]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => tracingStateRef.current === 'running',
            onMoveShouldSetPanResponder: () => tracingStateRef.current === 'running',
            onPanResponderGrant: (evt) => {
                if (firstTouchRef.current === null){
                    firstTouchRef.current = Date.now();
                }
                const {locationX,locationY} = evt.nativeEvent;
                userPathRef.current.push({x: locationX, y: locationY});
            },
            onPanResponderMove: (evt) => {
                const {locationX, locationY} = evt.nativeEvent;
                userPathRef.current.push({x: locationX, y: locationY});
            }
        })
    ).current;

    useEffect(() => () => { 
        if (animRef.current) animRef.current.stop();
        if (timerRef.current) clearTimeout(timerRef.current); 
    }, []);

    const ratingColor = 
        result?.accuracy !== undefined ? result.accuracy >= 95 ? '#58c300':
        result.accuracy >= 80 ? '#3B6D11':
        result.accuracy >= 60 ? '#BA7517':
        '#A32D2D':
        '#444';

    return (
        <View style={localStyles.tracing_container}>
            <Text style={[themed.text, localStyles.section_heading]}>
                🎯 Tracing Challenge
            </Text>
            <Text style={[themed.text,localStyles.tracing_header_text]}>
                Follow the moving ball with your finger as closely as possible.
            </Text>

            <View
                ref={canvasRef}
                style={[localStyles.tracing_canvas, localThemed.tracing_canvas, {
                    width: CANVAS_WIDTH,
                    height: CANVAS_HEIGHT,
                }]}
                {...(tracingState === 'running' ? panResponder.panHandlers: {})}>

                {(tracingState === 'countdown') && countdown > 0 && (
                    <Text style={[localStyles.countdown_text, localThemed.countdown_text]}>
                        {countdown}
                    </Text>
                )}

                {tracingState === 'running' && (
                    <Animated.View
                        style={[localStyles.trace_ball,localThemed.trace_ball, {
                            width: BALL_RADIUS * 2,
                            height: BALL_RADIUS * 2,
                            borderRadius: BALL_RADIUS,
                            transform: [
                                {translateX: ballAnimation.x},
                                {translateY: ballAnimation.y},
                            ],
                        }]}
                    />
                )}

                {tracingState === 'done' && (
                    <View style={localStyles.trace_complete_canvas}>
                        <Text style={{fontSize: 32}}>
                            ✅
                        </Text>
                        <Text style={[themed.text, localStyles.trace_complete_canvas_text]}>
                            Done!
                        </Text>
                    </View> 
                )}
            </View>

            {tracingState === 'idle' && (
                <TouchableOpacity
                    style={[localStyles.button, localThemed.start_tracing_button, localStyles.start_tracing_button]}
                    onPress={startRun}
                    activeOpacity={0.85}>

                    <Text style={[themed.text, localStyles.buttonText]}>
                        ▶  Start Tracing
                    </Text>
                </TouchableOpacity>
            )}
            
            {tracingState === 'running' && (
                <Text style={[themed.text, localStyles.trace_ball_text]}>
                    Keep your finger on the ball!
                </Text>
            )}

            {result && (
                <View style={[localStyles.trace_result, localThemed.trace_result,{width: CANVAS_WIDTH}]}>

                    <Text style={[localStyles.trace_result_rating, {color: ratingColor}]}>
                        {result.rating}
                    </Text>

                    <View style={localStyles.trace_result_wrap}>
                        <View style={{alignItems: 'center'}}>
                            <Text style={[themed.text, localStyles.trace_results]}>
                                {result.accuracy} %
                            </Text>
                            <Text style={[themed.text, localStyles.trace_results_unit]}>
                                Accuracy
                            </Text>
                        </View> 
                        <View style={{alignItems: 'center'}}>
                            <Text style={[themed.text, localStyles.trace_results]}>
                                {result.delay} ms
                            </Text>
                            <Text style={[themed.text, localStyles.trace_results_unit]}>
                                Reaction Delay
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[localStyles.button, localStyles.trace_retry_button, localThemed.trace_retry_button]}
                        onPress={startRun}
                        activeOpacity={0.85}>

                        <Text style={[localStyles.buttonText, themed.text]}>
                            ↻ Try Again
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}

const isTracingComplete = (result: TracingResult | null) => result !== null;

export default function StartActivity1() {
    const { theme } = useTheme();
    
    const themed = globalColors[theme as ThemeKey];
    const localThemed = localColors[theme as ThemeKey];

    const [activeTab, setActiveTab] = useState<AttemptKey>('action1');
    const [attempt, setAttempt] = useState<Record<AttemptKey, AttemptData>>({
        action1: {...DEFAULT_ATTEMPT},
        action2: {...DEFAULT_ATTEMPT},
        action3: {...DEFAULT_ATTEMPT},
    });

    const [tracingResult, setTracingResult] = useState<TracingResult | null>(null);

    const [state, setState] = useState<RTState>('idle');
    const [reactionMs, setReactionMs] = useState<number | null>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const startRef = useRef<number>(0);

    const handlePress = () => {
        if (state === 'idle' || state === 'result') {
            setState('waiting');
            setReactionMs(null);
            const delay = 3000 + Math.random() * 7000;
            timerRef.current = setTimeout(() => {
                setState('ready');
                startRef.current = Date.now();
            }, delay);
        } else if (state === 'waiting') {
            if (timerRef.current) clearTimeout(timerRef.current);
            setState('idle');
        } else if (state === 'ready') {
            const ms = Date.now() - startRef.current;
            setReactionMs(ms);
            setState('result');
        }
    }



    const hint =
        state === 'idle'   ? 'Tap to start — react when the button turns green' :
        state === 'waiting'? "Wait for green… (tap to cancel)" :
        state === 'ready'  ? '' :
        reactionMs !== null ? (
            reactionMs < 200 ? 'Excellent!' :
            reactionMs < 300 ? 'Good reaction' :
            reactionMs < 500 ? 'Average' : 'Keep practicing'
        ) : '';

    const btnColor =
        state === 'ready'   ? '#27500A' :
        state === 'result'  ? '#185FA5' :
        state === 'waiting' ? '#e8f4e8' : '#f0f0f0';

    const btnTextColor =
        state === 'ready'  ? '#EAF3DE' :
        state === 'result' ? '#E6F1FB' :
        state === 'waiting'? '#3B6D11' : '#444';

    const btnLabel =
        state === 'idle'    ? '▶  Start test' :
        state === 'waiting' ? '⏳  Get ready…' :
        state === 'ready'   ? '⚡  Tap now!' :
        '🔁  Tap to try again';

    const updateField = (field : keyof AttemptData, value: any) => {
        setAttempt((prev) => ({
            ...prev,
            [activeTab]: {
                ...prev[activeTab], [field]: value,
            },
        }));
    };

    const handleSubmit = () => {
        router.push('/pages/student/quiz/quiz6');
    };

    const current = attempt[activeTab];

    const completeCount = 
    (isAttemptComplete(attempt['action1']) ? 1 : 0) +
    (isAttemptComplete(attempt['action2']) ? 1 : 0) +
    (isTracingComplete(tracingResult) ? 1 : 0);

    const isTabComplete = (key : AttemptKey) => {
        if (key === 'action3'){
            return isTracingComplete(tracingResult);
        };
        return isAttemptComplete(attempt[key]);
    };
                            
    return (
        <SafeAreaView style={[themed.page, localStyles.page]}>
            <View style={[localThemed.header_container, localStyles.header]}>
                <TouchableOpacity 
                style={[themed.back, localStyles.back_button]}
                onPress={() => router.back()}>
                    <Text style={themed.text}>{'<'}</Text>
                </TouchableOpacity>
                <View style={localStyles.header_title_container}>
                    <Text style={[themed.text, localStyles.header_title]}>
                        Activity 6 · In Progress
                    </Text>
                    <Text style={[themed.text, localStyles.header_subtitle]}>
                        Reaction Board Challenge
                    </Text>
                </View>
                <View style={[themed.white_background, localStyles.header_progress]}>
                    <Text style={[themed.text, localStyles.header_progress_text]}>
                        {completeCount}/3
                    </Text>
                </View>
            </View>

            <View style={[themed.tab_bar, localStyles.tab_row]}>
                {TABS.map((tab) => {
                    const complete = isTabComplete(tab.key);
                    return(
                        <TouchableOpacity
                            key={tab.key}
                            style={[globalStyles.tab, activeTab === tab.key && themed.tab_active]}
                            onPress={() => setActiveTab(tab.key)}
                            activeOpacity={0.75}>
                                
                                <Text style={localStyles.tab_complete}>
                                    {complete ? '✅' : '⬜'}
                                </Text>
                                <Text style={[[themed.tab_label, globalStyles.tab_label], activeTab === tab.key && [themed.tab_label_active, globalStyles.tab_label_active]]}>
                                    {tab.label}
                                </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <View style={[localThemed.header_container, localStyles.attempt_description_container]}>
                <Text style={[themed.text, localStyles.attempt_description]}>
                    {TABS.find((t) => t.key === activeTab)?.description}
                </Text>
            </View>

            <ScrollView
                style={[themed.white_background, localStyles.scroll]}
                contentContainerStyle={localStyles.scroll_content}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps='handled'>

                    {activeTab === 'action3' ? (
                        <>
                            <TracingChallenge onComplete={(r) => setTracingResult(r)}/>

                            {tracingResult && (
                            <View style={localStyles.trace_show_result_wrap}>
                                <Text style={[themed.text, localStyles.section_heading]}>
                                    📋 Your Best Result
                                </Text>
                                <View style={localStyles.input_container}>
                                    <Text style={[themed.text, localStyles.input_label]}>
                                        Tracing Accuracy
                                    </Text>
                                    <View style={localStyles.input_row}>
                                        <View style={[themed.white_background, localStyles.input, {justifyContent: 'center'}]}>
                                            <Text style={[themed.text,localStyles.trace_show_resuls]}>
                                                {tracingResult.accuracy}
                                            </Text>
                                        </View>
                                            <Text style={[themed.text, localStyles.input_unit]}>
                                                %
                                            </Text>
                                    </View>
                                </View>
                                <View style={localStyles.input_container}>
                                    <Text style={[themed.text, localStyles.input_container]}>
                                        Reaction Delay
                                    </Text>
                                    <View style={localStyles.input_row}>
                                        <View style={[themed.white_background, localStyles.input, {justifyContent: 'center'}]}>
                                            <Text style={[themed.text,localStyles.trace_show_resuls]}>
                                                {tracingResult.delay} 
                                            </Text>
                                        </View>
                                            <Text style={[themed.text, localStyles.input_unit]}>
                                                ms
                                            </Text>
                                    </View>
                                </View>
                                <View style={localStyles.input_container}>
                                    <Text style={[themed.text, localStyles.input_container]}>
                                        Rating
                                    </Text>
                                    <View style={localStyles.input_row}>
                                        <View style={[themed.white_background, localStyles.input, {justifyContent: 'center'}]}>
                                            <Text style={[themed.text,localStyles.trace_show_resuls]}>
                                                {tracingResult.rating}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}
                        </>
                    ) : (
                        <>
                            <Text style={[themed.text, localStyles.section_heading]}>
                                ⏱️ Reaction Time
                            </Text>

                            <Text style={[themed.text, localStyles.timeDisplay]}>{reactionMs !== null ? `${reactionMs} ms` : '—'}</Text>

                            <TouchableOpacity
                            style={[localStyles.button, {backgroundColor:btnColor}]}
                            onPress={handlePress}
                            activeOpacity={0.85}>
                                <Text style={[localStyles.buttonText, {color:btnTextColor}]}>{btnLabel}</Text>
                            </TouchableOpacity>

                            {hint ? (
                                <Text style={[themed.text, localStyles.hint]}>{hint}</Text>
                            ) : null}

                            <Text style={[themed.text, localStyles.section_heading]}>
                                📊 Record Results
                            </Text>

                            <View style={localStyles.input_container}>
                                <Text style={[themed.text, localStyles.input_label]}>
                                    Milisecond (Prediction)
                                </Text>
                                <View style={localStyles.input_row}>
                                    <TextInput 
                                        style={[themed.white_background, localStyles.input]}
                                        placeholder='e.g. 300'
                                        placeholderTextColor='#969696'
                                        keyboardType='decimal-pad'
                                        value={current.prediction}
                                        onChangeText={(val) => updateField('prediction', val)}>
                                    </TextInput>
                                    <Text style={[themed.text, localStyles.input_unit]}>
                                        ms
                                    </Text>
                                </View>
                            </View>

                            <View style={localStyles.input_container}>
                                <Text style={[themed.text, localStyles.input_label]}>
                                    Outcome (Time)
                                </Text>
                                <View style={localStyles.input_row}>
                                    <TextInput 
                                        style={[themed.white_background, localStyles.input]}
                                        placeholder='e.g. 250'
                                        placeholderTextColor='#969696'
                                        keyboardType='decimal-pad'
                                        value={current.outcome}
                                        onChangeText={(val) => updateField('outcome', val)}>
                                    </TextInput>
                                    <Text style={[themed.text, localStyles.input_unit]}>
                                        ms
                                    </Text>
                                </View>
                            </View>

                            <View style={localStyles.input_container}>
                                <Text style={[themed.text, localStyles.input_label]}>
                                    Were you right with your prediction?
                                </Text>
                                <View style={localStyles.toggle_row}>
                                    <TouchableOpacity
                                        style={[[themed.white_background, localStyles.toggle_button], current.isUserCorrect === 'yes' && themed.pressable_default]}
                                        onPress={() => updateField('isUserCorrect', 'yes')}>

                                        <Text style={[[themed.text, localStyles.toggle_text], current.isUserCorrect === 'yes' && [themed.text, localStyles.toggle_text_active]]}>
                                            ✔ Yes
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[[themed.white_background, localStyles.toggle_button], current.isUserCorrect === 'no' && themed.pressable_default]}
                                        onPress={() => updateField('isUserCorrect', 'no')}>

                                        <Text style={[[themed.text, localStyles.toggle_text], current.isUserCorrect === 'no' && [themed.text, localStyles.toggle_text_active]]}>
                                            ✖ No
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </>
                    )}
                    
                    <View style={{height: 32}}/>
            </ScrollView>

            <View style={[themed.white_background, localStyles.footer]}>
                {completeCount === 3 ? (
                    <TouchableOpacity
                        style={[localThemed.start_button, localStyles.submit_button]}
                        onPress={handleSubmit}
                        activeOpacity={0.85}>

                        <Text style={localStyles.submit_button_text}>
                            Proceed to Quiz
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[themed.pressable_default, localStyles.next_button]}
                        onPress={() => {
                            const i = TABS.findIndex((t) => t.key === activeTab);
                            if (i < TABS.length - 1) {
                                setActiveTab(TABS[i + 1].key);
                            }
                        }}
                        activeOpacity={0.85}>

                        <Text style={localStyles.next_button_text}>
                            {activeTab === 'action3' ? 'Review All' : 'Next Attempt →'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
            <ToolsPanel />
        </SafeAreaView>
    );    
}