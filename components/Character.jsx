import React from 'react';
import { View, Dimensions } from 'react-native';

const windowHeight = Dimensions.get('window').height;

const Character = ({ body, size, camera }) => {
    if (!body || !camera) return null;
    
    const x = body.position.x - (size[0] / 2) - camera.position.x;
    const y = Math.min(body.position.y - (size[1] / 2), windowHeight - size[1]);

    return (
        <View
            style={{
                position: 'absolute',
                left: x,
                top: y,
                width: size[0],
                height: size[1],
                backgroundColor: 'rgb(128, 13, 13)',
                borderRadius: 5,
                transform: [{ translateX: 0 }],
                zIndex: 999,
                elevation: 999  // Added for Android
            }}
        />
    );
};

export default Character;
