
import { mockAdmins, mockStudents } from "@/lib/mock-data";
import { Admin, Student, User } from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is stored in local storage
    const storedUser = localStorage.getItem("rmsUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // For demo purposes, we're accepting any password
    // In a real app, you would validate against a backend

    // Check if user exists in mock data
    const adminUser = mockAdmins.find((admin) => admin.username === username);
    if (adminUser) {
      setUser(adminUser);
      localStorage.setItem("rmsUser", JSON.stringify(adminUser));
      toast({
        title: "Login successful",
        description: `Welcome back, ${adminUser.name}!`,
      });
      setIsLoading(false);
      return true;
    }

    const studentUser = mockStudents.find((student) => student.username === username);
    if (studentUser) {
      setUser(studentUser);
      localStorage.setItem("rmsUser", JSON.stringify(studentUser));
      toast({
        title: "Login successful",
        description: `Welcome, ${studentUser.name}!`,
      });
      setIsLoading(false);
      return true;
    }

    toast({
      title: "Login failed",
      description: "Invalid username or password",
      variant: "destructive",
    });
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("rmsUser");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("rmsUser", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
