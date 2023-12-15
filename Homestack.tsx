import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, Text, View } from 'react-native';
import { LeftScan } from './LeftScan';
import LeftControl from './LeftControl';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';





const HomeStack = createNativeStackNavigator();

export function HomeStackScreen({navigation}:{navigation:any}) {
    const isFocused = useIsFocused();
    const [initialRoute, setInitialRoute] = React.useState('Left Watch');

    let page;

    React.useEffect(() => {
        const fetchAsyncData = async () => {
            try {
                const val = await AsyncStorage.getItem('@app:id');
                console.log('Value is ', val);

                if (val !== 'null' && val !== null) {
                    console.log(val);
                    console.log('Navigating Bro.....');
                    navigation.navigate("Left Watch Connect")
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
        <HomeStack.Navigator initialRouteName={initialRoute}>
            <HomeStack.Screen name="Left Watch" options={{ headerTitleAlign: 'center' }} component={LeftScan} />
            <HomeStack.Screen name="Left Watch Connect" options={{ headerTitleAlign: 'center' }} component={LeftControl} />
        </HomeStack.Navigator>
    );
}

