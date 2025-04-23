
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useResult } from "@/contexts/ResultContext";
import { Student } from "@/types";
import { CalendarDays, Download, FileText, Headphones } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export const StudentDashboard = () => {
  const { user } = useAuth();
  const { getResultsByStudent, academicYears, semesters, calculateStudentGPA } = useResult();
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  const student = user as Student;
  const studentResults = getResultsByStudent(student.id);
  
  const latestResults = studentResults.slice(0, 3);
  
  // Calculate GPA for each semester
  const semesterGPAs = academicYears.flatMap(year => {
    return semesters.map(sem => {
      const gpa = calculateStudentGPA(student.id, { academicYear: year, semester: sem });
      return {
        period: `${sem} - ${year}`,
        GPA: gpa,
      };
    });
  }).filter(item => item.GPA > 0);
  
  // Calculate overall GPA
  const overallGPA = calculateStudentGPA(student.id);
  
  // Calculate performance metrics
  const totalSubjects = studentResults.length;
  const aGrades = studentResults.filter(r => r.grade === 'A+' || r.grade === 'A').length;
  const aPercentage = totalSubjects > 0 ? Math.round((aGrades / totalSubjects) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Student Dashboard</h1>
          <p className="text-gray-600">
            Welcome, {student.name}! Here's an overview of your academic performance.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <CalendarDays className="h-4 w-4" />
          <span>{new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <FileText className="h-5 w-5 mr-2 text-rms-primary" />
              Overall GPA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-rms-primary">{overallGPA}</div>
            <CardDescription>Calculated across all semesters</CardDescription>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <FileText className="h-5 w-5 mr-2 text-rms-secondary" />
              Total Subjects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-rms-secondary">{totalSubjects}</div>
            <CardDescription>Subjects with recorded results</CardDescription>
          </CardContent>
        </Card>

        <Card className="hover-scale">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <FileText className="h-5 w-5 mr-2 text-rms-accent" />
              A Grade Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-rms-accent">{aPercentage}%</div>
            <CardDescription>Subjects with A or A+ grades</CardDescription>
            <Progress className="mt-2" value={aPercentage} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-rms-primary" />
              GPA Trend
            </CardTitle>
            <CardDescription>
              Your GPA performance across semesters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {semesterGPAs.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={semesterGPAs} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="GPA" 
                      stroke="#9b87f5" 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No GPA data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-rms-secondary" />
              Latest Results
            </CardTitle>
            <CardDescription>
              Your most recent academic results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {latestResults.length > 0 ? (
                latestResults.map((result) => (
                  <div key={result.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex-1">
                      <div className="font-medium">{result.subjectName}</div>
                      <div className="text-sm text-gray-500">
                        {result.subjectCode} • {result.semester} • {result.academicYear}
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex items-center space-x-2">
                      <div className="text-sm">
                        <div className="font-semibold text-right">
                          {result.marksObtained}/{result.totalMarks}
                        </div>
                        <div className={`text-right font-medium ${
                          result.grade === 'A+' || result.grade === 'A' 
                          ? 'text-green-600' 
                          : result.grade === 'F' 
                          ? 'text-red-600' 
                          : 'text-orange-600'
                        }`}>
                          Grade: {result.grade}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-500">
                  No results found
                </div>
              )}

              <div className="pt-2">
                <Link 
                  to="/student/results" 
                  className="text-rms-primary hover:text-rms-accent flex items-center justify-center"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  View All Results
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link to="/student/results">
                <div className="p-4 bg-gradient-to-r from-rms-primary to-rms-accent hover:opacity-90 text-white rounded-md flex flex-col items-center justify-center gap-2 h-32 transition-all">
                  <FileText className="h-8 w-8" />
                  <span className="font-medium text-center">View Results</span>
                </div>
              </Link>
              <Link to="/student/download">
                <div className="p-4 bg-gradient-to-r from-rms-secondary to-rms-accent hover:opacity-90 text-white rounded-md flex flex-col items-center justify-center gap-2 h-32 transition-all">
                  <Download className="h-8 w-8" />
                  <span className="font-medium text-center">Download Results</span>
                </div>
              </Link>
              {student.isVoiceOverEnabled && (
                <Link to="/student/voice-over">
                  <div className="p-4 bg-gradient-to-r from-rms-blue to-rms-secondary hover:opacity-90 text-white rounded-md flex flex-col items-center justify-center gap-2 h-32 transition-all">
                    <Headphones className="h-8 w-8" />
                    <span className="font-medium text-center">Voice Over Results</span>
                  </div>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
