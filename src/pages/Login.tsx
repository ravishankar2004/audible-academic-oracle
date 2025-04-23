
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [studentUsername, setStudentUsername] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(adminUsername, adminPassword);
      if (success) {
        navigate("/admin/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(studentUsername, studentPassword);
      if (success) {
        navigate("/student/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rms-soft-bg to-white flex items-center justify-center">
      <div className="container max-w-4xl animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold mb-3 text-rms-dark">
              Student Result Management System
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-rms-primary to-rms-accent mb-6"></div>
            <p className="text-gray-600 mb-6">
              Welcome to SRM University's Result Management System. This platform enables students to access their academic results securely and allows administrators to manage result data efficiently.
            </p>
            <div className="p-4 bg-white rounded-lg border shadow-sm">
              <h3 className="font-semibold text-rms-secondary mb-2">Demo Login Credentials:</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Admin:</span> username: <code>admin</code>, password: any
                </div>
                <div>
                  <span className="font-medium">Students:</span> username: <code>jaswanth</code>, <code>raja</code>, <code>ravi</code>, <code>hasini</code>, password: any
                </div>
              </div>
            </div>
          </div>
          <div>
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>
                  Enter your credentials to access the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="student" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="student">Student</TabsTrigger>
                    <TabsTrigger value="admin">Admin</TabsTrigger>
                  </TabsList>

                  <TabsContent value="student">
                    <form onSubmit={handleStudentLogin}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="student-username">Username</Label>
                          <Input
                            id="student-username"
                            placeholder="Enter your username"
                            value={studentUsername}
                            onChange={(e) => setStudentUsername(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="student-password">Password</Label>
                          <Input
                            id="student-password"
                            type="password"
                            placeholder="Enter your password"
                            value={studentPassword}
                            onChange={(e) => setStudentPassword(e.target.value)}
                            required
                          />
                        </div>
                        <Button className="w-full" disabled={isLoading || !studentUsername}>
                          <User className="mr-2 h-4 w-4" />
                          Student Login
                        </Button>
                      </div>
                    </form>
                  </TabsContent>

                  <TabsContent value="admin">
                    <form onSubmit={handleAdminLogin}>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="admin-username">Username</Label>
                          <Input
                            id="admin-username"
                            placeholder="Enter your username"
                            value={adminUsername}
                            onChange={(e) => setAdminUsername(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="admin-password">Password</Label>
                          <Input
                            id="admin-password"
                            type="password"
                            placeholder="Enter your password"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            required
                          />
                        </div>
                        <Button variant="secondary" className="w-full" disabled={isLoading || !adminUsername}>
                          <LogIn className="mr-2 h-4 w-4" />
                          Admin Login
                        </Button>
                      </div>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-gray-500">
                  SRM University - AP, Andhra Pradesh
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
