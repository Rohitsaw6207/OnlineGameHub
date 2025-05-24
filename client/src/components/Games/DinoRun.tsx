import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Position {
  x: number;
  y: number;
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'cactus' | 'bird';
}

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 200;
const DINO_WIDTH = 30;
const DINO_HEIGHT = 40;
const GROUND_Y = CANVAS_HEIGHT - 20;
const GRAVITY = 0.8;
const JUMP_STRENGTH = -15;
const GAME_SPEED = 5;

export function DinoRun() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  const [dino, setDino] = useState<Position>({ x: 50, y: GROUND_Y - DINO_HEIGHT });
  const [dinoVelocity, setDinoVelocity] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [gameSpeed, setGameSpeed] = useState(GAME_SPEED);

  const resetGame = useCallback(() => {
    setDino({ x: 50, y: GROUND_Y - DINO_HEIGHT });
    setDinoVelocity(0);
    setIsJumping(false);
    setObstacles([]);
    setScore(0);
    setGameSpeed(GAME_SPEED);
    setGameOver(false);
  }, []);

  const startGame = () => {
    resetGame();
    setGameRunning(true);
  };

  const jump = useCallback(() => {
    if (gameRunning && !gameOver && !isJumping) {
      setDinoVelocity(JUMP_STRENGTH);
      setIsJumping(true);
    }
  }, [gameRunning, gameOver, isJumping]);

  // Generate obstacles
  const generateObstacle = useCallback((): Obstacle => {
    const type = Math.random() < 0.7 ? 'cactus' : 'bird';
    const obstacle: Obstacle = {
      x: CANVAS_WIDTH,
      type,
      width: 0,
      height: 0,
      y: 0
    };
    
    if (type === 'cactus') {
      obstacle.width = 20;
      obstacle.height = 40;
      obstacle.y = GROUND_Y - obstacle.height;
    } else {
      obstacle.width = 30;
      obstacle.height = 20;
      obstacle.y = GROUND_Y - 80; // Flying bird
    }
    
    return obstacle;
  }, []);

  // Collision detection
  const checkCollision = useCallback((dinoPos: Position, obstacleList: Obstacle[]): boolean => {
    for (const obstacle of obstacleList) {
      if (
        dinoPos.x + DINO_WIDTH > obstacle.x &&
        dinoPos.x < obstacle.x + obstacle.width &&
        dinoPos.y + DINO_HEIGHT > obstacle.y &&
        dinoPos.y < obstacle.y + obstacle.height
      ) {
        return true;
      }
    }
    return false;
  }, []);

  // Game loop
  useEffect(() => {
    if (!gameRunning || gameOver) return;

    const gameLoop = setInterval(() => {
      // Update dino
      setDinoVelocity(prev => prev + GRAVITY);
      setDino(prev => {
        const newY = prev.y + dinoVelocity;
        
        // Ground collision
        if (newY >= GROUND_Y - DINO_HEIGHT) {
          setIsJumping(false);
          setDinoVelocity(0);
          return { ...prev, y: GROUND_Y - DINO_HEIGHT };
        }
        
        return { ...prev, y: newY };
      });

      // Update obstacles
      setObstacles(prev => {
        let newObstacles = prev.map(obstacle => ({
          ...obstacle,
          x: obstacle.x - gameSpeed
        }));
        
        // Remove off-screen obstacles
        newObstacles = newObstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
        
        // Add new obstacle
        if (newObstacles.length === 0 || newObstacles[newObstacles.length - 1].x < CANVAS_WIDTH - 200) {
          newObstacles.push(generateObstacle());
        }
        
        return newObstacles;
      });

      // Update score
      setScore(prev => prev + 1);
      
      // Increase game speed gradually
      setGameSpeed(prev => Math.min(prev + 0.001, 8));

      // Check collisions
      if (checkCollision(dino, obstacles)) {
        setGameOver(true);
        setGameRunning(false);
      }
    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameRunning, gameOver, dino, dinoVelocity, obstacles, gameSpeed, checkCollision, generateObstacle]);

  // Controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };

    const handleClick = () => {
      jump();
    };

    window.addEventListener('keydown', handleKeyPress);
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('click', handleClick);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (canvas) {
        canvas.removeEventListener('click', handleClick);
      }
    };
  }, [jump]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw background
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#F0E68C');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw ground
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, 20);
    
    // Ground pattern
    ctx.strokeStyle = '#654321';
    ctx.lineWidth = 2;
    for (let x = 0; x < CANVAS_WIDTH; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, GROUND_Y);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }

    // Draw clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 3; i++) {
      const x = (score * 0.5 + i * 200) % (CANVAS_WIDTH + 100) - 50;
      const y = 30 + i * 20;
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.arc(x + 15, y, 20, 0, Math.PI * 2);
      ctx.arc(x + 30, y, 15, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw dino
    ctx.fillStyle = '#228B22';
    ctx.fillRect(dino.x, dino.y, DINO_WIDTH, DINO_HEIGHT);
    
    // Dino details
    ctx.fillStyle = '#000';
    ctx.fillRect(dino.x + 20, dino.y + 5, 3, 3); // Eye
    ctx.fillRect(dino.x + 25, dino.y + 15, 5, 3); // Mouth
    
    // Legs (running animation)
    const legOffset = Math.floor(score * 0.3) % 2 === 0 ? 0 : 2;
    ctx.fillRect(dino.x + 5, dino.y + DINO_HEIGHT, 5, 5 + legOffset);
    ctx.fillRect(dino.x + 15, dino.y + DINO_HEIGHT, 5, 5 - legOffset);

    // Draw obstacles
    obstacles.forEach(obstacle => {
      if (obstacle.type === 'cactus') {
        ctx.fillStyle = '#006400';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        
        // Cactus details
        ctx.fillStyle = '#004400';
        ctx.fillRect(obstacle.x + 2, obstacle.y + 5, 3, 10);
        ctx.fillRect(obstacle.x + obstacle.width - 5, obstacle.y + 8, 3, 8);
      } else {
        // Bird
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        
        // Bird wing animation
        const wingOffset = Math.floor(score * 0.5) % 2 === 0 ? -2 : 2;
        ctx.fillRect(obstacle.x + 5, obstacle.y + wingOffset, 8, 3);
        ctx.fillRect(obstacle.x + 17, obstacle.y - wingOffset, 8, 3);
      }
    });

    // Draw score
    ctx.fillStyle = '#000';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`Score: ${Math.floor(score / 10)}`, CANVAS_WIDTH - 10, 30);

    // Game over screen
    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 30);
      ctx.font = 'bold 20px Arial';
      ctx.fillText(`Final Score: ${Math.floor(score / 10)}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);
      ctx.font = 'bold 16px Arial';
      ctx.fillText('Click to restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
    }
    
    ctx.textAlign = 'left';
  }, [dino, obstacles, score, gameOver]);

  const handleCanvasClick = () => {
    if (gameOver) {
      startGame();
    } else {
      jump();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
            Dino Run
          </CardTitle>
          <div className="text-center">
            <p className="text-lg font-semibold">Score: {Math.floor(score / 10)}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            {/* Game Canvas */}
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="border-2 border-border cursor-pointer"
              onClick={handleCanvasClick}
            />

            {/* Controls */}
            <div className="space-y-2 w-full max-w-md">
              {!gameRunning && !gameOver ? (
                <Button 
                  onClick={startGame} 
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white"
                >
                  Start Game
                </Button>
              ) : null}
              
              <div className="text-center text-sm text-muted-foreground">
                Click, press Space, or Up arrow to jump. Avoid the cacti and birds!
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
