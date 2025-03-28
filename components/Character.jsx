import React from 'react';
import { View } from 'react-native';

const Character = ({ body, size, camera }) => {
    if (!body || !camera) return null;
    
    const x = Math.round(body.position.x - size[0]/2 - camera.position.x);
    const y = Math.round(body.position.y - size[1]/2);

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
                zIndex: 999  // Ensure character is always on top
            }}
        />
    );
};

export default Character;
