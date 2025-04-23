
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarDays, Download, FileText, Headphones, Search, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useVoiceOver } from "@/contexts/VoiceOverContext";

export const StudentSidebar = () => {
  const location = useLocation();
  const { isVoiceOverEnabled } = useVoiceOver();
  
  const navItems = [
    {
      name: "Dashboard",
      href: "/student/dashboard",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "View Results",
      href: "/student/results",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Download Results",
      href: "/student/download",
      icon: <Download className="h-5 w-5" />,
    },
    ...(isVoiceOverEnabled ? [
      {
        name: "Voice Over Results",
        href: "/student/voice-over",
        icon: <Headphones className="h-5 w-5" />,
      }
    ] : []),
    {
      name: "Search Results",
      href: "/student/search",
      icon: <Search className="h-5 w-5" />,
    },
    {
      name: "Academic Calendar",
      href: "/student/calendar",
      icon: <CalendarDays className="h-5 w-5" />,
    },
    {
      name: "Profile",
      href: "/student/profile",
      icon: <User className="h-5 w-5" />,
    },
  ];

  return (
    <aside className="w-64 border-r bg-white">
      <div className="p-6 space-y-8">
        <div className="space-y-2">
          <h2 className="text-lg font-medium text-rms-dark">Student Menu</h2>
          <div className="h-px bg-gray-200" />
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2 font-medium",
                location.pathname === item.href
                  ? "bg-rms-primary/10 text-rms-primary"
                  : "text-gray-600 hover:bg-gray-100 hover:text-rms-primary"
              )}
              asChild
            >
              <Link to={item.href}>
                {item.icon}
                {item.name}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </aside>
  );
};
