
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useResult } from "@/contexts/ResultContext";
import { Upload, Edit, Trash2, FileText, Download } from "lucide-react";
import { useState } from "react";
import { mockStudents } from "@/lib/mock-data";

export const ManageResults = () => {
  const { results, subjects, addResult, updateResult, deleteResult, academicYears, semesters } = useResult();
  
  const [studentId, setStudentId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [marksObtained, setMarksObtained] = useState("");
  const [totalMarks, setTotalMarks] = useState("100");
  const [academicYear, setAcademicYear] = useState("");
  const [semester, setSemester] = useState("");
  const [uploadType, setUploadType] = useState("single");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingResult, setEditingResult] = useState<string | null>(null);
  
  // Filter states
  const [filterAcademicYear, setFilterAcademicYear] = useState("all");
  const [filterSemester, setFilterSemester] = useState("all");
  const [filterSubject, setFilterSubject] = useState("all");
  
  const filteredResults = results.filter(result => {
    if (filterAcademicYear !== "all" && result.academicYear !== filterAcademicYear) return false;
    if (filterSemester !== "all" && result.semester !== filterSemester) return false;
    if (filterSubject !== "all" && result.subjectId !== filterSubject) return false;
    return true;
  });

  const handleSingleResultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const student = mockStudents.find(s => s.id === studentId);
      if (!student) {
        console.error("Student not found");
        return;
      }
      
      const subject = subjects.find(s => s.id === subjectId);
      if (!subject) {
        console.error("Subject not found");
        return;
      }
      
      const marks = parseFloat(marksObtained);
      if (isNaN(marks)) {
        console.error("Invalid marks");
        return;
      }
      
      const total = parseFloat(totalMarks);
      if (isNaN(total)) {
        console.error("Invalid total marks");
        return;
      }
      
      // Calculate grade based on percentage
      const percentage = (marks / total) * 100;
      let grade = "F";
      if (percentage >= 90) grade = "A+";
      else if (percentage >= 80) grade = "A";
      else if (percentage >= 70) grade = "B+";
      else if (percentage >= 60) grade = "B";
      else if (percentage >= 50) grade = "C+";
      else if (percentage >= 40) grade = "C";
      else if (percentage >= 30) grade = "D";
      
      if (editingResult) {
        const result = results.find(r => r.id === editingResult);
        if (result) {
          updateResult({
            ...result,
            studentId,
            studentName: student.name,
            rollNumber: student.rollNumber,
            subjectId,
            subjectName: subject.subjectName,
            subjectCode: subject.subjectCode,
            academicYear,
            semester,
            marksObtained: marks,
            totalMarks: total,
            grade,
          });
        }
        setEditingResult(null);
      } else {
        addResult({
          studentId,
          studentName: student.name,
          rollNumber: student.rollNumber,
          subjectId,
          subjectName: subject.subjectName,
          subjectCode: subject.subjectCode,
          academicYear,
          semester,
          marksObtained: marks,
          totalMarks: total,
          grade,
        });
      }
      
      // Reset form
      setStudentId("");
      setSubjectId("");
      setMarksObtained("");
      setTotalMarks("100");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCSVUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!csvFile) {
        console.error("No file selected");
        return;
      }
      
      // In a real app, we would parse the CSV and upload the results
      // For this demo, we'll just show a success message
      
      // Reset form
      setCsvFile(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditResult = (resultId: string) => {
    const result = results.find(r => r.id === resultId);
    if (!result) return;
    
    setEditingResult(resultId);
    setStudentId(result.studentId);
    setSubjectId(result.subjectId);
    setMarksObtained(result.marksObtained.toString());
    setTotalMarks(result.totalMarks.toString());
    setAcademicYear(result.academicYear);
    setSemester(result.semester);
    setUploadType("single");
  };

  const handleDeleteResult = (resultId: string) => {
    if (window.confirm("Are you sure you want to delete this result?")) {
      deleteResult(resultId);
    }
  };

  const calculatePercentage = (obtained: number, total: number) => {
    return ((obtained / total) * 100).toFixed(2);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Manage Results</h1>
      <p className="text-gray-600">
        Upload, edit, or delete student results
      </p>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="upload">Upload Results</TabsTrigger>
          <TabsTrigger value="manage">Manage Results</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="p-4 bg-white rounded-md shadow-sm mt-4">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Button 
                variant={uploadType === "single" ? "default" : "outline"} 
                onClick={() => setUploadType("single")}
              >
                Single Result
              </Button>
              <Button 
                variant={uploadType === "csv" ? "default" : "outline"} 
                onClick={() => setUploadType("csv")}
              >
                Bulk Upload (CSV)
              </Button>
            </div>

            {uploadType === "single" ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="h-5 w-5 mr-2 text-rms-primary" />
                    {editingResult ? "Edit Result" : "Add New Result"}
                  </CardTitle>
                  <CardDescription>
                    Enter result details for a single student
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSingleResultSubmit}>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="student">Student</Label>
                        <Select 
                          value={studentId} 
                          onValueChange={setStudentId}
                          required
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
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Select 
                          value={subjectId} 
                          onValueChange={setSubjectId}
                          required
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
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="academicYear">Academic Year</Label>
                        <Select 
                          value={academicYear} 
                          onValueChange={setAcademicYear}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select academic year" />
                          </SelectTrigger>
                          <SelectContent>
                            {academicYears.length === 0 ? (
                              <SelectItem value="2023-2024">2023-2024</SelectItem>
                            ) : (
                              academicYears.map(year => (
                                <SelectItem key={year} value={year}>
                                  {year}
                                </SelectItem>
                              ))
                            )}
                            <SelectItem value="2022-2023">2022-2023</SelectItem>
                            <SelectItem value="2024-2025">2024-2025</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="semester">Semester</Label>
                        <Select 
                          value={semester} 
                          onValueChange={setSemester}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select semester" />
                          </SelectTrigger>
                          <SelectContent>
                            {semesters.length === 0 ? (
                              <>
                                <SelectItem value="Semester 1">Semester 1</SelectItem>
                                <SelectItem value="Semester 2">Semester 2</SelectItem>
                              </>
                            ) : (
                              semesters.map(sem => (
                                <SelectItem key={sem} value={sem}>
                                  {sem}
                                </SelectItem>
                              ))
                            )}
                            <SelectItem value="Semester 3">Semester 3</SelectItem>
                            <SelectItem value="Semester 4">Semester 4</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="marksObtained">Marks Obtained</Label>
                        <Input 
                          id="marksObtained"
                          type="number"
                          placeholder="Enter marks obtained"
                          value={marksObtained}
                          onChange={(e) => setMarksObtained(e.target.value)}
                          required
                          min="0"
                          max={totalMarks}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="totalMarks">Total Marks</Label>
                        <Input 
                          id="totalMarks"
                          type="number"
                          placeholder="Enter total marks"
                          value={totalMarks}
                          onChange={(e) => setTotalMarks(e.target.value)}
                          required
                          min="1"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline"
                      type="button"
                      onClick={() => {
                        setEditingResult(null);
                        setStudentId("");
                        setSubjectId("");
                        setMarksObtained("");
                        setTotalMarks("100");
                        setAcademicYear("");
                        setSemester("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {editingResult ? "Update Result" : "Add Result"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="h-5 w-5 mr-2 text-rms-primary" />
                    Bulk Upload Results
                  </CardTitle>
                  <CardDescription>
                    Upload multiple results using a CSV file
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleCSVUpload}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="csvFile">CSV File</Label>
                      <Input 
                        id="csvFile"
                        type="file"
                        accept=".csv"
                        required
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setCsvFile(file);
                        }}
                      />
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>CSV file should have the following columns:</p>
                      <ol className="list-decimal list-inside mt-2">
                        <li>Student ID</li>
                        <li>Subject ID</li>
                        <li>Academic Year</li>
                        <li>Semester</li>
                        <li>Marks Obtained</li>
                        <li>Total Marks</li>
                      </ol>
                      <div className="mt-2">
                        <a href="#" className="text-rms-primary hover:underline">
                          <Download className="inline h-4 w-4 mr-1" />
                          Download Template
                        </a>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting || !csvFile}>
                      Upload CSV
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="manage" className="p-4 bg-white rounded-md shadow-sm mt-4">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              <div className="space-y-2 flex-1">
                <Label htmlFor="filterAcademicYear">Academic Year</Label>
                <Select 
                  value={filterAcademicYear} 
                  onValueChange={setFilterAcademicYear}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by academic year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {academicYears.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 flex-1">
                <Label htmlFor="filterSemester">Semester</Label>
                <Select 
                  value={filterSemester} 
                  onValueChange={setFilterSemester}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Semesters</SelectItem>
                    {semesters.map(sem => (
                      <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 flex-1">
                <Label htmlFor="filterSubject">Subject</Label>
                <Select 
                  value={filterSubject} 
                  onValueChange={setFilterSubject}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map(subject => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.subjectName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Roll Number</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Academic Year</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>Marks</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        No results found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredResults.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell>{result.studentName}</TableCell>
                        <TableCell>{result.rollNumber}</TableCell>
                        <TableCell>
                          {result.subjectName}
                          <div className="text-xs text-gray-500">
                            {result.subjectCode}
                          </div>
                        </TableCell>
                        <TableCell>{result.academicYear}</TableCell>
                        <TableCell>{result.semester}</TableCell>
                        <TableCell>
                          {result.marksObtained}/{result.totalMarks}
                          <div className="text-xs text-gray-500">
                            {calculatePercentage(result.marksObtained, result.totalMarks)}%
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`font-medium ${
                            result.grade === 'A+' || result.grade === 'A' 
                            ? 'text-green-600' 
                            : result.grade === 'F' 
                            ? 'text-red-600' 
                            : 'text-orange-600'
                          }`}>
                            {result.grade}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditResult(result.id)}
                            >
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteResult(result.id)}
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
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManageResults;
