// apps/mobile/components/FarmForm.tsx
import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import DropDownPicker from "react-native-dropdown-picker";
import { useTheme } from "@react-navigation/native";
import {
  Modal,
  TextField,
  Text,
  Button,
  DateTimePicker,
  RadioGroup,
} from "./ui";
import { FarmFormValues } from "../../../packages/types/src";

interface FarmFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: FarmFormValues) => void;
  loading: boolean;
}

const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  cropName: yup.string().required("Crop name is required"),
  variety: yup.string().required("Variety is required"),
  sowingDate: yup.string().required("Sowing date is required"),
  watering: yup
    .string()
    .oneOf(["Irrigated", "Rainfed"])
    .required("Watering method is required"),
});

// Sample crop list - in production, this would come from an API
const cropOptions = [
  { label: "Maize", value: "Maize" },
  { label: "Beans", value: "Beans" },
  { label: "Rice", value: "Rice" },
  { label: "Tomatoes", value: "Tomatoes" },
  { label: "Potatoes", value: "Potatoes" },
  { label: "Wheat", value: "Wheat" },
  { label: "Coffee", value: "Coffee" },
  { label: "Tea", value: "Tea" },
];

export function FarmForm({
  visible,
  onClose,
  onSubmit,
  loading,
}: FarmFormProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [crops, setCrops] = useState(cropOptions);
  const { colors } = useTheme();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FarmFormValues>({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      cropName: "",
      variety: "",
      sowingDate: new Date().toISOString().split("T")[0], // Today's date as default
      watering: "Rainfed",
    },
  });

  return (
    <Modal isVisible={visible} onClose={onClose}>
      <Text variant="h3" style={styles.title}>
        Farm Details
      </Text>

      <ScrollView contentContainerStyle={styles.formContainer}>
        <Text style={styles.labelText}>Crop Name</Text>
        <View style={styles.dropdownContainer}>
          <Controller
            control={control}
            name="cropName"
            render={({ field: { value } }) => (
              <DropDownPicker
                open={dropdownOpen}
                value={value}
                items={crops}
                setOpen={setDropdownOpen}
                setValue={(val) => {
                  if (typeof val === "function") {
                    const newValue = val(value);
                    setValue("cropName", newValue);
                  } else {
                    setValue("cropName", val);
                  }
                }}
                setItems={setCrops}
                searchable={true}
                searchPlaceholder="Search for crops..."
                placeholder="Select a crop"
                style={[styles.dropdown, { borderColor: colors.border }]}
                dropDownContainerStyle={{ borderColor: colors.border }}
                textStyle={{ color: colors.text }}
                zIndex={3000}
                zIndexInverse={1000}
              />
            )}
          />
          {errors.cropName && (
            <Text style={styles.errorText}>{errors.cropName.message}</Text>
          )}
        </View>

        <Text style={styles.labelText}>Variety</Text>
        <Controller
          control={control}
          name="variety"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              placeholder="Enter crop variety"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              error={errors.variety?.message}
            />
          )}
        />

        <Text style={styles.labelText}>Sowing Date</Text>
        <View style={styles.datePickerContainer}>
          <Controller
            control={control}
            name="sowingDate"
            render={({ field: { value } }) => (
              <DateTimePicker
                value={new Date(value || new Date())}
                mode="date"
                display="default"
                onChange={(date) => {
                  if (date) {
                    const formattedDate = date.toISOString().split("T")[0];
                    setValue("sowingDate", formattedDate);
                  }
                }}
                style={styles.datePicker}
              />
            )}
          />
          {errors.sowingDate && (
            <Text style={styles.errorText}>{errors.sowingDate.message}</Text>
          )}
        </View>

        <Text style={styles.labelText}>Watering</Text>
        <Controller
          control={control}
          name="watering"
          render={({ field: { value } }) => (
            <RadioGroup
              options={[
                { label: "Irrigated", value: "Irrigated" },
                { label: "Rainfed", value: "Rainfed" },
              ]}
              value={value}
              onChange={(val: string) =>
                setValue("watering", val as "Irrigated" | "Rainfed")
              }
              style={styles.radioGroup}
            />
          )}
        />
        {errors.watering && (
          <Text style={styles.errorText}>{errors.watering.message}</Text>
        )}

        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={onClose}
            style={styles.cancelButton}
          />
          <Button
            title="Save Farm"
            loading={loading}
            onPress={handleSubmit(onSubmit)}
            style={styles.saveButton}
          />
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  formContainer: {
    paddingBottom: 20,
  },
  labelText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 10,
    color: "#444",
  },
  dropdownContainer: {
    marginBottom: 15,
    zIndex: 3000,
  },
  dropdown: {
    borderWidth: 1,
  },
  datePickerContainer: {
    marginBottom: 15,
  },
  datePicker: {
    width: "100%",
    marginTop: 5,
  },
  radioGroup: {
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
  },
  saveButton: {
    flex: 1,
    marginLeft: 10,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 5,
  },
});

export default FarmForm;
