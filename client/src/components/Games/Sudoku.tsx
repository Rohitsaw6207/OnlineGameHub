import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type SudokuGrid = (number | null)[][];

export function Sudoku() {
  const [grid, setGrid] = useState<SudokuGrid>(Array(9).fill(null).map(() => Array(9).fill(null)));
  const [initialGrid, setInitialGrid] = useState<SudokuGrid>(Array(9).fill(null).map(() => Array(9).fill(null)));
  const [isComplete, setIsComplete] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const generatePuzzle = () => {
    // Simple puzzle generation - in a real app, you'd want more sophisticated generation
    const puzzle: SudokuGrid = [
      [5, 3, null, null, 7, null, null, null, null],
      [6, null, null, 1, 9, 5, null, null, null],
      [null, 9, 8, null, null, null, null, 6, null],
      [8, null, null, null, 6, null, null, null, 3],
      [4, null, null, 8, null, 3, null, null, 1],
      [7, null, null, null, 2, null, null, null, 6],
      [null, 6, null, null, null, null, 2, 8, null],
      [null, null, null, 4, 1, 9, null, null, 5],
      [null, null, null, null, 8, null, null, 7, 9]
    ];
    
    setGrid(puzzle.map(row => [...row]));
    setInitialGrid(puzzle.map(row => [...row]));
    setIsComplete(false);
    setIsValid(true);
  };

  const isValidNumber = (grid: SudokuGrid, row: number, col: number, num: number): boolean => {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (x !== col && grid[row][x] === num) return false;
    }

    // Check column
    for (let x = 0; x < 9; x++) {
      if (x !== row && grid[x][col] === num) return false;
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const currentRow = boxRow + i;
        const currentCol = boxCol + j;
        if (currentRow !== row && currentCol !== col && grid[currentRow][currentCol] === num) {
          return false;
        }
      }
    }

    return true;
  };

  const checkComplete = (grid: SudokuGrid): boolean => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (grid[i][j] === null) return false;
      }
    }
    return true;
  };

  const validateGrid = (grid: SudokuGrid): boolean => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const num = grid[i][j];
        if (num !== null && !isValidNumber(grid, i, j, num)) {
          return false;
        }
      }
    }
    return true;
  };

  const handleCellChange = (row: number, col: number, value: string) => {
    if (initialGrid[row][col] !== null) return; // Can't change pre-filled cells

    const num = value === '' ? null : parseInt(value);
    if (num !== null && (num < 1 || num > 9)) return;

    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = num;
    setGrid(newGrid);

    const valid = validateGrid(newGrid);
    setIsValid(valid);
    
    if (valid && checkComplete(newGrid)) {
      setIsComplete(true);
    }
  };

  const resetPuzzle = () => {
    setGrid(initialGrid.map(row => [...row]));
    setIsComplete(false);
    setIsValid(true);
  };

  useEffect(() => {
    generatePuzzle();
  }, []);

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
            Sudoku
          </CardTitle>
          {isComplete && (
            <div className="text-center text-green-500 font-semibold">
              🎉 Puzzle Complete! 🎉
            </div>
          )}
          {!isValid && (
            <div className="text-center text-red-500 font-semibold">
              Invalid puzzle state
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            {/* Sudoku Grid */}
            <div className="grid grid-cols-9 gap-1 p-2 bg-muted border-2 border-border">
              {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <Input
                    key={`${rowIndex}-${colIndex}`}
                    type="text"
                    maxLength={1}
                    value={cell || ''}
                    onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                    className={`w-8 h-8 text-center p-0 text-sm font-semibold ${
                      initialGrid[rowIndex][colIndex] !== null 
                        ? 'bg-secondary text-foreground font-bold' 
                        : 'bg-background'
                    } ${
                      (rowIndex + 1) % 3 === 0 && rowIndex < 8 ? 'border-b-2 border-border' : ''
                    } ${
                      (colIndex + 1) % 3 === 0 && colIndex < 8 ? 'border-r-2 border-border' : ''
                    }`}
                    disabled={initialGrid[rowIndex][colIndex] !== null}
                  />
                ))
              )}
            </div>

            {/* Controls */}
            <div className="space-y-2 w-full">
              <Button 
                onClick={generatePuzzle} 
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
              >
                New Puzzle
              </Button>
              <Button 
                onClick={resetPuzzle} 
                variant="outline" 
                className="w-full"
              >
                Reset Puzzle
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Fill each row, column, and 3×3 box with numbers 1-9
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
