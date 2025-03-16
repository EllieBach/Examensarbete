import React from 'react';
import { Image, StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Background = ({ camera }) => {
    if (!camera) return null;

    return (
        <Image
            source={require('../assets/images/background.png')}
            style={[
                styles.background,
                {
                    transform: [
                        { translateX: -camera.position.x * 0.8 }  
                    ],
                    zIndex: 0
                }
            ]}
        />
    );
};

const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 3800,
        height: windowHeight,
        resizeMode: 'stretch',
    }
});

export default Background;
