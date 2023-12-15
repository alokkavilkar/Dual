import React, { useEffect, useState } from "react";
import { Alert, FlatList, NativeEventEmitter, NativeModules, PermissionsAndroid, Platform, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import BleManager, { BleDisconnectPeripheralEvent, BleScanCallbackType, BleScanMatchMode, BleScanMode, Peripheral } from 'react-native-ble-manager'
import { isLocationEnabled, promptForEnableLocationIfNeeded } from "react-native-android-location-enabler";

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const App = () => {
  useEffect(() => {
    BleManager.start({ showAlert: false });

    const ble1 = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);

    handlePermission();
    console.log(Platform.Version);


    return () => {
      ble1.remove();
    }
  });

  const [peripherals, setPeripherals] = useState(
    new Map<Peripheral['id'], Peripheral>(),
  );
  const addOrUpdatePeripheral = (id: string, updatedPeripheral: Peripheral) => {
    // console.log("Adding the peripherals.")
    setPeripherals(map => new Map(map.set(id, updatedPeripheral)));
  }

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
    console.debug('[handleDiscoverPeripheral] new BLE peripheral= ', peripheral.name);

    if (!peripheral) {
      console.log("Please check with the location");
    }

    if (!peripheral.name) {
      peripheral.name = 'No Name';
    }
    else {
      // console.log("Peripherals" + peripheral.name);
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
    <View>
      <TouchableOpacity style={{ margin: 20, padding: 40 }} onPress={enableBLE}>
        <Text>Click now</Text>
      </TouchableOpacity>

      <TouchableOpacity style={{ margin: 20, padding: 40 }} onPress={startScan}><Text>Click to scan</Text></TouchableOpacity>

      <FlatList style={{ width: '90%' }}
        data={Array.from(peripherals.values())}
        contentContainerStyle={{ rowGap: 12 }}
        keyExtractor={item => item.id}
        renderItem={item => (
          <TouchableHighlight
            style={{ backgroundColor: 'lightgrey', borderRadius: 20 }}
            underlayColor="#90EE90"
            onPress={() => { }}>
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
  )
}

export default App;