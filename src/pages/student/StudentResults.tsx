
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useResult } from "@/contexts/ResultContext";
import { useVoiceOver } from "@/contexts/VoiceOverContext";
import { ResultFilter, Student } from "@/types";
import { Download, FileText, Headphones } from "lucide-react";
import { useState } from "react";

export const StudentResults = () => {
  const { user } = useAuth();
  const { getResultsByStudent, subjects, academicYears, semesters } = useResult();
  const { speakText, isVoiceOverEnabled } = useVoiceOver();
  
  const [filter, setFilter] = useState<ResultFilter>({});
  const [viewType, setViewType] = useState<"all" | "semester" | "subject">("all");
  
  const student = user as Student;
  const studentResults = getResultsByStudent(student.id, filter);
  
  const handleFilterChange = (type: keyof ResultFilter, value: string) => {
    if (value === "all") {
      const newFilter = { ...filter };
      delete newFilter[type];
      setFilter(newFilter);
    } else {
      setFilter({ ...filter, [type]: value });
    }
  };
  
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
      <h1 className="text-3xl font-bold text-gray-800">View Results</h1>
      <p className="text-gray-600">
        Access and review your academic results
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-rms-primary" />
            Result Filters
          </CardTitle>
          <CardDescription>
            Filter your results by academic year, semester, or subject
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="all"
            value={viewType}
            onValueChange={(value) => {
              setViewType(value as "all" | "semester" | "subject");
              setFilter({});
            }}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Results</TabsTrigger>
              <TabsTrigger value="semester">By Semester</TabsTrigger>
              <TabsTrigger value="subject">By Subject</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="pt-4">
              {/* No filters for all results view */}
              <p className="text-sm text-gray-500">
                Viewing all your results. Use the tabs above to filter by semester or subject.
              </p>
            </TabsContent>
            
            <TabsContent value="semester" className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Academic Year</label>
                  <Select
                    value={filter.academicYear || "all"}
                    onValueChange={(value) => handleFilterChange("academicYear", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select academic year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Academic Years</SelectItem>
                      {academicYears.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Semester</label>
                  <Select
                    value={filter.semester || "all"}
                    onValueChange={(value) => handleFilterChange("semester", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Semesters</SelectItem>
                      {semesters.map(sem => (
                        <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="subject" className="pt-4">
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Select
                  value={filter.subjectId || "all"}
                  onValueChange={(value) => handleFilterChange("subjectId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map(subject => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.subjectName} ({subject.subjectCode})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-rms-accent" />
            Results
          </CardTitle>
          <CardDescription>
            {studentResults.length} results found based on your selection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
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
                {studentResults.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No results found
                    </TableCell>
                  </TableRow>
                ) : (
                  studentResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>
                        <div className="font-medium">{result.subjectName}</div>
                        <div className="text-xs text-gray-500">
                          {result.subjectCode}
                        </div>
                      </TableCell>
                      <TableCell>{result.academicYear}</TableCell>
                      <TableCell>{result.semester}</TableCell>
                      <TableCell>
                        <div>
                          {result.marksObtained}/{result.totalMarks}
                        </div>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentResults;
