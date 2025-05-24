import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Users, Bot, X, Circle, RotateCcw, Home } from "lucide-react";
import { Link } from "wouter";

type Player = 'X' | 'O' | null;
type GameMode = 'local' | 'computer' | null;

export function TicTacToe() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [winner, setWinner] = useState<Player | 'tie' | null>(null);
  const [gameActive, setGameActive] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [stats, setStats] = useState({ wins: 0, draws: 1, losses: 1 });

  // Animated background elements
  const backgroundElements = Array.from({ length: 15 }, (_, i) => (
    <div
      key={i}
      className="absolute opacity-5 text-2xl animate-float"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${3 + Math.random() * 4}s`
      }}
    >
      {Math.random() > 0.5 ? '⚡' : '🎮'}
    </div>
  ));

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  const checkWinner = (squares: Player[]): Player | 'tie' | null => {
    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    if (squares.every(square => square !== null)) {
      return 'tie';
    }
    return null;
  };

  const makeComputerMove = (squares: Player[]): Player[] => {
    const availableMoves = squares.map((square, index) => square === null ? index : null).filter(val => val !== null) as number[];
    if (availableMoves.length === 0) return squares;
    
    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    const newSquares = [...squares];
    newSquares[randomMove] = 'O';
    return newSquares;
  };

  const handleCellClick = (index: number) => {
    if (board[index] || winner || !gameActive) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameResult = checkWinner(newBoard);
    if (gameResult) {
      setWinner(gameResult);
      setShowResult(true);
      setGameActive(false);
      
      // Update stats
      if (gameResult === 'X') {
        setStats(prev => ({ ...prev, wins: prev.wins + 1 }));
      } else if (gameResult === 'tie') {
        setStats(prev => ({ ...prev, draws: prev.draws + 1 }));
      } else {
        setStats(prev => ({ ...prev, losses: prev.losses + 1 }));
      }
      return;
    }

    if (gameMode === 'computer' && currentPlayer === 'X') {
      setCurrentPlayer('O');
      setTimeout(() => {
        const computerBoard = makeComputerMove(newBoard);
        setBoard(computerBoard);
        const computerResult = checkWinner(computerBoard);
        if (computerResult) {
          setWinner(computerResult);
          setShowResult(true);
          setGameActive(false);
        } else {
          setCurrentPlayer('X');
        }
      }, 500);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const startGame = (mode: GameMode) => {
    setGameMode(mode);
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setGameActive(true);
    setShowResult(false);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setGameActive(true);
    setShowResult(false);
  };

  const renderCell = (index: number) => {
    const value = board[index];
    return (
      <button
        key={index}
        onClick={() => handleCellClick(index)}
        className="w-full aspect-square bg-slate-700/50 border-2 border-slate-600 rounded-lg flex items-center justify-center text-4xl font-bold transition-all duration-200 hover:bg-slate-600/50 hover:border-purple-500 hover:scale-105 active:scale-95"
        disabled={!gameActive || value !== null}
      >
        {value === 'X' && <span className="text-purple-400">✕</span>}
        {value === 'O' && <span className="text-orange-400">○</span>}
      </button>
    );
  };

  const getResultMessage = () => {
    if (!winner) return '';
    if (winner === 'tie') return 'Draw!';
    if (gameMode === 'computer') {
      return winner === 'X' ? 'You Win!' : 'You Lose!';
    }
    return `${winner} Wins!`;
  };

  const getResultColor = () => {
    if (!winner) return '';
    if (winner === 'tie') return 'text-yellow-400';
    if (gameMode === 'computer') {
      return winner === 'X' ? 'text-green-400' : 'text-red-400';
    }
    return winner === 'X' ? 'text-purple-400' : 'text-orange-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {backgroundElements}
      </div>

      <div className="w-full max-w-md relative z-10">
        {!gameMode ? (
          // Game Mode Selection
          <Card className="bg-slate-800/90 border-slate-700 shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                TIC TAC TOE
              </CardTitle>
              <p className="text-slate-400">Choose your game mode</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => startGame('local')}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 text-lg"
              >
                <Users className="mr-2 h-5 w-5" />
                2 Players (Local)
              </Button>
              <Button
                onClick={() => startGame('computer')}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white py-4 text-lg"
              >
                <Bot className="mr-2 h-5 w-5" />
                vs Computer
              </Button>
              <Link href="/">
                <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Games
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          // Game Board
          <div className="space-y-6">
            {/* Header with Stats */}
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent mb-4">
                TIC TAC TOE
              </h1>
              
              {/* Stats */}
              <div className="flex justify-center gap-6 mb-6">
                <div className="bg-slate-800/60 rounded-lg px-4 py-2 border border-slate-700">
                  <p className="text-xs text-slate-400">Win</p>
                  <p className="text-2xl font-bold text-purple-400">{stats.wins}</p>
                </div>
                <div className="bg-slate-800/60 rounded-lg px-4 py-2 border border-slate-700">
                  <p className="text-xs text-slate-400">Draw</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.draws}</p>
                </div>
                <div className="bg-slate-800/60 rounded-lg px-4 py-2 border border-slate-700">
                  <p className="text-xs text-slate-400">Lose</p>
                  <p className="text-2xl font-bold text-orange-400">{stats.losses}</p>
                </div>
              </div>
              
              {/* Current Player */}
              {gameActive && (
                <p className="text-lg text-slate-300 mb-4">
                  {gameMode === 'computer' ? 
                    (currentPlayer === 'X' ? "Your turn (X)" : "Computer's turn (O)") :
                    `Player ${currentPlayer}'s turn`
                  }
                </p>
              )}
            </div>

            {/* Game Board */}
            <div className="grid grid-cols-3 gap-3 p-6 bg-slate-800/60 rounded-xl border border-slate-700">
              {Array(9).fill(null).map((_, index) => renderCell(index))}
            </div>

            {/* Game Controls */}
            <div className="flex gap-3">
              <Button
                onClick={resetGame}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Restart Game
              </Button>
              <Button
                onClick={() => setGameMode(null)}
                variant="outline"
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Change Mode
              </Button>
            </div>
          </div>
        )}

        {/* Result Modal */}
        <Dialog open={showResult} onOpenChange={setShowResult}>
          <DialogContent className="bg-slate-800/95 border-slate-700 max-w-sm mx-auto">
            <div className="text-center py-6">
              {/* Result Icon */}
              <div className="mb-4">
                {winner === 'X' && <span className="text-6xl">✕</span>}
                {winner === 'O' && <span className="text-6xl">○</span>}
                {winner === 'tie' && <span className="text-6xl">🤝</span>}
              </div>
              
              {/* Result Message */}
              <h2 className={`text-3xl font-bold mb-6 ${getResultColor()}`}>
                {getResultMessage()}
              </h2>
              
              {/* Game Board Preview */}
              <div className="grid grid-cols-3 gap-1 mb-6 max-w-32 mx-auto">
                {board.map((cell, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-slate-700 rounded flex items-center justify-center text-sm"
                  >
                    {cell === 'X' && <span className="text-purple-400">✕</span>}
                    {cell === 'O' && <span className="text-orange-400">○</span>}
                  </div>
                ))}
              </div>
              
              {/* Action Button */}
              <Button
                onClick={() => {
                  setShowResult(false);
                  resetGame();
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white py-3"
              >
                New Game
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>


    </div>
  );
}