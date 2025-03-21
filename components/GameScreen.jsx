import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import Modal from "react-native-modal";
import { GameEngine } from "react-native-game-engine";
import controls from "./Controls"; // Import controls
import Matter from "matter-js"; // Import Matter.js for physics engine
import Character from "./Character"; // Import Character component
import Physics from './physics';
import Obstacle from './Obstacle';
import CameraSystem from './CameraSystem';
import Platform from './Platform'; // Add this import
import Background from './Background'; // Add this import
import InfiniteFloor from './InfiniteFloor';

export default function GameScreen({ navigation }) {
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);  // Add this state
  const [score, setScore] = useState(0);  // Add score state
  const gameEngine = useRef(null); // Reference to GameEngine
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  // Initialize Matter.js engine with better physics settings
  const engine = Matter.Engine.create({
    enableSleeping: false,
    constraintIterations: 4,
    velocityIterations: 8
  });
  const world = engine.world;
  engine.world.gravity.y = 2.8;

  // Make character with adjusted physics
  const character = Matter.Bodies.rectangle(
    screenWidth / 3,
    screenHeight - 100,
    50,
    50,
    {
      restitution: 0.1, // Added small bounce
      friction: 0.2,
      frictionAir: 0.0008,
      mass: 0.8,
      label: 'character',
      inertia: Infinity,
      collisionFilter: {
        group: -1,
        category: 0x0002,
        mask: 0x0005  // Updated to collide with floor (0x0001) and obstacles (0x0004)
      }
    }
  );

  // Remove any initial rotation
  Matter.Body.setAngle(character, 0);
  
  // Ensure initial velocity
  Matter.Body.setVelocity(character, { x: 5, y: 0 });

  // Create initial platform
  const initialPlatform = Matter.Bodies.rectangle(
    0,  // Start at x=0
    screenHeight - 30,
    screenWidth * 2,  // Make initial platform wider
    60,
    {
      isStatic: true,
      friction: 1,
      label: 'floor',
      collisionFilter: {
        category: 0x0001,
        mask: 0x0002
      }
    }
  );

  Matter.World.add(world, [character, initialPlatform]);

  // Create camera first, with initial position
  const camera = { position: { x: 0, y: 0 } };

  // Set up game objects
  const entities = {
    background: {
      renderer: Background,
      camera: camera,
      zIndex: 0  // Draw first
    },
    floor: {
      renderer: InfiniteFloor,
      camera: camera,
      zIndex: 1
    },
    character: {
      body: character,
      size: [50, 50],
      renderer: Character,
      camera: camera,
      zIndex: 2  // Draw last
    },
    camera: camera,
    physics: { 
      engine: engine, 
      world: world, 
      gameEngine: gameEngine 
    }
  };

  const handlePause = () => {
    if (!isGameOver) {  // Only allow pause if game isn't over
      console.log("Pause button clicked!");
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    console.log("Game Resumed");
    setIsPaused(false);
  };

  
  const handleJump = () => {
    if (!isPaused && gameEngine.current) {
      gameEngine.current.dispatch({ type: "jump" });
    }
  };

  const handleMainMenu = () => {
    setIsPaused(false);
    navigation.navigate("MainMenu");
  };

  const onEvent = (e) => {
    if (e.type === "game-over") {
      setIsGameOver(true);  // Set game over state
      console.log("Game Over triggered!");
      navigation.navigate("GameOver", { finalScore: score });
    } else if (e.type === "score") {
      setScore(prev => prev + 1);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleJump}>
      <View style={styles.container}>
        {/* Score Display */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{score}</Text>
        </View>
        
        {/* Pause Button */}
        <TouchableOpacity
          onPress={handlePause}
          style={styles.pauseButtonContainer}
          activeOpacity={0.7}
        >
          <Image
            source={require("../assets/images/pause.png")}
            style={styles.pauseButton}
          />
        </TouchableOpacity>

        {/* Game Engine */}
        <GameEngine
          ref={gameEngine}
          systems={[controls, Physics, CameraSystem]} 
          entities={entities} 
          running={!isPaused && !isGameOver}  // Stop game engine on game over
          onEvent={onEvent}
          style={styles.gameEngine}
        />

        {/* Pause Modal - Only show if game isn't over */}
        {isPaused && !isGameOver && (
          <Modal
            isVisible={true}
            onBackdropPress={handleResume}
            animationIn="fadeIn"
            animationOut="fadeOut"
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>Game Paused</Text>
                <TouchableOpacity style={styles.menuButton} onPress={handleResume}>
                  <Text style={styles.buttonText}>Resume</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={handleMainMenu}
                >
                  <Text style={styles.buttonText}>Main Menu</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  pauseButtonContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 5,
  },
  pauseButton: {
    width: 40,
    height: 40,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 250,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    
  },
  menuButton: {
    backgroundColor: "pink",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: 140,
    marginTop: 10,
   
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  gameEngine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  scoreContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 5,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
});
