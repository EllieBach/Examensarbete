import React from 'react';
import { View } from 'react-native';

const Obstacle = ({ body, camera }) => {
    if (!body || !camera) return null;

    const width = 30;
    const height = 30;
    const x = body.position.x - width/2 - (camera?.position?.x || 0);
    const y = body.position.y - height/2;

    return (
        <View
            style={{
                position: 'absolute',
                left: x,
                top: y,
                width: width,
                height: height,
                backgroundColor: '#ff0000',
                borderRadius: 5,
                zIndex: 2
            }}
        />
    );
};

export default React.memo(Obstacle, (prev, next) => {
    return Math.round(prev.body?.position?.x) === Math.round(next.body?.position?.x) &&
           Math.round(prev.body?.position?.y) === Math.round(next.body?.position?.y) &&
           prev.camera?.position?.x === next.camera?.position?.x;
});
