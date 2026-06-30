import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, DeviceEventEmitter } from 'react-native';
import Buttons from '../../components/Buttons';
import { ModularGraph } from '../../components/Graphs'; 
import { sendObdCommand } from '../../utils/BluetoothService'; // Imported here now

// Baseline PID Dictionary
const OBD2_METRICS = [
    { id: 'rpm', label: 'RPM', min: 0, max: 8000, color: '#FF6D00', pid: '010C' },
    { id: 'load', label: 'LOAD %', min: 0, max: 100, color: '#00E5FF', pid: '0104' },
    { id: 'stft', label: 'STFT %', min: -25, max: 25, color: '#E040FB', pid: '0106' },
    { id: 'maf', label: 'MAF g/s', min: 0, max: 250, color: '#00FF00', pid: '0110' }
];

export default function LiveDataSelect() {

    const [activeMetrics, setActiveMetrics] = useState(['rpm', 'load']);
    const [telemetry, setTelemetry] = useState({ rpm: 0, load: 0, stft: 0, maf: 0 });

    // Loop Refs to avoid unecessary rerendering
    const isStreaming = useRef(false);
    const dataBuffer = useRef("");
    const pollingQueue = useRef([]);
    const currentPollIndex = useRef(0);

    // PID Hex parser. Transforms raw hex data into integers. 
    const parseOBDResponse = (rawData) => {
        //Remove spaces and Searching...
        let clean = rawData.replace(/[\s>\r\n]/g, "").replace(/SEARCHING\.*/g, "");
        
        //Parsing logic for RPM
        if (clean.includes("410C")) {
            const index = clean.indexOf("410C");
            const hexData = clean.slice(index + 4, index + 8);
            if (hexData.length === 4) {
                const A = parseInt(hexData.slice(0, 2), 16);
                const B = parseInt(hexData.slice(2, 4), 16);
                setTelemetry(prev => ({ ...prev, rpm: ((A * 256) + B) / 4 }));
            }
        }
       //Parsing logic for load

        else if (clean.includes("4104")) {
            const index = clean.indexOf("4104");
            const hexData = clean.slice(index + 4, index + 6);
            if (hexData.length === 2) {
                const A = parseInt(hexData, 16);
                setTelemetry(prev => ({ ...prev, load: (A * 100) / 255 }));
            }
        }
        //Parsing logic for STFT%

        else if (clean.includes("4106")) {
            const index = clean.indexOf("4106");
            const hexData = clean.slice(index + 4, index + 6);
            if (hexData.length === 2) {
                const A = parseInt(hexData, 16);
                setTelemetry(prev => ({ ...prev, stft: (A - 128) * (100 / 128) }));
            }
        }

        //Parsing logic for MAF

        else if (clean.includes("4110")) {
            const index = clean.indexOf("4110");
            const hexData = clean.slice(index + 4, index + 8);
            if (hexData.length === 4) {
                const A = parseInt(hexData.slice(0, 2), 16);
                const B = parseInt(hexData.slice(2, 4), 16);
                setTelemetry(prev => ({ ...prev, maf: ((A * 256) + B) / 100 }));
            }
        }
    };

    useEffect(() => {
        //Listening from Device Info
        const rawDataSub = DeviceEventEmitter.addListener("BT_RAW_DATA", (chunk) => {
            dataBuffer.current += chunk;

            // Check for complete response (ends with ">")
            if (dataBuffer.current.includes(">")) {
                parseOBDResponse(dataBuffer.current);
                dataBuffer.current = "";

                // Send next command in queue if stream is active
                if (isStreaming.current && pollingQueue.current.length > 0) {
                    setTimeout(() => {
                        if (isStreaming.current) { 
                            currentPollIndex.current = (currentPollIndex.current + 1) % pollingQueue.current.length;
                            sendObdCommand(pollingQueue.current[currentPollIndex.current]);
                        }
                    }, 100); //100ms to avoid overloading adapter (Subject to change for newer devices (sub20?))
                }
            }
        });

        // Cleanup on unmount (kills the loop automatically when leaving the screen)
        return () => {
            rawDataSub.remove();
            isStreaming.current = false; 
        };
    }, []);

    const startLiveStream = () => {
        console.log("--- STARTING STREAM ---");
        isStreaming.current = true;
        
        // Build the queue dynamically based on what's active in the UI (work on real time addition during polling)
        pollingQueue.current = activeMetrics.map(id => {
            const metricConfig = OBD2_METRICS.find(m => m.id === id);
            return metricConfig.pid;
        });
        
        currentPollIndex.current = 0;
        
        //fire first command
        if (pollingQueue.current.length > 0) {
            sendObdCommand(pollingQueue.current[0]);
        }
    };

    const stopLiveStream = () => {
        console.log("--- STOPPING STREAM ---");
        isStreaming.current = false;
    };

    const toggleMetric = (metricId) => {
        setActiveMetrics(prev => {
            if (prev.includes(metricId)) return prev.filter(id => id !== metricId);
            return [...prev, metricId];
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.graphContainer}>
                <ModularGraph 
                    latestData={telemetry} 
                    metricConfigs={OBD2_METRICS} 
                    activeMetrics={activeMetrics}
                    onToggleMetric={toggleMetric}
                />
            </View>

            <View style={styles.controls}>
                <Buttons title="Start Live Stream" onPress={startLiveStream} />
                <Buttons title="Stop Live Stream" onPress={stopLiveStream} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1F1F1F', padding: 20, justifyContent: 'space-between' },
    graphContainer: { flex: 1, justifyContent: 'center' },
    controls: { marginBottom: 30, width: '100%', gap: 15 }
});