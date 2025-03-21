import Matter from 'matter-js';
import { Dimensions } from 'react-native';

const LERP_FACTOR = 0.08; // Reduced for smoother movement
const TARGET_OFFSET = Dimensions.get('window').width / 3;

const CameraSystem = (entities) => {
    const character = entities.character;
    const camera = entities.camera;
    
    if (character && camera) {
        const targetX = character.body.position.x - TARGET_OFFSET;
        const dx = targetX - camera.position.x;
        
        // Apply smoother lerping with minimum movement threshold
        if (Math.abs(dx) > 0.01) {
            camera.position.x += dx * LERP_FACTOR;
        }
    }
    
    return entities;
};

export default CameraSystem;
