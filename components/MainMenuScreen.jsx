import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';


export default function MainMenuScreen({ navigation }) {
  
    const handleStartGame = async () => {
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
