import Matter from 'matter-js';
import { Dimensions } from 'react-native';
import Obstacle from './Obstacle';
import Platform from './Platform';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const OBSTACLE_SPEED = 8;
const PLATFORM_WIDTH = windowWidth;
const PLATFORM_HEIGHT = 60;

const Physics = (entities, { time }) => {
    const { physics, character } = entities;
    if (!physics?.engine || !character?.body) return entities;

    const world = physics.engine.world;
    Matter.Engine.update(physics.engine, 16.667);

    // Ensure collision platform exists and follows character properly
    if (!entities['collision-floor']) {
        const platform = Matter.Bodies.rectangle(
            0,
            windowHeight - 30,
            windowWidth * 10, // Much wider collision floor
            PLATFORM_HEIGHT,
            {
                isStatic: true,
                friction: 1,
                label: 'floor',
                collisionFilter: {
                    category: 0x0001,
                    mask: 0x0002
                },
                chamfer: { radius: 0 }, // Sharp edges for better collision
                slop: 0.3
            }
        );
        Matter.World.add(world, [platform]);
        entities['collision-floor'] = {
            body: platform,
            lastCharacterX: character.body.position.x
        };
    }

    // Track character movement and update floor position
    const floor = entities['collision-floor'];
    const characterX = character.body.position.x;
    
    if (Math.abs(characterX - floor.lastCharacterX) > windowWidth) {
        Matter.Body.setPosition(floor.body, {
            x: characterX,
            y: windowHeight - 30
        });
        floor.lastCharacterX = characterX;
    }

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
