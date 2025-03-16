import Matter from 'matter-js';

const JUMP_FORCE = -10; // Increased jump force
const RUN_SPEED = 5;

const controls = (entities, { events }) => {
    const character = entities.character?.body;
    const floor = entities.floor?.body;
    if (!character || !floor) return entities;

    // Keep running
    Matter.Body.setVelocity(character, {
        x: RUN_SPEED,
        y: character.velocity.y
    });

    // Handle jump events
    if (events.length) {
        events.forEach(event => {
            if (event.type === "jump") {
                // Simpler ground detection
                if (Math.abs(character.velocity.y) < 0.1) {
                    console.log('Jumping!');
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
