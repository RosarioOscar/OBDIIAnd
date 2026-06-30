import { Alert } from 'react-native';

//const BACKEND_URL = 'http://10.0.0.33:8080/api/vehicles/profile';
const BACKEND_URL = 'https://jsonplaceholder.typicode.com/posts';

export const runDatabaseTest = async () => {
  const dummyPayload = {
    userId: "testVehicleUser", 
    vin: "RANDOMVIN1234567890",
    make: "Honda",
    model: "Accord",
    supportedPids: JSON.stringify(["0C", "0D", "0F", "11"]) 
  };

  try {
    console.log("Firing payload to Spring Boot...");
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(dummyPayload)
    });

    if (!response.ok) throw new Error(`Status: ${response.status}`);

    const savedProfile = await response.json();
    Alert.alert("Success!", `Vehicle saved. ID: ${savedProfile.id}`);

  } catch (error) {
    console.error("Network Error:", error);
    Alert.alert("Connection Failed", "Check your IP address and Spring Boot.");
  }
};