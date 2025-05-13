// apps/mobile/app/(app)/farm/[id].tsx
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Polygon, PROVIDER_GOOGLE } from "react-native-maps";
import { MaterialIcons } from "@expo/vector-icons";
import { Text, Button, Card } from "../../../components/ui";
import { getFarmById } from "../../../services/farm";
import { Farm } from "../../../../../packages/types/src";

export default function FarmDetailScreen() {
  const [farm, setFarm] = useState<Farm | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const params = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();
  const id = typeof params.id === "string" ? params.id : "";

  useEffect(() => {
    if (id) {
      loadFarmDetails();
    }
  }, [id]);

  const loadFarmDetails = async () => {
    try {
      setLoading(true);
      const farmData = await getFarmById(id);
      setFarm(farmData);
    } catch (error) {
      console.error("Failed to load farm details:", error);
      Alert.alert("Error", "Failed to load farm details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const calculateCropAge = (sowingDate: string) => {
    const sowing = new Date(sowingDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - sowing.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!farm) {
    return (
      <SafeAreaView
        style={[styles.errorContainer, { backgroundColor: colors.background }]}
      >
        <Text variant="h3">Farm Not Found</Text>
        <Button
          title="Go Back"
          onPress={() => router.back()}
          style={styles.backButton}
        />
      </SafeAreaView>
    );
  }

  // Calculate map region from farm coordinates
  const mapRegion = {
    latitude:
      farm.coordinates.reduce((sum, coord) => sum + coord.latitude, 0) /
      farm.coordinates.length,
    longitude:
      farm.coordinates.reduce((sum, coord) => sum + coord.longitude, 0) /
      farm.coordinates.length,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView>
        {/* Farm Map */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={mapRegion}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            <Polygon
              coordinates={farm.coordinates}
              strokeWidth={2}
              strokeColor={colors.primary}
              fillColor={colors.primary + "40"}
            />
          </MapView>
          <View style={styles.farmIdContainer}>
            <Text style={[styles.farmIdText, { color: "white" }]}>
              Farm ID: {farm.id.slice(0, 8)}
            </Text>
          </View>
        </View>

        {/* Basic Farm Details */}
        <Card style={styles.detailsCard}>
          <Text variant="h3" style={{ textAlign: "center", marginBottom: 10 }}>
            {farm.name}
          </Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Crop</Text>
              <Text style={styles.detailValue}>{farm.cropName}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Variety</Text>
              <Text style={styles.detailValue}>{farm.variety}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Acreage</Text>
              <Text style={styles.detailValue}>
                {farm.acreage.toFixed(2)} acres
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Crop Age</Text>
              <Text style={styles.detailValue}>
                {calculateCropAge(farm.sowingDate)} days
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Sowing Date</Text>
              <Text style={styles.detailValue}>
                {new Date(farm.sowingDate).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Soil Type</Text>
              <Text style={styles.detailValue}>
                {farm.soilType || "Not specified"}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Watering</Text>
              <Text style={styles.detailValue}>{farm.watering}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>
                {farm.location || "No location data"}
              </Text>
            </View>
          </View>

          <Button
            title="Edit Farm"
            variant="outline"
            icon={
              <MaterialIcons name="edit" size={16} color={colors.primary} />
            }
            style={styles.editButton}
            onPress={() => {
              // To be implemented
              Alert.alert(
                "Coming Soon",
                "Edit farm functionality will be available soon."
              );
            }}
          />
        </Card>

        {/* Accordion Sections */}
        <View style={styles.accordionContainer}>
          {/* Weather Forecast Section */}
          <TouchableAccordion
            title="Weather Forecast"
            isExpanded={expandedSection === "weather"}
            onPress={() => toggleSection("weather")}
            colors={colors}
          >
            <Text style={styles.placeholderText}>
              Weather forecast data will be displayed here. This section will
              include daily forecasts, temperature, precipitation, and other
              weather details relevant to farming.
            </Text>
          </TouchableAccordion>

          {/* Soil Health Section */}
          <TouchableAccordion
            title="Soil Health"
            isExpanded={expandedSection === "soil"}
            onPress={() => toggleSection("soil")}
            colors={colors}
          >
            <Text style={styles.placeholderText}>
              Soil health data will be displayed here. This section will include
              soil moisture levels, nutrient content, pH levels and
              recommendations for soil management.
            </Text>
          </TouchableAccordion>

          {/* Pest & Disease Section */}
          <TouchableAccordion
            title="Pest & Disease Alerts"
            isExpanded={expandedSection === "pests"}
            onPress={() => toggleSection("pests")}
            colors={colors}
          >
            <Text style={styles.placeholderText}>
              Pest and disease alerts specific to your crop and region will be
              displayed here. This section will include current threats,
              prevention measures, and treatment recommendations.
            </Text>
          </TouchableAccordion>

          {/* Crop Calendar Section */}
          <TouchableAccordion
            title="Crop Calendar"
            isExpanded={expandedSection === "calendar"}
            onPress={() => toggleSection("calendar")}
            colors={colors}
          >
            <Text style={styles.placeholderText}>
              Crop calendar will be displayed here. This section will include
              key dates for planting, fertilizing, pest control, and harvesting
              based on your crop type and local conditions.
            </Text>
          </TouchableAccordion>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper component for accordion sections
function TouchableAccordion({
  title,
  isExpanded,
  onPress,
  children,
  colors,
}: {
  title: string;
  isExpanded: boolean;
  onPress: () => void;
  children: React.ReactNode;
  colors: any;
}) {
  return (
    <View style={[styles.accordion, { backgroundColor: colors.card }]}>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>{title}</Text>
        <MaterialIcons
          name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
          size={24}
          color={colors.text}
        />
      </TouchableOpacity>

      {isExpanded && <View style={styles.accordionContent}>{children}</View>}
    </View>
  );
}

import { TouchableOpacity } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  mapContainer: {
    height: 200,
    width: "100%",
    position: "relative",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  farmIdContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 5,
    borderRadius: 5,
  },
  farmIdText: {
    fontWeight: "bold",
  },
  detailsCard: {
    borderRadius: 10,
    margin: 10,
    padding: 15,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  detailItem: {
    width: "48%",
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  editButton: {
    borderRadius: 5,
  },
  backButton: {
    marginTop: 20,
    borderRadius: 5,
  },
  accordionContainer: {
    marginHorizontal: 10,
    marginBottom: 20,
  },
  accordion: {
    marginTop: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  accordionContent: {
    padding: 16,
    paddingTop: 0,
  },
  placeholderText: {
    color: "#666",
    fontStyle: "italic",
    padding: 10,
  },
});
