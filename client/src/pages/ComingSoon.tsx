import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Gamepad2, Sparkles, Clock, ArrowRight } from "lucide-react";

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-slate-800 to-cyan-900 relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }, (_, i) => (
          <div
            key={i}
            className="absolute opacity-20 text-2xl animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            {i % 4 === 0 ? '⚡' : i % 4 === 1 ? '🎮' : i % 4 === 2 ? '🎲' : '🚀'}
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <Card className="bg-slate-800/90 border-slate-700 shadow-2xl">
          <CardContent className="p-8 space-y-6">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-cyan-500 rounded-3xl flex items-center justify-center animate-pulse">
                <Gamepad2 className="h-12 w-12 text-white" />
              </div>
            </div>

            {/* Main Message */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Sorry! This Game is Under Development
              </h1>
              
              <p className="text-lg text-slate-300 leading-relaxed">
                We're working hard to bring you an amazing gaming experience. 
                This game will be available after the next update.
              </p>
            </div>

            {/* Coming Soon Badge */}
            <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-full py-3 px-6 border border-purple-500/30">
              <Clock className="h-5 w-5 text-purple-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                COMING SOON
              </span>
              <Sparkles className="h-5 w-5 text-cyan-400" />
            </div>

            {/* Description */}
            <p className="text-slate-400 text-base">
              Until then, please explore our other exciting games from our collection!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link href="/" className="flex-1">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white py-3 text-lg">
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Explore Other Games
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700 py-3"
                onClick={() => window.history.back()}
              >
                Go Back
              </Button>
            </div>

            {/* Progress Indicator */}
            <div className="space-y-2 pt-4">
              <div className="flex justify-between text-sm text-slate-400">
                <span>Development Progress</span>
                <span>75%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full w-3/4 animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}