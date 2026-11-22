import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { useCalendarColors } from '@/constants/calendar-theme';

SplashScreen.preventAutoHideAsync();

// Root layout: a Stack navigator.
// index.tsx (calendar) is the first screen; day/[date].tsx is pushed on top,
// so going back returns to the calendar exactly as you left it (same month).
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const colors = useCalendarColors();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.paper },
          headerTintColor: colors.ink,
          headerShadowVisible: false,
          headerBackTitle: 'Calendar',
          contentStyle: { backgroundColor: colors.paper },
        }}>
        <Stack.Screen name="index" options={{ title: 'Movie Calendar' }} />
        <Stack.Screen name="day/[date]" options={{ title: 'Movie' }} />
      </Stack>
      <AnimatedSplashOverlay />
    </ThemeProvider>
  );
}
