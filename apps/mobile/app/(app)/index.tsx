// apps/mobile/app/(app)/index.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { Text, Button } from "../../components/ui";
import FarmCard from "../../components/FarmCard";
import { getFarms, deleteFarm } from "../../services/farm";
import { Farm } from "../../../../packages/types/src";

export default function HomeScreen() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { colors } = useTheme();

  const loadFarms = async () => {
    try {
      setLoading(true);
      const farmsData = await getFarms();
      setFarms(farmsData);
    } catch (error) {
      console.error("Failed to load farms:", error);
      Alert.alert("Error", "Failed to load farms. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadFarms();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadFarms();
  };

  const handleDeleteFarm = async (farmId: string) => {
    Alert.alert("Delete Farm", "Are you sure you want to delete this farm?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteFarm(farmId);
            setFarms(farms.filter((farm) => farm.id !== farmId));
            Alert.alert("Success", "Farm deleted successfully");
          } catch (error) {
            Alert.alert("Error", "Failed to delete farm");
          }
        },
      },
    ]);
  };

  const handleFarmPress = (farm: Farm) => {
    router.push(`/farm/${farm.id}`);
  };

  const handleAddFarm = () => {
    router.push("/farm/add");
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text variant="h3">No Farms Added Yet</Text>
      <Text style={{ color: "#666", marginVertical: 20, textAlign: "center" }}>
        Click the + button to add your first farm
      </Text>
      <Button
        title="Add Farm"
        onPress={handleAddFarm}
        style={{ borderRadius: 5 }}
      />
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <FlatList
        data={farms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FarmCard
            farm={item}
            onPress={() => handleFarmPress(item)}
            onDelete={() => handleDeleteFarm(item.id)}
          />
        )}
        contentContainerStyle={
          farms.length === 0 ? { flex: 1 } : { padding: 16 }
        }
        ListEmptyComponent={renderEmptyComponent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {farms.length > 0 && (
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.primary }]}
          onPress={handleAddFarm}
        >
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
