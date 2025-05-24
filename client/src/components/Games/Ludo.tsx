import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PlayerColor = 'red' | 'blue' | 'green' | 'yellow';
type GameMode = '1p-3cpu' | '2p-2cpu' | '3p-1cpu' | 'local' | null;

interface Player {
  color: PlayerColor;
  isAI: boolean;
  tokens: number[];
  name: string;
}

interface GameState {
  players: Player[];
  currentPlayer: number;
  diceValue: number | null;
  winner: PlayerColor | null;
}

const playerColors = {
  red: 'bg-red-500',
  blue: 'bg-blue-500', 
  green: 'bg-green-500',
  yellow: 'bg-yellow-500'
};

export function Ludo() {
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const createPlayers = (mode: GameMode): Player[] => {
    const players: Player[] = [
      { color: 'red', isAI: false, tokens: [0, 0, 0, 0], name: 'Player 1' },
      { color: 'blue', isAI: true, tokens: [0, 0, 0, 0], name: 'CPU 1' },
      { color: 'green', isAI: true, tokens: [0, 0, 0, 0], name: 'CPU 2' },
      { color: 'yellow', isAI: true, tokens: [0, 0, 0, 0], name: 'CPU 3' }
    ];

    switch (mode) {
      case '1p-3cpu':
        // Default setup above
        break;
      case '2p-2cpu':
        players[1].isAI = false;
        players[1].name = 'Player 2';
        break;
      case '3p-1cpu':
        players[1].isAI = false;
        players[1].name = 'Player 2';
        players[2].isAI = false;
        players[2].name = 'Player 3';
        break;
      case 'local':
        players.forEach((player, index) => {
          player.isAI = false;
          player.name = `Player ${index + 1}`;
        });
        break;
    }

    return players;
  };

  const startGame = (mode: GameMode) => {
    setGameMode(mode);
    setGameState({
      players: createPlayers(mode),
      currentPlayer: 0,
      diceValue: null,
      winner: null
    });
  };

  const rollDice = () => {
    if (!gameState || isRolling) return;
    
    setIsRolling(true);
    
    // Simulate dice rolling animation
    setTimeout(() => {
      const newDice = Math.floor(Math.random() * 6) + 1;
      setGameState(prev => prev ? { ...prev, diceValue: newDice } : null);
      setIsRolling(false);
      
      // Auto-move for AI players
      if (gameState.players[gameState.currentPlayer].isAI) {
        setTimeout(() => {
          makeAIMove(newDice);
        }, 1000);
      }
    }, 500);
  };

  const makeAIMove = (diceValue: number) => {
    if (!gameState) return;
    
    // Simple AI: move the first available token
    const currentPlayer = gameState.players[gameState.currentPlayer];
    const tokenIndex = currentPlayer.tokens.findIndex(token => token < 57);
    
    if (tokenIndex !== -1) {
      moveToken(tokenIndex, diceValue);
    } else {
      nextTurn();
    }
  };

  const moveToken = (tokenIndex: number, steps: number) => {
    if (!gameState) return;
    
    setGameState(prev => {
      if (!prev) return null;
      
      const newState = { ...prev };
      const currentPlayerIndex = newState.currentPlayer;
      const newTokens = [...newState.players[currentPlayerIndex].tokens];
      
      // Move token
      if (newTokens[tokenIndex] === 0 && steps === 6) {
        newTokens[tokenIndex] = 1; // Enter the board
      } else if (newTokens[tokenIndex] > 0) {
        newTokens[tokenIndex] = Math.min(57, newTokens[tokenIndex] + steps);
      }
      
      newState.players[currentPlayerIndex].tokens = newTokens;
      
      // Check for winner
      if (newTokens.every(token => token === 57)) {
        newState.winner = newState.players[currentPlayerIndex].color;
      }
      
      return newState;
    });
    
    // Next turn (unless rolled 6)
    if (gameState.diceValue !== 6) {
      setTimeout(nextTurn, 500);
    } else {
      setGameState(prev => prev ? { ...prev, diceValue: null } : null);
    }
  };

  const nextTurn = () => {
    setGameState(prev => {
      if (!prev) return null;
      
      const nextPlayer = (prev.currentPlayer + 1) % prev.players.length;
      return {
        ...prev,
        currentPlayer: nextPlayer,
        diceValue: null
      };
    });
  };

  const resetGame = () => {
    setGameMode(null);
    setGameState(null);
  };

  const getTokenPosition = (playerIndex: number, tokenIndex: number): string => {
    if (!gameState) return '';
    
    const position = gameState.players[playerIndex].tokens[tokenIndex];
    
    if (position === 0) {
      // Token in home
      const homePositions = [
        ['top-2 left-2', 'top-2 left-8', 'top-8 left-2', 'top-8 left-8'],
        ['top-2 right-2', 'top-2 right-8', 'top-8 right-2', 'top-8 right-8'],
        ['bottom-2 right-2', 'bottom-2 right-8', 'bottom-8 right-2', 'bottom-8 right-8'],
        ['bottom-2 left-2', 'bottom-2 left-8', 'bottom-8 left-2', 'bottom-8 left-8']
      ];
      return homePositions[playerIndex][tokenIndex];
    } else if (position === 57) {
      // Token finished
      return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2';
    } else {
      // Token on board - simplified positioning
      const boardPosition = (position - 1) * 6; // Degrees around the board
      return `top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-[${boardPosition}deg] translate-y-[-100px]`;
    }
  };

  if (!gameMode) {
    return (
      <div className="flex flex-col items-center space-y-6 p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              Ludo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                onClick={() => startGame('1p-3cpu')} 
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
              >
                1 Player vs 3 CPU
              </Button>
              <Button 
                onClick={() => startGame('2p-2cpu')} 
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
              >
                2 Players vs 2 CPU
              </Button>
              <Button 
                onClick={() => startGame('3p-1cpu')} 
                className="w-full bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white"
              >
                3 Players vs 1 CPU
              </Button>
              <Button 
                onClick={() => startGame('local')} 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                Local Multiplayer (4 Players)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
            Ludo Game
          </CardTitle>
          {gameState && (
            <div className="text-center">
              {gameState.winner ? (
                <p className="text-lg font-bold text-green-500">
                  {gameState.players.find(p => p.color === gameState.winner)?.name} Wins! 🎉
                </p>
              ) : (
                <p className="text-lg">
                  Current Turn: <span className="font-semibold text-purple-600">
                    {gameState.players[gameState.currentPlayer].name}
                  </span>
                </p>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {gameState && (
            <>
              {/* Game Board */}
              <div className="relative w-96 h-96 mx-auto mb-6 bg-white border-4 border-gray-800">
                {/* Cross pattern */}
                <div className="absolute inset-0 flex">
                  <div className="w-2/5 bg-white"></div>
                  <div className="w-1/5 bg-yellow-100"></div>
                  <div className="w-2/5 bg-white"></div>
                </div>
                <div className="absolute inset-0 flex flex-col">
                  <div className="h-2/5 bg-white"></div>
                  <div className="h-1/5 bg-yellow-100"></div>
                  <div className="h-2/5 bg-white"></div>
                </div>

                {/* Home areas */}
                <div className="absolute top-0 left-0 w-2/5 h-2/5 bg-red-200 border-2 border-red-500"></div>
                <div className="absolute top-0 right-0 w-2/5 h-2/5 bg-blue-200 border-2 border-blue-500"></div>
                <div className="absolute bottom-0 right-0 w-2/5 h-2/5 bg-green-200 border-2 border-green-500"></div>
                <div className="absolute bottom-0 left-0 w-2/5 h-2/5 bg-yellow-200 border-2 border-yellow-500"></div>

                {/* Center */}
                <div className="absolute top-1/2 left-1/2 w-12 h-12 transform -translate-x-1/2 -translate-y-1/2 bg-yellow-400 border-2 border-gray-800"></div>

                {/* Tokens */}
                {gameState.players.map((player, playerIndex) =>
                  player.tokens.map((position, tokenIndex) => (
                    <div
                      key={`${playerIndex}-${tokenIndex}`}
                      className={`absolute w-4 h-4 rounded-full ${playerColors[player.color]} border border-gray-600 ${getTokenPosition(playerIndex, tokenIndex)}`}
                      onClick={() => {
                        if (!player.isAI && gameState.diceValue && !gameState.winner) {
                          moveToken(tokenIndex, gameState.diceValue);
                        }
                      }}
                    />
                  ))
                )}
              </div>

              {/* Player Status */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {gameState.players.map((player, index) => (
                  <div 
                    key={player.color}
                    className={`p-3 rounded-lg border-2 ${
                      index === gameState.currentPlayer ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-300'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full ${playerColors[player.color]} mb-2`}></div>
                    <p className="font-semibold text-sm">{player.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Home: {player.tokens.filter(t => t === 0).length} |
                      Finished: {player.tokens.filter(t => t === 57).length}
                    </p>
                  </div>
                ))}
              </div>

              {/* Dice and Controls */}
              <div className="flex flex-col items-center space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white border-2 border-gray-800 rounded-lg flex items-center justify-center text-2xl font-bold">
                    {isRolling ? '?' : gameState.diceValue || '-'}
                  </div>
                  
                  {!gameState.winner && (
                    <Button 
                      onClick={rollDice} 
                      disabled={isRolling || gameState.diceValue !== null}
                      className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
                    >
                      {isRolling ? 'Rolling...' : 'Roll Dice'}
                    </Button>
                  )}
                </div>

                <div className="flex space-x-2">
                  <Button onClick={resetGame} variant="outline">
                    New Game
                  </Button>
                  <Button 
                    onClick={() => startGame(gameMode)} 
                    className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
                  >
                    Restart
                  </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  Roll 6 to enter the board. Get all tokens to the center to win!
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
