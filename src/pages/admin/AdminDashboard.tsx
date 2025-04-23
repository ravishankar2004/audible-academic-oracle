
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useResult } from "@/contexts/ResultContext";
import { CalendarIcon, FileBarChart, FileText, Search, Upload, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { mockStudents } from "@/lib/mock-data";

export const AdminDashboard = () => {
  const { user } = useAuth();
  const { results, reports, subjects } = useResult();

  // Calculate grade distribution across all results
  const gradeDistribution = results.reduce<Record<string, number>>(
    (acc, result) => {
      acc[result.grade] = (acc[result.grade] || 0) + 1;
      return acc;
    },
    {}
  );

  const chartData = Object.entries(gradeDistribution).map(([grade, count]) => ({
    grade,
    count,
  })).sort((a, b) => {
    const gradeOrder = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'];
    return gradeOrder.indexOf(a.grade) - gradeOrder.indexOf(b.grade);
  });

  // Get subject with highest average marks
  const subjectAverages = subjects.map(subject => {
    const subjectResults = results.filter(r => r.subjectId === subject.id);
    if (subjectResults.length === 0) return { subject, average: 0 };
    
    const avg = subjectResults.reduce((sum, r) => sum + r.marksObtained, 0) / subjectResults.length;
    return {
      subject,
      average: parseFloat(avg.toFixed(2))
    };
  }).sort((a, b) => b.average - a.average);

  const widgets = [
    {
      title: "Total Students",
      value: mockStudents.length.toString(),
      description: "Registered in the system",
      icon: <Users className="h-5 w-5 text-rms-primary" />,
    },
    {
      title: "Total Subjects",
      value: subjects.length.toString(),
      description: "Available in the system",
      icon: <FileText className="h-5 w-5 text-rms-secondary" />,
    },
    {
      title: "Total Results",
      value: results.length.toString(),
      description: "Uploaded in the system",
      icon: <Upload className="h-5 w-5 text-rms-blue" />,
    },
    {
      title: "Reports Generated",
      value: reports.length.toString(),
      description: "Available for download",
      icon: <FileBarChart className="h-5 w-5 text-rms-accent" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user?.name}! Here's an overview of the system.
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <CalendarIcon className="h-4 w-4" />
          <span>{new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {widgets.map((widget, i) => (
          <Card key={i} className="hover-scale">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{widget.title}</CardTitle>
                {widget.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{widget.value}</div>
              <CardDescription>{widget.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileBarChart className="h-5 w-5 mr-2 text-rms-accent" />
              Grade Distribution
            </CardTitle>
            <CardDescription>
              Overview of grades across all subjects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grade" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#9b87f5" name="Number of Students" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2 text-rms-blue" />
              Latest Actions
            </CardTitle>
            <CardDescription>Recent activities in the system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3">
              <h4 className="font-semibold">Recent Reports</h4>
              {reports.slice(0, 3).map((report) => (
                <div key={report.id} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{report.title}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(report.generatedOn).toLocaleDateString()}
                    </div>
                  </div>
                  <Link
                    to={`/admin/reports/${report.id}`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">Best Performing Subjects</h4>
              {subjectAverages.slice(0, 3).map((item, index) => (
                <div key={item.subject.id} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{item.subject.subjectName}</div>
                    <div className="text-sm text-gray-500">{item.subject.subjectCode}</div>
                  </div>
                  <div className="text-rms-accent font-semibold">
                    Avg: {item.average}%
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center mt-2">
              <Link to="/admin/reports" className="text-rms-primary hover:text-rms-secondary flex items-center">
                <Search className="h-4 w-4 mr-1" />
                <span>View All Reports</span>
              </Link>
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
              <Link to="/admin/manage-results">
                <div className="p-4 bg-gradient-to-r from-rms-primary to-rms-accent hover:opacity-90 text-white rounded-md flex flex-col items-center justify-center gap-2 h-32 transition-all">
                  <Upload className="h-8 w-8" />
                  <span className="font-medium text-center">Upload Results</span>
                </div>
              </Link>
              <Link to="/admin/search">
                <div className="p-4 bg-gradient-to-r from-rms-secondary to-rms-accent hover:opacity-90 text-white rounded-md flex flex-col items-center justify-center gap-2 h-32 transition-all">
                  <Search className="h-8 w-8" />
                  <span className="font-medium text-center">Search Results</span>
                </div>
              </Link>
              <Link to="/admin/reports">
                <div className="p-4 bg-gradient-to-r from-rms-blue to-rms-secondary hover:opacity-90 text-white rounded-md flex flex-col items-center justify-center gap-2 h-32 transition-all">
                  <FileBarChart className="h-8 w-8" />
                  <span className="font-medium text-center">Generate Reports</span>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
