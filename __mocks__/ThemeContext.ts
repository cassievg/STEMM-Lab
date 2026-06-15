const useTheme = () => ({
    theme: 'light' as const,
    changeTheme: () => {},
});

const ThemeProvider = ({ children }: { children: React.ReactNode }) => children;

module.exports = { useTheme, ThemeProvider };