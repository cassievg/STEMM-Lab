import { activityColors } from '@/app/pages/student/activities/activityStyles';
import { globalColors } from '@/app/styles';
import { useTheme } from '@/src/context/ThemeContext';
import { ThemeKey } from '@/src/context/ThemeContext.d';

export function useThemedStyles() {
    const { theme } = useTheme();

    return {
        theme,
        themed: activityColors[theme as ThemeKey],
        globalThemed: globalColors[theme as ThemeKey],
    };
}