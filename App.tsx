/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Home from './screens/Home';
import Search from './screens/Search';

const Stack = createNativeStackNavigator();

function App() {
  const backgroundStyle = {
    backgroundColor: Colors.darker
  };

  return (
    <SafeAreaProvider style={backgroundStyle}>
      <StatusBar
        barStyle='dark-content'
        backgroundColor="#00aaff"
      />
      
      {/*<Home />*/}
      {/*<Search />*/}

      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name='Home' component={Home} />
          <Stack.Screen name='Search' component={Search} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
