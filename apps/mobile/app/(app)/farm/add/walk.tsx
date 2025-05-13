// apps/mobile/app/(app)/farm/add/walk.tsx
import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import * as Location from "expo-location";
import MapView, {
  Marker,
  Polygon,
  Polyline,
  PROVIDER_GOOGLE,
} from "react-native-maps";
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

// Step enum to track the farm walking process
enum WalkStep {
  NAME_INPUT = 0,
  READY_TO_WALK = 1,
  WALKING = 2,
  FARM_DETAILS = 3,
}

// Form validation schema for farm name
const farmNameValidationSchema = yup.object().shape({
  farmName: yup.string().required("Farm name is required"),
});

type FarmNameFormData = {
  farmName: string;
};

export default function WalkFarmScreen() {
  const [currentStep, setCurrentStep] = useState<WalkStep>(WalkStep.NAME_INPUT);
  const [farmName, setFarmName] = useState("");
  const [region, setRegion] = useState(initialRegion);
  const [markers, setMarkers] = useState<
    { latitude: number; longitude: number }[]
  >([]);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);

  const mapRef = useRef<MapView>(null);
  const watchIdRef = useRef<Location.LocationSubscription | null>(null);
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

    // Clean up location watcher when component unmounts
    return () => {
      if (watchIdRef.current) {
        watchIdRef.current.remove();
      }
    };
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

  const startWalking = async () => {
    setCurrentStep(WalkStep.WALKING);
    setIsRecording(true);
    setMarkers([]);

    // Start tracking location
    if (locationPermission) {
      watchIdRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 5, // Minimum distance (in meters) to trigger update
          timeInterval: 1000, // Minimum time (in ms) between updates
        },
        (location) => {
          const { latitude, longitude } = location.coords;

          // Add marker if recording
          if (isRecording) {
            setMarkers((prev) => [...prev, { latitude, longitude }]);

            // Center map on current location
            mapRef.current?.animateToRegion({
              latitude,
              longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            });
          }
        }
      );
    }
  };

  const stopWalking = () => {
    setIsRecording(false);

    // Stop tracking location
    if (watchIdRef.current) {
      watchIdRef.current.remove();
      watchIdRef.current = null;
    }

    // If we have enough points, proceed to farm details
    if (markers.length >= 3) {
      setCurrentStep(WalkStep.FARM_DETAILS);
      setFormVisible(true);
    } else {
      Alert.alert(
        "Insufficient Points",
        "Please walk around your farm to capture at least 3 points.",
        [
          {
            text: "Try Again",
            onPress: () => setCurrentStep(WalkStep.READY_TO_WALK),
          },
        ]
      );
    }
  };

  const handleNameSubmit = (data: FarmNameFormData) => {
    setFarmName(data.farmName);
    setCurrentStep(WalkStep.READY_TO_WALK);
    getCurrentLocation(); // Make sure we have the latest location
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

  // Reuse the same acreage calculation function as in DrawFarm
  const calculateAcreage = (
    coords: { latitude: number; longitude: number }[]
  ) => {
    if (coords.length < 3) return 0;

    let area = 0;

    for (let i = 0; i < coords.length; i++) {
      const j = (i + 1) % coords.length;
      area += coords[i].longitude * coords[j].latitude;
      area -= coords[j].longitude * coords[i].latitude;
    }

    return Math.abs(area * 5000000) / 4047;
  };

  const renderStep = () => {
    switch (currentStep) {
      case WalkStep.NAME_INPUT:
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
                  // placeholder="Enter farm name"
                  onChangeText={onChange}
                  onBlur={onBlur}
                  value={value}
                  autoFocus
                  // error={errors.farmName?.message}
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

      case WalkStep.READY_TO_WALK:
        return (
          <Modal isVisible={true} onClose={() => router.back()}>
            <Text variant="h3" style={styles.overlayTitle}>
              Walk Your Farm
            </Text>
            <Text style={styles.instructionText}>
              1. Walk to a corner of your farm
            </Text>
            <Text style={styles.instructionText}>
              2. Tap "Start Walking" and walk around the boundary
            </Text>
            <Text style={styles.instructionText}>
              3. When you return to your starting point, tap "Stop Walking"
            </Text>
            <Button
              title="Start Walking"
              onPress={startWalking}
              style={[styles.continueButton, { marginTop: 20 }]}
              icon={<MaterialIcons name="play-arrow" size={20} color="white" />}
            />
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => router.back()}
              style={{ marginTop: 10 }}
            />
          </Modal>
        );

      case WalkStep.WALKING:
        return (
          <View style={styles.walkingControlsContainer}>
            <View style={styles.walkingStatus}>
              <Text style={[styles.walkingStatusText, { color: "white" }]}>
                {markers.length === 0
                  ? "Getting your location..."
                  : `Points Recorded: ${markers.length}`}
              </Text>
            </View>
            <Button
              title="Stop Walking"
              onPress={stopWalking}
              style={styles.stopButton}
              icon={<MaterialIcons name="stop" size={20} color="white" />}
            />
          </View>
        );

      case WalkStep.FARM_DETAILS:
        // This is handled by the FarmForm modal
        return null;
    }
  };

  // apps/mobile/app/(app)/farm/add/walk.tsx (continued)
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={region}
        showsUserLocation={true}
      >
        {/* Markers for each recorded point */}
        {markers.map((marker, index) => (
          <Marker
            key={`marker-${index}`}
            coordinate={marker}
            pinColor={index === 0 ? "red" : "yellow"}
          />
        ))}

        {/* Polyline for the walking path */}
        {markers.length >= 2 && (
          <Polyline
            coordinates={markers}
            strokeWidth={3}
            strokeColor="#2196F3"
          />
        )}

        {/* Polygon for the farm area */}
        {markers.length >= 3 && !isRecording && (
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
          setCurrentStep(WalkStep.READY_TO_WALK);
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
  instructionText: {
    color: "#666",
    marginVertical: 5,
    textAlign: "left",
  },
  continueButton: {
    borderRadius: 5,
    marginTop: 10,
  },
  walkingControlsContainer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  walkingStatus: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  walkingStatusText: {
    fontWeight: "bold",
  },
  stopButton: {
    backgroundColor: "#F44336",
    paddingHorizontal: 30,
    borderRadius: 5,
  },
});
