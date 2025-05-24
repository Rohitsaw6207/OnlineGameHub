import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Position {
  x: number;
  y: number;
}

interface Velocity {
  x: number;
  y: number;
}

interface Block {
  x: number;
  y: number;
  width: number;
  height: number;
  destroyed: boolean;
  color: string;
}

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 15;
const BALL_SIZE = 10;
const BLOCK_WIDTH = 50;
const BLOCK_HEIGHT = 20;
const BLOCK_ROWS = 6;
const BLOCK_COLS = 10;

export function Breakout() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  
  const [paddle, setPaddle] = useState<Position>({ x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2, y: CANVAS_HEIGHT - 30 });
  const [ball, setBall] = useState<Position>({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 50 });
  const [ballVelocity, setBallVelocity] = useState<Velocity>({ x: 5, y: -5 });
  const [blocks, setBlocks] = useState<Block[]>([]);

  const createBlocks = useCallback((): Block[] => {
    const newBlocks: Block[] = [];
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3'];
    
    for (let row = 0; row < BLOCK_ROWS; row++) {
      for (let col = 0; col < BLOCK_COLS; col++) {
        newBlocks.push({
          x: col * (BLOCK_WIDTH + 5) + 30,
          y: row * (BLOCK_HEIGHT + 5) + 50,
          width: BLOCK_WIDTH,
          height: BLOCK_HEIGHT,
          destroyed: false,
          color: colors[row]
        });
      }
    }
    
    return newBlocks;
  }, []);

  const resetGame = useCallback(() => {
    setPaddle({ x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2, y: CANVAS_HEIGHT - 30 });
    setBall({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 50 });
    setBallVelocity({ x: 5 * (Math.random() > 0.5 ? 1 : -1), y: -5 });
    setBlocks(createBlocks());
    setScore(0);
    setLives(3);
    setGameOver(false);
    setGameWon(false);
  }, [createBlocks]);

  const startGame = () => {
    resetGame();
    setGameRunning(true);
  };

  const stopGame = () => {
    setGameRunning(false);
  };

  // Ball collision detection
  const checkCollisions = useCallback((ballPos: Position, ballVel: Velocity) => {
    let newVel = { ...ballVel };
    let newPos = { ...ballPos };
    let hitBlock = false;

    // Wall collisions
    if (ballPos.x <= 0 || ballPos.x >= CANVAS_WIDTH - BALL_SIZE) {
      newVel.x = -newVel.x;
    }
    if (ballPos.y <= 0) {
      newVel.y = -newVel.y;
    }

    // Bottom wall (life lost)
    if (ballPos.y >= CANVAS_HEIGHT) {
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setGameOver(true);
          setGameRunning(false);
        } else {
          // Reset ball position
          setTimeout(() => {
            setBall({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 50 });
            setBallVelocity({ x: 5 * (Math.random() > 0.5 ? 1 : -1), y: -5 });
          }, 1000);
        }
        return newLives;
      });
      return { position: newPos, velocity: newVel };
    }

    // Paddle collision
    if (
      ballPos.x + BALL_SIZE >= paddle.x &&
      ballPos.x <= paddle.x + PADDLE_WIDTH &&
      ballPos.y + BALL_SIZE >= paddle.y &&
      ballPos.y <= paddle.y + PADDLE_HEIGHT
    ) {
      newVel.y = -Math.abs(newVel.y);
      // Add some spin based on where the ball hits the paddle
      const hitPos = (ballPos.x - paddle.x) / PADDLE_WIDTH - 0.5;
      newVel.x = hitPos * 8;
    }

    // Block collisions
    setBlocks(prevBlocks => {
      const newBlocks = prevBlocks.map(block => {
        if (
          !block.destroyed &&
          ballPos.x + BALL_SIZE >= block.x &&
          ballPos.x <= block.x + block.width &&
          ballPos.y + BALL_SIZE >= block.y &&
          ballPos.y <= block.y + block.height
        ) {
          hitBlock = true;
          setScore(prev => prev + 10);
          return { ...block, destroyed: true };
        }
        return block;
      });

      // Check if all blocks are destroyed
      if (newBlocks.every(block => block.destroyed)) {
        setGameWon(true);
        setGameRunning(false);
      }

      return newBlocks;
    });

    if (hitBlock) {
      newVel.y = -newVel.y;
    }

    return { position: newPos, velocity: newVel };
  }, [paddle]);

  // Game loop
  useEffect(() => {
    if (!gameRunning) return;

    const gameLoop = setInterval(() => {
      setBall(prevBall => {
        const newX = prevBall.x + ballVelocity.x;
        const newY = prevBall.y + ballVelocity.y;
        const newPos = { x: newX, y: newY };
        
        const collision = checkCollisions(newPos, ballVelocity);
        setBallVelocity(collision.velocity);
        
        return collision.position;
      });
    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameRunning, ballVelocity, checkCollisions]);

  // Mouse controls
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!gameRunning || !canvasRef.current) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const paddleX = Math.max(0, Math.min(CANVAS_WIDTH - PADDLE_WIDTH, x - PADDLE_WIDTH / 2));
      
      setPaddle(prev => ({ ...prev, x: paddleX }));
    };

    if (canvasRef.current) {
      canvasRef.current.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [gameRunning]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw blocks
    blocks.forEach(block => {
      if (!block.destroyed) {
        ctx.fillStyle = block.color;
        ctx.fillRect(block.x, block.y, block.width, block.height);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.strokeRect(block.x, block.y, block.width, block.height);
      }
    });

    // Draw paddle
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(paddle.x, paddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.fillStyle = '#ffff00';
    ctx.fillRect(ball.x, ball.y, BALL_SIZE, BALL_SIZE);

    // Draw UI
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`Lives: ${lives}`, CANVAS_WIDTH - 100, 30);

    // Game over screen
    if (gameOver || gameWon) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(gameWon ? 'You Win!' : 'Game Over!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50);
      ctx.font = 'bold 24px Arial';
      ctx.fillText(`Final Score: ${score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.font = 'bold 18px Arial';
      ctx.fillText('Click to restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
      ctx.textAlign = 'left';
    }
  }, [paddle, ball, blocks, score, lives, gameOver, gameWon]);

  const handleCanvasClick = () => {
    if (gameOver || gameWon) {
      startGame();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">
            Breakout
          </CardTitle>
          <div className="text-center">
            <p className="text-lg font-semibold">
              Score: {score} | Lives: {lives}
            </p>
            {(gameOver || gameWon) && (
              <p className="text-lg font-bold text-green-500 mt-2">
                {gameWon ? 'Congratulations! You cleared all blocks!' : 'Game Over!'}
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            {/* Game Canvas */}
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className="border-2 border-border bg-black cursor-none"
              onClick={handleCanvasClick}
            />

            {/* Controls */}
            <div className="space-y-2 w-full max-w-md">
              {!gameRunning && !gameOver && !gameWon ? (
                <Button 
                  onClick={startGame} 
                  className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white"
                >
                  Start Game
                </Button>
              ) : gameRunning ? (
                <Button 
                  onClick={stopGame} 
                  variant="outline" 
                  className="w-full"
                >
                  Pause Game
                </Button>
              ) : null}
              
              <div className="text-center text-sm text-muted-foreground">
                Move your mouse to control the paddle. Break all blocks to win!
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
