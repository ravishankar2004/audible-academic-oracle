
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { Headphones, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useVoiceOver } from "@/contexts/VoiceOverContext";
import { Switch } from "@/components/ui/switch";
import { Student } from "@/types";

export const AppHeader = () => {
  const { user, logout } = useAuth();
  const { isVoiceOverEnabled, toggleVoiceOver } = useVoiceOver();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-white border-b shadow-sm py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div 
          className="flex items-center space-x-2 cursor-pointer" 
          onClick={() => navigate(user?.role === "admin" ? "/admin/dashboard" : "/student/dashboard")}
        >
          <div className="bg-gradient-to-r from-rms-primary to-rms-accent p-2 rounded-lg">
            <div className="w-8 h-8 text-white flex items-center justify-center font-bold">
              RMS
            </div>
          </div>
          <h1 className="text-2xl font-bold logo-text">
            Result Management System
          </h1>
        </div>

        {user && (
          <div className="flex items-center space-x-4">
            {user.role === "student" && (
              <div className="flex items-center space-x-2 mr-4">
                <Headphones className="h-4 w-4" />
                <span className="text-sm">Voice Over</span>
                <Switch
                  checked={isVoiceOverEnabled}
                  onCheckedChange={toggleVoiceOver}
                />
              </div>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate(user.role === "admin" ? "/admin/profile" : "/student/profile")}>
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  );
};
