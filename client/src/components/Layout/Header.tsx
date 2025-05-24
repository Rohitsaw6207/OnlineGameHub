import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { useUser } from "../../contexts/UserContext";
import { logout } from "../../lib/firebase";
import { Home, Moon, Sun, User, Gamepad2 } from "lucide-react";

const avatarColors = [
  "from-red-500 to-pink-500",
  "from-blue-500 to-cyan-500", 
  "from-green-500 to-emerald-500",
  "from-yellow-500 to-orange-500",
  "from-purple-500 to-indigo-500",
  "from-gray-500 to-slate-500"
];

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { profile, updateAvatar } = useUser();
  const [, setLocation] = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setLocation("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleAvatarSelect = (avatarId: number) => {
    updateAvatar(avatarId);
  };

  const getAvatarGradient = (avatarId: number) => {
    return avatarColors[avatarId - 1] || avatarColors[0];
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <Gamepad2 className="h-6 w-6 text-white" />
            </div>
            <Link href="/">
              <h1 className="font-bold text-xl bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent hidden sm:block font-mono">
                Online Game Hub
              </h1>
            </Link>
          </div>

          {/* Center Title for Mobile */}
          <Link href="/">
            <h1 className="font-bold text-lg bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent sm:hidden font-mono">
              Game Hub
            </h1>
          </Link>

          {/* Right Controls */}
          <div className="flex items-center space-x-4">
            {/* Home Button */}
            <Link href="/">
              <Button variant="ghost" size="icon" className="hover:bg-muted">
                <Home className="h-5 w-5 text-purple-600" />
              </Button>
            </Link>

            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="hover:bg-muted">
              {theme === "dark" ? (
                <Moon className="h-5 w-5 text-cyan-500" />
              ) : (
                <Sun className="h-5 w-5 text-orange-500" />
              )}
            </Button>

            {/* Profile/Auth */}
            {user && profile ? (
              <DropdownMenu open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className={`bg-gradient-to-br ${getAvatarGradient(profile.avatar)} text-white`}>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-6 bg-card border border-border">
                  <div>
                    {/* Profile Info */}
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar className="w-16 h-16">
                        <AvatarFallback className={`bg-gradient-to-br ${getAvatarGradient(profile.avatar)} text-white text-xl`}>
                          <User className="h-8 w-8" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">
                          {profile.firstName} {profile.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground">@{profile.firstName.toLowerCase()}</p>
                      </div>
                    </div>

                    {/* User Details */}
                    <div className="space-y-2 mb-4 text-sm">
                      <p><span className="text-muted-foreground">Email:</span> <span className="text-foreground">{profile.email}</span></p>
                      <p><span className="text-muted-foreground">Phone:</span> <span className="text-foreground">{profile.phone}</span></p>
                    </div>

                    {/* Avatar Selection */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2 text-foreground">Choose Avatar:</label>
                      <div className="grid grid-cols-6 gap-2">
                        {avatarColors.map((gradient, index) => (
                          <button
                            key={index + 1}
                            onClick={() => handleAvatarSelect(index + 1)}
                            className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-colors ${
                              profile.avatar === index + 1 ? 'border-purple-600' : 'border-transparent hover:border-purple-600'
                            }`}
                          >
                            <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                              <User className="text-white text-xs" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Link href="/profile" className="flex-1">
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white">
                          View Profile
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        onClick={handleLogout}
                        className="border-border hover:bg-muted"
                      >
                        Logout
                      </Button>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
