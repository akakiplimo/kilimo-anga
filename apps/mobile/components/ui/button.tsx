// apps/mobile/components/ui/Button.tsx
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useTheme } from "@react-navigation/native";

type ButtonVariant =
  | "default"
  | "primary"
  | "outline"
  | "destructive"
  | "ghost"
  | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

interface ButtonProps {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
}

export function Button({
  title,
  onPress,
  variant = "default",
  size = "default",
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}: ButtonProps) {
  const { colors } = useTheme();

  const getButtonStyle = () => {
    const baseStyle = styles.button;
    const sizeStyle = styles[`button_${size}`] || styles.button_default;

    let variantStyle: any = {};
    switch (variant) {
      case "primary":
        variantStyle = { backgroundColor: colors.primary };
        break;
      case "outline":
        variantStyle = {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: colors.primary,
        };
        break;
      case "destructive":
        variantStyle = { backgroundColor: "#F44336" };
        break;
      case "ghost":
        variantStyle = { backgroundColor: "transparent" };
        break;
      case "link":
        variantStyle = {
          backgroundColor: "transparent",
          paddingVertical: 0,
          paddingHorizontal: 0,
        };
        break;
      default:
        variantStyle = { backgroundColor: colors.primary };
    }

    const disabledStyle = disabled ? { opacity: 0.5 } : {};

    return [baseStyle, sizeStyle, variantStyle, disabledStyle, style];
  };

  const getTextStyle = () => {
    let textColor;
    switch (variant) {
      case "outline":
      case "ghost":
      case "link":
        textColor = colors.primary;
        break;
      default:
        textColor = "white";
    }

    const baseTextStyle = {
      fontSize: 16,
      fontWeight: "500",
      color: textColor,
    };

    let sizeTextStyle = {};
    if (size === "sm") {
      sizeTextStyle = { fontSize: 14 };
    } else if (size === "lg") {
      sizeTextStyle = { fontSize: 18 };
    }

    return [baseTextStyle, sizeTextStyle, textStyle];
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      <View style={styles.contentContainer}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={
              variant === "outline" || variant === "ghost" || variant === "link"
                ? colors.primary
                : "white"
            }
            style={styles.indicator}
          />
        ) : icon ? (
          <View style={styles.iconContainer}>{icon}</View>
        ) : null}

        <Text style={getTextStyle()}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  button_default: {},
  button_sm: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  button_lg: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  button_icon: {
    width: 40,
    height: 40,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 20,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    marginRight: 8,
  },
  indicator: {
    marginRight: 8,
  },
});
