
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { useResult } from "@/contexts/ResultContext";
import { useVoiceOver } from "@/contexts/VoiceOverContext";
import { Student } from "@/types";
import { Download, FileText, Headphones, Search } from "lucide-react";
import { useState } from "react";

export const StudentSearch = () => {
  const { user } = useAuth();
  const { getResultsByStudent, subjects, academicYears, semesters } = useResult();
  const { speakText, isVoiceOverEnabled } = useVoiceOver();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [academicYear, setAcademicYear] = useState("all");
  const [semester, setSemester] = useState("all");
  const [subjectId, setSubjectId] = useState("all");

  const student = user as Student;
  const studentResults = getResultsByStudent(student.id);
  
  const filteredResults = studentResults.filter(result => {
    // Apply filters
    if (academicYear !== "all" && result.academicYear !== academicYear) return false;
    if (semester !== "all" && result.semester !== semester) return false;
    if (subjectId !== "all" && result.subjectId !== subjectId) return false;

    // Apply search
    if (!searchQuery) return true;
    
    return result.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           result.subjectCode.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const calculatePercentage = (obtained: number, total: number) => {
    return ((obtained / total) * 100).toFixed(2);
  };
  
  const handleReadResult = (result: any) => {
    if (!isVoiceOverEnabled) return;
    
    const text = `Result for ${result.subjectName}, ${result.subjectCode}. 
    Academic year: ${result.academicYear}, ${result.semester}.
    You scored ${result.marksObtained} out of ${result.totalMarks}, 
    which is ${calculatePercentage(result.marksObtained, result.totalMarks)} percent.
    Your grade is ${result.grade}.`;
    
    speakText(text);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Search Results</h1>
      <p className="text-gray-600">
        Search for specific results in your academic history
      </p>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-md shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search by subject name or code..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Select
                value={academicYear}
                onValueChange={setAcademicYear}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Academic Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Academic Years</SelectItem>
                  {academicYears.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select
                value={semester}
                onValueChange={setSemester}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  {semesters.map(sem => (
                    <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Select
                value={subjectId}
                onValueChange={setSubjectId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Subject" />
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
        </div>

        <div className="bg-white rounded-md shadow-sm">
          <div className="p-4 border-b flex justify-between items-center">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-2 text-rms-primary" />
              <h2 className="font-semibold text-lg">Search Results</h2>
            </div>
            <div className="text-sm text-gray-500">
              Found {filteredResults.length} results
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
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
                    <TableCell colSpan={6} className="h-24 text-center">
                      No results found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">
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
                            asChild
                          >
                            <a href="#" onClick={(e) => e.preventDefault()}>
                              <Download className="h-4 w-4" />
                              <span className="sr-only">Download</span>
                            </a>
                          </Button>
                          
                          {isVoiceOverEnabled && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleReadResult(result)}
                            >
                              <Headphones className="h-4 w-4" />
                              <span className="sr-only">Listen</span>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSearch;
