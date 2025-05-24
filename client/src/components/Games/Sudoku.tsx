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
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

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

  const handleCellClick = (row: number, col: number) => {
    if (initialGrid[row][col] !== null) return; // Can't select pre-filled cells
    setSelectedCell([row, col]);
  };

  const handleNumberSelect = (num: number) => {
    setSelectedNumber(num);
    if (selectedCell) {
      const [row, col] = selectedCell;
      handleCellChange(row, col, num);
    }
  };

  const handleCellChange = (row: number, col: number, value: number | null) => {
    if (initialGrid[row][col] !== null) return; // Can't change pre-filled cells

    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = value;
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
                row.map((cell, colIndex) => {
                  const isSelected = selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex;
                  const isPrefilled = initialGrid[rowIndex][colIndex] !== null;
                  
                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      className={`w-8 h-8 flex items-center justify-center text-center text-sm font-semibold cursor-pointer border ${
                        isPrefilled 
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold' 
                          : 'bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700'
                      } ${
                        isSelected ? 'ring-2 ring-blue-500 bg-blue-100 dark:bg-blue-900' : ''
                      } ${
                        (rowIndex + 1) % 3 === 0 && rowIndex < 8 ? 'border-b-2 border-gray-600' : ''
                      } ${
                        (colIndex + 1) % 3 === 0 && colIndex < 8 ? 'border-r-2 border-gray-600' : ''
                      }`}
                    >
                      {cell || ''}
                    </div>
                  );
                })
              )}
            </div>

            {/* Number Selection */}
            <div className="w-full">
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                Select a number:
              </p>
              <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <Button
                    key={num}
                    onClick={() => handleNumberSelect(num)}
                    variant={selectedNumber === num ? "default" : "outline"}
                    className={`h-10 w-10 p-0 text-lg font-bold ${
                      selectedNumber === num 
                        ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                        : 'hover:bg-blue-50 dark:hover:bg-blue-900'
                    }`}
                  >
                    {num}
                  </Button>
                ))}
                <Button
                  onClick={() => {
                    setSelectedNumber(null);
                    if (selectedCell) {
                      const [row, col] = selectedCell;
                      handleCellChange(row, col, null);
                    }
                  }}
                  variant="outline"
                  className="h-10 w-10 p-0 text-lg font-bold hover:bg-red-50 dark:hover:bg-red-900 col-span-1"
                >
                  ×
                </Button>
              </div>
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
