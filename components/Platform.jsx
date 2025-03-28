import React from 'react';
import { View, Dimensions } from 'react-native';

export default function Platform({ body, size, camera }) {
    if (!body || !camera) return null;
    
    const screenHeight = Dimensions.get('window').height;
    const width = size[0];
    const x = body.position.x - width / 2 - camera.position.x;

    return (
        <View
            style={{
                position: 'absolute',
                left: x,
                bottom: -50, // Extend below screen bottom
                width: width + 100,
                height: screenHeight * 0.3, // Increase height to 30% of screen
                backgroundColor: 'green',
                zIndex: 1,
                borderWidth: 1,
                borderColor: 'rgb(0, 126, 42)'
            }}
        />
    );
}