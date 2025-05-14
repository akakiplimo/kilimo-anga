// apps/mobile/app/(app)/_layout.tsx
import { Redirect, Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../context/auth";

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  // If not authenticated, redirect to login
  if (!isLoading && !isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#4CAF50",
        tabBarStyle: {
          elevation: 0,
          borderTopWidth: 1,
          borderTopColor: "#f0f0f0",
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "My Farms",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="person" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="farm/[id]"
        options={{
          title: "Farm Details",
          href: null, // Hide this tab
        }}
      />
      <Tabs.Screen
        name="farm/add"
        options={{
          title: "Add Farm",
          href: null, // Hide this tab
        }}
      />
    </Tabs>
  );
}
