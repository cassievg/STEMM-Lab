export const Audio = {
    requestPermissionsAsync: jest.fn(() =>
        Promise.resolve({ granted: true })
    ),
    setAudioModeAsync: jest.fn(() => Promise.resolve()),
    Recording: {
        createAsync: jest.fn(() =>
            Promise.resolve({ recording: { stopAndUnloadAsync: jest.fn() } })
        ),
    },
    RecordingOptionsPresets: {
        HIGH_QUALITY: {},
    },
};