import { View, Text, StyleSheet, ScrollView } from "react-native";
import Buttons from "../../components/Buttons";
import handlePermissionsRequest from "../../utils/Permissions";
import { useLayoutEffect } from "react";
import { useUser } from "../../context/UserContext";
import { runDatabaseTest } from "../../components/VehicleProfileTest";

import Login from "./Login";
// Bring in the exact color palette from LiveDataSelect for a cohesive app theme
const colors = {
  bgMain: '#1F1F1F',       // Deep ash gray background
  bgElement: '#2D2D2D',    // Slightly lighter gray for inactive buttons/rows
  accentOrange: '#FF6D00', // Vibrant safety orange
  textWhite: '#FFFFFF',    // High contrast white text
  textGray: '#A1A1A1',     // Muted gray text for inactive states
  borderDark: '#333333',   // Subtle dark borders
};

export default function HomeScreen({ navigation }) {
  const { username, isLoggedIn, vin, isconnected, login } = useUser();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: username ? `Logged in as: ${username}` : "Dashboard",
      headerRight: () => <Text style={{ color: colors.accentOrange, marginRight: 15, fontWeight: 'bold' }}>{vin ? `VIN: ${vin.substring(0, 5)}...` : ''}</Text>,
      headerStyle: { backgroundColor: colors.bgElement },
      headerTintColor: colors.textWhite,
    });
  }, [navigation, username, vin]);

  if(!isLoggedIn){
    return(
      <Login
        onLoginSuccess = {(token, userId) => {
          if(login) login(token, userId)
        }}
      />
    )
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      <View style={styles.headerSection}>
        <Text style={styles.mainTitle}>AutoLog Diagnostics</Text>
        <Text style={styles.subTitle}>
          {isconnected ? "🟢 Scanner Connected" : "🔴 Scanner Disconnected"}
        </Text>
      </View>

      {/* Group 1: Primary Telematics Actions */}
      <View style={styles.actionSection}>
        <Text style={styles.sectionLabel}>DIAGNOSTICS & DATA</Text>
        {isconnected && (
          <Buttons title={"Live Data Dashboard"} onPress={() => { navigation.navigate("LiveDataSelect") }} />
        )}
        <Buttons title={"Device Scanner"} onPress={() => { navigation.navigate("DevicesList") }} />
        {/* Hidden until connected */}
        {!isconnected && <Buttons title={"PID DataBase"} onPress={() => { navigation.navigate("PIDInfo") }} />}
      </View>

      {/* Group 2: Garage & Profile */}
      <View style={styles.actionSection}>
        <Text style={styles.sectionLabel}>VEHICLE MANAGEMENT</Text>
        {isLoggedIn && <Buttons title={"My Garage"} onPress={() => { navigation.navigate("MyGarage") }} />}
        <Buttons title={"VIN Lookup"} onPress={() => { navigation.navigate("VinLookup") }} />
      </View>

      {/* Group 3: Testing & Settings */}
      <View style={styles.actionSection}>
        <Text style={styles.sectionLabel}>SYSTEM CONTROLS</Text>
        <Buttons title={"Request Bluetooth Permissions"} onPress={() => { handlePermissionsRequest() }} />
        {/* <Buttons title={"Server Test"} onPress={() => runDatabaseTest()} /> */}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain, // Matches your ash gray theme
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  headerSection: {
    marginBottom: 30,
    marginTop: 10,
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: colors.bgElement,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderDark,
    // Subtle shadow to make the header pop
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  mainTitle: {
    color: colors.textWhite,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1,
  },
  subTitle: {
    color: colors.textGray,
    fontSize: 14,
    marginTop: 5,
    fontWeight: '600',
  },
  actionSection: {
    marginBottom: 25,
  },
  sectionLabel: {
    color: colors.textGray,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 10,
    marginLeft: 5,
  }
});