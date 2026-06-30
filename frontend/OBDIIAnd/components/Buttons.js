import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, View } from 'react-native';

export default function Buttons({
    title,
    onPress,
    hidden = false,
    disabled = false,
    loading = false,
    style,      // OVERRIDE container styles here
    textStyle,  // OVERRIDE text styles here
}) {
    if (hidden) return null;

    return (
        <Pressable
            onPress={disabled || loading ? null : onPress}
            // Array syntax allows us to merge styles: [DEFAULT, OVERRIDES]
            style={({ pressed }) => [
                styles.defaultButton, // 1. The Base Style (Always applied)
                
                // 2. State Styles (Pressed/Disabled)
                pressed && styles.pressed,
                (disabled || loading) && styles.disabled,

                style 
            ]}
        >
            {loading ? (
                <ActivityIndicator color="white" />
            ) : (
                <Text style={[styles.defaultText, textStyle]}>
                    {title}
                </Text>
            )}
        </Pressable>
    );
}

// --- THE ONE DEFAULT STYLE ---
const styles = StyleSheet.create({
    defaultButton: {
        backgroundColor: '#6e615b', // Default Gray
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 100,
        // Default Shadow
        elevation: 3, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    defaultText: {
        color: '#FFFFFF', // Default White Text
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    pressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }] // Slight shrink effect
    },
    disabled: {
        opacity: 0.5,
        backgroundColor: '#555' // Grey out when disabled
    }
});