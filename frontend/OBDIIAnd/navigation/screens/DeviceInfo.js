import { Text, View, StyleSheet, ScrollView, DeviceEventEmitter } from "react-native";
import Buttons from "../../components/Buttons";
import { connectToDevice, disconnectFromDevice } from "../../utils/BluetoothService";
import { useUser } from "../../context/UserContext";


//handles and broadcasts incoming hex data globally. Caught by "Live Data Select"
 const handleIncoming = (chunk) => {
        if (chunk) {
            DeviceEventEmitter.emit("BT_RAW_DATA", chunk);
        }
    };


function DeviceInfo({ route, navigation }) {
    const { deviceItem } = route.params;
    const { isconnected, connect, disconnect } = useUser(); 

  
    async function connectionHandler(deviceItem) {
        if (isconnected) {
            console.log("Disconnecting...");
            
            //200ms to flush buffer before severing the socket connection
            await new Promise(resolve => setTimeout(resolve, 200)); 

            try {
                await disconnectFromDevice();
            } catch (e) {
                console.error("Error during disconnect:", e);
            }
            disconnect(); 
        } else {
            try {
                //Pass the device MAC/UUID and listener to the native bridge
                const result = await connectToDevice(deviceItem.id, handleIncoming);
                
                if (result) {
                    connect(); //context update
                    console.log("----- CONNECTED -----");
                    navigation.navigate("HomeScreen"); //popToTop() Bugged?

                }
            } catch (e) {
                console.error("Connection Failed:", e);
                disconnect();
            }
        }
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <Text style={styles.headerText}>ID: {deviceItem.id}</Text>
                <Text style={styles.headerText}>Name: {deviceItem.name}</Text>
                <Text style={styles.headerText}>RSSI: {deviceItem.rssi}</Text>
            </View>

            <Buttons 
                title={isconnected ? "Disconnect" : "Connect"} 
                onPress={() => connectionHandler(deviceItem)} 
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, flex: 1, backgroundColor: '#1F1F1F' },
    card: { backgroundColor: '#2D2D2D', padding: 20, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#333' },
    headerText: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#FFFFFF' }
});

export default DeviceInfo;