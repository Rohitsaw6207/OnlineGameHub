import { createContext, useContext, useState, ReactNode } from "react";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: number;
}

interface UserContextType {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  updateAvatar: (avatar: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("userProfile");
    return saved ? JSON.parse(saved) : null;
  });

  const updateProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem("userProfile", JSON.stringify(newProfile));
  };

  const updateAvatar = (avatar: number) => {
    if (profile) {
      const updated = { ...profile, avatar };
      updateProfile(updated);
    }
  };

  return (
    <UserContext.Provider value={{ profile, setProfile: updateProfile, updateAvatar }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
