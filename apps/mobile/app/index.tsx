// apps/mobile/app/index.tsx
import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import { Text, Button, TextField } from "../components/ui";
import { useAuth } from "../context/auth";

// Form validation schemas
const phoneValidationSchema = yup.object().shape({
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
});

const otpValidationSchema = yup.object().shape({
  otp: yup
    .string()
    .matches(/^[0-9]{6}$/, "OTP must be 6 digits")
    .required("OTP is required"),
});

// Type definitions for form data
type PhoneFormData = {
  phoneNumber: string;
};

type OtpFormData = {
  otp: string;
};

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const router = useRouter();
  const { colors } = useTheme();
  const { signIn, requestOtp } = useAuth();

  // Initialize forms
  const {
    control: phoneControl,
    handleSubmit: handlePhoneSubmit,
    formState: { errors: phoneErrors },
  } = useForm<PhoneFormData>({
    resolver: yupResolver(phoneValidationSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const {
    control: otpControl,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm<OtpFormData>({
    resolver: yupResolver(otpValidationSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onRequestOTP = async (data: PhoneFormData) => {
    try {
      setLoading(true);
      await requestOtp(data.phoneNumber);
      setPhoneNumber(data.phoneNumber);
      setOtpSent(true);
      Alert.alert("Success", "OTP has been sent to your phone");
    } catch (error: any) {
      Alert.alert("Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOTP = async (data: OtpFormData) => {
    try {
      setLoading(true);
      await signIn(phoneNumber, data.otp);
      router.replace("/(app)");
    } catch (error: any) {
      Alert.alert("Verification Failed", error.message);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Text variant="h1">Kilimo Anga</Text>
        <Text variant="h3" style={{ marginTop: 10 }}>
          {otpSent ? "Enter OTP" : "Login to Your Account"}
        </Text>
      </View>

      {!otpSent ? (
        <View style={styles.form}>
          <Controller
            control={phoneControl}
            name="phoneNumber"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="Phone Number"
                placeholder="Enter your phone number"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                keyboardType="phone-pad"
                error={phoneErrors.phoneNumber?.message}
                // leftIcon={<Feather name="phone" size={24} color="#666" />}
              />
            )}
          />

          <Button
            title="Send OTP"
            loading={loading}
            onPress={handlePhoneSubmit(onRequestOTP)}
            style={styles.button}
          />

          <View style={styles.registerContainer}>
            <Text>Don't have an account? </Text>
            <Text
              style={[styles.registerLink, { color: colors.primary }]}
              onPress={() => router.push("/register")}
            >
              Register
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.form}>
          <Text style={styles.phoneText}>OTP sent to: {phoneNumber}</Text>

          <Controller
            control={otpControl}
            name="otp"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="OTP Code"
                placeholder="Enter 6-digit OTP"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                keyboardType="number-pad"
                maxLength={6}
                error={otpErrors.otp?.message}
                // leftIcon={<MaterialIcons name="lock" size={24} color="#666" />}
              />
            )}
          />

          <Button
            title="Verify OTP"
            loading={loading}
            onPress={handleOtpSubmit(onVerifyOTP)}
            style={styles.button}
          />

          <Button
            title="Back"
            variant="outline"
            onPress={() => setOtpSent(false)}
            style={styles.backButton}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  form: {
    width: "100%",
  },
  button: {
    marginTop: 20,
    borderRadius: 5,
  },
  backButton: {
    marginTop: 15,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  registerLink: {
    fontWeight: "bold",
  },
  phoneText: {
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
});
