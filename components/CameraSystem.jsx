import { Dimensions } from 'react-native';

const LERP_FACTOR = 0.1;
const TARGET_OFFSET = Dimensions.get('window').width / 3;

const CameraSystem = (entities) => {
    const character = entities.character;
    const camera = entities.camera;
    
    if (character?.body && camera) {
        // Keep character in view horizontally
        const targetX = character.body.position.x - TARGET_OFFSET;
        camera.position.x = targetX;  // Direct tracking instead of lerping
        
        // Ensure camera doesn't lag behind
        if (camera.position.x < character.body.position.x - TARGET_OFFSET * 1.5) {
            camera.position.x = character.body.position.x - TARGET_OFFSET;
        }
    }
    
    return entities;
};

// Change to named export
export { CameraSystem };
