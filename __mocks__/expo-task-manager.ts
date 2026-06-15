export const defineTask = jest.fn();
export const isTaskRegisteredAsync = jest.fn(() => Promise.resolve(false));
export const unregisterAllTasksAsync = jest.fn(() => Promise.resolve());
export const unregisterTaskAsync = jest.fn(() => Promise.resolve());
export const getRegisteredTasksAsync = jest.fn(() => Promise.resolve([]));
export const isTaskDefined = jest.fn(() => false);