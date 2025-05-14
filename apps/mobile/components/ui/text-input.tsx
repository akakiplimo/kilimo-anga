import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { TextInputProps } from "react-native";
import { Input } from "./input"; // your base input component
import { cn } from "~/lib/utils";

type CustomTextInputProps = TextInputProps & {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
};

export const TextInput: React.FC<CustomTextInputProps> = ({
  label,
  error,
  leftIcon,
  style,
  className,
  ...props
}) => {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View style={[styles.inputWrapper, error && styles.inputError]}>
        {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}

        <Input
          {...props}
          className={cn("flex-1", className)}
          style={[
            styles.input,
            leftIcon ? styles.inputWithIcon : undefined,
            style,
          ]}
        />
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    marginBottom: 4,
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "#ccc",
    paddingHorizontal: 8,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#000",
  },
  inputWithIcon: {
    marginLeft: 8,
  },
  icon: {
    marginRight: 4,
  },
  inputError: {
    borderColor: "#f00",
  },
  errorText: {
    marginTop: 4,
    color: "#f00",
    fontSize: 12,
  },
});
