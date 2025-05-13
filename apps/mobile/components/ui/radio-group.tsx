// apps/mobile/components/ui/RadioGroup.tsx
import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { Text } from "./text";

interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  style?: StyleProp<ViewStyle>;
  direction?: "row" | "column";
}

export function RadioGroup({
  options,
  value,
  onChange,
  style,
  direction = "column",
}: RadioGroupProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        direction === "row" ? styles.containerRow : styles.containerColumn,
        style,
      ]}
    >
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.option,
            direction === "row" ? styles.optionRow : styles.optionColumn,
          ]}
          onPress={() => onChange(option.value)}
        >
          <View
            style={[
              styles.radio,
              {
                borderColor: colors.primary,
                backgroundColor: colors.card,
              },
            ]}
          >
            {value === option.value && (
              <View
                style={[styles.radioInner, { backgroundColor: colors.primary }]}
              />
            )}
          </View>
          <Text style={styles.label}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  containerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  containerColumn: {
    flexDirection: "column",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  optionRow: {
    marginRight: 16,
  },
  optionColumn: {
    marginBottom: 8,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  label: {
    marginLeft: 8,
  },
});
