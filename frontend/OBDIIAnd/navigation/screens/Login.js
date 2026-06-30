import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator} from 'react-native';    


//Local Spring Boot DEV Server. Move to Render ASAP
const AUTH = "http://192.168.1.162:8080/api/v1/auth/login";

export default function Login({onLoginSuccess}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

const handleLogin = async() =>{
        if(!email || !password){
            Alert.alert("Error", "Please enter email & password");
            return;
        }

        setIsLoading(true);
        try{
            console.log("Sending login request...");
            const response = await fetch(AUTH,{
                method: "POST",
                headers:{
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email: email, password: password}),
            });

            if(!response.ok){
                throw Error(`HTTP error: ${response.status}`);
            }
            const data = await response.json();

            if(data.token){
                console.log("Success! UserID: ", data.userId);
                onLoginSuccess(data.token, data.userId);
                
            }
            else {
                Alert.alert("Failed to Login", "Invalid response");
            }

        } catch (error) {
            console.error("Login Error: ", error);
            Alert.alert("Connection Failed", "Check your IP and Spring Boot");
        } finally {
            setIsLoading(false);
        }
    }
return (
    <View style={styles.container}>
            <View style={styles.formCard}>
                <Text style={styles.mainTitle}>AutoLog</Text>
                <Text style={styles.subTitle}>Sign in to access vehicle telemetry</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor={colors.textGray}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />
                
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={colors.textGray}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
                    {isLoading ? (
                        <ActivityIndicator color={colors.textWhite} />
                    ) : (
                        <Text style={styles.buttonText}>CONNECT</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const colors = {
  bgMain: '#1F1F1F',
  bgElement: '#2D2D2D',
  accentOrange: '#FF6D00',
  textWhite: '#FFFFFF',
  textGray: '#A1A1A1',
  borderDark: '#333333',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain,
    justifyContent: 'center', 
    padding: 20,
  },
  formCard: {
    backgroundColor: colors.bgElement,
    padding: 25,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderDark,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  mainTitle: {
    color: colors.textWhite,
    fontSize: 28, 
    fontWeight: '800',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 5,
  },
  subTitle: {
    color: colors.textGray,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: colors.bgMain,
    color: colors.textWhite,
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.borderDark,
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.accentOrange,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: colors.accentOrange,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: colors.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  }
});