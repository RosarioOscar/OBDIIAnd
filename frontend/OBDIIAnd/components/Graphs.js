import React, { useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useSharedValue, useDerivedValue, withDecay } from 'react-native-reanimated';
import { Canvas, Path, Skia } from "@shopify/react-native-skia";

const GRAPH_WIDTH = 320;
const GRAPH_HEIGHT = 180; 

//Partial Component. UI THREAD!
const MetricLine = ({ allData, windowOffset, pointsPerView, config }) => {
    //DerivedValue forces execution on UI thread to dodge JS thread blocking. 
    const path = useDerivedValue(() => {
        const skPath = Skia.Path.Make();
        const data = allData.value;
        if (data.length < 2) return skPath;

        const totalPoints = data.length;
        const visibleCount = pointsPerView.value;
        
        const endIndex = totalPoints - Math.max(0, windowOffset.value);
        const startIndex = Math.max(0, endIndex - visibleCount);
        const xStep = GRAPH_WIDTH / (visibleCount - 1);
        
        const range = (config.max - config.min) || 1;

        for (let i = startIndex; i < endIndex; i++) {
            const screenX = (i - startIndex) * xStep;
            const rawValue = data[i][config.id] !== undefined ? data[i][config.id] : config.min;
            //Normalizes values to fit in one continuous graph through their range. 0 - 8000 rpm normalized along -25 to 25% STFT, 0 - 1V, etc
            const normalizedY = (rawValue - config.min) / range;
            const screenY = GRAPH_HEIGHT - (normalizedY * GRAPH_HEIGHT);
            const clampedY = Math.max(0, Math.min(GRAPH_HEIGHT, screenY));

            if (i === startIndex) skPath.moveTo(screenX, clampedY);
            else skPath.lineTo(screenX, clampedY);
        }
        return skPath;
    });

    return (
        <Path 
            path={path} 
            color={config.color} 
            style="stroke" 
            strokeWidth={2.5} 
            strokeJoin="round" 
            strokeCap="round"
        />
    );
};

//MAIN Graph Component for states and gestures
export const ModularGraph = ({ 
    latestData,       
    metricConfigs,    // Array of all available metric rules
    activeMetrics,    // Array of string IDs: ['rpm', 'load']
    onToggleMetric    //handles  tapping the legend
}) => {
    //SharedValues to isolate threads and avoid re-rendering each message is received
    const allPoints = useSharedValue([]); 
    const windowOffset = useSharedValue(0); 
    const pointsPerView = useSharedValue(50); 

    // Append new incoming dictionary object to the array
    useEffect(() => {
        if (latestData) {
            allPoints.value = [...allPoints.value, latestData];
        }
    }, [latestData]);

    //withDecay adds natural momentum physics for swiping
    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            windowOffset.value -= e.changeX / 5; 
        })
        .onEnd((e) => {
            windowOffset.value = withDecay({ velocity: -e.velocityX });
        });

    return (
        <View style={styles.container}>
            {/* Dynamic Interactive Header / Legend */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.legendScroll}>
                {metricConfigs.map((config) => {
                    const isActive = activeMetrics.includes(config.id);
                    // Get current value safely
                    const currentValue = latestData?.[config.id] ?? 0;
                    
                    return (
                        <TouchableOpacity 
                            key={config.id}
                            style={[
                                styles.legendItem, 
                                isActive ? { borderColor: config.color } : styles.legendInactive
                            ]}
                            onPress={() => onToggleMetric(config.id)}
                        >
                            <Text style={[styles.title, { color: isActive ? config.color : '#666' }]}>
                                {config.label}
                            </Text>
                            <Text style={[styles.value, { color: isActive ? 'white' : '#666' }]}>
                                {currentValue.toFixed(1)}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
            
            <GestureDetector gesture={panGesture}>
                <View style={styles.graphBox}>
                    <Canvas style={{ width: GRAPH_WIDTH, height: GRAPH_HEIGHT }}>
                        {/* Map over ONLY the active metrics and render a thread-isolated line for each */}
                        {metricConfigs
                            .filter(config => activeMetrics.includes(config.id))
                            .map(config => (
                                <MetricLine 
                                    key={config.id}
                                    allData={allPoints}
                                    windowOffset={windowOffset}
                                    pointsPerView={pointsPerView}
                                    config={config}
                                />
                            ))
                        }
                    </Canvas>
                </View>
            </GestureDetector>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { marginBottom: 20, backgroundColor: '#2D2D2D', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#333' },
    legendScroll: { marginBottom: 10, flexDirection: 'row' },
    legendItem: { 
        paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, 
        marginRight: 10, minWidth: 80, alignItems: 'center', backgroundColor: '#1F1F1F' 
    },
    legendInactive: { borderColor: '#333' },
    title: { fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 2 },
    value: { fontSize: 16, fontWeight: '800', fontVariant: ['tabular-nums'] },
    graphBox: { borderWidth: 1, borderColor: '#333', backgroundColor: '#1F1F1F', borderRadius: 8, overflow: 'hidden', alignSelf: 'center' }
});