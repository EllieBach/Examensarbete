import React from 'react';
import { View } from 'react-native';

const Spike = ({ body, size, camera }) => {
    if (!body || !camera) return null;

    const width = size[0];
    const height = size[1];
    const x = body.position.x - width/2 - (camera?.position.x || 0);
    const y = body.position.y - height/2;

    return (
        <View style={{
            position: 'absolute',
            left: x,
            top: y,
            width: 0,
            height: 0,
            backgroundColor: 'transparent',
            borderStyle: 'solid',
            borderLeftWidth: width/2,
            borderRightWidth: width/2,
            borderBottomWidth: height,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: 'grey',
            zIndex: 2
        }} />
    );
};

export default Spike;
