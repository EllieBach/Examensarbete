import React from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const BACKGROUND_WIDTH = windowWidth * 2; 

const Background = ({ camera }) => {
    if (!camera) return null;

   
    const cameraX = camera.position.x;
    const baseOffset = (cameraX * 0.6) % BACKGROUND_WIDTH;
    const segments = 3; 

    return (
        <>
            {Array.from({ length: segments }).map((_, i) => (
                <View
                    key={i}
                    style={[
                        styles.background,
                        {
                            backgroundColor: '#2e9dff',
                            left: -baseOffset + (BACKGROUND_WIDTH * i),
                            width: BACKGROUND_WIDTH
                        }
                    ]}
                />
            ))}
        </>
    );
};

const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        top: 0,
        height: windowHeight,
        zIndex: -1
    }
});

export default Background;
