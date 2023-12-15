import * as React from 'react';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeStackScreen } from './Homestack';
import { Button, Text, View } from 'react-native';
import { RightScan } from './RightScan';
import RightConnect from './RightControl';
import AsyncStorage from '@react-native-async-storage/async-storage';


const SettingsStack = createNativeStackNavigator();

export function RightHome({navigation}:{navigation:any}) {

  const isFocused = useIsFocused();
    const [initialRoute, setInitialRoute] = React.useState('Right Watch');

    let page;

    React.useEffect(() => {
        const fetchAsyncData = async () => {
            try {
                const val = await AsyncStorage.getItem('@app:id2');
                console.log('Value is ', val);

                if (val !== 'null' && val !== null) {
                    console.log(val);
                    console.log('Navigating Bro..... 2');
                    navigation.navigate("Right Watch Connect")
                }
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };
        if (isFocused) {
            fetchAsyncData();
        }
    }, [isFocused]);




  return (
    <SettingsStack.Navigator initialRouteName={initialRoute}>
      <SettingsStack.Screen name="Right Watch" options={{ headerTitleAlign: 'center' }} component={RightScan} />
      <SettingsStack.Screen name="Right Watch Connect" options={{ headerTitleAlign: 'center' }} component={RightConnect} />
    </SettingsStack.Navigator>
  );
}
