import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Position {
  x: number;
  y: number;
}

interface Pipe {
  x: number;
  topHeight: number;
  passed: boolean;
}

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
const BIRD_SIZE = 20;
const PIPE_WIDTH = 50;
const PIPE_GAP = 150;
const GRAVITY = 0.6;
const JUMP_STRENGTH = -12;
const PIPE_SPEED = 3;

export function FlappyBird() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [bird, setBird] = useState<Position>({ x: 50, y: CANVAS_HEIGHT / 2 });
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<Pipe[]>([]);

  const resetGame = useCallback(() => {
    setBird({ x: 50, y: CANVAS_HEIGHT / 2 });
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    setGameOver(false);
  }, []);

  const startGame = () => {
    resetGame();
    setGameRunning(true);
  };

  const jump = useCallback(() => {
    if (gameRunning && !gameOver) {
      setBirdVelocity(JUMP_STRENGTH);
    }
  }, [gameRunning, gameOver]);

  // Generate pipes
  const generatePipe = useCallback((): Pipe => {
    const topHeight = Math.random() * (CANVAS_HEIGHT - PIPE_GAP - 100) + 50;
    return {
      x: CANVAS_WIDTH,
      topHeight,
      passed: false
    };
  }, []);

  // Collision detection
  const checkCollisions = useCallback((birdPos: Position, currentPipes: Pipe[]): boolean => {
    // Ground and ceiling
    if (birdPos.y <= 0 || birdPos.y + BIRD_SIZE >= CANVAS_HEIGHT) {
      return true;
    }

    // Pipe collisions
    for (const pipe of currentPipes) {
      if (
        birdPos.x + BIRD_SIZE > pipe.x &&
        birdPos.x < pipe.x + PIPE_WIDTH &&
        (birdPos.y < pipe.topHeight || birdPos.y + BIRD_SIZE > pipe.topHeight + PIPE_GAP)
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
      // Update bird
      setBirdVelocity(prev => prev + GRAVITY);
      setBird(prev => {
        const newY = prev.y + birdVelocity;
        return { ...prev, y: newY };
      });

      // Update pipes
      setPipes(prev => {
        let newPipes = prev.map(pipe => ({ ...pipe, x: pipe.x - PIPE_SPEED }));
        
        // Remove off-screen pipes
        newPipes = newPipes.filter(pipe => pipe.x + PIPE_WIDTH > 0);
        
        // Add new pipe if needed
        if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < CANVAS_WIDTH - 200) {
          newPipes.push(generatePipe());
        }
        
        // Check for scoring
        newPipes.forEach(pipe => {
          if (!pipe.passed && pipe.x + PIPE_WIDTH < bird.x) {
            pipe.passed = true;
            setScore(s => s + 1);
          }
        });
        
        return newPipes;
      });

      // Check collisions
      if (checkCollisions(bird, pipes)) {
        setGameOver(true);
        setGameRunning(false);
      }
    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameRunning, gameOver, bird, birdVelocity, pipes, checkCollisions, generatePipe]);

  // Controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
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
    gradient.addColorStop(1, '#98FB98');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw pipes
    ctx.fillStyle = '#228B22';
    pipes.forEach(pipe => {
      // Top pipe
      ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
      // Bottom pipe
      ctx.fillRect(pipe.x, pipe.topHeight + PIPE_GAP, PIPE_WIDTH, CANVAS_HEIGHT - pipe.topHeight - PIPE_GAP);
    });

    // Draw bird
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(bird.x, bird.y, BIRD_SIZE, BIRD_SIZE);
    
    // Bird eye
    ctx.fillStyle = '#000';
    ctx.fillRect(bird.x + 12, bird.y + 5, 3, 3);

    // Draw score
    ctx.fillStyle = '#000';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Score: ${score}`, CANVAS_WIDTH / 2, 50);

    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 32px Arial';
      ctx.fillText('Game Over!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50);
      ctx.font = 'bold 24px Arial';
      ctx.fillText(`Final Score: ${score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.font = 'bold 18px Arial';
      ctx.fillText('Click to restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
    }
  }, [bird, pipes, score, gameOver]);

  const handleCanvasClick = () => {
    if (gameOver) {
      startGame();
    } else {
      jump();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
            Flappy Bird
          </CardTitle>
          <div className="text-center">
            <p className="text-lg font-semibold">Score: {score}</p>
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
            <div className="space-y-2 w-full">
              {!gameRunning && !gameOver ? (
                <Button 
                  onClick={startGame} 
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white"
                >
                  Start Game
                </Button>
              ) : null}
              
              <div className="text-center text-sm text-muted-foreground">
                Click or press Space to flap. Avoid the pipes!
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
