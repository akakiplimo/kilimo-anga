// apps/mobile/components/FarmCard.tsx
import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { Card, Text } from "./ui";
import { Farm } from "../../../packages/types/src";

interface FarmCardProps {
  farm: Farm;
  onPress: () => void;
  onDelete: () => void;
}

export function FarmCard({ farm, onPress, onDelete }: FarmCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text variant="h3" style={styles.title}>
            {farm.name}
          </Text>
          <TouchableOpacity onPress={onDelete} style={styles.menuButton}>
            <MaterialIcons name="delete" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <MaterialIcons name="grass" size={18} color={colors.primary} />
            <Text style={styles.infoText}>{farm.cropName}</Text>
          </View>

          <View style={styles.infoItem}>
            <MaterialIcons name="straighten" size={18} color={colors.primary} />
            <Text style={styles.infoText}>{farm.acreage.toFixed(2)} acres</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <MaterialIcons name="water-drop" size={18} color={colors.primary} />
            <Text style={styles.infoText}>{farm.watering}</Text>
          </View>

          <View style={styles.infoItem}>
            <MaterialIcons name="event" size={18} color={colors.primary} />
            <Text style={styles.infoText}>
              {new Date(farm.sowingDate).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={[styles.mapPreview, { backgroundColor: colors.border }]}>
          {/* Map preview will be implemented later */}
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    marginBottom: 15,
    padding: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  menuButton: {
    padding: 5,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  infoText: {
    marginLeft: 5,
    fontSize: 14,
  },
  mapPreview: {
    height: 100,
    borderRadius: 5,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FarmCard;
