import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Home';
import II from './II';

const HomeStack = createNativeStackNavigator();

export function User() {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen name="Main" component={II} />
        </HomeStack.Navigator>
    );
}
