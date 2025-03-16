import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

export default function MainMenuScreen({ navigation }) {
    const [sound, setSound] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const loadSound = async () => {
            try {
                const { sound: newSound } = await Audio.Sound.createAsync(
                    require('../assets/sounds/Magic_Scout.mp3'),
                    { shouldPlay: true, isLooping: true }
                );
                if (isMounted) {
                    setSound(newSound);
                }
            } catch (error) {
                console.log('Error loading sound:', error);
            }
        };

        loadSound();

        const unsubscribe = navigation.addListener('focus', () => {
            // Reset any game states when returning to main menu
            navigation.setParams({ isPaused: false });
        });

        return () => {
            isMounted = false;
            if (sound) {
                sound.unloadAsync();
            }
            unsubscribe();
        };
    }, [navigation]);

    const handleStartGame = async () => {
        // Pause the music when starting the game
        if (sound) {
            await sound.pauseAsync();
        }
        navigation.navigate('GameScreen');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.mainButton}
                onPress={handleStartGame}
            >
                <Text style={styles.buttonText}>START GAME</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.mainButton}
                onPress={() => navigation.navigate('Settings')} 
            >
                <Text style={styles.buttonText}>SETTINGS</Text>
            </TouchableOpacity>
           
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainButton: {
        margin: 10,
        padding: 10,
        backgroundColor: 'pink',
        borderRadius: 15,
        width: 200,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
