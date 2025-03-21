import Matter from 'matter-js';
import { Dimensions } from 'react-native';

const LERP_FACTOR = 0.3; // Increased for snappier camera movement
const TARGET_OFFSET = Dimensions.get('window').width / 3;
const UPDATE_THRESHOLD = 0.1; // Reduced threshold for more responsive updates

const CameraSystem = (entities) => {
    const character = entities.character;
    const camera = entities.camera;
    
    if (character?.body && camera) {
        const targetX = character.body.position.x - TARGET_OFFSET;
        const dx = targetX - camera.position.x;
        
        if (Math.abs(dx) > UPDATE_THRESHOLD) {
            camera.position.x = targetX - (dx * (1 - LERP_FACTOR));
        }
    }
    
    return entities;
};

export default CameraSystem;
