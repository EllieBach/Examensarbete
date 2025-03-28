import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GameOverScreen({ navigation, route }) {
    const [highScore, setHighScore] = useState(0);
    const score = route.params?.finalScore || 0;

    useEffect(() => {
        const updateHighScore = async () => {
            try {
                const savedScore = await AsyncStorage.getItem('highScore');
                const previousHigh = savedScore ? parseInt(savedScore) : 0;
                
                if (score > previousHigh) {
                    await AsyncStorage.setItem('highScore', score.toString());
                    setHighScore(score);
                } else {
                    setHighScore(previousHigh);
                }
            } catch (error) {
                console.log('Error handling high score:', error);
            }
        };

        updateHighScore();
    }, [score]);

    return (
        <View style={styles.container}>
            <Text style={styles.gameOverText}>GAME OVER</Text>
            <Text style={styles.scoreText}>Score: {score}</Text>
            <Text style={styles.highScoreText}>High Score: {highScore}</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.replace('GameScreen')}
            >
                <Text style={styles.buttonText}>PLAY AGAIN</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('MainMenu')}
            >
                <Text style={styles.buttonText}>MAIN MENU</Text>
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
    gameOverText: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    button: {
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
    scoreText: {
        fontSize: 30,
        marginVertical: 20,
    },
    highScoreText: {
        fontSize: 30,
        fontWeight: 'bold',
        marginVertical: 10,
        color: 'gold',
    },
});