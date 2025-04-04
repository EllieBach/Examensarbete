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
import controls from "./Controls"; 
import Matter from "matter-js"; 
import Character from "./Character"; 
import Physics from './physics';
import { CameraSystem } from './CameraSystem';
import SpikePatternSystem from './SpikePatternSystem';
import Background from './Background'; 
import InfiniteFloor from './InfiniteFloor';


const gameSystem = (entities, { time, dispatch, touches, events }) => {
  const updatedEntities = Physics(entities, { time, events });
  controls(updatedEntities, { touches, dispatch });
  SpikePatternSystem(updatedEntities, { time, dispatch });
  CameraSystem(updatedEntities);
  return updatedEntities;
};

export default function GameScreen({ navigation }) {
  const [isPaused, setIsPaused] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);  
  const [score, setScore] = useState(0); 
  const gameEngine = useRef(null);
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  // Add score timer effect
  useEffect(() => {
    let scoreTimer;
    if (!isPaused && !isGameOver) {
      scoreTimer = setInterval(() => {
        setScore(prevScore => prevScore + 1);
      }, 1000); // Increment score every second
    }
    return () => {
      if (scoreTimer) {
        clearInterval(scoreTimer);
      }
    };
  }, [isPaused, isGameOver]);

  const engine = Matter.Engine.create({
    enableSleeping: false,
  });
  const world = engine.world;
  //.gravity.y = 0;  // We'll handle gravity manually

  const platformY = screenHeight - 30;
  const initialPlatform = Matter.Bodies.rectangle(
    screenWidth / 2,
    platformY,
    screenWidth * 30, 
    100,
    {
      isStatic: true,
      friction: 0,
      restitution: 0,
      label: 'floor',
      chamfer: { radius: 0 },
      collisionFilter: {
        category: 0x0001, 
        mask: 0x0002   
      }
    }
  );

  const character = Matter.Bodies.rectangle(
    screenWidth / 3,
    screenHeight - 85,
    50,
    50,
    {
      friction: 0,
      frictionAir: 0,
      restitution: 0,
      mass: 1,
      inertia: Infinity,
      label: 'character',
      collisionFilter: {
        category: 0x0002,
        mask: 0x0001
      }
    }
  );

  Matter.Body.setInertia(character, Infinity);
  Matter.Body.setAngle(character, 0);

  
  Matter.Body.setVelocity(character, {
    x: 5,
    y: 0
  });

  
  useEffect(() => {
    return () => {
      Matter.World.clear(world);
      Matter.Engine.clear(engine);
    };
  }, []);

  Matter.World.add(world, [character, initialPlatform]);


  const camera = { position: { x: 0, y: 0 } };


  const entities = {
    background: {
      renderer: Background,
      camera: camera,
      zIndex: 0 
    },
    floor: {
      body: initialPlatform,  
      renderer: InfiniteFloor,
      camera: camera,
      zIndex: 1
    },
    character: {
      body: character,
      size: [50, 50],
      isGrounded: true,  
      renderer: Character,
      camera: camera,
      zIndex: 3  
    },
    camera: camera,
    physics: { 
      engine: engine, 
      world: world, 
      gameEngine: gameEngine,
      lastSpawnTime: 0,  
      obstacleCount: 0   
    }
  };

  const handlePause = () => {
    if (!isGameOver) {  
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
      setIsGameOver(true);
      console.log("Game Over triggered with score:", score);
      navigation.navigate("GameOver", { 
        finalScore: score,
        fromGame: true
      });
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
          systems={[gameSystem]}
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
