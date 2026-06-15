import { act, fireEvent, render, screen } from '@testing-library/react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ExpoRouter from 'expo-router';
import React from 'react';
import StartActivity1 from '../app/pages/student/startactivity/start1';

jest.mock('@/src/context/ThemeContext', () => ({
    useTheme: () => ({ theme: 'light', changeTheme: jest.fn() }),
}));

jest.mock('@/src/context/AuthContext', () => ({
    useAuth: () => ({
        userDoc: { role: 'student' },
        teamID: 'team123',
    }),
}));

jest.mock('@react-native-firebase/app', () => ({ default: jest.fn() }));

jest.mock('@react-native-firebase/auth', () => ({
    default: jest.fn(() => ({
        currentUser: null,
        onAuthStateChanged: jest.fn(),
    })),
}));

jest.mock('@react-native-firebase/firestore', () => ({
    default: jest.fn(() => ({
        collection: jest.fn(() => ({
            doc: jest.fn(() => ({
                get: jest.fn(() => Promise.resolve({ exists: false })),
                set: jest.fn(() => Promise.resolve()),
            })),
        })),
    })),
}));

jest.mock('expo-router', () => ({
    router: {
        push: jest.fn(),
        back: jest.fn(),
        replace: jest.fn(),
    },
    useLocalSearchParams: jest.fn(() => ({ id: '1' })),
}));

jest.mock('expo-image-picker', () => ({
    requestCameraPermissionsAsync: jest.fn(),
    launchCameraAsync: jest.fn(),
    MediaTypeOptions: { Videos: 'Videos', All: 'All' },
}));

jest.mock('expo-video', () => ({
    VideoView: () => null,
    useVideoPlayer: jest.fn(() => ({})),
}));

jest.mock('../app/pages/student/tools/panel', () => {
    const { View } = require('react-native');
    const MockToolsPanel = () => <View testID="tools-panel" />;
    MockToolsPanel.displayName = 'MockToolsPanel';
    return MockToolsPanel;
});

jest.mock('@/app/styles', () => ({
    globalStyles: {
        page: {},
        header: {},
        back_button: {},
        text: {},
        tab: {},
        tab_label: {},
        tab_label_active: {},
    },
    globalColors: {
        light: {
            back: {},
            text: {},
            white_background: {},
            black_background: {},
            tab_bar: {},
            tab_active: {},
            tab_label: {},
            tab_label_active: {},
            pressable_default: {},
            light_text: {},
            page: {},
        },
    },
}));

jest.mock('../app/pages/student/startactivity/startStyles', () => ({
    localStyles: {
        page: {},
        container: {},
        header: {},
        tab_row: {},
        tab: {},
        tab_active: {},
        tab_done: {},
        tab_label: {},
        tab_label_active: {},
        tab_complete: {},
        attempt_desc_bar: {},
        attempt_desc: {},
        attempt_description_container: {},
        attempt_description: {},
        scroll: {},
        scroll_content: {},
        section_heading: {},
        video_button: {},
        video_button_done: {},
        video_icon: {},
        video_text: {},
        video_subtext: {},
        video_preview_wrap: {},
        video_preview_container: {},
        video_preview: {},
        video_placeholder: {},
        video_placeholder_icon: {},
        video_placeholder_text: {},
        video_retake_button: {},
        video_retake_text: {},
        timer_box: {},
        timer_display: {},
        timer_container: {},
        timer_button: {},
        timer_buttons: {},
        timer_btn_start: {},
        timer_button_start: {},
        timer_btn_stop: {},
        timer_button_stop: {},
        timer_btn_reset: {},
        timer_button_reset: {},
        timer_btn_use: {},
        timer_button_use: {},
        timer_btn_text: {},
        timer_button_text: {},
        timer_btn_text_dark: {},
        input_container: {},
        field_group: {},
        field_label: {},
        input_label: {},
        input_row: {},
        input: {},
        input_unit: {},
        input_multiline: {},
        toggle_row: {},
        toggle_btn: {},
        toggle_button: {},
        toggle_btn_active: {},
        toggle_text: {},
        toggle_text_active: {},
        footer: {},
        next_button: {},
        next_button_text: {},
        submit_button: {},
        submit_button_text: {},
        back_button: {},
        back_text: {},
        header_text: {},
        header_tag: {},
        header_title: {},
        header_subtitle: {},
        header_title_container: {},
        header_progress: {},
        header_progress_text: {},
        progress_badge: {},
        progress_text: {},
    },
    localColors: {
        light: {
            header_container: {},
            timer_container: {},
            start_button: {},
            stop_button: {},
            reset_button: {},
        },
    },
}));

jest.mock('react-native-safe-area-context', () => ({
    SafeAreaView: ({ children }: any) => children,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

const mockRouterPush = ExpoRouter.router.push as jest.Mock;
const mockRequestCameraPermissionsAsync = ImagePicker.requestCameraPermissionsAsync as jest.Mock;
const mockLaunchCameraAsync = ImagePicker.launchCameraAsync as jest.Mock;

const renderComponent = async () => {
    await act(async () => {
        render(<StartActivity1 />);
    });
};

/**
 * Fills every required field on the currently-visible tab so that
 * isAttemptComplete returns true for it.
 * Caller must NOT pre-set mockRequestCameraPermissionsAsync /
 * mockLaunchCameraAsync — this helper sets them itself.
 */
const completeCurrentTab = async () => {
    await act(async () => {
        fireEvent.changeText(screen.getByPlaceholderText('e.g. 0.80'), '0.80');
    });
    await act(async () => {
        fireEvent.changeText(screen.getByPlaceholderText('e.g. 0.60'), '0.60');
    });
    await act(async () => {
        fireEvent.press(screen.getByText('✔ Yes'));
    });
    await act(async () => {
        fireEvent.changeText(screen.getByPlaceholderText('e.g. 0.15'), '0.15');
    });

    mockRequestCameraPermissionsAsync.mockResolvedValueOnce({ granted: true });
    mockLaunchCameraAsync.mockResolvedValueOnce({
        canceled: false,
        assets: [{ uri: 'file://mock-video.mp4' }],
    });
    await act(async () => {
        fireEvent.press(screen.getByText('Record Drop Video'));
    });
};

describe('StartActivity1', () => {
    beforeAll(() => { jest.useFakeTimers(); });
    afterAll(() => { jest.useRealTimers(); });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });

    describe('Rendering', () => {
        it('renders without crashing', async () => {
            await renderComponent();
            screen.debug();
        });

        it('renders the header with correct title', async () => {
            await renderComponent();
            expect(screen.getByText('Activity 1 · In Progress')).toBeTruthy();
        });

        it('renders all 3 attempt tabs', async () => {
            await renderComponent();
            expect(screen.getByText('Design 1')).toBeTruthy();
            expect(screen.getByText('Design 2')).toBeTruthy();
            expect(screen.getByText('Design 3')).toBeTruthy();
        });

        it('renders progress badge starting at 0/3', async () => {
            await renderComponent();
            expect(screen.getByText(/0\/3|0\s*\/\s*3/)).toBeTruthy();
        });

        it('renders Design 1 description by default', async () => {
            await renderComponent();
            expect(screen.getByText('No parachute (baseline)')).toBeTruthy();
        });

        it('renders all data entry fields', async () => {
            await renderComponent();
            expect(screen.getByPlaceholderText('e.g. 0.80')).toBeTruthy();
            expect(screen.getByPlaceholderText('e.g. 0.60')).toBeTruthy();
            expect(screen.getByPlaceholderText('e.g. 0.15')).toBeTruthy();
            expect(screen.getByPlaceholderText('What did you observe?')).toBeTruthy();
        });

        it('renders the timer display', async () => {
            await renderComponent();
            expect(screen.getByText(/00\.00/)).toBeTruthy();
        });

        it('renders the video record button', async () => {
            await renderComponent();
            expect(screen.getByText('Record Drop Video')).toBeTruthy();
        });

        it('renders "Next Attempt →" button initially', async () => {
            await renderComponent();
            expect(screen.getByText('Next Attempt →')).toBeTruthy();
        });

        it('renders the ToolsPanel', async () => {
            await renderComponent();
            expect(screen.getByTestId('tools-panel')).toBeTruthy();
        });

        it('renders the subtitle "Parachute Drop Challenge"', async () => {
            await renderComponent();
            expect(screen.getByText('Parachute Drop Challenge')).toBeTruthy();
        });

        it('renders unchecked state icons for all tabs initially', async () => {
            await renderComponent();
            const unchecked = screen.getAllByText('⬜');
            expect(unchecked).toHaveLength(3);
        });
    });

    describe('Tab Navigation', () => {
        it('switches to Design 2 and shows correct description', async () => {
            await renderComponent();
            await act(async () => { fireEvent.press(screen.getByText('Design 2')); });
            expect(screen.getByText('Plastic with corners tied')).toBeTruthy();
        });

        it('switches to Design 3 and shows correct description', async () => {
            await renderComponent();
            await act(async () => { fireEvent.press(screen.getByText('Design 3')); });
            expect(screen.getByText('Your own design')).toBeTruthy();
        });

        it('resets the timer when switching tabs', async () => {
            await renderComponent();
            await act(async () => { fireEvent.press(screen.getByText('▶ Start')); });
            await act(async () => { jest.advanceTimersByTime(500); });
            await act(async () => { fireEvent.press(screen.getByText('Design 2')); });
            expect(screen.getByText(/00\.00/)).toBeTruthy();
        });

        it('preserves field values when switching between tabs', async () => {
            await renderComponent();
            await act(async () => {
                fireEvent.changeText(screen.getByPlaceholderText('e.g. 0.80'), '1.23');
            });
            await act(async () => { fireEvent.press(screen.getByText('Design 2')); });
            await act(async () => { fireEvent.press(screen.getByText('Design 1')); });
            expect(screen.getByPlaceholderText('e.g. 0.80').props.value).toBe('1.23');
        });

        it('"Next Attempt →" button advances to Design 2', async () => {
            await renderComponent();
            await act(async () => { fireEvent.press(screen.getByText('Next Attempt →')); });
            expect(screen.getByText('Plastic with corners tied')).toBeTruthy();
        });

        it('"Next Attempt →" on Design 2 advances to Design 3', async () => {
            await renderComponent();
            await act(async () => { fireEvent.press(screen.getByText('Next Attempt →')); });
            await act(async () => { fireEvent.press(screen.getByText('Next Attempt →')); });
            expect(screen.getByText('Your own design')).toBeTruthy();
        });

        it('shows "Review All" instead of "Next Attempt →" on Design 3', async () => {
            await renderComponent();
            await act(async () => { fireEvent.press(screen.getByText('Design 3')); });
            expect(screen.getByText('Review All')).toBeTruthy();
        });
    });

    describe('Timer', () => {
        it('starts counting when Start is pressed', async () => {
            await renderComponent();
            await act(async () => { fireEvent.press(screen.getByText('▶ Start')); });
            await act(async () => { jest.advanceTimersByTime(1000); });
            expect(screen.queryByText(/00\.00/)).toBeNull();
        });

        it('shows Stop button while timer is running', async () => {
            await renderComponent();
            await act(async () => { fireEvent.press(screen.getByText('▶ Start')); });
            expect(screen.getByText('⏹ Stop')).toBeTruthy();
        });

        it('shows Start button again after Stop is pressed', async () => {
            await renderComponent();
            await act(async () => { fireEvent.press(screen.getByText('▶ Start')); });
            await act(async () => { fireEvent.press(screen.getByText('⏹ Stop')); });
            expect(screen.getByText('▶ Start')).toBeTruthy();
        });

        it('resets timer to 00.00 when Reset is pressed', async () => {
            await renderComponent();
            await act(async () => { fireEvent.press(screen.getByText('▶ Start')); });
            await act(async () => { jest.advanceTimersByTime(500); });
            await act(async () => { fireEvent.press(screen.getByText('↺ Reset')); });
            expect(screen.getByText(/00\.00/)).toBeTruthy();
        });

        it('"Use Value" populates the time-to-hit field', async () => {
            await renderComponent();
            await act(async () => { fireEvent.press(screen.getByText('▶ Start')); });
            await act(async () => { jest.advanceTimersByTime(800); });
            await act(async () => { fireEvent.press(screen.getByText('⏹ Stop')); });
            await act(async () => { fireEvent.press(screen.getByText('Use Value')); });
            const timeInput = screen.getByPlaceholderText('e.g. 0.60');
            expect(timeInput.props.value).not.toBe('');
        });
    });

    describe('Input Fields', () => {
        it('updates prediction field on text change', async () => {
            await renderComponent();
            const input = screen.getByPlaceholderText('e.g. 0.80');
            await act(async () => { fireEvent.changeText(input, '1.5'); });
            expect(input.props.value).toBe('1.5');
        });

        it('updates time-to-hit field on text change', async () => {
            await renderComponent();
            const input = screen.getByPlaceholderText('e.g. 0.60');
            await act(async () => { fireEvent.changeText(input, '0.75'); });
            expect(input.props.value).toBe('0.75');
        });

        it('updates slow-motion field on text change', async () => {
            await renderComponent();
            const input = screen.getByPlaceholderText('e.g. 0.15');
            await act(async () => { fireEvent.changeText(input, '0.20'); });
            expect(input.props.value).toBe('0.20');
        });

        it('updates notes field on text change', async () => {
            await renderComponent();
            const input = screen.getByPlaceholderText('What did you observe?');
            await act(async () => { fireEvent.changeText(input, 'The parachute slowed it down.'); });
            expect(input.props.value).toBe('The parachute slowed it down.');
        });

        it('selects "Yes" for prediction correctness', async () => {
            await renderComponent();
            await act(async () => { fireEvent.press(screen.getByText('✔ Yes')); });
            expect(screen.getByText('✔ Yes')).toBeTruthy();
        });

        it('selects "No" for prediction correctness', async () => {
            await renderComponent();
            await act(async () => { fireEvent.press(screen.getByText('✖ No')); });
            expect(screen.getByText('✖ No')).toBeTruthy();
        });

        it('allows toggling between Yes and No', async () => {
            await renderComponent();
            await act(async () => { fireEvent.press(screen.getByText('✔ Yes')); });
            await act(async () => { fireEvent.press(screen.getByText('✖ No')); });
            expect(screen.getByText('✖ No')).toBeTruthy();
        });
    });

    describe('Video Recording', () => {
        it('requests camera permission when record button is pressed', async () => {
            mockRequestCameraPermissionsAsync.mockResolvedValueOnce({ granted: true });
            mockLaunchCameraAsync.mockResolvedValueOnce({ canceled: true });

            await renderComponent();
            await act(async () => { fireEvent.press(screen.getByText('Record Drop Video')); });

            expect(mockRequestCameraPermissionsAsync).toHaveBeenCalledTimes(1);
        });

        it('does not open camera if permission is denied', async () => {
            mockRequestCameraPermissionsAsync.mockResolvedValueOnce({ granted: false });

            await renderComponent();
            await act(async () => { fireEvent.press(screen.getByText('Record Drop Video')); });

            expect(mockLaunchCameraAsync).not.toHaveBeenCalled();
        });

        it('shows Retake Video button after a successful recording', async () => {
            mockRequestCameraPermissionsAsync.mockResolvedValueOnce({ granted: true });
            mockLaunchCameraAsync.mockResolvedValueOnce({
                canceled: false,
                assets: [{ uri: 'file://mock-video.mp4' }],
            });

            await renderComponent();
            await act(async () => { fireEvent.press(screen.getByText('Record Drop Video')); });

            expect(screen.getByText('🔄 Retake Video')).toBeTruthy();
        });

        it('hides the Record button after a successful recording', async () => {
            mockRequestCameraPermissionsAsync.mockResolvedValueOnce({ granted: true });
            mockLaunchCameraAsync.mockResolvedValueOnce({
                canceled: false,
                assets: [{ uri: 'file://mock-video.mp4' }],
            });

            await renderComponent();
            await act(async () => { fireEvent.press(screen.getByText('Record Drop Video')); });

            expect(screen.queryByText('Record Drop Video')).toBeNull();
        });

        it('keeps Record button visible when camera is canceled', async () => {
            mockRequestCameraPermissionsAsync.mockResolvedValueOnce({ granted: true });
            mockLaunchCameraAsync.mockResolvedValueOnce({ canceled: true });

            await renderComponent();
            await act(async () => { fireEvent.press(screen.getByText('Record Drop Video')); });

            expect(screen.getByText('Record Drop Video')).toBeTruthy();
        });

        it('allows re-recording via the Retake button', async () => {
            mockRequestCameraPermissionsAsync
                .mockResolvedValueOnce({ granted: true })
                .mockResolvedValueOnce({ granted: true });
            mockLaunchCameraAsync
                .mockResolvedValueOnce({ canceled: false, assets: [{ uri: 'file://first.mp4' }] })
                .mockResolvedValueOnce({ canceled: false, assets: [{ uri: 'file://second.mp4' }] });

            await renderComponent();
            await act(async () => { fireEvent.press(screen.getByText('Record Drop Video')); });
            await act(async () => { fireEvent.press(screen.getByText('🔄 Retake Video')); });

            expect(mockLaunchCameraAsync).toHaveBeenCalledTimes(2);
        });
    });

    describe('Progress Tracking', () => {
        it('increments progress badge to 1/3 after one complete attempt', async () => {
            await renderComponent();
            await completeCurrentTab();
            expect(screen.getByText(/1\/3|1\s*\/3/)).toBeTruthy();
        });

        it('marks the completed tab with a ✅ icon', async () => {
            await renderComponent();
            await completeCurrentTab();
            expect(screen.getByText('✅')).toBeTruthy();
        });

        it('shows "Proceed to Quiz" button only when all 3 attempts are complete', async () => {
            await renderComponent();

            await completeCurrentTab();
            expect(screen.queryByText('Proceed to Quiz')).toBeNull();

            await act(async () => { fireEvent.press(screen.getByText('Design 2')); });
            await completeCurrentTab();
            expect(screen.queryByText('Proceed to Quiz')).toBeNull();

            await act(async () => { fireEvent.press(screen.getByText('Design 3')); });
            await completeCurrentTab();
            expect(screen.getByText('Proceed to Quiz')).toBeTruthy();
        });

        it('progress badge reads 3/3 after all attempts are complete', async () => {
            await renderComponent();

            for (const label of ['Design 1', 'Design 2', 'Design 3']) {
                await act(async () => { fireEvent.press(screen.getByText(label)); });
                await completeCurrentTab();
            }

            expect(screen.getByText(/3\/3|3\s*\/3/)).toBeTruthy();
        });
    });

    describe('Navigation', () => {
        it('navigates back to activity page when back button is pressed', async () => {
            await renderComponent();
            await act(async () => { fireEvent.press(screen.getByText('<')); });
            expect(mockRouterPush).toHaveBeenCalledWith('/pages/student/activities/1');
        });

        it('navigates to quiz1 when "Proceed to Quiz" is pressed', async () => {
            await renderComponent();

            for (const label of ['Design 1', 'Design 2', 'Design 3']) {
                await act(async () => { fireEvent.press(screen.getByText(label)); });
                await completeCurrentTab();
            }

            await act(async () => { fireEvent.press(screen.getByText('Proceed to Quiz')); });
            expect(mockRouterPush).toHaveBeenCalledWith('/pages/student/quiz/quiz1');
        });
    });
});