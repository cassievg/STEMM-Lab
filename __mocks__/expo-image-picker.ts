export const requestCameraPermissionsAsync = jest.fn(() =>
    Promise.resolve({ granted: true })
);

export const launchCameraAsync = jest.fn(() =>
    Promise.resolve({
        canceled: false,
        assets: [{ uri: 'file://mock-video.mp4' }],
    })
);

export const MediaTypeOptions = {
    Videos: 'Videos',
    All: 'All',
};