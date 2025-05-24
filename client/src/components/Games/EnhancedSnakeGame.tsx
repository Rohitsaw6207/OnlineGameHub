import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Play, Home, RotateCcw } from "lucide-react";
import { Link } from "wouter";

interface Position {
  x: number;
  y: number;
}

export function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<string>('');
  const [gameRunning, setGameRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const BOARD_SIZE = 20;
  const GAME_SPEED = 100; // Faster speed for more difficulty

  // Animated background elements
  const backgroundElements = Array.from({ length: 12 }, (_, i) => (
    <div
      key={i}
      className="absolute opacity-5 text-3xl animate-float"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${3 + Math.random() * 4}s`
      }}
    >
      {Math.random() > 0.5 ? '🐍' : '🍎'}
    </div>
  ));

  const generateFood = useCallback((): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE)
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [snake]);

  const checkCollision = useCallback((head: Position, snakeBody: Position[]) => {
    // Wall collision
    if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
      return true;
    }
    // Self collision
    return snakeBody.some(segment => segment.x === head.x && segment.y === head.y);
  }, []);

  const moveSnake = useCallback(() => {
    if (!gameRunning || !direction) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
        default: return currentSnake;
      }

      if (checkCollision(head, newSnake)) {
        setGameRunning(false);
        setGameOver(true);
        setShowResult(true);
        const newHighScore = Math.max(score, highScore);
        setHighScore(newHighScore);
        return currentSnake;
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
  }, [direction, gameRunning, food, checkCollision, score, highScore, generateFood]);

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [moveSnake]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameRunning) return;
      
      const newDirection = {
        'ArrowUp': 'UP',
        'ArrowDown': 'DOWN',
        'ArrowLeft': 'LEFT',
        'ArrowRight': 'RIGHT',
        'w': 'UP',
        's': 'DOWN',
        'a': 'LEFT',
        'd': 'RIGHT'
      }[e.key];

      if (newDirection) {
        e.preventDefault();
        // Prevent reversing into self
        const opposites: { [key: string]: string } = { 'UP': 'DOWN', 'DOWN': 'UP', 'LEFT': 'RIGHT', 'RIGHT': 'LEFT' };
        if (direction !== opposites[newDirection]) {
          setDirection(newDirection);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameRunning]);

  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection('');
    setScore(0);
    setGameRunning(true);
    setGameOver(false);
    setShowResult(false);
  };

  const handleDirectionClick = (newDirection: string) => {
    if (!gameRunning) return;
    const opposites: { [key: string]: string } = { 'UP': 'DOWN', 'DOWN': 'UP', 'LEFT': 'RIGHT', 'RIGHT': 'LEFT' };
    if (direction !== opposites[newDirection]) {
      setDirection(newDirection);
    }
  };

  const renderCell = (x: number, y: number) => {
    const isSnake = snake.some(segment => segment.x === x && segment.y === y);
    const isFood = food.x === x && food.y === y;
    const isHead = snake[0]?.x === x && snake[0]?.y === y;

    let cellClass = "w-full h-full border border-green-800/20 ";
    
    if (isFood) {
      cellClass += "bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50";
    } else if (isHead) {
      cellClass += "bg-green-400 rounded-lg shadow-lg shadow-green-400/50";
    } else if (isSnake) {
      cellClass += "bg-green-600 rounded";
    } else {
      cellClass += "bg-green-900/20";
    }

    return <div key={`${x}-${y}`} className={cellClass} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-900 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {backgroundElements}
        {/* Snake character decoration */}
        <div className="absolute top-10 right-10 text-8xl opacity-20 animate-bounce">
          🐍
        </div>
      </div>

      <div className="w-full max-w-lg relative z-10">
        {!gameRunning && !gameOver ? (
          // Game Start Screen
          <div className="bg-black rounded-2xl p-8 shadow-2xl border-2 border-green-500">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-green-400 mb-4 animate-pulse">🐍 SNAKE GAME</h2>
              <p className="text-green-300 text-lg mb-2">Classic arcade snake adventure</p>
              <p className="text-green-200 text-sm">Use arrow keys or on-screen controls</p>
            </div>
            
            <div className="text-center space-y-4">
              <p className="text-green-300">High Score: <span className="font-bold text-green-400 text-xl">{highScore}</span></p>
              
              <Button
                onClick={startGame}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 text-lg font-bold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
              >
                <Play className="mr-3 h-6 w-6" />
                START PLAYING
              </Button>
              
              <Link href="/">
                <Button variant="outline" className="w-full border-green-600 text-green-300 hover:bg-green-700/20 py-3">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Games
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          // Game Board
          <div className="space-y-4">
            {/* Score Display */}
            <div className="flex justify-between items-center bg-black rounded-lg px-6 py-3 border-2 border-green-500">
              <div className="text-center">
                <p className="text-sm text-green-300">Score</p>
                <p className="text-2xl font-bold text-green-400">{score}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-green-300">High Score</p>
                <p className="text-2xl font-bold text-green-400">{highScore}</p>
              </div>
            </div>

            {/* Game Board */}
            <div className="bg-black p-4 rounded-xl border-2 border-green-500">
              <div 
                className="grid gap-0 mx-auto bg-black rounded-lg p-2"
                style={{ 
                  gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
                  aspectRatio: '1/1',
                  maxWidth: '400px',
                  maxHeight: '400px'
                }}
              >
                {Array.from({ length: BOARD_SIZE }, (_, y) =>
                  Array.from({ length: BOARD_SIZE }, (_, x) => renderCell(x, y))
                )}
              </div>
            </div>

            {/* Mobile Controls */}
            <div className="mobile-controls">
              <button 
                className="control-btn control-up"
                onClick={() => handleDirectionClick('UP')}
                disabled={!gameRunning}
              >
                <ArrowUp className="w-6 h-6" />
              </button>
              <button 
                className="control-btn control-left"
                onClick={() => handleDirectionClick('LEFT')}
                disabled={!gameRunning}
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <button 
                className="control-btn control-right"
                onClick={() => handleDirectionClick('RIGHT')}
                disabled={!gameRunning}
              >
                <ArrowRight className="w-6 h-6" />
              </button>
              <button 
                className="control-btn control-down"
                onClick={() => handleDirectionClick('DOWN')}
                disabled={!gameRunning}
              >
                <ArrowDown className="w-6 h-6" />
              </button>
            </div>

            {/* Game Controls */}
            <div className="flex gap-3">
              <Button
                onClick={startGame}
                className="flex-1 bg-green-700 hover:bg-green-600 text-white"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Restart
              </Button>
              <Link href="/">
                <Button
                  variant="outline"
                  className="flex-1 border-green-600 text-green-300 hover:bg-green-700"
                >
                  Exit
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Game Over Modal */}
        <Dialog open={showResult} onOpenChange={setShowResult}>
          <DialogContent className="bg-green-800/95 border-green-700 max-w-sm mx-auto">
            <div className="text-center py-6">
              <div className="text-6xl mb-4">💀</div>
              <h2 className="text-3xl font-bold mb-4 text-red-400">Game Over!</h2>
              
              <div className="bg-green-900/50 rounded-lg p-4 mb-6">
                <p className="text-green-300 mb-2">Final Score</p>
                <p className="text-4xl font-bold text-green-400">{score}</p>
                {score === highScore && score > 0 && (
                  <p className="text-yellow-400 text-sm mt-2">🏆 New High Score!</p>
                )}
              </div>
              
              <Button
                onClick={() => {
                  setShowResult(false);
                  startGame();
                }}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3"
              >
                Play Again
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}