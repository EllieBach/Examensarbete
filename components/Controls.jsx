import Matter from 'matter-js';
import { Dimensions } from 'react-native';

const JUMP_FORCE = -13;
const RUN_SPEED = 5;
const GROUND_THRESHOLD = 1; // Increased threshold
const WINDOW_HEIGHT = Dimensions.get('window').height;

const controls = (entities, { events }) => {
    const character = entities.character?.body;
    const floor = entities['collision-floor']?.body;
    if (!character || !floor) return entities;

    // Maintain horizontal velocity
    Matter.Body.setVelocity(character, {
        x: RUN_SPEED,
        y: character.velocity.y
    });

    // Handle jump events with better collision detection
    if (events.length) {
        events.forEach(event => {
            if (event.type === "jump") {
                const collision = Matter.Collision.collides(character, floor);
                const isNearGround = character.position.y >= WINDOW_HEIGHT - 150;

                if (collision || isNearGround) {
                    Matter.Body.setVelocity(character, {
                        x: RUN_SPEED,
                        y: JUMP_FORCE
                    });
                }
            }
        });
    }

    return entities;
};

export default controls;
