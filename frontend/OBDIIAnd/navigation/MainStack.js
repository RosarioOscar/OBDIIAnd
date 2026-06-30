
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import DevicesList from './screens/DevicesList';
import DeviceInfo from './screens/DeviceInfo'; 
import PIDInfo from './screens/PIDInfo';
import LiveDataSelect from './screens/LiveDataSelect';
import { DynamicGraph } from '../components/Graphs';

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false, 
        contentStyle: { backgroundColor: '#121212' }
      }}>
      <Stack.Screen name="Dashboard" component={HomeScreen} />



      <Stack.Screen name="DevicesList" component={DevicesList} />
      <Stack.Screen name="DeviceInfo" component={DeviceInfo} />
      <Stack.Screen name="PIDInfo" component={PIDInfo} />
      <Stack.Screen name="LiveDataSelect" component={LiveDataSelect} />


    </Stack.Navigator>
  );
}