// apps/mobile/app/(app)/farm/add/draw.tsx
import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import * as Location from "expo-location";
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from "react-native-maps";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Button, Modal, TextField } from "../../../../components/ui";
import FarmForm from "../../../../components/FarmForm";
import { FarmFormValues } from "../../../../../../packages/types/src";
import { createFarm } from "../../../../services/farm";

// Initial region for the map (will be updated with user's location)
const initialRegion = {
  latitude: -1.2921, // Nairobi center as default
  longitude: 36.8219,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

// Step enum to track the farm drawing process
enum DrawStep {
  NAME_INPUT = 0,
  DRAWING = 1,
  FARM_DETAILS = 2,
}

// Form validation schema for farm name
const farmNameValidationSchema = yup.object().shape({
  farmName: yup.string().required("Farm name is required"),
});

type FarmNameFormData = {
  farmName: string;
};

export default function DrawFarmScreen() {
  const [currentStep, setCurrentStep] = useState<DrawStep>(DrawStep.NAME_INPUT);
  const [farmName, setFarmName] = useState("");
  const [region, setRegion] = useState(initialRegion);
  const [markers, setMarkers] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);

  const mapRef = useRef<MapView>(null);
  const router = useRouter();
  const { colors } = useTheme();

  // Setup React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FarmNameFormData>({
    resolver: yupResolver(farmNameValidationSchema),
    defaultValues: {
      farmName: "",
    },
  });

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      setLocationPermission(true);
      getCurrentLocation();
    } else {
      Alert.alert(
        "Permission Denied",
        "Location permission is required to map your farm. Please enable it in settings."
      );
    }
  };

  const getCurrentLocation = async () => {
    if (locationPermission) {
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        const { latitude, longitude } = location.coords;
        setRegion({
          ...region,
          latitude,
          longitude,
        });
      } catch (error) {
        console.log("Error getting location:", error);
        Alert.alert(
          "Error",
          "Failed to get current location. Please ensure GPS is enabled."
        );
      }
    }
  };

  const handleMapPress = (event: any) => {
    if (currentStep === DrawStep.DRAWING) {
      const { latitude, longitude } = event.nativeEvent.coordinate;
      setMarkers([...markers, { latitude, longitude }]);
    }
  };

  const removeLastMarker = () => {
    if (markers.length > 0) {
      setMarkers(markers.slice(0, -1));
    }
  };

  const handleNameSubmit = (data: FarmNameFormData) => {
    setFarmName(data.farmName);
    setCurrentStep(DrawStep.DRAWING);
  };

  const handleNextStep = () => {
    if (markers.length < 3) {
      Alert.alert("Error", "Please add at least 3 points to create a polygon");
      return;
    }
    setCurrentStep(DrawStep.FARM_DETAILS);
    setFormVisible(true);
  };

  const handleSubmitFarmDetails = async (values: FarmFormValues) => {
    try {
      setLoading(true);
      // Calculate acreage (example calculation - in reality would use a proper geo library)
      const acreage = calculateAcreage(markers);

      // Create farm object
      await createFarm({
        ...values,
        name: farmName,
        acreage,
        coordinates: markers,
      });

      Alert.alert("Success", "Farm added successfully", [
        { text: "OK", onPress: () => router.replace("/(app)") },
      ]);
    } catch (error) {
      console.error("Failed to create farm:", error);
      Alert.alert("Error", "Failed to add farm. Please try again.");
    } finally {
      setLoading(false);
      setFormVisible(false);
    }
  };

  // This is a simplified area calculation that should be replaced with a proper geodesic area calculation
  const calculateAcreage = (
    coords: { latitude: number; longitude: number }[]
  ) => {
    // Simple approximation - in production, use a proper area calculation library
    // This is a placeholder calculation and will not be accurate!
    if (coords.length < 3) return 0;

    // Very rough estimation just for demo purposes
    let area = 0;

    // Calculate using shoelace formula
    for (let i = 0; i < coords.length; i++) {
      const j = (i + 1) % coords.length;
      area += coords[i].longitude * coords[j].latitude;
      area -= coords[j].longitude * coords[i].latitude;
    }

    // Convert to acres (this is highly simplified and inaccurate)
    // In a real app, use a proper geospacial library for accurate calculations
    return Math.abs(area * 5000000) / 4047; // Rough conversion to acres
  };

  const renderStep = () => {
    switch (currentStep) {
      case DrawStep.NAME_INPUT:
        return (
          <Modal isVisible={true} onClose={() => router.back()}>
            <Text variant="h3" style={styles.overlayTitle}>
              Name Your Farm
            </Text>
            <Controller
              control={control}
              name="farmName"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextField
                  placeholder="Enter farm name"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  autoFocus
                  error={errors.farmName?.message}
                  // rightIcon={
                  //   <MaterialIcons
                  //     name="arrow-forward"
                  //     size={24}
                  //     color={colors.primary}
                  //     onPress={handleSubmit(handleNameSubmit)}
                  //   />
                  // }
                />
              )}
            />
            <Button
              title="Continue"
              onPress={handleSubmit(handleNameSubmit)}
              style={styles.continueButton}
            />
          </Modal>
        );

      case DrawStep.DRAWING:
        return (
          <>
            <View style={styles.instructionContainer}>
              <Text style={[styles.instructionText, { color: "white" }]}>
                Tap on the map to mark the boundaries of your farm
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title="Undo"
                onPress={removeLastMarker}
                disabled={markers.length === 0}
                variant="outline"
                style={styles.actionButton}
                icon={
                  <MaterialIcons name="undo" size={20} color={colors.primary} />
                }
              />
              <Button
                title="My Location"
                onPress={getCurrentLocation}
                variant="outline"
                style={styles.actionButton}
                icon={
                  <MaterialIcons
                    name="gps-fixed"
                    size={20}
                    color={colors.primary}
                  />
                }
              />
              <Button
                title="Next"
                onPress={handleNextStep}
                disabled={markers.length < 3}
                style={styles.actionButton}
                icon={
                  <MaterialIcons name="arrow-forward" size={20} color="white" />
                }
              />
            </View>
          </>
        );

      case DrawStep.FARM_DETAILS:
        // This is handled by the FarmForm modal
        return null;
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        onPress={handleMapPress}
        showsUserLocation={true}
      >
        {/* Markers for each point */}
        {markers.map((marker, index) => (
          <Marker
            key={`marker-${index}`}
            coordinate={marker}
            pinColor={index === 0 ? "red" : "yellow"}
          />
        ))}

        {/* Polygon outline */}
        {markers.length >= 3 && (
          <Polygon
            coordinates={markers}
            strokeWidth={2}
            strokeColor={colors.primary}
            fillColor={colors.primary + "40"}
          />
        )}
      </MapView>

      {renderStep()}

      <FarmForm
        visible={formVisible}
        onClose={() => {
          setFormVisible(false);
          setCurrentStep(DrawStep.DRAWING);
        }}
        onSubmit={handleSubmitFarmDetails}
        loading={loading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayTitle: {
    textAlign: "center",
    marginBottom: 20,
  },
  continueButton: {
    borderRadius: 5,
    marginTop: 20,
  },
  instructionContainer: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  instructionText: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  actionButton: {
    paddingHorizontal: 15,
    borderRadius: 5,
  },
});
