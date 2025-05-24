import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Position {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const CANVAS_SIZE = 400;

export function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Position>({ x: 0, y: 0 });
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const generateFood = useCallback(() => {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    return { x, y };
  }, []);

  const checkCollision = useCallback((head: Position, snakeBody: Position[]) => {
    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    // Self collision
    return snakeBody.some(segment => segment.x === head.x && segment.y === head.y);
  }, []);

  const moveSnake = useCallback(() => {
    if (!gameRunning) return;

    setSnake(prevSnake => {
      const newSnake = [...prevSnake];
      const head = { ...newSnake[0] };
      head.x += direction.x;
      head.y += direction.y;

      if (checkCollision(head, newSnake)) {
        setGameOver(true);
        setGameRunning(false);
        return prevSnake;
      }

      newSnake.unshift(head);

      // Check if food is eaten
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameRunning, checkCollision, generateFood]);

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, 150);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameRunning) return;
      
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameRunning]);

  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood());
    setDirection({ x: 1, y: 0 });
    setGameRunning(true);
    setScore(0);
    setGameOver(false);
  };

  const cellSize = CANVAS_SIZE / GRID_SIZE;

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
            Snake Game
          </CardTitle>
          <div className="text-center">
            <p className="text-lg font-semibold">Score: {score}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            {/* Game Canvas */}
            <div 
              className="relative border-2 border-border bg-muted"
              style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
            >
              {/* Snake */}
              {snake.map((segment, index) => (
                <div
                  key={index}
                  className={`absolute ${index === 0 ? 'bg-green-500' : 'bg-green-400'}`}
                  style={{
                    left: segment.x * cellSize,
                    top: segment.y * cellSize,
                    width: cellSize - 1,
                    height: cellSize - 1,
                  }}
                />
              ))}
              
              {/* Food */}
              <div
                className="absolute bg-red-500 rounded-full"
                style={{
                  left: food.x * cellSize + 2,
                  top: food.y * cellSize + 2,
                  width: cellSize - 4,
                  height: cellSize - 4,
                }}
              />
            </div>

            {/* Game Status */}
            {gameOver && (
              <div className="text-center">
                <p className="text-lg font-semibold text-red-500 mb-2">Game Over!</p>
                <p className="text-sm text-muted-foreground">Final Score: {score}</p>
              </div>
            )}

            {/* Controls */}
            <div className="space-y-2 w-full">
              {!gameRunning ? (
                <Button 
                  onClick={startGame} 
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                >
                  {gameOver ? 'Play Again' : 'Start Game'}
                </Button>
              ) : (
                <Button 
                  onClick={() => setGameRunning(false)} 
                  variant="outline" 
                  className="w-full"
                >
                  Pause Game
                </Button>
              )}
              
              <div className="text-center text-sm text-muted-foreground">
                Use arrow keys to control the snake
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
