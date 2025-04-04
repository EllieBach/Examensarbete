import Matter from 'matter-js';
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const FLOOR_Y = windowHeight - 85;

const GROUND_CHECK_RADIUS = 0.2;
const JUMP_FORCE = -5;
const MOVE_SPEED = 5;

function Physics(entities, { time, events = [] }) {
    const { engine } = entities.physics;
    const character = entities.character;
    const camera = entities.camera;

    if (character?.body) {
      
        const charBottom = character.body.position.y + (character.size[1] / 2);
        const isGrounded = Math.abs(charBottom - FLOOR_Y) <= GROUND_CHECK_RADIUS;

        
        character.isGrounded = isGrounded;

        if (events.find(e => e.type === "jump") && isGrounded) {
            Matter.Body.applyForce(character.body, 
                character.body.position, 
                { x: 0, y: JUMP_FORCE }
            );
        }

        // Keep horizontal movement and position synced
        Matter.Body.setVelocity(character.body, {
            x: MOVE_SPEED,
            y: character.body.velocity.y
        });

        if (isGrounded) {
            Matter.Body.setPosition(character.body, {
                x: camera.position.x + (windowWidth / 3),
                y: FLOOR_Y
            });
        }

        camera.position.x += MOVE_SPEED;
    }

    Matter.Engine.update(engine, time.delta);
    return entities;
}

export default Physics;