import react from 'react';
import { Text, View } from 'react-native-svg';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//PAGES
import Home from './screens/Home';
import EventPage from './screens/EventPage';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />

        <Stack.Screen name="Event" component={EventPage} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}