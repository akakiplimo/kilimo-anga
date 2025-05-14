// apps/mobile/components/ui/DateTimePicker.tsx
import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, Platform, View } from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "@react-navigation/native";
import { Text } from "./text";

interface DateTimePickerProps {
  value: Date;
  onChange: (date: Date | null) => void;
  mode?: "date" | "time" | "datetime";
  display?: "default" | "spinner" | "calendar" | "clock";
  style?: any;
  minimumDate?: Date;
  maximumDate?: Date;
}

export function DateTimePicker({
  value,
  onChange,
  mode = "date",
  display = "default",
  style,
  minimumDate,
  maximumDate,
}: DateTimePickerProps) {
  const [show, setShow] = useState(Platform.OS === "ios");
  const { colors } = useTheme();

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShow(Platform.OS === "ios");
    if (event.type === "dismissed") {
      return;
    }
    onChange(selectedDate || null);
  };

  const showPicker = () => {
    setShow(true);
  };

  const formatDate = (date: Date): string => {
    if (mode === "date") {
      return date.toLocaleDateString();
    } else if (mode === "time") {
      return date.toLocaleTimeString().substring(0, 5);
    }
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString().substring(0, 5)}`;
  };

  return (
    <View style={[styles.container, style]}>
      {Platform.OS === "android" && (
        <TouchableOpacity
          onPress={showPicker}
          style={[
            styles.touchable,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text>{formatDate(value)}</Text>
        </TouchableOpacity>
      )}

      {show && (
        <RNDateTimePicker
          testID="dateTimePicker"
          value={value}
          mode={mode}
          display={display}
          onChange={onDateChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          textColor={colors.text}
          themeVariant={colors.text === "#f9fafb" ? "dark" : "light"}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  touchable: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 6,
  },
});
