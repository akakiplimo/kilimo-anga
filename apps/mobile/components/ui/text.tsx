// apps/mobile/components/ui/Text.tsx
import React, { ReactNode } from "react";
import { Text as RNText, StyleSheet, StyleProp, TextStyle } from "react-native";
import { useTheme } from "@react-navigation/native";

type TextVariant =
  | "default"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "p"
  | "small"
  | "muted";

interface TextProps {
  children: ReactNode;
  variant?: TextVariant;
  style?: StyleProp<TextStyle>;
  onPress?: () => void;
}

export function Text({
  children,
  variant = "default",
  style,
  onPress,
}: TextProps) {
  const { colors } = useTheme();

  const getTextStyle = () => {
    const baseStyle = [styles.text, { color: colors.text }];

    let variantStyle = {};
    switch (variant) {
      case "h1":
        variantStyle = styles.text_h1;
        break;
      case "h2":
        variantStyle = styles.text_h2;
        break;
      case "h3":
        variantStyle = styles.text_h3;
        break;
      case "h4":
        variantStyle = styles.text_h4;
        break;
      case "p":
        variantStyle = styles.text_p;
        break;
      case "small":
        variantStyle = styles.text_small;
        break;
      case "muted":
        variantStyle = [styles.text_small, { color: "#6b7280" }];
        break;
      default:
        variantStyle = styles.text_default;
    }

    return [baseStyle, variantStyle, style];
  };

  return (
    <RNText style={getTextStyle()} onPress={onPress}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "System",
  },
  text_default: {
    fontSize: 16,
    lineHeight: 24,
  },
  text_h1: {
    fontSize: 36,
    fontWeight: "bold",
    lineHeight: 40,
  },
  text_h2: {
    fontSize: 30,
    fontWeight: "bold",
    lineHeight: 36,
  },
  text_h3: {
    fontSize: 24,
    fontWeight: "bold",
    lineHeight: 32,
  },
  text_h4: {
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 28,
  },
  text_p: {
    fontSize: 16,
    lineHeight: 24,
  },
  text_small: {
    fontSize: 14,
    lineHeight: 20,
  },
});
