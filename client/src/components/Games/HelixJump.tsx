import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Position {
  x: number;
  y: number;
  z: number;
}

interface Platform {
  y: number;
  rotation: number;
  hasGap: boolean;
  gapStart: number;
  gapEnd: number;
  color: string;
}

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;
const BALL_SIZE = 15;
const PLATFORM_HEIGHT = 20;
const PLATFORM_SPACING = 80;
const TOWER_RADIUS = 120;

export function HelixJump() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  
  const [ball, setBall] = useState<Position>({ x: CANVAS_WIDTH / 2, y: 100, z: 0 });
  const [ballVelocity, setBallVelocity] = useState(0);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [cameraY, setCameraY] = useState(0);
  const [towerRotation, setTowerRotation] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [lastMouseX, setLastMouseX] = useState(0);

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#A8E6CF', '#FFD93D'];

  const generatePlatforms = useCallback((): Platform[] => {
    const newPlatforms: Platform[] = [];
    
    for (let i = 0; i < 50; i++) {
      const y = i * PLATFORM_SPACING + 200;
      const gapSize = 80 + Math.random() * 40; // Random gap size
      const gapStart = Math.random() * (360 - gapSize);
      
      newPlatforms.push({
        y,
        rotation: 0,
        hasGap: true,
        gapStart,
        gapEnd: gapStart + gapSize,
        color: colors[i % colors.length]
      });
    }
    
    return newPlatforms;
  }, []);

  const resetGame = useCallback(() => {
    setBall({ x: CANVAS_WIDTH / 2, y: 100, z: 0 });
    setBallVelocity(0);
    setPlatforms(generatePlatforms());
    setScore(0);
    setCameraY(0);
    setTowerRotation(0);
    setGameOver(false);
  }, [generatePlatforms]);

  const startGame = () => {
    resetGame();
    setGameRunning(true);
  };

  // Convert 3D position to 2D screen coordinates
  const project3D = (angle: number, radius: number, y: number) => {
    const x = CANVAS_WIDTH / 2 + Math.cos(angle) * radius;
    const screenY = y - cameraY + 100;
    return { x, y: screenY };
  };

  // Check if ball is in gap
  const isInGap = (ballAngle: number, platform: Platform): boolean => {
    const normalizedAngle = ((ballAngle % 360) + 360) % 360;
    let gapStart = ((platform.gapStart % 360) + 360) % 360;
    let gapEnd = ((platform.gapEnd % 360) + 360) % 360;
    
    if (gapEnd < gapStart) {
      return normalizedAngle >= gapStart || normalizedAngle <= gapEnd;
    }
    return normalizedAngle >= gapStart && normalizedAngle <= gapEnd;
  };

  // Ball collision with platforms
  const checkPlatformCollision = useCallback((ballPos: Position, ballVel: number) => {
    const ballAngle = Math.atan2(ballPos.x - CANVAS_WIDTH / 2, ballPos.z) * 180 / Math.PI;
    
    for (const platform of platforms) {
      const platformTop = platform.y;
      const platformBottom = platform.y + PLATFORM_HEIGHT;
      
      if (ballPos.y + BALL_SIZE >= platformTop && 
          ballPos.y <= platformBottom && 
          ballVel > 0) {
        
        if (isInGap(ballAngle, platform)) {
          // Ball passes through gap
          continue;
        } else {
          // Ball hits platform
          return { hit: true, platformY: platformTop };
        }
      }
    }
    
    return { hit: false, platformY: 0 };
  }, [platforms]);

  // Game physics loop
  useEffect(() => {
    if (!gameRunning || gameOver) return;

    const gameLoop = setInterval(() => {
      setBall(prevBall => {
        let newBall = { ...prevBall };
        
        // Apply gravity
        setBallVelocity(prev => prev + 0.5);
        newBall.y += ballVelocity;
        
        // Check platform collisions
        const collision = checkPlatformCollision(newBall, ballVelocity);
        if (collision.hit) {
          newBall.y = collision.platformY - BALL_SIZE;
          setBallVelocity(-8); // Bounce
          
          // Update score
          setScore(prev => prev + 1);
        }
        
        // Check if ball fell too far
        if (newBall.y > cameraY + CANVAS_HEIGHT + 200) {
          setGameOver(true);
          setGameRunning(false);
        }
        
        // Update camera to follow ball
        setCameraY(newBall.y - 300);
        
        return newBall;
      });
    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameRunning, gameOver, ballVelocity, checkPlatformCollision, cameraY]);

  // Mouse controls for rotating tower
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (!gameRunning || !canvasRef.current) return;
      setIsMouseDown(true);
      setLastMouseX(e.clientX);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseDown || !gameRunning || !canvasRef.current) return;
      
      const deltaX = e.clientX - lastMouseX;
      setTowerRotation(prev => prev + deltaX * 0.5);
      setLastMouseX(e.clientX);
      
      // Update ball position based on rotation
      setBall(prev => {
        const currentRadius = Math.sqrt((prev.x - CANVAS_WIDTH / 2) ** 2 + prev.z ** 2);
        const currentAngle = Math.atan2(prev.x - CANVAS_WIDTH / 2, prev.z) + deltaX * 0.01;
        
        return {
          ...prev,
          x: CANVAS_WIDTH / 2 + Math.sin(currentAngle) * currentRadius,
          z: Math.cos(currentAngle) * currentRadius
        };
      });
    };

    const handleMouseUp = () => {
      setIsMouseDown(false);
    };

    if (canvasRef.current) {
      canvasRef.current.addEventListener('mousedown', handleMouseDown);
    }
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('mousedown', handleMouseDown);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isMouseDown, lastMouseX, gameRunning]);

  // Touch controls for mobile
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (!gameRunning || !canvasRef.current) return;
      e.preventDefault();
      setIsMouseDown(true);
      setLastMouseX(e.touches[0].clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isMouseDown || !gameRunning || !canvasRef.current) return;
      e.preventDefault();
      
      const deltaX = e.touches[0].clientX - lastMouseX;
      setTowerRotation(prev => prev + deltaX * 0.5);
      setLastMouseX(e.touches[0].clientX);
      
      setBall(prev => {
        const currentRadius = Math.sqrt((prev.x - CANVAS_WIDTH / 2) ** 2 + prev.z ** 2);
        const currentAngle = Math.atan2(prev.x - CANVAS_WIDTH / 2, prev.z) + deltaX * 0.01;
        
        return {
          ...prev,
          x: CANVAS_WIDTH / 2 + Math.sin(currentAngle) * currentRadius,
          z: Math.cos(currentAngle) * currentRadius
        };
      });
    };

    const handleTouchEnd = () => {
      setIsMouseDown(false);
    };

    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
      canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
      canvas.addEventListener('touchend', handleTouchEnd);

      return () => {
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchmove', handleTouchMove);
        canvas.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isMouseDown, lastMouseX, gameRunning]);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw platforms
    platforms.forEach(platform => {
      const screenY = platform.y - cameraY + 100;
      
      if (screenY > -50 && screenY < CANVAS_HEIGHT + 50) {
        // Draw platform segments
        for (let angle = 0; angle < 360; angle += 2) {
          if (!isInGap(angle + towerRotation, platform)) {
            const pos1 = project3D((angle + towerRotation) * Math.PI / 180, TOWER_RADIUS - 20, platform.y);
            const pos2 = project3D((angle + towerRotation) * Math.PI / 180, TOWER_RADIUS + 20, platform.y);
            
            if (pos1.y > 0 && pos1.y < CANVAS_HEIGHT) {
              ctx.strokeStyle = platform.color;
              ctx.lineWidth = PLATFORM_HEIGHT;
              ctx.beginPath();
              ctx.moveTo(pos1.x, pos1.y);
              ctx.lineTo(pos2.x, pos2.y);
              ctx.stroke();
            }
          }
        }
      }
    });

    // Draw center pole
    ctx.fillStyle = '#333';
    ctx.fillRect(CANVAS_WIDTH / 2 - 10, 0, 20, CANVAS_HEIGHT);

    // Draw ball shadow
    const shadowY = ball.y - cameraY + 100 + 5;
    if (shadowY > 0 && shadowY < CANVAS_HEIGHT) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.ellipse(ball.x, shadowY, BALL_SIZE + 2, BALL_SIZE / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw ball
    const ballScreenY = ball.y - cameraY + 100;
    if (ballScreenY > -50 && ballScreenY < CANVAS_HEIGHT + 50) {
      const ballGradient = ctx.createRadialGradient(
        ball.x - 3, ballScreenY - 3, 0,
        ball.x, ballScreenY, BALL_SIZE
      );
      ballGradient.addColorStop(0, '#FFD700');
      ballGradient.addColorStop(1, '#FFA500');
      
      ctx.fillStyle = ballGradient;
      ctx.beginPath();
      ctx.arc(ball.x, ballScreenY, BALL_SIZE, 0, Math.PI * 2);
      ctx.fill();
      
      // Ball highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.arc(ball.x - 3, ballScreenY - 3, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw score
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Score: ${score}`, CANVAS_WIDTH / 2, 40);

    // Game over screen
    if (gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 32px Arial';
      ctx.fillText('Game Over!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50);
      ctx.font = 'bold 24px Arial';
      ctx.fillText(`Final Score: ${score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.font = 'bold 18px Arial';
      ctx.fillText('Click to restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
    }
    
    ctx.textAlign = 'left';
  }, [ball, platforms, cameraY, towerRotation, score, gameOver]);

  const handleCanvasClick = () => {
    if (gameOver) {
      startGame();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
            Helix Jump
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
              className="border-2 border-border cursor-pointer select-none"
              onClick={handleCanvasClick}
            />

            {/* Controls */}
            <div className="space-y-2 w-full">
              {!gameRunning && !gameOver ? (
                <Button 
                  onClick={startGame} 
                  className="w-full bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white"
                >
                  Start Game
                </Button>
              ) : null}
              
              <div className="text-center text-sm text-muted-foreground">
                Click and drag to rotate the tower. Guide the ball through the gaps!
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
