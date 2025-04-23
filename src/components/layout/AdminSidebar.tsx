
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarDays, FileBarChart, FileText, Search, Upload, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const AdminSidebar = () => {
  const location = useLocation();
  
  const navItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Manage Results",
      href: "/admin/manage-results",
      icon: <Upload className="h-5 w-5" />,
    },
    {
      name: "Search Results",
      href: "/admin/search",
      icon: <Search className="h-5 w-5" />,
    },
    {
      name: "Reports",
      href: "/admin/reports",
      icon: <FileBarChart className="h-5 w-5" />,
    },
    {
      name: "Academic Calendar",
      href: "/admin/calendar",
      icon: <CalendarDays className="h-5 w-5" />,
    },
    {
      name: "Profile",
      href: "/admin/profile",
      icon: <User className="h-5 w-5" />,
    },
  ];

  return (
    <aside className="w-64 border-r bg-white">
      <div className="p-6 space-y-8">
        <div className="space-y-2">
          <h2 className="text-lg font-medium text-rms-dark">Admin Menu</h2>
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
