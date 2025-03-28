import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const FLOOR_HEIGHT = 60;
const SEGMENTS = 4; 

const InfiniteFloor = React.memo(({ camera }) => {
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
                    while (position < -screenWidth) {
                        position += screenWidth * SEGMENTS;
                    }
                    return { ...floor, position };
                });

                return newPositions;
            });

            frameId = requestAnimationFrame(updateFloors);
        };

        frameId = requestAnimationFrame(updateFloors);
        return () => cancelAnimationFrame(frameId);
    }, [camera]);

    return (
        <>
            {floors.map(floor => (
                <View
                    key={floor.key}
                    style={[
                        styles.floor,
                        { 
                            transform: [{ translateX: floor.position }],
                            width: screenWidth + 1 // Slight overlap
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
