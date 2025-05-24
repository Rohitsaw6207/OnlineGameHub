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

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 300;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 60;
const BALL_SIZE = 10;

export function Pong() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const [gameOver, setGameOver] = useState(false);
  
  const [playerPaddle, setPlayerPaddle] = useState<Position>({ x: 20, y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 });
  const [aiPaddle, setAiPaddle] = useState<Position>({ x: CANVAS_WIDTH - 30, y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 });
  const [ball, setBall] = useState<Position>({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 });
  const [ballVelocity, setBallVelocity] = useState<Velocity>({ x: 5, y: 3 });

  const resetGame = useCallback(() => {
    setPlayerPaddle({ x: 20, y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 });
    setAiPaddle({ x: CANVAS_WIDTH - 30, y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 });
    setBall({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 });
    setBallVelocity({ x: 5 * (Math.random() > 0.5 ? 1 : -1), y: 3 * (Math.random() > 0.5 ? 1 : -1) });
    setScore({ player: 0, ai: 0 });
    setGameOver(false);
  }, []);

  const startGame = () => {
    resetGame();
    setGameRunning(true);
  };

  const stopGame = () => {
    setGameRunning(false);
  };

  // Ball collision detection
  const checkBallCollision = useCallback((ballPos: Position, ballVel: Velocity) => {
    let newVel = { ...ballVel };
    let newPos = { ...ballPos };
    let scored = false;

    // Top and bottom walls
    if (ballPos.y <= 0 || ballPos.y >= CANVAS_HEIGHT - BALL_SIZE) {
      newVel.y = -newVel.y;
    }

    // Player paddle collision
    if (
      ballPos.x <= playerPaddle.x + PADDLE_WIDTH &&
      ballPos.x >= playerPaddle.x &&
      ballPos.y + BALL_SIZE >= playerPaddle.y &&
      ballPos.y <= playerPaddle.y + PADDLE_HEIGHT
    ) {
      newVel.x = Math.abs(newVel.x);
      const hitPos = (ballPos.y - playerPaddle.y) / PADDLE_HEIGHT - 0.5;
      newVel.y = hitPos * 8;
    }

    // AI paddle collision
    if (
      ballPos.x + BALL_SIZE >= aiPaddle.x &&
      ballPos.x <= aiPaddle.x + PADDLE_WIDTH &&
      ballPos.y + BALL_SIZE >= aiPaddle.y &&
      ballPos.y <= aiPaddle.y + PADDLE_HEIGHT
    ) {
      newVel.x = -Math.abs(newVel.x);
      const hitPos = (ballPos.y - aiPaddle.y) / PADDLE_HEIGHT - 0.5;
      newVel.y = hitPos * 8;
    }

    // Scoring
    if (ballPos.x <= 0) {
      setScore(prev => ({ ...prev, ai: prev.ai + 1 }));
      scored = true;
    } else if (ballPos.x >= CANVAS_WIDTH) {
      setScore(prev => ({ ...prev, player: prev.player + 1 }));
      scored = true;
    }

    if (scored) {
      newPos = { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT / 2 };
      newVel = { x: 5 * (Math.random() > 0.5 ? 1 : -1), y: 3 * (Math.random() > 0.5 ? 1 : -1) };
    }

    return { position: newPos, velocity: newVel };
  }, [playerPaddle, aiPaddle]);

  // Game loop
  useEffect(() => {
    if (!gameRunning) return;

    const gameLoop = setInterval(() => {
      setBall(prevBall => {
        const newX = prevBall.x + ballVelocity.x;
        const newY = prevBall.y + ballVelocity.y;
        const newPos = { x: newX, y: newY };
        
        const collision = checkBallCollision(newPos, ballVelocity);
        setBallVelocity(collision.velocity);
        
        return collision.position;
      });

      // AI paddle movement
      setAiPaddle(prevAi => {
        const ballCenter = ball.y + BALL_SIZE / 2;
        const paddleCenter = prevAi.y + PADDLE_HEIGHT / 2;
        const speed = 4;
        
        if (ballCenter < paddleCenter - 5) {
          return { ...prevAi, y: Math.max(0, prevAi.y - speed) };
        } else if (ballCenter > paddleCenter + 5) {
          return { ...prevAi, y: Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, prevAi.y + speed) };
        }
        return prevAi;
      });
    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameRunning, ball, ballVelocity, checkBallCollision]);

  // Check for game over
  useEffect(() => {
    if (score.player >= 5 || score.ai >= 5) {
      setGameOver(true);
      setGameRunning(false);
    }
  }, [score]);

  // Mouse controls
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!gameRunning || !canvasRef.current) return;
      
      const rect = canvasRef.current.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const paddleY = Math.max(0, Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, y - PADDLE_HEIGHT / 2));
      
      setPlayerPaddle(prev => ({ ...prev, y: paddleY }));
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
    ctx.fillStyle = 'rgb(15, 23, 42)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw center line
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = 'rgb(148, 163, 184)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = 'rgb(34, 197, 94)';
    ctx.fillRect(playerPaddle.x, playerPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);
    
    ctx.fillStyle = 'rgb(239, 68, 68)';
    ctx.fillRect(aiPaddle.x, aiPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.fillStyle = 'rgb(251, 191, 36)';
    ctx.fillRect(ball.x, ball.y, BALL_SIZE, BALL_SIZE);
  }, [playerPaddle, aiPaddle, ball]);

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
            Pong
          </CardTitle>
          <div className="text-center">
            <p className="text-lg font-semibold">
              Player: {score.player} | AI: {score.ai}
            </p>
            {gameOver && (
              <p className="text-lg font-bold text-green-500 mt-2">
                {score.player >= 5 ? 'You Win!' : 'AI Wins!'}
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
              className="border-2 border-border bg-slate-900 cursor-none"
            />

            {/* Controls */}
            <div className="space-y-2 w-full max-w-md">
              {!gameRunning ? (
                <Button 
                  onClick={startGame} 
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                >
                  {gameOver ? 'Play Again' : 'Start Game'}
                </Button>
              ) : (
                <Button 
                  onClick={stopGame} 
                  variant="outline" 
                  className="w-full"
                >
                  Pause Game
                </Button>
              )}
              
              <div className="text-center text-sm text-muted-foreground">
                Move your mouse to control the left paddle. First to 5 points wins!
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
