
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import { AdminLayout } from "./components/layout/AdminLayout";
import { StudentLayout } from "./components/layout/StudentLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminReports from "./pages/admin/AdminReports";
import AdminSearch from "./pages/admin/AdminSearch";
import ManageResults from "./pages/admin/ManageResults";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentResults from "./pages/student/StudentResults";
import StudentDownload from "./pages/student/StudentDownload";
import StudentVoiceOver from "./pages/student/StudentVoiceOver";
import StudentSearch from "./pages/student/StudentSearch";
import { ResultProvider } from "./contexts/ResultContext";
import { VoiceOverProvider } from "./contexts/VoiceOverContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ResultProvider>
          <VoiceOverProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Login />} />
                
                <Route path="/admin" element={<AdminLayout />}>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="manage-results" element={<ManageResults />} />
                  <Route path="reports" element={<AdminReports />} />
                  <Route path="search" element={<AdminSearch />} />
                  <Route path="profile" element={<div>Admin Profile</div>} />
                  <Route path="calendar" element={<div>Academic Calendar</div>} />
                </Route>
                
                <Route path="/student" element={<StudentLayout />}>
                  <Route path="dashboard" element={<StudentDashboard />} />
                  <Route path="results" element={<StudentResults />} />
                  <Route path="download" element={<StudentDownload />} />
                  <Route path="voice-over" element={<StudentVoiceOver />} />
                  <Route path="search" element={<StudentSearch />} />
                  <Route path="profile" element={<div>Student Profile</div>} />
                  <Route path="calendar" element={<div>Academic Calendar</div>} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </VoiceOverProvider>
        </ResultProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
