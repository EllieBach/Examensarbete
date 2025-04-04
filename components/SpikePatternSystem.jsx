import Matter from 'matter-js';
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const FLOOR_Y = windowHeight - 45;

// Spike constants
const SPAWN_INTERVAL = 2000;  // Time between patterns
const SPIKE_WIDTH = 30;
const SPIKE_HEIGHT = 30;
const SPIKE_SPACING = 60;     // Space between spikes in a pattern

const PATTERNS = [
    [0],           // Single spike
    [0, 0],       // Double spike
    [0, 0, 0]     // Triple spike
];

function SpikePatternSystem(entities, { time, dispatch }) {
    const { world } = entities.physics;
    const character = entities.character;
    const camera = entities.camera;
    const now = Date.now();

    // Initialize spawn timer if needed
    if (!entities.physics.lastSpawnTime) {
        entities.physics.lastSpawnTime = now;
        entities.physics.obstacleCount = 0;
    }

    // Spawn new pattern
    if (now - entities.physics.lastSpawnTime > SPAWN_INTERVAL) {
        // Select random pattern
        const pattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
        const spawnX = camera.position.x + windowWidth + 50; // Spawn ahead of camera

        // Create spikes based on pattern
        pattern.forEach((_, index) => {
            const spike = Matter.Bodies.rectangle(
                spawnX + (index * SPIKE_SPACING),
                FLOOR_Y - (SPIKE_HEIGHT / 2),
                SPIKE_WIDTH,
                SPIKE_HEIGHT,
                {
                    isStatic: true,
                    isSensor: true,
                    label: 'spike',
                    collisionFilter: {
                        category: 0x0002,
                        mask: 0x0001
                    }
                }
            );

            const obstacleId = `spike_${entities.physics.obstacleCount++}`;
            Matter.World.add(world, [spike]);
            
            entities[obstacleId] = {
                body: spike,
                renderer: entities.physics.renderer,
                camera: camera,
                size: [SPIKE_WIDTH, SPIKE_HEIGHT]
            };
        });

        entities.physics.lastSpawnTime = now;
    }

    return entities;
}

export default SpikePatternSystem;
