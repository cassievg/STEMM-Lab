export const requestForegroundPermissionsAsync = jest.fn(() =>
    Promise.resolve({ status: 'granted' })
);
export const getCurrentPositionAsync = jest.fn(() =>
    Promise.resolve({
        coords: {
            latitude: -33.8688,
            longitude: 151.2093,
            accuracy: 10,
            altitude: 0,
            speed: 0,
        },
        timestamp: Date.now(),
    })
);