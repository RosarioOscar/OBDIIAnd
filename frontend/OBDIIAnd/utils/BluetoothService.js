import { encode, decode } from "base-64";
import { BleManager } from "react-native-ble-plx";
import { Platform } from "react-native";


const manager = new BleManager();

let connectedDevice = null;
let serviceUUID = null;
let writeCharUUID = null;
let notifyCharUUID = null;
let subscription = null;
// Callback to send data back to UI from the native BLE listener
let onDataCallback = null;

//Need a buffer here, since BLE packets are limited to 20 bytes, they become fragmente across multiple packets. 
const responseBuffer = { content: "" };

 //Connects to the device and AUTOMATICALLY subscribes to notifications. This ensures you never send a command before the listener is ready.

export const connectToDevice = async (deviceId, onDataReceived) => {
    try {
        // 1. Assign the data callback immediately
        onDataCallback = onDataReceived;

        console.log(`Connecting to ${deviceId}...`);
        
        // 2. Android Force-Mode: autoConnect: false is required for reliable connections. If true, connection is queued in background OS layer
        const device = await manager.connectToDevice(deviceId, {
            autoConnect: false,
            timeout: 10000
        });
        
        connectedDevice = device;
        console.log("Connected. Discovering services...");

        //Forces GATT server to expose routing table data. 
        await device.discoverAllServicesAndCharacteristics();

        // Finds UART bridging UUIDs (OBD2 devices)
        const characteristics = await findObdCharacteristics(device);
        
        //Subscribe to prevent missing handshake responses. 
        await setupNotificationSubscription(device, characteristics);

        console.log("Ready to send commands!");
        return characteristics;

    } catch (error) {
        console.error("Connection setup failed:", error);
        disconnectFromDevice(); // Cleanup on failure
        throw error;
    }
};

const setupNotificationSubscription = async (device, { serviceUUID, notifyUUID }) => {
    //cleans previous listeners or subscriptions on reconnect. 
    if (subscription) {
        subscription.remove();
    }

    console.log(`Subscribing to ${notifyUUID}...`);
    
    // The subscription callback is where we handle incoming BLE data
    subscription = device.monitorCharacteristicForService(
        serviceUUID,
        notifyUUID,
        (error, characteristic) => {
            if (error) { /* handle error */ return; }
            if (!characteristic?.value) return;

            //ELM327 chipset communicates in ASCII. BLE transmits in Base64, so we decode it to get the raw string.
            const rawData = decode(characteristic.value);
            
            //Append data to global buffer.
            responseBuffer.content += rawData; 

            //ELM327 protocol uses ">" to signal the end of a response. Keep looping until we catch a >"
            if (rawData.includes(">")) {
                if (onDataCallback) {
                    //send it to the UI layer
                    onDataCallback(responseBuffer.content);
                }

                //clear buffer so the next frame starts fresh
                responseBuffer.content = "";
            }
        }
    );
};
export const sendObdCommand = async (command) => {
    if (!connectedDevice || !serviceUUID || !writeCharUUID) {
        console.error("Cannot send: Device not connected or UUIDs missing.");
        return;
    }

    //ELM327 requires a carriage return (\r) at the end of each command in order to execute
    const fullCommand = command.endsWith("\r") ? command : command + "\r";
    const base64Command = encode(fullCommand);

    try {
        // writeCharacteristicWithResponseForService ensures the command is sent and acknowledged by the device
        // If  device is laggy, try writeCharacteristicWithoutResponseForService, WithoutResponse is faster but is built for faster ELM327 chips. Slower chipsets will drop packets. 
        await connectedDevice.writeCharacteristicWithResponseForService(
            serviceUUID,
            writeCharUUID,
            base64Command
        );
        console.log("Sent:", fullCommand.trim());
    } catch (e) {
        console.error("Write failed:", e);
        throw e;
    }
};

export const disconnectFromDevice = async () => {
    if (connectedDevice) {
        console.log("Disconnecting... (at the service level");

        //Setting a delay to prevent crashing from data sitting in buffers. Flushes the queues before severing the socket
        
    await new Promise(r => setTimeout(r,200)); 
        try {
            await connectedDevice.cancelConnection();
        } catch (e) {
            console.warn("Error during cancellation:", e);
        }
        //Cleaning to prevent memory leaks and bad references. 
        connectedDevice = null;
        serviceUUID = null;
        writeCharUUID = null;
        notifyCharUUID = null;
        onDataCallback = null;
        console.log("Disconnected cleaned up.");
    }
};

const findObdCharacteristics = async (device) => {
    const services = await device.services();
    
    //Veepeak / ELM327 Standard (FFF0 serial bridge, FFF1 notify, FFF2 write)
    const targetService = services.find(s => s.uuid.includes("fff0") || s.uuid.includes("FFF0"));

    if (targetService) {
        const characteristics = await device.characteristicsForService(targetService.uuid);
        const writeChar = characteristics.find(c => c.uuid.includes("fff2"));
        const notifyChar = characteristics.find(c => c.uuid.includes("fff1"));

        if (writeChar && notifyChar) {
            serviceUUID = targetService.uuid;
            writeCharUUID = writeChar.uuid;
            notifyCharUUID = notifyChar.uuid;
            return { serviceUUID, writeUUID: writeCharUUID, notifyUUID: notifyCharUUID };
        }
    }

    // Fallback for Generic chips.
    for (const service of services) {
        const characteristics = await device.characteristicsForService(service.uuid);
        const writeChar = characteristics.find(c => c.isWritableWithResponse || c.isWritableWithoutResponse);
        const notifyChar = characteristics.find(c => c.isNotifiable || c.isIndicatable);

        if (writeChar && notifyChar) {
            serviceUUID = service.uuid;
            writeCharUUID = writeChar.uuid;
            notifyCharUUID = notifyChar.uuid;
            return { serviceUUID, writeUUID: writeCharUUID, notifyUUID: notifyCharUUID };
        }
    }
    
    throw new Error("No valid OBD2 characteristics found");
};


 //Sends a command and waits for the full response (until '>' is seen)

export const requestResponse = async (command, timeout = 30000) => {
    //Clear the CONTENT, not the variable
    responseBuffer.content = ""; 
    
    await sendObdCommand(command);

    const start = Date.now();
    while (true) {
        //Read from the shared object. Caution: Only good for first time connection
        if (responseBuffer.content.includes(">")) {
            if (responseBuffer.content.includes("SEARCHING")) {
                await new Promise(r => setTimeout(r, 200)); 
            } else {
                break; 
            }
        }
        //prevents infinite loops
        if (Date.now() - start > timeout) {
            console.warn(`Giving up on ${command} after ${timeout}ms`);
            break;
        }
        //check the buffer every 50ms
        await new Promise(r => setTimeout(r, 50));
    }

    // Return the text inside the object
    return responseBuffer.content;
};
export const isDeviceConnected = () => !!connectedDevice;