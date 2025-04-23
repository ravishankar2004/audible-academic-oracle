
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useResult } from "@/contexts/ResultContext";
import { useVoiceOver } from "@/contexts/VoiceOverContext";
import { ResultFilter, Student } from "@/types";
import { Headphones, Pause, Play } from "lucide-react";
import { useState } from "react";

export const StudentVoiceOver = () => {
  const { user } = useAuth();
  const { getResultsByStudent, subjects, academicYears, semesters, calculateStudentGPA } = useResult();
  const { speakText, isSpeaking, stopSpeaking, isVoiceOverEnabled } = useVoiceOver();
  
  const [filter, setFilter] = useState<ResultFilter>({});
  const [readingMode, setReadingMode] = useState<"individual" | "summary">("individual");
  
  const student = user as Student;
  const studentResults = getResultsByStudent(student.id, filter);
  const gpa = calculateStudentGPA(student.id, filter);
  
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
  
  const readIndividualResult = (result: any) => {
    const text = `Result for ${result.subjectName}, ${result.subjectCode}. 
    Academic year: ${result.academicYear}, ${result.semester}.
    You scored ${result.marksObtained} out of ${result.totalMarks}, 
    which is ${calculatePercentage(result.marksObtained, result.totalMarks)} percent.
    Your grade is ${result.grade}.`;
    
    speakText(text);
  };
  
  const readSummary = () => {
    if (studentResults.length === 0) {
      speakText("No results found for the selected filters.");
      return;
    }
    
    const academicYearText = filter.academicYear 
      ? `for academic year ${filter.academicYear}` 
      : "across all academic years";
      
    const semesterText = filter.semester 
      ? `in ${filter.semester}` 
      : "across all semesters";
      
    const subjectText = filter.subjectId 
      ? `for ${subjects.find(s => s.id === filter.subjectId)?.subjectName || "the selected subject"}` 
      : "across all subjects";
    
    const intro = `Summary of your academic performance ${academicYearText}, ${semesterText}, ${subjectText}.`;
    
    const resultsText = studentResults.map((result, index) => {
      return `Result ${index + 1}: ${result.subjectName}, ${result.subjectCode}. 
      You scored ${result.marksObtained} out of ${result.totalMarks}, 
      which is ${calculatePercentage(result.marksObtained, result.totalMarks)} percent.
      Your grade is ${result.grade}.`;
    }).join(" ");
    
    const gpaText = `Your GPA for the selected results is ${gpa}.`;
    
    const text = `${intro} ${resultsText} ${gpaText}`;
    
    speakText(text);
  };
  
  if (!isVoiceOverEnabled) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Voice Over Results</h1>
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center text-red-700">
              Voice Over Not Enabled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">
              This feature is only available when voice over is enabled. Please enable voice over in your profile settings.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Voice Over Results</h1>
      <p className="text-gray-600">
        Listen to your results using the voice over feature
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Headphones className="h-5 w-5 mr-2 text-rms-primary" />
            Voice Over Settings
          </CardTitle>
          <CardDescription>
            Select filters and listen to your results
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <div className="flex items-center space-x-2">
              <Button 
                variant={readingMode === "individual" ? "default" : "outline"} 
                onClick={() => setReadingMode("individual")}
              >
                Individual Results
              </Button>
              <Button 
                variant={readingMode === "summary" ? "default" : "outline"} 
                onClick={() => setReadingMode("summary")}
              >
                Summary
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              {isSpeaking ? (
                <Button 
                  variant="destructive" 
                  className="min-w-[100px]"
                  onClick={stopSpeaking}
                >
                  <Pause className="mr-2 h-4 w-4" />
                  Stop
                </Button>
              ) : (
                <Button 
                  variant="default" 
                  className="min-w-[100px]"
                  onClick={readingMode === "individual" ? undefined : readSummary}
                  disabled={readingMode === "individual" || studentResults.length === 0}
                >
                  <Play className="mr-2 h-4 w-4" />
                  {readingMode === "individual" ? "Select Below" : "Read Summary"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {readingMode === "individual" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Headphones className="h-5 w-5 mr-2 text-rms-accent" />
              Individual Results
            </CardTitle>
            <CardDescription>
              Click on a result to listen to its details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentResults.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No results found for the selected filters
                </div>
              ) : (
                studentResults.map((result) => (
                  <div 
                    key={result.id} 
                    className="p-4 border rounded-md hover:bg-gray-50 cursor-pointer"
                    onClick={() => readIndividualResult(result)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{result.subjectName}</div>
                        <div className="text-sm text-gray-500">
                          {result.subjectCode} • {result.semester} • {result.academicYear}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div>
                            {result.marksObtained}/{result.totalMarks}
                          </div>
                          <div className={`font-medium ${
                            result.grade === 'A+' || result.grade === 'A' 
                              ? 'text-green-600' 
                              : result.grade === 'F' 
                              ? 'text-red-600' 
                              : 'text-orange-600'
                          }`}>
                            Grade: {result.grade}
                          </div>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            readIndividualResult(result);
                          }}
                        >
                          <Headphones className="h-5 w-5 text-rms-accent" />
                          <span className="sr-only">Listen</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {readingMode === "summary" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Headphones className="h-5 w-5 mr-2 text-rms-accent" />
              Results Summary
            </CardTitle>
            <CardDescription>
              Listen to a summary of your academic performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-md">
                  <div className="text-sm font-medium text-gray-500">Results Found</div>
                  <div className="text-2xl font-bold">{studentResults.length}</div>
                </div>
                
                <div className="p-4 border rounded-md">
                  <div className="text-sm font-medium text-gray-500">Overall GPA</div>
                  <div className="text-2xl font-bold">{gpa}</div>
                </div>
              </div>
              
              <div className="flex justify-center pt-4">
                <Button
                  onClick={readSummary}
                  disabled={studentResults.length === 0 || isSpeaking}
                  className="px-8"
                >
                  <Headphones className="mr-2 h-4 w-4" />
                  Read Summary
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentVoiceOver;
