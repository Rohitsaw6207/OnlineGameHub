import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Star, Users, Trophy } from "lucide-react";

const games = [
  {
    id: 'tic-tac-toe',
    title: 'Tic Tac Toe',
    description: 'Classic strategy game. Get three in a row to win!',
    icon: '⚡',
    gradient: 'from-red-500 to-pink-500',
    category: 'Strategy',
    players: '2 Players',
    route: '/tic-tac-toe'
  },
  {
    id: 'snake-game',
    title: 'Snake Game',
    description: 'Navigate the snake, eat food, and grow longer!',
    icon: '🐍',
    gradient: 'from-green-500 to-emerald-500',
    category: 'Arcade',
    players: 'Single Player',
    route: '/snake-game'
  },
  {
    id: 'sudoku',
    title: 'Sudoku',
    description: 'Fill the grid with numbers. Use logic to solve!',
    icon: '🔢',
    gradient: 'from-blue-500 to-cyan-500',
    category: 'Puzzle',
    players: 'Single Player',
    route: '/sudoku'
  },
  {
    id: 'chess',
    title: 'Chess',
    description: 'The ultimate strategy game. Checkmate your opponent!',
    icon: '♛',
    gradient: 'from-purple-500 to-indigo-500',
    category: 'Strategy',
    players: '2 Players',
    route: '/chess'
  },
  {
    id: 'pong',
    title: 'Pong',
    description: 'Classic arcade tennis. Control the paddle!',
    icon: '🏓',
    gradient: 'from-yellow-500 to-orange-500',
    category: 'Arcade',
    players: 'vs AI',
    route: '/pong'
  },
  {
    id: 'flappy-bird',
    title: 'Flappy Bird',
    description: 'Tap to flap and avoid the pipes. How far can you go?',
    icon: '🐦',
    gradient: 'from-teal-500 to-cyan-500',
    category: 'Endless',
    players: 'Single Player',
    route: '/flappy-bird'
  },
  {
    id: 'ludo',
    title: 'Ludo',
    description: 'Roll the dice and race your tokens to home!',
    icon: '🎲',
    gradient: 'from-rose-500 to-pink-500',
    category: 'Board Game',
    players: '2-4 Players',
    route: '/ludo'
  },
  {
    id: 'breakout',
    title: 'Breakout',
    description: 'Break all the blocks with your paddle and ball!',
    icon: '🧱',
    gradient: 'from-violet-500 to-purple-500',
    category: 'Arcade',
    players: 'Single Player',
    route: '/breakout'
  },
  {
    id: 'dino-run',
    title: 'Dino Run',
    description: 'Jump over obstacles in this endless runner!',
    icon: '🦕',
    gradient: 'from-amber-500 to-yellow-500',
    category: 'Runner',
    players: 'Single Player',
    route: '/dino-run'
  },
  {
    id: 'helix-jump',
    title: 'Helix Jump',
    description: 'Guide the ball down the spiral tower!',
    icon: '⚫',
    gradient: 'from-indigo-500 to-blue-500',
    category: '3D',
    players: 'Single Player',
    route: '/helix-jump'
  }
];

export default function Home() {
  const scrollToGames = () => {
    const gamesSection = document.getElementById('featured-games');
    if (gamesSection) {
      gamesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Gaming Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 animate-bounce">
            <div className="text-6xl">🎮</div>
          </div>
          <div className="absolute top-20 right-20 animate-pulse">
            <Trophy className="h-20 w-20 text-cyan-500" />
          </div>
          <div className="absolute bottom-20 left-1/4 animate-bounce" style={{ animationDelay: '1s' }}>
            <div className="text-4xl">🎲</div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative">
          <h1 className="font-bold text-4xl sm:text-5xl lg:text-7xl mb-6 animate-in slide-in-from-bottom-4 duration-1000">
            <span className="bg-gradient-to-r from-purple-600 via-cyan-500 to-green-500 bg-clip-text text-transparent font-mono">
              Epic Gaming
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent font-mono">
              Adventure Awaits
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-in slide-in-from-bottom-6 duration-1000 delay-200">
            Dive into a world of classic and modern games. From strategic chess battles to fast-paced arcade action, 
            find your next gaming obsession right here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in slide-in-from-bottom-8 duration-1000 delay-300">
            <Button 
              size="lg" 
              onClick={scrollToGames}
              className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white px-8 py-4 text-lg"
            >
              <Play className="mr-2 h-5 w-5" />
              Start Playing
            </Button>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-4 text-lg">
                <Users className="mr-2 h-5 w-5" />
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Games Grid Section */}
      <section id="featured-games" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl sm:text-4xl mb-4 font-mono">
              <span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                Featured Games
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our collection of engaging games, from timeless classics to modern favorites
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {games.map((game) => (
              <Card 
                key={game.id} 
                className="group hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:-translate-y-2 hover:scale-105 border-border/50 hover:border-purple-500/50"
              >
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${game.gradient} rounded-2xl flex items-center justify-center group-hover:animate-pulse text-2xl`}>
                      {game.icon}
                    </div>
                    <h3 className="font-bold text-xl mb-2 font-mono text-foreground">
                      {game.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {game.description}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Link href={game.route}>
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white">
                        <Play className="mr-2 h-4 w-4" />
                        Play Now
                      </Button>
                    </Link>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{game.category}</span>
                      <span>{game.players}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl sm:text-4xl mb-4 font-mono">
              <span className="bg-gradient-to-r from-cyan-500 to-green-500 bg-clip-text text-transparent">
                Why Choose Game Hub?
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center">
                <Play className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Instant Play</h3>
              <p className="text-muted-foreground">No downloads required. Jump straight into the action with our web-based games.</p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-green-500 rounded-2xl flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Multiplayer Fun</h3>
              <p className="text-muted-foreground">Challenge friends or play against AI in our competitive multiplayer games.</p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-yellow-500 rounded-2xl flex items-center justify-center">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-xl mb-2">Track Progress</h3>
              <p className="text-muted-foreground">Save your progress, track high scores, and unlock achievements as you play.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
