export const router = {
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
};

export const useLocalSearchParams = jest.fn(() => ({ id: '1' }));