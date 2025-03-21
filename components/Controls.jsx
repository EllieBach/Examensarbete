import Matter from 'matter-js';
import { Dimensions } from 'react-native';

const JUMP_FORCE = -20;
const RUN_SPEED = 8;
const GROUND_THRESHOLD = 0.8; // Increased threshold for better ground detection
const MAX_FALL_SPEED = 25;
const FLOOR_Y = Dimensions.get('window').height - 80; // Reference point for ground

const VELOCITY_CACHE = {
    x: RUN_SPEED,
    y: 0
};

const controls = (entities, { events }) => {
    const character = entities.character?.body;
    if (!character) return entities;

    // Improved ground detection
    const isGrounded = 
        character.position.y >= FLOOR_Y - 10 && 
        character.velocity.y >= -0.1;

    // Maintain consistent horizontal speed
    Matter.Body.setVelocity(character, {
        x: RUN_SPEED,
        y: Math.min(character.velocity.y, MAX_FALL_SPEED)
    });

    // Handle jump events with better ground detection
    if (events.length && isGrounded) {
        events.forEach(event => {
            if (event.type === "jump") {
                Matter.Body.setVelocity(character, {
                    x: RUN_SPEED,
                    y: JUMP_FORCE
                });
            }
        });
    }

    return entities;
};

export default controls;
