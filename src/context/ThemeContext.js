import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();
const useTheme = () => useContext(ThemeContext);

const THEME_STORAGE_KEY = 'THEME';
const THEME_LIST = ['light', 'dark'];

const ThemeProvider = ({ children }) => {
    const colorScheme = useColorScheme();
    const [theme, setTheme] = useState(THEME_LIST[0]);

    const getThemedStyle = useCallback((styleDict) => {
        let style = {};

        if (theme in styleDict) {
            style = styleDict[theme];
        }
        else {
            // Get the first element of the style dict as default
            for (let key in styleDict) {
                style = styleDict[key]
                break;
            }
        }

        return style;
    }, [theme]);

    const changeTheme = useCallback(async (givenTheme) => {
        if (THEME_LIST.includes(givenTheme)) {
            setTheme(givenTheme);
            await AsyncStorage.setItem(THEME_STORAGE_KEY, givenTheme);
        }
        else {
            throw new Error('Unknown theme');
        }
    }, []);

    useEffect(() => {
        const init = async () => {
            const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);

            if (savedTheme && THEME_LIST.includes(savedTheme)) {
                setTheme(savedTheme);
            }
            else if (colorScheme && THEME_LIST.includes(colorScheme)) {
                setTheme(colorScheme);
            }
            else {
                setTheme(THEME_LIST[0]);
            }
        };

        init();
    }, [colorScheme]);

    return (
        <ThemeContext.Provider value={{themeList: THEME_LIST, theme, changeTheme, getThemedStyle}}>
            {children}
        </ThemeContext.Provider>
    );
};


export {
    ThemeProvider, useTheme
};

