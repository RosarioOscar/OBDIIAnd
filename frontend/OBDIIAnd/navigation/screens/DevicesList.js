import { FlatList,View,Text, StyleSheet, Pressable  } from "react-native";
import { BleManager } from "react-native-ble-plx";
import { useEffect, useState } from "react";
import DeviceInfo from "./DeviceInfo";

const manager = new BleManager();

function DevicesList({navigation}){
  
const [devices, setDevices] = useState([]);


    const scanForDevices = () => {
        console.log("Starting scan...");

        manager.startDeviceScan(null,null,(error, device) =>{
            if (error){
                console.log("Scan Error: ", error);

                setDevices([]);
                return;
            }

            if (device) {
                setDevices((prevDevices) => {

                if(!prevDevices.some((dev) => dev.id === device.id)){
                    return [...prevDevices, device];
                }
                return prevDevices;
                });
            }

        });
    };

   useEffect(() => {

    scanForDevices();

    return () => {
        console.log("Stopping scan...");
        manager.stopDeviceScan();
    }
   }, []);

    function deviceInfoHandler({item}){
      console.log("Pressed" ,{item})

    }
   const renderDeviceItem = ({item}) => (
   
    <Pressable 
    onPress= {() => navigation.navigate("DeviceInfo", {deviceItem: item})}
>
    <View style={styles.deviceItem}>
      <Text style={styles.deviceName}>{item.name || "Unknown Device"}</Text>
      <Text style={styles.deviceInfo}>ID: {item.id} | RSSI: {item.rssi}</Text>
    </View>
    </Pressable>
   );
   return (
    <View style={styles.container}>
      <FlatList
        data={devices}
        renderItem={renderDeviceItem}
        
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<Text style={styles.header}>Found Devices:</Text>}
        ListEmptyComponent={<Text style={styles.emptyText}>Scanning...</Text>}
      />
    </View>
   )
}
export default DevicesList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 15,
    backgroundColor: 'white',
  },
  deviceItem: {
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deviceInfo: {
    fontSize: 12,
    color: '#666',
  },
  emptyText: {
    padding: 20,
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
});

