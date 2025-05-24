import { useParams } from "wouter";
import { TicTacToe } from "../components/Games/EnhancedTicTacToe";
import { SnakeGame } from "../components/Games/SnakeGame";
import { Sudoku } from "../components/Games/Sudoku";
import { Chess } from "../components/Games/Chess";
import { Pong } from "../components/Games/Pong";
import { FlappyBird } from "../components/Games/FlappyBird";
import { Ludo } from "../components/Games/Ludo";
import { Breakout } from "../components/Games/Breakout";
import { DinoRun } from "../components/Games/DinoRun";
import { HelixJump } from "../components/Games/HelixJump";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

const gameComponents = {
  'tic-tac-toe': TicTacToe,
  'snake-game': SnakeGame,
  'sudoku': Sudoku,
  'chess': Chess,
  'pong': Pong,
  'flappy-bird': FlappyBird,
  'ludo': Ludo,
  'breakout': Breakout,
  'dino-run': DinoRun,
  'helix-jump': HelixJump,
};

export default function GamePage() {
  const params = useParams();
  const gameId = params.game as keyof typeof gameComponents;
  
  const GameComponent = gameComponents[gameId];

  if (!GameComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold text-foreground">Game Not Found</h1>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              The game "{gameId}" could not be found. Please check the URL or return to the home page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GameComponent />
    </div>
  );
}
