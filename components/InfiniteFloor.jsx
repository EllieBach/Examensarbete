import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const FLOOR_HEIGHT = 60;
const SEGMENTS = 4; // Increased number of segments

const InfiniteFloor = ({ camera }) => {
    const [floors, setFloors] = useState(
        Array.from({ length: SEGMENTS }, (_, i) => ({
            key: i,
            position: i * screenWidth
        }))
    );

    useEffect(() => {
        const updateFloors = () => {
            const cameraX = camera?.position.x || 0;
            
            setFloors(prevFloors => {
                return prevFloors.map(floor => {
                    let position = floor.position - cameraX;
                    
                    // Recycle floor segments
                    while (position < -screenWidth * 1.5) {
                        position += screenWidth * SEGMENTS;
                    }
                    
                    return {
                        ...floor,
                        position
                    };
                }).sort((a, b) => a.position - b.position);
            });

            requestAnimationFrame(updateFloors);
        };

        const animationId = requestAnimationFrame(updateFloors);
        return () => cancelAnimationFrame(animationId);
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
};

const styles = StyleSheet.create({
    floor: {
        position: 'absolute',
        bottom: 30,
        height: FLOOR_HEIGHT,
        backgroundColor: 'green',
        zIndex: 1,
        opacity: 0.8
    },
});

export default InfiniteFloor;
