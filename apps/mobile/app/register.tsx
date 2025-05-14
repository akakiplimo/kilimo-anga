// apps/mobile/app/register.tsx
import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, TextField, Button } from "../components/ui";
import { register } from "../services/auth";

const validationSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
});

type FormData = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
};

export default function RegisterScreen() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { colors } = useTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      await register(data);
      Alert.alert(
        "Registration Successful",
        "Please login with your phone number",
        [{ text: "OK", onPress: () => router.push("/") }]
      );
    } catch (error) {
      const err = error as Error;
      Alert.alert("Registration Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text variant="h1">Kilimo Anga</Text>
          <Text variant="h3" style={{ marginTop: 10 }}>
            Create Your Account
          </Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="First Name"
                placeholder="Enter your first name"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.firstName?.message}
                // leftIcon={
                //   <MaterialIcons name="person" size={24} color="#666" />
                // }
              />
            )}
          />

          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="Last Name"
                placeholder="Enter your last name"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                error={errors.lastName?.message}
                // leftIcon={
                //   <MaterialIcons name="person" size={24} color="#666" />
                // }
              />
            )}
          />

          <Controller
            control={control}
            name="phoneNumber"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="Phone Number"
                placeholder="Enter your phone number"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                keyboardType="phone-pad"
                error={errors.phoneNumber?.message}
                // leftIcon={<MaterialIcons name="phone" size={24} color="#666" />}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextField
                label="Email Address"
                placeholder="Enter your email address"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email?.message}
                // leftIcon={<MaterialIcons name="email" size={24} color="#666" />}
              />
            )}
          />

          <Button
            title="Register"
            loading={loading}
            onPress={handleSubmit(onSubmit)}
            style={styles.button}
          />

          <View style={styles.loginContainer}>
            <Text>Already have an account? </Text>
            <Text
              style={[styles.loginLink, { color: colors.primary }]}
              onPress={() => router.push("/")}
            >
              Login
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginVertical: 30,
  },
  form: {
    marginTop: 20,
  },
  button: {
    marginTop: 20,
    borderRadius: 5,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginLink: {
    fontWeight: "bold",
  },
});
