import react from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function GameOverScreen({ navigation, route }) {
    const score = route.params?.finalScore || 0;

    return (
        <View style={styles.container}>
            <Text style={styles.gameOverText}>GAME OVER</Text>
            <Text style={styles.scoreText}>Score: {score}</Text>
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
});