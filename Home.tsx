import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Icon from 'react-native-vector-icons/MaterialIcons'
import { HomeStackScreen } from './Homestack';
import { Button, Text, View } from 'react-native';
import { RightHome } from './RightHome';
import {  User } from './Main';


const Tab = createBottomTabNavigator();

export default function Home() {
    return (
        <NavigationContainer>
            <Tab.Navigator screenOptions={{ headerShown: false}}>
                <Tab.Screen name='My Home'component={User}/>
                <Tab.Screen name="Left" component={HomeStackScreen} />
                <Tab.Screen name="Right" component={RightHome} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}