// apps/mobile/app/(app)/profile.tsx
import React from "react";
import { View, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Text, Button, Card } from "../../components/ui";
import { useAuth } from "../../context/auth";

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const router = useRouter();
  const { colors } = useTheme();

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        onPress: async () => {
          await signOut();
          // The auth context will handle the navigation back to login
        },
      },
    ]);
  };

  const menuItems: {
    icon: keyof typeof MaterialIcons.glyphMap;
    title: string;
    onPress: () => void;
  }[] = [
    {
      icon: "person",
      title: "Account Information",
      onPress: () =>
        Alert.alert("Coming Soon", "This feature will be available soon"),
    },
    {
      icon: "security",
      title: "Privacy & Security",
      onPress: () =>
        Alert.alert("Coming Soon", "This feature will be available soon"),
    },
    {
      icon: "settings",
      title: "App Settings",
      onPress: () =>
        Alert.alert("Coming Soon", "This feature will be available soon"),
    },
    {
      icon: "help",
      title: "Help & Support",
      onPress: () =>
        Alert.alert("Coming Soon", "This feature will be available soon"),
    },
    {
      icon: "info",
      title: "About Kilimo Anga",
      onPress: () =>
        Alert.alert("Coming Soon", "This feature will be available soon"),
    },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Text variant="h2">My Profile</Text>
      </View>

      <Card style={styles.userCard}>
        <View style={styles.userIconContainer}>
          <MaterialIcons name="person" size={60} color={colors.primary} />
        </View>
        <Text variant="h3" style={styles.userName}>
          User Name
        </Text>
        <Text style={styles.userEmail}>user@example.com</Text>
      </Card>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuItem, { backgroundColor: colors.card }]}
            onPress={item.onPress}
          >
            <View style={styles.menuLeft}>
              <MaterialIcons
                name={item.icon}
                size={24}
                color={colors.primary}
              />
              <Text style={styles.menuTitle}>{item.title}</Text>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={colors.border}
            />
          </TouchableOpacity>
        ))}
      </View>

      <Button
        title="Sign Out"
        variant="outline"
        style={styles.signOutButton}
        onPress={handleSignOut}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  userCard: {
    padding: 20,
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 20,
  },
  userIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  userName: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  userEmail: {
    color: "#666",
  },
  menuContainer: {
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuTitle: {
    marginLeft: 15,
    fontSize: 16,
  },
  signOutButton: {
    marginTop: 10,
  },
});
