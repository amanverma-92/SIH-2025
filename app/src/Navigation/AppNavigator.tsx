import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeScreen, LoginScreen, RegisterScreen, HomeScreen, TouristIDScreen, SafetyScoreScreen, GeoFencingAlertsScreen , AuthorityScreen} from '../Screens';

const Stack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {

  return (
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="TouristIDScreen" component={TouristIDScreen} />
        <Stack.Screen name="SafetyScoreScreen" component={SafetyScoreScreen} />
        <Stack.Screen name="GeoFencingAlertsScreen" component={GeoFencingAlertsScreen} />
        {/* <Stack.Screen name="PanicButtonScreen" component={PanicButtonScreen} /> */}
        <Stack.Screen name="AuthorityScreen" component={AuthorityScreen} />
      </Stack.Navigator>
  );
};

export default AppNavigator;


