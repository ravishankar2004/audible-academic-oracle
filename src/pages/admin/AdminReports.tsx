
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useResult } from "@/contexts/ResultContext";
import { mockStudents } from "@/lib/mock-data";
import { Download, FileBarChart, FileText, Trash2 } from "lucide-react";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export const AdminReports = () => {
  const { reports, subjects, addReport, deleteReport, academicYears, semesters, results } = useResult();
  
  const [reportTitle, setReportTitle] = useState("");
  const [reportType, setReportType] = useState<"class" | "subject" | "student">("class");
  const [academicYear, setAcademicYear] = useState("");
  const [semester, setSemester] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [studentId, setStudentId] = useState("");

  // Calculate grade distribution for visualization
  const getGradeDistribution = (filterSubject?: string, filterStudent?: string) => {
    let filteredResults = [...results];
    
    if (filterSubject) {
      filteredResults = filteredResults.filter(r => r.subjectId === filterSubject);
    }
    
    if (filterStudent) {
      filteredResults = filteredResults.filter(r => r.studentId === filterStudent);
    }
    
    const gradeCounts: Record<string, number> = {};
    filteredResults.forEach((result) => {
      gradeCounts[result.grade] = (gradeCounts[result.grade] || 0) + 1;
    });
    
    return Object.entries(gradeCounts).map(([grade, count]) => ({
      name: grade,
      value: count,
    })).sort((a, b) => {
      const gradeOrder = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'];
      return gradeOrder.indexOf(a.name) - gradeOrder.indexOf(b.name);
    });
  };

  // Visual chart for the reports
  const COLORS = ['#9b87f5', '#7E69AB', '#D6BCFA', '#8B5CF6', '#1EAEDB', '#ea384c', '#1A1F2C', '#8E9196'];
  
  const handleGenerateReport = () => {
    if (!reportTitle) return;
    
    const filePath = `/reports/${reportType}-report-${Date.now()}.pdf`;
    
    addReport({
      adminId: "admin1", // In a real app, this would be the current admin's ID
      reportType,
      filePath,
      title: reportTitle,
    });
    
    // Reset form
    setReportTitle("");
  };

  const handleDeleteReport = (reportId: string) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      deleteReport(reportId);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Reports</h1>
      <p className="text-gray-600">
        Generate and manage reports for academic analysis
      </p>

      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="generate">Generate Report</TabsTrigger>
          <TabsTrigger value="manage">Manage Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="p-4 bg-white rounded-md shadow-sm mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileBarChart className="h-5 w-5 mr-2 text-rms-accent" />
                  Generate New Report
                </CardTitle>
                <CardDescription>
                  Create reports based on academic data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="reportTitle">Report Title</label>
                  <Input
                    id="reportTitle"
                    placeholder="Enter report title"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="reportType">Report Type</label>
                  <Select 
                    value={reportType} 
                    onValueChange={(value) => setReportType(value as "class" | "subject" | "student")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="class">Class Report</SelectItem>
                      <SelectItem value="subject">Subject Report</SelectItem>
                      <SelectItem value="student">Student Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {reportType === "class" && (
                  <>
                    <div className="space-y-2">
                      <label htmlFor="academicYear">Academic Year</label>
                      <Select 
                        value={academicYear} 
                        onValueChange={setAcademicYear}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select academic year" />
                        </SelectTrigger>
                        <SelectContent>
                          {academicYears.map(year => (
                            <SelectItem key={year} value={year}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="semester">Semester</label>
                      <Select 
                        value={semester} 
                        onValueChange={setSemester}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select semester" />
                        </SelectTrigger>
                        <SelectContent>
                          {semesters.map(sem => (
                            <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {reportType === "subject" && (
                  <div className="space-y-2">
                    <label htmlFor="subject">Subject</label>
                    <Select 
                      value={subjectId} 
                      onValueChange={setSubjectId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map(subject => (
                          <SelectItem key={subject.id} value={subject.id}>
                            {subject.subjectName} ({subject.subjectCode})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {reportType === "student" && (
                  <div className="space-y-2">
                    <label htmlFor="student">Student</label>
                    <Select 
                      value={studentId} 
                      onValueChange={setStudentId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockStudents.map(student => (
                          <SelectItem key={student.id} value={student.id}>
                            {student.name} ({student.rollNumber})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button
                  className="w-full"
                  onClick={handleGenerateReport}
                  disabled={!reportTitle}
                >
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Report Preview</CardTitle>
                <CardDescription>
                  Visualization of the selected report data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {reportType === "class" && (
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getGradeDistribution()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {getGradeDistribution().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {reportType === "subject" && subjectId && (
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getGradeDistribution(subjectId)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {getGradeDistribution(subjectId).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {reportType === "student" && studentId && (
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getGradeDistribution(undefined, studentId)}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {getGradeDistribution(undefined, studentId).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {((reportType === "subject" && !subjectId) || 
                  (reportType === "student" && !studentId)) && (
                  <div className="h-72 flex items-center justify-center">
                    <p className="text-gray-500">Select options to preview report</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="manage" className="p-4 bg-white rounded-md shadow-sm mt-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Generated On</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No reports found
                    </TableCell>
                  </TableRow>
                ) : (
                  reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.title}</TableCell>
                      <TableCell>
                        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize">
                          {report.reportType}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(report.generatedOn).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteReport(report.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminReports;
