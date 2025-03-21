import React from 'react';
import { View } from 'react-native';

export default function Platform({ body, size, camera }) {
    if (!body || !camera) return null;
    
    const width = size[0];
    const height = size[1];
    const x = body.position.x - width / 2 - camera.position.x;
    const y = body.position.y - height / 2;

    return (
        <View
            style={{
                position: 'absolute',
                left: x,
                top: y,
                width: width + 2, // Slight overlap to prevent gaps
                height: height,
                backgroundColor: 'green',
                zIndex: 1,
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.1)'
            }}
        />
    );
}