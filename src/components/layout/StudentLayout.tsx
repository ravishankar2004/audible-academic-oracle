
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { AppHeader } from "./AppHeader";
import { StudentSidebar } from "./StudentSidebar";
import React from "react";

export const StudentLayout = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rms-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  if (user.role !== "student") {
    return <Navigate to="/admin/dashboard" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <div className="flex flex-1">
        <StudentSidebar />
        <main className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
