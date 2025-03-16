import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
export default function Settings({ navigation }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.mainButton}
                onPress={() => navigation.navigate('MainMenu')} 
            >
                <Text style={styles.buttonText}>BACK TO MAIN MENU</Text>
            </TouchableOpacity>
        </View>
    );
}

styles = StyleSheet.create({
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
})