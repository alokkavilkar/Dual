import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeStackScreen } from './Homestack';
import { Button, Text, View } from 'react-native';
import { RightScan } from './RightScan';



function DetailsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Details!</Text>
    </View>
  );
}





const SettingsStack = createNativeStackNavigator();

export function RightHome() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name="RightScan" component={RightScan} />
      <SettingsStack.Screen name="Rightconnect" component={DetailsScreen} />
    </SettingsStack.Navigator>
  );
}
