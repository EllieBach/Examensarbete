import Matter from 'matter-js';
import { Dimensions } from 'react-native';

const windowHeight = Dimensions.get('window').height;
const FLOOR_Y = windowHeight - 85;

// Adjusted constants for better ground detection
const GROUND_CHECK_TOLERANCE = 20;  // Increased tolerance
const JUMP_FORCE = -15;
const MAX_JUMP_HEIGHT = windowHeight / 3;
const GRAVITY = 0.8;

function JumpSystem(entities, { events = [] }) {
    const character = entities.character;
    
    if (!character?.body) return entities;

    // Simplified ground detection
    const isGrounded = character.body.position.y >= FLOOR_Y - GROUND_CHECK_TOLERANCE;
    character.isGrounded = isGrounded;

    // Handle jump
    if (events.find(e => e.type === "jump") && isGrounded) {
        Matter.Body.setPosition(character.body, {
            x: character.body.position.x,
            y: FLOOR_Y  // Reset position to floor before jump
        });
        Matter.Body.setVelocity(character.body, {
            x: character.body.velocity.x,
            y: JUMP_FORCE
        });
    }

    // Apply gravity
    if (!isGrounded) {
        Matter.Body.setVelocity(character.body, {
            x: character.body.velocity.x,
            y: Math.min(character.body.velocity.y + GRAVITY, 15)
        });
    } else {
        // Snap to ground
        Matter.Body.setPosition(character.body, {
            x: character.body.position.x,
            y: FLOOR_Y
        });
    }

    return entities;
}

export default JumpSystem;
