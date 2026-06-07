import React from 'react';

export type ThemeKey = 'light' | 'dark';

export interface ThemeContextType {
    theme: ThemeKey;
    themeList: ThemeKey[];
    changeTheme: (theme: string) => Promise<void>;
}

export declare function useTheme(): ThemeContextType;
export declare function ThemeProvider({ children }: { children: React.ReactNode }): React.ReactElement;