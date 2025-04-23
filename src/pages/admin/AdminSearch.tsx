
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useResult } from "@/contexts/ResultContext";
import { mockStudents } from "@/lib/mock-data";
import { FileText, Search } from "lucide-react";
import { useState } from "react";

export const AdminSearch = () => {
  const { results, subjects, academicYears, semesters } = useResult();

  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("name"); // name, rollNumber
  const [academicYear, setAcademicYear] = useState("all");
  const [semester, setSemester] = useState("all");
  const [subjectId, setSubjectId] = useState("all");

  const filteredResults = results.filter(result => {
    // Apply filters
    if (academicYear !== "all" && result.academicYear !== academicYear) return false;
    if (semester !== "all" && result.semester !== semester) return false;
    if (subjectId !== "all" && result.subjectId !== subjectId) return false;

    // Apply search
    if (!searchQuery) return true;
    
    if (searchType === "name") {
      return result.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    } else if (searchType === "rollNumber") {
      return result.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    return true;
  });

  const calculatePercentage = (obtained: number, total: number) => {
    return ((obtained / total) * 100).toFixed(2);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Search Results</h1>
      <p className="text-gray-600">
        Search for student results using various filters
      </p>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-md shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search by student name or roll number..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Select
                value={searchType}
                onValueChange={setSearchType}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Search by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="rollNumber">Roll Number</SelectItem>
                </SelectContent>
              </Select>
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
                  <TableHead>Student Name</TableHead>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Academic Year</TableHead>
                  <TableHead>Semester</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead>Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No results found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">{result.studentName}</TableCell>
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

export default AdminSearch;
