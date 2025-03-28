import Matter from 'matter-js';
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const FLOOR_Y = windowHeight - 85;

// Adjusted constants for better physics
const INITIAL_X = windowWidth / 3;
const MOVE_SPEED = 5;
const JUMP_FORCE = -15;
const GRAVITY = 0.8;
const MAX_FALL_SPEED = 15;

function Physics(entities, { time, events = [] }) {
    const { engine, world } = entities.physics;
    const character = entities.character;
    const floor = entities.floor;
    const camera = entities.camera;

    if (character?.body) {
        // Ground detection with position check
        const isGrounded = character.body.position.y >= FLOOR_Y;
        character.isGrounded = isGrounded;

        // Jump handling
        if (events.find(e => e.type === "jump")) {
            console.log("Jump detected, isGrounded:", isGrounded);
            if (isGrounded) {
                console.log("Applying jump force");
                Matter.Body.setVelocity(character.body, {
                    x: MOVE_SPEED,
                    y: JUMP_FORCE
                });
            }
        }

        // Apply physics
        if (!isGrounded) {
            const newVelY = Math.min(character.body.velocity.y + GRAVITY, MAX_FALL_SPEED);
            Matter.Body.setVelocity(character.body, {
                x: MOVE_SPEED,
                y: newVelY
            });
        } else {
            Matter.Body.setPosition(character.body, {
                x: camera.position.x + INITIAL_X,
                y: FLOOR_Y
            });
            Matter.Body.setVelocity(character.body, {
                x: MOVE_SPEED,
                y: 0
            });
        }

        // Update camera
        camera.position.x += MOVE_SPEED;
    }

    Matter.Engine.update(engine, time.delta);
    return entities;
}

export default Physics;