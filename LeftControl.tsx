import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Button, NativeEventEmitter, NativeModules, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import BleManager, { BleDisconnectPeripheralEvent, BleScanCallbackType, BleScanMatchMode, BleScanMode, Peripheral } from 'react-native-ble-manager'


import Sound from "react-native-sound";


const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);


const LeftControl = ({ route, navigation }: { route: any, navigation: any }) => {

    var s = "";

    const val = AsyncStorage.getItem("@app:id");
    val.then((val) => {
        console.log(val);
        s += val;
    })

    useEffect(() => {
        const ble3 = bleManagerEmitter.addListener(
            'BleManagerDisconnectPeripheral',
            handleDisconnectedPeripheral
        );

        return (() => {
            ble3.remove();
        })
    }, []);


    function sleep(ms: number) {
        return new Promise<void>(resolve => setTimeout(resolve, ms));
    }


    const getConnected = async () => {
        try {
            const devices = await BleManager.getConnectedPeripherals();
            console.log("In retrieve function ", devices);
        }
        catch (err) {
            console.log("Unable to get the connected devices..")
        }
    }

    const handleDisconnectedPeripheral = (
        event: BleDisconnectPeripheralEvent,
    ) => {

        console.debug(
            `[handleDisconnectedPeripheral][] previously connected peripheral is disconnected.`,
            event.peripheral,
        );

        console.debug(
            `[handleDisconnectedPeripheral][${event.peripheral}] disconnected.`,
            // connect();
        );
    };

    const disconnect = (peripheral: string) => {

        BleManager.disconnect(peripheral).then((val) => {
            console.log("Disconnected");
            ToastAndroid.show("Disconnected... Ready to Pair.", ToastAndroid.SHORT);
            AsyncStorage.setItem("@app:device", "null");
            var whoosh = new Sound('disconnected.mp3', Sound.MAIN_BUNDLE, (error) => {
                if (error) {
                    console.log('failed to load the sound', error);
                    return;
                }
                // loaded successfully
                console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());

                // Play the sound with an onEnd callback
                whoosh.play((success) => {
                    if (success) {
                        console.log('successfully finished playing');
                    } else {
                        console.log('playback failed due to audio decoding errors');
                    }
                });
            });
        })
            .catch((err) => {
                console.log(err);
            })


    }




    const connect = async (peripheral: string) => {
        try {
            if (peripheral) {
                await BleManager.connect(peripheral);
                console.log('pheripheral connected.');
                ToastAndroid.show("Connected", ToastAndroid.SHORT);
                var whoosh = new Sound('connected.mp3', Sound.MAIN_BUNDLE, (error) => {
                    if (error) {
                        console.log('failed to load the sound', error);
                        return;
                    }
                    // loaded successfully
                    console.log('duration in seconds: ' + whoosh.getDuration() + 'number of channels: ' + whoosh.getNumberOfChannels());

                    // Play the sound with an onEnd callback
                    whoosh.play((success) => {
                        if (success) {
                            console.log('successfully finished playing');
                        } else {
                            console.log('playback failed due to audio decoding errors');
                        }
                    });
                });
                await sleep(900);

                const data = await BleManager.retrieveServices(peripheral);
                console.log("services: ", data);

                const rssi = await BleManager.readRSSI(peripheral);

                console.log("Rssi : " + rssi);

                if (data.characteristics) {
                    console.log("Present");
                }

                getConnected();

                if (data.characteristics) {
                    for (let characteristic of data.characteristics) {
                        if (characteristic.descriptors) {
                            for (let descriptor of characteristic.descriptors) {
                                try {
                                    let data = await BleManager.readDescriptor(
                                        peripheral,
                                        characteristic.service, characteristic.characteristic,
                                        descriptor.uuid
                                    );
                                    console.log("per", peripheral, " read as", data);
                                }
                                catch (err) {
                                    console.log("Don't able to get the data");
                                }
                            }
                        }
                    }
                }
            }
        }
        catch (err) {
            ToastAndroid.show("Disconnected check bluetooth connection", ToastAndroid.SHORT);
            console.log("Error occur..." + err);
        }
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Details!</Text>
            {/* <Text>{route.params.id}</Text> */}

            <TouchableOpacity
                style={{ width: '90%', backgroundColor: '#007bff', margin: 10, padding: 15, borderRadius: 20 }}
                onPress={() => { connect("90:E2:02:9E:9B:3E") }}
            >
                <Text style={{ color: "white", fontSize: 20, textAlign: 'center', fontFamily: 'Arial', }}>Connect</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={{ width: '90%', backgroundColor: '#007bff', margin: 10, padding: 15, borderRadius: 20 }}
                onPress={() => { disconnect("90:E2:02:9E:9B:3E") }}
            >
                <Text style={{ color: "white", fontSize: 20, textAlign: 'center', fontFamily: 'Arial', }}>Disconnect</Text>
            </TouchableOpacity>
        </View>
    );
}

export default LeftControl;