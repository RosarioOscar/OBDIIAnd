import { useState, useEffect, } from "react";
import { TextInput, Text, View, Alert, ActivityIndicator,StyleSheet } from "react-native";
import Buttons from "./Buttons";
import { getVinDetails } from "../utils/NHTSA";
import Login from "../screens/Login";
import { useUser } from "../context/UserContext";
import { doc, setDoc } from "firebase/firestore"; //import Firestore functions. Soon to be obsolete. Moving to custom DB. 
import { db } from "../firebaseConfig";

const currentYear = new Date().getFullYear;


export default function GetVin({onSuccess}){

    const {username} = useUser();
    const {vinHandler} = useUser();
    const [vin, setVin] = useState("");
    const [year, setYear] = useState("");

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () =>{
        setError(null);
    
         if(!year || year <= 1980 || year > currentYear +1){
            setError("Please enter a valid model year after 1980");
            return ;
        }

         if(vin.length !== 17){
            setError("VIN must be exactly 17 characters");
            return;
        }
       
        setLoading(true);
        try{
            const data = await getVinDetails(vin.toUpperCase());
            
            if(data.Results.length === 0){
                setError("VIN not found in NHTSA database. Please try again later");
                setLoading(false);
                return;
            }

            const apiYearResult = data.Results.find(
                (item) => item.Variable === "Model Year"
            );

            if (apiYearResult && apiYearResult.Value == year){
                setLoading(false);
                Alert.alert("Success!", "VIN Verified.");
                if(onSuccess){
                    vinHandler(vin);

                    onSuccess(data);

                    if(username){
                      const getField = (variableName) => {
                  return data.Results.find((item) => item.Variable === variableName)?.Value || "Unknown";
                };
                    const docRef = doc(db, "users",username, "Garage", vin)
                    try{
                                await setDoc(docRef, {
                                    vin: vin,
                                    rawvin: data,
                                    modelYear: getField("Model Year"),
                                    make: getField("Make"),
                                    model: getField("Model")
                                });
                                console.log("Document created!");
                } catch (e) {
                  console.error("Error: ", e);
                }}
              }
              } else{
                setLoading(false);
                setError("VIN found, but for an incorrect year.");
            }
        } catch (apiError){
            console.error("API Error:", apiError);
            setError("An error occurred while fetching VIN data.");
            setLoading(false);
        }
    }
   
    if (loading){
        return (
        <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Verifying VIN...</Text>
      </View>
    );
  }

    return (
      <View style={styles.container}>
      <Text style={styles.label}>Enter Model Year</Text>
      <TextInput
        style={styles.input}
        onChangeText={setYear}
        value={year}
        placeholder="e.g., 2002"
        keyboardType="numeric" 
        maxLength={4}
      />
      <Text style={styles.label}>Enter VIN</Text>
      <TextInput
        style={styles.input}
        onChangeText={setVin}
        value={vin}
        placeholder="17-Character VIN"
        autoCapitalize="characters" 
        maxLength={17}
      />
      
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Buttons title={"Confirm"} onPress={handleConfirm} />
    </View>

    );

}
const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  }
});