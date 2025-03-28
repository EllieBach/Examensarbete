import React from 'react';
import { View } from 'react-native';

const Character = React.memo(({ body, size, camera }) => {
    if (!body || !camera) return null;
    
    const x = Math.round(body.position.x - size[0]/2 - (camera?.position?.x || 0));
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
                zIndex: 1
            }}
        />
    );
}, (prev, next) => {
    return Math.round(prev.body.position.x) === Math.round(next.body.position.x) &&
           Math.round(prev.body.position.y) === Math.round(next.body.position.y) &&
           prev.camera.position.x === next.camera.position.x;
});

export default Character;
