import Matter from 'matter-js';
import { Dimensions } from 'react-native';
import Obstacle from './Obstacle';
import Platform from './Platform';
import Spike from './Spike';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const FLOOR_Y = windowHeight - 65;  // Adjusted floor height

// Game constants
const JUMP_VELOCITY = -13;  // Adjusted for cross-platform consistency
const RUN_SPEED = 5;  // Increased run speed
const MAX_FALL_SPEED = 15;
const FLOOR_OFFSET = 5;
const GROUND_THRESHOLD = 1;  // Tighter ground detection
const SAFETY_MARGIN = 200;  // Add safety margin
const RESET_Y = FLOOR_Y + 300;

// Obstacle constants
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

const Physics = (entities, { time, events = [] }) => {
    const { engine, world } = entities.physics;
    const character = entities.character;
    const floor = entities.floor?.body;
    
    if (character?.body) {
        // Safety check - reset if fallen too far
        if (character.body.position.y > RESET_Y) {
            Matter.Body.setPosition(character.body, {
                x: character.body.position.x,
                y: FLOOR_Y - 10
            });
            Matter.Body.setVelocity(character.body, {
                x: RUN_SPEED,
                y: 0
            });
            return entities;
        }

        // Improved ground detection
        const groundDistance = Math.abs(character.body.position.y - FLOOR_Y);
        const isGrounded = groundDistance < 2;
        character.isGrounded = isGrounded;

        // Handle movement
        if (isGrounded) {
            // Lock to ground when grounded
            Matter.Body.setPosition(character.body, {
                x: character.body.position.x,
                y: FLOOR_Y
            });
            Matter.Body.setVelocity(character.body, {
                x: RUN_SPEED,
                y: 0
            });
        } else {
            // Air control
            Matter.Body.setVelocity(character.body, {
                x: RUN_SPEED,
                y: Math.min(character.body.velocity.y, 15)
            });
        }

        // Handle jump with better detection
        if (events.find(e => e.type === "jump") && isGrounded) {
            Matter.Body.setVelocity(character.body, {
                x: RUN_SPEED,
                y: JUMP_VELOCITY
            });
        }

        Matter.Body.setAngle(character.body, 0);
    }

    Matter.Engine.update(engine, time.delta);
    return entities;
};

export default Physics;