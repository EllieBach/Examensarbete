import React from 'react';
import { View } from 'react-native';

const Character = React.memo(({ body, size, camera }) => {
    if (!body || !camera) return null;
    
    const transform = [{
        translateX: body.position.x - size[0]/2 - (camera?.position?.x || 0)
    }, {
        translateY: body.position.y - size[1]/2
    }];

    return (
        <View
            style={{
                position: 'absolute',
                width: size[0],
                height: size[1],
                backgroundColor: 'red',
                borderRadius: 5,
                zIndex: 1,
                transform
            }}
        />
    );
}, (prev, next) => {
    return prev.body.position.x === next.body.position.x &&
           prev.body.position.y === next.body.position.y &&
           prev.camera.position.x === next.camera.position.x;
});

export default Character;
