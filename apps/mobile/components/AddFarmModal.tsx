// apps/mobile/components/AddFarmModal.tsx
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { Modal, Text, Button } from "./ui";

interface AddFarmModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectMethod: (method: "draw" | "walk") => void;
}

export function AddFarmModal({
  visible,
  onClose,
  onSelectMethod,
}: AddFarmModalProps) {
  const { colors } = useTheme();

  return (
    <Modal isVisible={visible} onClose={onClose}>
      <Text variant="h3" style={styles.title}>
        Add New Farm
      </Text>
      <Text style={{ textAlign: "center", color: "#666", marginBottom: 20 }}>
        Choose how you would like to map your farm:
      </Text>

      <TouchableOpacity
        style={[styles.option, { backgroundColor: colors.border + "20" }]}
        onPress={() => onSelectMethod("draw")}
      >
        <MaterialIcons name="edit" size={36} color={colors.primary} />
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionTitle}>Draw</Text>
          <Text style={{ color: "#666", fontSize: 14, marginTop: 5 }}>
            Draw farm boundaries on the map manually
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={colors.border} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.option, { backgroundColor: colors.border + "20" }]}
        onPress={() => onSelectMethod("walk")}
      >
        <MaterialIcons
          name="directions-walk"
          size={36}
          color={colors.primary}
        />
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionTitle}>Walk</Text>
          <Text style={{ color: "#666", fontSize: 14, marginTop: 5 }}>
            Walk around your farm to mark boundaries using GPS
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color={colors.border} />
      </TouchableOpacity>

      <Button
        title="Cancel"
        variant="outline"
        onPress={onClose}
        style={styles.cancelButton}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    marginBottom: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
  },
  optionTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 20,
  },
});

export default AddFarmModal;
