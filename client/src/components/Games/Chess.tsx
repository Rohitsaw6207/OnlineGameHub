import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
type PieceColor = 'white' | 'black';

interface Piece {
  type: PieceType;
  color: PieceColor;
}

type Board = (Piece | null)[][];
type GameMode = 'local' | 'computer' | null;

const pieceSymbols: Record<PieceColor, Record<PieceType, string>> = {
  white: {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙'
  },
  black: {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟'
  }
};

export function Chess() {
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [board, setBoard] = useState<Board>(createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState<PieceColor>('white');
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<[number, number][]>([]);
  const [gameStarted, setGameStarted] = useState(false);

  function createInitialBoard(): Board {
    const board: Board = Array(8).fill(null).map(() => Array(8).fill(null));
    
    // Black pieces
    board[0] = [
      { type: 'rook', color: 'black' },
      { type: 'knight', color: 'black' },
      { type: 'bishop', color: 'black' },
      { type: 'queen', color: 'black' },
      { type: 'king', color: 'black' },
      { type: 'bishop', color: 'black' },
      { type: 'knight', color: 'black' },
      { type: 'rook', color: 'black' }
    ];
    board[1] = Array(8).fill({ type: 'pawn', color: 'black' });
    
    // White pieces
    board[6] = Array(8).fill({ type: 'pawn', color: 'white' });
    board[7] = [
      { type: 'rook', color: 'white' },
      { type: 'knight', color: 'white' },
      { type: 'bishop', color: 'white' },
      { type: 'queen', color: 'white' },
      { type: 'king', color: 'white' },
      { type: 'bishop', color: 'white' },
      { type: 'knight', color: 'white' },
      { type: 'rook', color: 'white' }
    ];
    
    return board;
  }

  const getPossibleMoves = (row: number, col: number): [number, number][] => {
    const moves: [number, number][] = [];
    const piece = board[row][col];
    if (!piece || piece.color !== currentPlayer) return moves;

    for (let toRow = 0; toRow < 8; toRow++) {
      for (let toCol = 0; toCol < 8; toCol++) {
        if (isValidMove(row, col, toRow, toCol)) {
          moves.push([toRow, toCol]);
        }
      }
    }
    return moves;
  };

  const startGame = (mode: GameMode) => {
    setGameMode(mode);
    setBoard(createInitialBoard());
    setCurrentPlayer('white');
    setSelectedSquare(null);
    setPossibleMoves([]);
    setGameStarted(true);
  };

  const resetGame = () => {
    setGameMode(null);
    setBoard(createInitialBoard());
    setCurrentPlayer('white');
    setSelectedSquare(null);
    setPossibleMoves([]);
    setGameStarted(false);
  };

  const isValidMove = (fromRow: number, fromCol: number, toRow: number, toCol: number): boolean => {
    const piece = board[fromRow][fromCol];
    if (!piece || piece.color !== currentPlayer) return false;
    
    // Target square validation
    const targetPiece = board[toRow][toCol];
    if (targetPiece && targetPiece.color === piece.color) return false;
    
    // Basic move validation (simplified)
    const rowDiff = Math.abs(toRow - fromRow);
    const colDiff = Math.abs(toCol - fromCol);
    
    switch (piece.type) {
      case 'pawn':
        const direction = piece.color === 'white' ? -1 : 1;
        const startRow = piece.color === 'white' ? 6 : 1;
        
        if (colDiff === 0) { // Forward move
          if (toRow === fromRow + direction && !targetPiece) return true;
          if (fromRow === startRow && toRow === fromRow + 2 * direction && !targetPiece) return true;
        } else if (colDiff === 1 && toRow === fromRow + direction && targetPiece) {
          return true; // Capture
        }
        return false;
        
      case 'rook':
        return (rowDiff === 0 || colDiff === 0);
        
      case 'bishop':
        return rowDiff === colDiff;
        
      case 'queen':
        return rowDiff === colDiff || rowDiff === 0 || colDiff === 0;
        
      case 'king':
        return rowDiff <= 1 && colDiff <= 1;
        
      case 'knight':
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
        
      default:
        return false;
    }
  };

  const handleSquareClick = (row: number, col: number) => {
    if (!gameStarted) return;
    
    if (selectedSquare) {
      const [fromRow, fromCol] = selectedSquare;
      
      if (fromRow === row && fromCol === col) {
        // Deselect
        setSelectedSquare(null);
      } else if (isValidMove(fromRow, fromCol, row, col)) {
        // Make move
        const newBoard = board.map(r => [...r]);
        newBoard[row][col] = newBoard[fromRow][fromCol];
        newBoard[fromRow][fromCol] = null;
        setBoard(newBoard);
        setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
        setSelectedSquare(null);
      } else {
        // Invalid move, try to select new piece
        const piece = board[row][col];
        if (piece && piece.color === currentPlayer) {
          setSelectedSquare([row, col]);
        } else {
          setSelectedSquare(null);
        }
      }
    } else {
      // Select piece
      const piece = board[row][col];
      if (piece && piece.color === currentPlayer) {
        setSelectedSquare([row, col]);
      }
    }
  };

  const isSquareSelected = (row: number, col: number) => {
    return selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col;
  };

  const getSquareColor = (row: number, col: number) => {
    const isLight = (row + col) % 2 === 0;
    const isSelected = isSquareSelected(row, col);
    
    if (isSelected) return 'bg-yellow-400';
    return isLight ? 'bg-amber-100 dark:bg-amber-900' : 'bg-amber-800 dark:bg-amber-700';
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Chess
          </CardTitle>
          {gameStarted && (
            <div className="text-center">
              <p className="text-lg">
                Current Player: <span className="font-semibold text-purple-600 capitalize">{currentPlayer}</span>
              </p>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {!gameMode ? (
            <div className="space-y-4">
              <Button 
                onClick={() => startGame('local')} 
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
              >
                Play Local (2 Players)
              </Button>
              <Button 
                onClick={() => startGame('computer')} 
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              >
                Play vs Computer
              </Button>
            </div>
          ) : (
            <>
              {/* Chess Board */}
              <div className="flex justify-center mb-4">
                <div className="grid grid-cols-8 border-2 border-border">
                  {board.map((row, rowIndex) =>
                    row.map((piece, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`w-12 h-12 flex items-center justify-center cursor-pointer text-2xl select-none ${getSquareColor(rowIndex, colIndex)}`}
                        onClick={() => handleSquareClick(rowIndex, colIndex)}
                      >
                        {piece && pieceSymbols[piece.color][piece.type]}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-2">
                <Button onClick={resetGame} variant="outline" className="w-full">
                  New Game
                </Button>
                <Button 
                  onClick={() => startGame(gameMode)} 
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                >
                  Reset Board
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground mt-4">
                Click a piece to select it, then click a valid square to move
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
