import React from 'react';
import { View } from 'react-native';

const Spike = ({ body, camera }) => {
    if (!body || !camera) return null;

    const width = 30;
    const height = 30;
    const x = body.position.x - (width / 2) - camera.position.x;
    const y = body.position.y - (height / 2);

    return (
        <View
            style={{
                position: 'absolute',
                left: x,
                top: y,
                width: width,
                height: height,
                borderStyle: 'solid',
                borderLeftWidth: width / 2,
                borderRightWidth: width / 2,
                borderBottomWidth: height,
                borderLeftColor: 'transparent',
                borderRightColor: 'transparent',
                borderBottomColor: '#ff0000',
                backgroundColor: 'transparent',
                zIndex: 999
            }}
        />
    );
};

export default Spike;
