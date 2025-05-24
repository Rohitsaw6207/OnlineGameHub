import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";
import { Layout } from "./components/Layout/Layout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import GamePage from "./pages/GamePage";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Home page */}
      <Route path="/" component={Home} />
      
      {/* Authentication routes */}
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/forgot-password" component={ForgotPassword} />
      
      {/* User pages */}
      <Route path="/profile" component={Profile} />
      
      {/* Static pages */}
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      
      {/* Game routes */}
      <Route path="/tic-tac-toe">
        {() => <GamePage params={{ game: 'tic-tac-toe' }} />}
      </Route>
      <Route path="/snake-game">
        {() => <GamePage params={{ game: 'snake-game' }} />}
      </Route>
      <Route path="/sudoku">
        {() => <GamePage params={{ game: 'sudoku' }} />}
      </Route>
      <Route path="/chess">
        {() => <GamePage params={{ game: 'chess' }} />}
      </Route>
      <Route path="/pong">
        {() => <GamePage params={{ game: 'pong' }} />}
      </Route>
      <Route path="/flappy-bird">
        {() => <GamePage params={{ game: 'flappy-bird' }} />}
      </Route>
      <Route path="/ludo">
        {() => <GamePage params={{ game: 'ludo' }} />}
      </Route>
      <Route path="/breakout">
        {() => <GamePage params={{ game: 'breakout' }} />}
      </Route>
      <Route path="/dino-run">
        {() => <GamePage params={{ game: 'dino-run' }} />}
      </Route>
      <Route path="/helix-jump">
        {() => <GamePage params={{ game: 'helix-jump' }} />}
      </Route>
      
      {/* 404 Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <UserProvider>
            <TooltipProvider>
              <Layout>
                <Router />
              </Layout>
              <Toaster />
            </TooltipProvider>
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
