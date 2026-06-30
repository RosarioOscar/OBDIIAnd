import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserProvider } from './context/UserContext';
import DrawerNavigator from "./navigation/DrawerNavigator";
import { GestureHandlerRootView } from 'react-native-gesture-handler';



export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <UserProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <DrawerNavigator />
       </NavigationContainer>
      </SafeAreaProvider>
    </UserProvider>
    </GestureHandlerRootView>

  );
}


