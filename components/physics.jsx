import Matter from 'matter-js';
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const FLOOR_Y = windowHeight - 85;


const MOVE_SPEED = 5;

function Physics(entities, { time, events = [] }) {
    const { engine } = entities.physics;
    const character = entities.character;
    const camera = entities.camera;

    if (character?.body) {
        // Keep horizontal movement and position synced
        Matter.Body.setVelocity(character.body, {
            x: MOVE_SPEED,
            y: character.body.velocity.y
        });

        if (character.isGrounded) {
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