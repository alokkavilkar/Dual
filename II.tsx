import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, Text, TouchableOpacity, View } from 'react-native';
import Sound from 'react-native-sound';
import AsyncStorage from '@react-native-async-storage/async-storage';


const II = ({ navigation }: { navigation: any }) => {
    const [name, setName] = React.useState("");
    React.useEffect(() => {
        const data = async () => {
            const data = await AsyncStorage.getItem("@app:name");
            if (data !== null) {
                setName(data);
            }
        }
        data();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {
                (!name) ?
                <Text style={{ color: 'black', fontSize: 25 }}> Welcome, User 👋</Text>
                :
                <Text style={{ color: 'black', fontSize: 25 }}>Welcome {name} 👋</Text>
            }
            <TouchableOpacity onPress={() => {
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
            }}>
                <Text>Play Sound</Text>
            </TouchableOpacity>
        </View>
    )
}

export default II;