import { PermissionsAndroid, Platform, Alert } from "react-native";
import * as Device from "expo-device";

const handlePermissionsRequest = async () => {
    console.log("--- Permission request started ---");
    
    if (Platform.OS !== "android") {
        Alert.alert("iOS Detected", "Bluetooth permissions are handled natively by iOS.");
        return true;
    }
    
    console.log("Platform is Android.");
    const apiLevel = Device.platformApiLevel;
    console.log("Device API Level:", apiLevel);
    
    if (apiLevel < 31) {
        console.log("Entering logic for Android 11 (API < 31)...");
        const status = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: "Location Permission",
                message: "This app needs location access for Bluetooth Scanning.",
                buttonPositive: "OK",
            }
        );
        
        // Popup confirming the single Android 11 requirement
        Alert.alert(
            "Android 11 Permissions",
            `Location: ${status.toUpperCase()}`
        );
        
        return status === PermissionsAndroid.RESULTS.GRANTED;
        
    } else if (apiLevel >= 31) {
        console.log("Entering logic for Android 12 (API >= 31)...");
        const result = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        ]);

        // Extract the exact string status of each permission
        const scanStatus = result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN];
        const connectStatus = result[PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT];
        const locationStatus = result[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];

        // Diagnostic Popup showing the breakdown
        Alert.alert(
            "Android 12+ Permissions",
            `Bluetooth Scan: ${scanStatus.toUpperCase()}\nBluetooth Connect: ${connectStatus.toUpperCase()}\nLocation: ${locationStatus.toUpperCase()}`
        );

        const allPermissionsGranted = 
            scanStatus === 'granted' &&
            connectStatus === 'granted' &&
            locationStatus === 'granted';
        
        console.log("All permissions granted:", allPermissionsGranted);
        return allPermissionsGranted;
    }
    
    console.log("--- Permission request finished ---");
    return false;
}

export default handlePermissionsRequest;