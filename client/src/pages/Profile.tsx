import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUser } from "../contexts/UserContext";
import { useAuth } from "../contexts/AuthContext";
import { User, Edit3, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const avatarColors = [
  "from-red-500 to-pink-500",
  "from-blue-500 to-cyan-500", 
  "from-green-500 to-emerald-500",
  "from-yellow-500 to-orange-500",
  "from-purple-500 to-indigo-500",
  "from-gray-500 to-slate-500"
];

export default function Profile() {
  const { user } = useAuth();
  const { profile, setProfile, updateAvatar } = useUser();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    email: profile?.email || '',
    phone: profile?.phone || ''
  });

  const getAvatarGradient = (avatarId: number) => {
    return avatarColors[avatarId - 1] || avatarColors[0];
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!profile) return;

    // Validate required fields
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    const updatedProfile = {
      ...profile,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim()
    };

    setProfile(updatedProfile);
    setIsEditing(false);
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleCancel = () => {
    setFormData({
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      email: profile?.email || '',
      phone: profile?.phone || ''
    });
    setIsEditing(false);
  };

  const handleAvatarSelect = (avatarId: number) => {
    updateAvatar(avatarId);
    toast({
      title: "Avatar Updated",
      description: "Your avatar has been changed successfully.",
    });
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <User className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Profile Found</h2>
              <p className="text-muted-foreground mb-4">
                Please sign in to view your profile.
              </p>
              <Button className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white">
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-mono bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Profile Information</span>
              {!isEditing ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                  className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
                >
                  <Edit3 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCancel}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleSave}
                    className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white"
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Profile Picture Section */}
            <div className="flex items-center space-x-6 mb-8">
              <Avatar className="w-24 h-24">
                <AvatarFallback className={`bg-gradient-to-br ${getAvatarGradient(profile.avatar)} text-white text-2xl`}>
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {profile.firstName} {profile.lastName}
                </h3>
                <p className="text-muted-foreground">@{profile.firstName.toLowerCase()}</p>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>
            </div>

            {/* Avatar Selection */}
            <div className="mb-6">
              <Label className="text-sm font-medium mb-3 block">Choose Avatar:</Label>
              <div className="grid grid-cols-6 gap-3">
                {avatarColors.map((gradient, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handleAvatarSelect(index + 1)}
                    disabled={isEditing}
                    className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all hover:scale-110 ${
                      profile.avatar === index + 1 
                        ? 'border-purple-600 ring-2 ring-purple-200 dark:ring-purple-800' 
                        : 'border-transparent hover:border-purple-600'
                    } ${isEditing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                      <User className="text-white text-sm" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-muted' : ''}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-muted' : ''}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-muted' : ''}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  className={!isEditing ? 'bg-muted' : ''}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Stats Card */}
        <Card className="mt-8 border-border/50">
          <CardHeader>
            <CardTitle>Gaming Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">12</div>
                <div className="text-sm text-muted-foreground">Games Played</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-cyan-500">8</div>
                <div className="text-sm text-muted-foreground">High Scores</div>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg">
                <div className="text-2xl font-bold text-green-500">245</div>
                <div className="text-sm text-muted-foreground">Total Points</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
