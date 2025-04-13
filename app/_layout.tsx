import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { StatusBar } from "expo-status-bar"; // Import StatusBar

import { useColorScheme } from "@/components/useColorScheme";
import AuthProvider from "@/context/AuthProvider";
import { RegistrationProvider } from "@/context/RegistrationContext";
import Toast from "react-native-toast-message";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2 } },
})

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
      {/* Cập nhật StatusBar */}
      <RootLayoutNav />
    </>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RegistrationProvider>
          <StatusBar
            style={colorScheme === "dark" ? "light" : "dark"}
            translucent
          />
          <Toast />
          <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
              }}
            >
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: "modal" }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            </Stack>
          </ThemeProvider>
        </RegistrationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
