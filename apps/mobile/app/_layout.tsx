import "~/global.css";

import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as React from "react";
import { useColorScheme } from "~/lib/useColorScheme";
import { AuthProvider } from "../context/auth";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Extend the themes with our custom colors
const LightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#4CAF50",
    background: "#f5f5f5",
    card: "#FFFFFF",
    text: "#1f2937",
    border: "#e5e7eb",
    notification: "#FF9800",
  },
};

const CustomDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#4CAF50",
    background: "#121212",
    card: "#1e1e1e",
    text: "#f9fafb",
    border: "#374151",
    notification: "#FF9800",
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme =
    colorScheme.colorScheme === "dark" ? CustomDarkTheme : LightTheme;

  return (
    <ThemeProvider value={theme}>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="register"
            options={{
              title: "Create Account",
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider>
    </ThemeProvider>
  );
}
