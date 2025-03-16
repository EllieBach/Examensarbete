import react from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function GameOverScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text style={styles.gameOverText}>GAME OVER</Text>
            <TouchableOpacity
                style={styles.mainButton}
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