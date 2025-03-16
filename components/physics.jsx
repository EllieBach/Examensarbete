import Matter from 'matter-js';
import { Dimensions } from 'react-native';
import Obstacle from './Obstacle';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const OBSTACLE_SPEED = 8;

const Physics = (entities, { time }) => {
    const { physics, character } = entities;
    if (!physics?.engine || !character?.body) return entities;

    const world = physics.world; 

    Matter.Engine.update(physics.engine, 16.667);

    // Check if character has fallen off screen
    if (character.body.position.y > Dimensions.get('window').height + 100) {
        if (physics.gameEngine?.current) {
            physics.gameEngine.current.dispatch({ type: "game-over" });
        }
        return entities;
    }
  
    entities.physics.timer = entities.physics.timer || 0;
    entities.physics.timer += time.delta;

    // Create new obstacle every 2 seconds
    if (entities.physics.timer >= 2000) {
        entities.physics.timer = 0;
        const obstacleId = `obstacle-${Date.now()}`;
        
        const obstacle = Matter.Bodies.rectangle(
            windowWidth + 50,
            windowHeight - 200,
            50,
            100,
            { 
                isStatic: true,
                label: 'obstacle',
                friction: 0,
                frictionAir: 0
            }
        );

        // Use the world reference from physics entity
        Matter.World.add(world, [obstacle]);
        
        entities[obstacleId] = {
            body: obstacle,
            size: [50, 100],
            color: 'purple',
            renderer: Obstacle,
            camera: entities.camera
        };
    }

    // Move obstacles
    Object.keys(entities).forEach(key => {
        if (key.startsWith('obstacle-')) {
            const obstacle = entities[key]?.body;
            if (obstacle) {
                Matter.Body.setPosition(obstacle, {
                    x: obstacle.position.x - OBSTACLE_SPEED,
                    y: obstacle.position.y
                });

                // Remove obstacles that are off screen
                if (obstacle.position.x < -100) {
                    Matter.Composite.remove(world, obstacle);
                    delete entities[key];
                }
            }
        }
    });

    return entities;
};

export default Physics;
