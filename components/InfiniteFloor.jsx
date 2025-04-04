import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const FLOOR_HEIGHT = 60;
const SEGMENTS = 4; 
const GROUND_CHECK_TOLERANCE = 20;
const FLOOR_Y = Dimensions.get('window').height - 85;

const InfiniteFloor = React.memo(({ camera, entities }) => {
    const [floors, setFloors] = useState(
        Array.from({ length: SEGMENTS }, (_, i) => ({
            key: i,
            position: i * screenWidth
        }))
    );

    useEffect(() => {
        let frameId;
        const updateFloors = () => {
            const cameraX = camera?.position.x || 0;
            
            setFloors(prevFloors => {
                const newPositions = prevFloors.map(floor => {
                    let position = floor.position - cameraX;
                    // Ensure floor segments stay in view
                    while (position < -screenWidth) {
                        position += screenWidth * SEGMENTS;
                    }
                    return { ...floor, position: Math.round(position) };
                });

                // Update ground check with more precise position tracking
                if (entities?.physics) {
                    entities.physics.floorSegments = newPositions;
                    entities.physics.checkGrounded = (charX, charY) => {
                        const absoluteCharX = charX;
                        return newPositions.some(floor => {
                            const floorStart = floor.position + cameraX;
                            const floorEnd = floorStart + screenWidth;
                            return absoluteCharX >= floorStart && 
                                   absoluteCharX <= floorEnd && 
                                   Math.abs(charY - FLOOR_Y) <= GROUND_CHECK_TOLERANCE;
                        });
                    };
                }

                return newPositions;
            });

            frameId = requestAnimationFrame(updateFloors);
        };

        frameId = requestAnimationFrame(updateFloors);
        return () => cancelAnimationFrame(frameId);
    }, [camera, entities]);

    return (
        <>
            {floors.map(floor => (
                <View
                    key={floor.key}
                    style={[
                        styles.floor,
                        { 
                            transform: [{ translateX: floor.position }],
                            width: screenWidth + 1 // Added 1 to avoid clipping
                        }
                    ]}
                />
            ))}
        </>
    );
});

const styles = StyleSheet.create({
    floor: {
        position: 'absolute',
        bottom:0,
        height: FLOOR_HEIGHT,
        backgroundColor: 'rgb(0, 126, 42)',
        zIndex: 1,
        opacity: 0.8
    },
});

export default InfiniteFloor;
