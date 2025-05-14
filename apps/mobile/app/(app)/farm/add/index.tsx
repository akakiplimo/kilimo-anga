// apps/mobile/app/(app)/farm/add/index.tsx
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddFarmModal from "../../../../components/AddFarmModal";

export default function AddFarmScreen() {
  const [modalVisible, setModalVisible] = useState(true);
  const router = useRouter();
  const { colors } = useTheme();

  const handleSelectMethod = (method: "draw" | "walk") => {
    setModalVisible(false);
    if (method === "draw") {
      router.push("/farm/add/draw");
    } else {
      router.push("/farm/add/walk");
    }
  };

  const handleClose = () => {
    setModalVisible(false);
    router.back();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <AddFarmModal
          visible={modalVisible}
          onClose={handleClose}
          onSelectMethod={handleSelectMethod}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
