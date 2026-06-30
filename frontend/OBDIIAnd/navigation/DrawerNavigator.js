// navigation/DrawerNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeStack from './MainStack'; // <--- Import the Stack!
import HomeScreen from './screens/HomeScreen';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator 
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: '#1F1F1F' },
        headerTintColor: '#FF6D00',
        drawerStyle: { backgroundColor: '#5a5959' },
        textColor: `#ffffff`,
      }}
    >
      {/* 1. The Main Flow (Contains Home, Devices, Info, etc.) */}
      <Drawer.Screen 
        name="Home" 
        component={HomeStack} 
        listeners={({navigation}) => ({
          drawerItemPress: (e) =>{
            e.preventDefault();
            navigation.navigate("Home", {screen: "Dashboard"});
          },
        })}

      />

      {/* 2. Other distinct sections */}


    </Drawer.Navigator>
  );
}