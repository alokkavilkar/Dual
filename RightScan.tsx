import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Alert, Button, FlatList, PermissionsAndroid, Platform, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import BleManager, { BleDisconnectPeripheralEvent, BleScanCallbackType, BleScanMatchMode, BleScanMode, Peripheral } from 'react-native-ble-manager'
import { NativeEventEmitter, NativeModules } from "react-native";
import { isLocationEnabled, promptForEnableLocationIfNeeded } from "react-native-android-location-enabler";
import AsyncStorage from '@react-native-async-storage/async-storage';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export function RightScan({ navigation }: { navigation: any }) {


    const [peripherals, setPeripherals] = React.useState(
        new Map<Peripheral['id'], Peripheral>(),
    );

    const addOrUpdatePeripheral = (id: string, updatedPeripheral: Peripheral) => {
        // console.log("Adding the peripherals.")
        setPeripherals(map => new Map(map.set(id, updatedPeripheral)));
    }

    React.useEffect(() => {
        BleManager.start({ showAlert: false });

        const ble1 = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);

        handlePermission();
        console.log(Platform.Version);


        return () => {
            ble1.remove();
        }

    }, []);


    const enableBLE = async () => {
        console.log("Ble is starting the connection.");
        try {
            await BleManager.enableBluetooth();
            console.log("Bluetooth enabled");
            const checkEnabled: boolean = await isLocationEnabled();
            console.log("checkEnabled" + checkEnabled);
            if (checkEnabled === false) {
                await promptForEnableLocationIfNeeded().then((val) => {
                    console.log("Location enabled.");
                })
                    .catch((err) => {
                        console.log("Failed to to so...." + err);
                    })
            }
        }
        catch (error) {
            console.log("Error enabling bluetotth");
            Alert.alert(
                'Bluetooth permission required',
                'Please enable Bluetooth permission',
                [{ text: "Ok", onPress: () => console.log("Ok Pressed") }]
            )
        }

    }
    const startScan = () => {
        console.log(BleManager.checkState().then((state) => {
            console.log(state);
        }))
        setPeripherals(new Map<Peripheral['id'], Peripheral>());
        try {
            console.log("Scanning started");
            BleManager.scan([], 5, true, { matchMode: BleScanMatchMode.Sticky, scanMode: BleScanMode.LowLatency, callbackType: BleScanCallbackType.AllMatches })
                .then(() => {
                    console.log("Scanning succesfull");
                    // console.log(serivce_uid);
                })
                .catch((err) => {
                    console.log("Got erro while scanning.." + err);
                })
        }
        catch (error) {
            console.log("Scanning cannot be performed..." + error);
        }
    }
    const handleDiscoverPeripheral = async (peripheral: Peripheral) => {
        console.debug('[handleDiscoverPeripheral] new BLE peripheral= ', peripheral.name + " " + peripheral.id);
        if (!peripheral) {
            console.log("Please check with the location");
        }
        if(peripheral.name !== null)
        {
            addOrUpdatePeripheral(peripheral.id, peripheral);
        }
    }

    const handlePermission = () => {
        if (Platform.OS === 'android' && Platform.Version >= 31) {
            PermissionsAndroid.requestMultiple(
                [
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                ]
            )
                .then(val => {
                    if (val) {
                        console.debug("Permission for android 12+ accepted.");
                    } else {
                        console.log("Permission denied by the user.");
                    }
                })
        }
        else if (Platform.OS == 'android' && Platform.Version >= 23) {
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,)
                .then((val) => {
                    if (val) {
                        console.log("User accepted permission");
                        // console.log(BleManager);
                    }
                    else {
                        console.log("user denied the permission");
                    }
                })
        }

    }



    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

            <TouchableOpacity
                style={{ width: '90%', backgroundColor: '#007bff', margin: 20, padding: 20, borderRadius: 20 }}
                onPress={enableBLE}
            >
                <Text style={{ color: "white", fontSize: 20, textAlign: 'center' }}>Enable Bluetooth/Location</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={{ width: '50%', backgroundColor: '#007bff', margin: 10, padding: 20, borderRadius: 20 }}
                onPress={startScan}
            >
                <Text style={{ color: "white", fontSize: 20, textAlign: 'center' }}>Scan</Text>
            </TouchableOpacity>

            <FlatList style={{ width: '90%' }}
                data={Array.from(peripherals.values())}
                contentContainerStyle={{ rowGap: 12 }}
                keyExtractor={item => item.id}
                renderItem={item => (
                    <TouchableHighlight
                        style={{ backgroundColor: 'lightgrey', borderRadius: 20 }}
                        underlayColor="#90EE90"
                        onPress={() => { 
                            
                            navigation.navigate("Right Watch Connect", { id: item.item.id, name: item.item.name });

                            if (item.item.id) {
                                console.log("Data2 stored finally");
                                AsyncStorage.setItem("@app:id2", item.item.id);
                            }

                            if(item.item.name)
                            {
                                console.log("Name2 stored");
                                AsyncStorage.setItem("@app:name2", item.item.name);
                                AsyncStorage.setItem("@app:myname2", item.item.name);
                            }



                        }}>
                        <View style={{ padding: 20 }}>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 20 }}>{item.item.advertising?.localName}</Text>
                                <Text style={{ fontSize: 20 }}>{item.item.rssi}</Text>
                            </View>
                            <Text style={{ fontSize: 15 }}>{item.item.id}</Text>
                        </View>
                    </TouchableHighlight>
                )}
            />
        </View>
    );
}