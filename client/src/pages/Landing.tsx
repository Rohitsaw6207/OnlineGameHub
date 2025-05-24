import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Play, Users, LogIn, Trophy } from "lucide-react";

export default function Landing() {
  const scrollToGames = () => {
    const gamesSection = document.getElementById('preview-games');
    if (gamesSection) {
      gamesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background Gaming Elements */}
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
          <div className="absolute top-1/2 right-1/3 animate-pulse" style={{ animationDelay: '2s' }}>
            <div className="text-5xl">⚡</div>
          </div>
          <div className="absolute bottom-1/3 right-10 animate-bounce" style={{ animationDelay: '0.5s' }}>
            <div className="text-4xl">🏆</div>
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
          
          {/* Action Buttons */}
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
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white px-8 py-4 text-lg">
                <Users className="mr-2 h-5 w-5" />
                Sign Up Free
              </Button>
            </Link>
            
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-8 py-4 text-lg">
                <LogIn className="mr-2 h-5 w-5" />
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Games Preview Section */}
      <section id="preview-games" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-bold text-3xl sm:text-4xl mb-4 font-mono">
              <span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                Featured Games
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get a preview of our amazing game collection. Sign up to start playing!
            </p>
          </div>

          {/* Game Preview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { name: 'Tic Tac Toe', icon: '⚡', color: 'from-red-500 to-pink-500' },
              { name: 'Snake Game', icon: '🐍', color: 'from-green-500 to-emerald-500' },
              { name: 'Sudoku', icon: '🔢', color: 'from-blue-500 to-cyan-500' },
              { name: 'Chess', icon: '♛', color: 'from-purple-500 to-indigo-500' },
              { name: 'Pong', icon: '🏓', color: 'from-yellow-500 to-orange-500' },
              { name: 'Flappy Bird', icon: '🐦', color: 'from-teal-500 to-cyan-500' },
              { name: 'Ludo', icon: '🎲', color: 'from-rose-500 to-pink-500' },
              { name: 'Breakout', icon: '🧱', color: 'from-violet-500 to-purple-500' },
              { name: 'Dino Run', icon: '🦕', color: 'from-amber-500 to-yellow-500' },
              { name: 'Helix Jump', icon: '🌀', color: 'from-indigo-500 to-purple-500' },
            ].map((game, index) => (
              <div 
                key={game.name}
                className="relative group cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-full aspect-square bg-gradient-to-br ${game.color} rounded-2xl flex items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-300 shadow-lg`}>
                  {game.icon}
                </div>
                <p className="text-center mt-2 text-sm font-medium text-muted-foreground">
                  {game.name}
                </p>
                <div className="absolute inset-0 bg-black/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-semibold">Sign up to play!</span>
                </div>
              </div>
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