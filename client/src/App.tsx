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
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import GamePage from "./pages/GamePage";
import ComingSoon from "./pages/ComingSoon";
import NotFound from "./pages/not-found";
import { useAuth } from "./contexts/AuthContext";

function Router() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <Switch>
      {/* Home page - shows Landing for new users, Home for authenticated users */}
      <Route path="/">
        {() => user ? <Home /> : <Landing />}
      </Route>
      
      {/* Authentication routes */}
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/forgot-password" component={ForgotPassword} />
      
      {/* User pages */}
      <Route path="/profile" component={Profile} />
      
      {/* Static pages */}
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      
      {/* Game routes */}
      <Route path="/game/:game" component={GamePage} />
      
      {/* Coming Soon page */}
      <Route path="/coming-soon" component={ComingSoon} />
      
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
