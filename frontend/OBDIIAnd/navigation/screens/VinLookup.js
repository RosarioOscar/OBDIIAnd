import nhtsa from "../../utils/NHTSA";
import { View, Text,StyleSheet, } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import GetVin from "../../components/GetVin";
import { SafeAreaView } from "react-native-safe-area-context";
import VehicleInfo from "./VehicleInfo";

//WIP. Get NHTSA API keys

export default function VinLookup(){
const [vehicleData, setVehicleData] = useState(null);

const handleVinSuccess = (data) =>{
    console.log("Success! Data received in VinLookupScreen:", data);
    setVehicleData(data);
}

    return (
    <SafeAreaView style={styles.container}>
      
      {!vehicleData ? (
        <View>
          <Text style={styles.title}>Enter Vehicle Details</Text>
          <GetVin onSuccess={handleVinSuccess} />
        </View>
      ) : (
        <View>
          <Text style={styles.title}>Vehicle Details</Text>
          <VehicleInfo data={vehicleData} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
});