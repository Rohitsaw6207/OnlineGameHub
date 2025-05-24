import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Player = 'X' | 'O' | null;
type GameMode = 'local' | 'computer' | null;

export function TicTacToe() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [winner, setWinner] = useState<Player | 'tie' | null>(null);
  const [gameActive, setGameActive] = useState(false);

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

  const makeMove = (index: number) => {
    if (board[index] || winner || !gameActive) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameResult = checkWinner(newBoard);
    if (gameResult) {
      setWinner(gameResult);
      setGameActive(false);
      return;
    }

    if (gameMode === 'computer' && currentPlayer === 'X') {
      setCurrentPlayer('O');
      // AI move after a short delay
      setTimeout(() => makeAIMove(newBoard), 500);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const makeAIMove = (currentBoard: Player[]) => {
    const availableMoves = currentBoard
      .map((cell, index) => cell === null ? index : null)
      .filter(val => val !== null) as number[];

    if (availableMoves.length === 0) return;

    // Simple AI: random move
    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    const newBoard = [...currentBoard];
    newBoard[randomMove] = 'O';
    setBoard(newBoard);

    const gameResult = checkWinner(newBoard);
    if (gameResult) {
      setWinner(gameResult);
      setGameActive(false);
    } else {
      setCurrentPlayer('X');
    }
  };

  const startGame = (mode: GameMode) => {
    setGameMode(mode);
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setGameActive(true);
  };

  const resetGame = () => {
    setGameMode(null);
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
    setGameActive(false);
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
            Tic Tac Toe
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!gameMode ? (
            <div className="space-y-4">
              <Button 
                onClick={() => startGame('local')} 
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white"
              >
                Play Local (2 Players)
              </Button>
              <Button 
                onClick={() => startGame('computer')} 
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
              >
                Play vs Computer
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-4">
                {winner ? (
                  <p className="text-lg font-semibold">
                    {winner === 'tie' ? "It's a tie!" : `Player ${winner} wins!`}
                  </p>
                ) : (
                  <p className="text-lg">
                    Current Player: <span className="font-semibold text-purple-600">{currentPlayer}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                {board.map((cell, index) => (
                  <Button
                    key={index}
                    onClick={() => makeMove(index)}
                    variant="outline"
                    className="w-20 h-20 text-2xl font-bold hover:bg-muted"
                    disabled={!!cell || !!winner || !gameActive}
                  >
                    {cell}
                  </Button>
                ))}
              </div>

              <div className="space-y-2">
                <Button onClick={resetGame} variant="outline" className="w-full">
                  New Game
                </Button>
                <Button 
                  onClick={() => startGame(gameMode)} 
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white"
                >
                  Reset Board
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
