import Matter from 'matter-js';
import { Dimensions } from 'react-native';

const CameraSystem = (entities, { time }) => {
    const windowWidth = Dimensions.get('window').width;
    
    if (!entities.character?.body || !entities.camera) return entities;

    const character = entities.character.body;

    // Only update camera position
    entities.camera.position.x = character.position.x - windowWidth / 3;

    return entities;
};

export default CameraSystem;
