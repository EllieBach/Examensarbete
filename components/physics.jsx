import Matter from 'matter-js';
import { Dimensions } from 'react-native';
import Obstacle from './Obstacle';
import Platform from './Platform';
import Spike from './Spike';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const OBSTACLE_SPEED = 8;
const SPAWN_INTERVAL = 3000;  // Increased to 3 seconds
const PLATFORM_WIDTH = windowWidth;
const PLATFORM_HEIGHT = 60;
const MIN_OBSTACLE_HEIGHT = windowHeight - 180;  // Adjusted height
const MAX_OBSTACLE_HEIGHT = windowHeight - 120;  // Adjusted height
const SPAWN_BUFFER = windowWidth * 1.2;  // Increased spawn distance
const OBSTACLE_WIDTH = 30;
const OBSTACLE_HEIGHT = 30;
const OBSTACLE_CLEANUP_DISTANCE = -200; // Increased cleanup distance
const MAX_OBSTACLES = 5; // Limit max obstacles
const PHYSICS_UPDATE_RATE = 1000 / 60; // 60 FPS
const OBSTACLE_BUFFER = windowWidth * 0.5;
const OBJECT_POOL_SIZE = 8;
const BATCH_SIZE = 4;
const POSITION_CACHE = { x: 0, y: 0 };
const COLLISION_CHECK_INTERVAL = 16; // Check collisions every 16ms
const SPIKE_WIDTH = 30;
const SPIKE_HEIGHT = 40;
const OBSTACLE_TYPES = ['block', 'spike'];
const FLOOR_Y = windowHeight - 30;
const PLAYABLE_AREA_HEIGHT = FLOOR_Y - 100; // Area between floor and top of screen
const SECTION_HEIGHT = PLAYABLE_AREA_HEIGHT / 3;

// Define spawn heights for different obstacles
const SPAWN_ZONES = {
    spike: FLOOR_Y - SPIKE_HEIGHT, // Spikes always on ground
    block: {
        min: FLOOR_Y - SECTION_HEIGHT * 3, // Top of playable area
        max: FLOOR_Y - SECTION_HEIGHT * 2  // 2/3 of playable area
    }
};

const Physics = (entities, { time }) => {
    const { physics, character } = entities;
    if (!physics?.engine || !character?.body) return entities;

    const world = physics.engine.world;

    // Use accumulated time for physics updates
    entities.physics.accumulator = (entities.physics.accumulator || 0) + time.delta;
    
    // Batch process physics updates
    if (entities.physics.accumulator >= PHYSICS_UPDATE_RATE) {
        const steps = Math.floor(entities.physics.accumulator / PHYSICS_UPDATE_RATE);
        for (let i = 0; i < Math.min(steps, BATCH_SIZE); i++) {
            Matter.Engine.update(physics.engine, PHYSICS_UPDATE_RATE);
        }
        entities.physics.accumulator %= PHYSICS_UPDATE_RATE;
    }

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

    // Only spawn new obstacle if we're under the limit
    const currentObstacles = Object.keys(entities).filter(key => key.startsWith('obstacle-')).length;
    
    if (entities.physics.timer >= SPAWN_INTERVAL && currentObstacles < MAX_OBSTACLES) {
        entities.physics.timer = 0;
        const obstacleId = `obstacle-${Date.now()}`;
        const obstacleType = OBSTACLE_TYPES[Math.floor(Math.random() * OBSTACLE_TYPES.length)];
        const spawnX = character.body.position.x + windowWidth + SPAWN_BUFFER;
        
        if (obstacleType === 'spike') {
            const spike = Matter.Bodies.rectangle(
                spawnX,
                SPAWN_ZONES.spike,  // Fixed height for spikes
                SPIKE_WIDTH,
                SPIKE_HEIGHT,
                { 
                    isStatic: true,
                    label: 'spike',
                    friction: 0,
                    frictionAir: 0,
                    collisionFilter: {
                        category: 0x0004,
                        mask: 0x0002
                    }
                }
            );

            Matter.World.add(world, [spike]);
            entities[obstacleId] = {
                body: spike,
                size: [SPIKE_WIDTH, SPIKE_HEIGHT],
                type: 'spike',
                renderer: Spike,
                camera: entities.camera
            };
        } else {
            // Random height within the upper zone for blocks
            const blockY = Math.random() * 
                (SPAWN_ZONES.block.max - SPAWN_ZONES.block.min) + 
                SPAWN_ZONES.block.min;

            const obstacle = Matter.Bodies.rectangle(
                spawnX,
                blockY,
                OBSTACLE_WIDTH,
                OBSTACLE_HEIGHT,
                { 
                    isStatic: true,
                    label: 'obstacle',
                    friction: 0,
                    frictionAir: 0,
                    collisionFilter: {
                        category: 0x0004,
                        mask: 0x0002
                    }
                }
            );

            Matter.World.add(world, [obstacle]);
            entities[obstacleId] = {
                body: obstacle,
                size: [OBSTACLE_WIDTH, OBSTACLE_HEIGHT],
                type: 'block',
                renderer: Obstacle,
                camera: entities.camera
            };
        }
    }

    // Object pooling for obstacles
    if (!entities.physics.obstaclePool) {
        entities.physics.obstaclePool = Array(OBJECT_POOL_SIZE).fill(null).map(() => {
            const body = Matter.Bodies.rectangle(0, 0, OBSTACLE_WIDTH, OBSTACLE_HEIGHT, {
                isStatic: true,
                label: 'obstacle',
                friction: 0,
                frictionAir: 0,
                collisionFilter: { category: 0x0004, mask: 0x0002 }
            });
            Matter.World.add(world, [body]);
            return body;
        });
    }

    // Optimized obstacle management using chunks
    entities.physics.lastCollisionCheck = entities.physics.lastCollisionCheck || 0;
    const currentTime = Date.now();
    const shouldCheckCollisions = currentTime - entities.physics.lastCollisionCheck > COLLISION_CHECK_INTERVAL;

    const obstacles = Object.entries(entities)
        .filter(([key]) => key.startsWith('obstacle-'))
        .map(([key, value]) => ({ key, ...value }));

    // Process obstacles in chunks
    for (let i = 0; i < obstacles.length; i += BATCH_SIZE) {
        const chunk = obstacles.slice(i, i + BATCH_SIZE);
        
        chunk.forEach(({ key, body }) => {
            if (!body) return;

            const distanceFromCharacter = body.position.x - character.body.position.x;

            if (distanceFromCharacter < OBSTACLE_CLEANUP_DISTANCE) {
                Matter.Composite.remove(world, body);
                delete entities[key];
                return;
            }

            if (shouldCheckCollisions && Math.abs(distanceFromCharacter) < PLATFORM_WIDTH) {
                if (Matter.Collision.collides(character.body, body)) {
                    physics.gameEngine?.current?.dispatch({ type: "game-over" });
                    return entities;
                }
            }

            POSITION_CACHE.x = body.position.x - OBSTACLE_SPEED;
            POSITION_CACHE.y = body.position.y;
            Matter.Body.setPosition(body, POSITION_CACHE);
        });
    }

    if (shouldCheckCollisions) {
        entities.physics.lastCollisionCheck = currentTime;
    }

    return entities;
};

export default Physics;
