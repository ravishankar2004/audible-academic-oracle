
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useResult } from "@/contexts/ResultContext";
import { ResultFilter, Student } from "@/types";
import { Download, FileText } from "lucide-react";
import { useState } from "react";

export const StudentDownload = () => {
  const { user } = useAuth();
  const { getResultsByStudent, academicYears, semesters, subjects } = useResult();
  
  const [filter, setFilter] = useState<ResultFilter>({});
  const [downloadFormat, setDownloadFormat] = useState<"pdf" | "excel">("pdf");
  
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
  
  const handleDownload = () => {
    // In a real app, this would download the results as PDF or Excel
    console.log("Downloading results:", studentResults, "Format:", downloadFormat);
    alert(`Downloading ${studentResults.length} results in ${downloadFormat.toUpperCase()} format`);
  };
  
  const getDownloadTitle = () => {
    const parts = [];
    
    if (filter.academicYear) {
      parts.push(filter.academicYear);
    }
    
    if (filter.semester) {
      parts.push(filter.semester);
    }
    
    if (filter.subjectId) {
      const subject = subjects.find(s => s.id === filter.subjectId);
      if (subject) {
        parts.push(`${subject.subjectName} (${subject.subjectCode})`);
      }
    }
    
    if (parts.length === 0) {
      return "All Results";
    }
    
    return parts.join(" - ");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Download Results</h1>
      <p className="text-gray-600">
        Download your results for offline access
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2 text-rms-primary" />
            Download Options
          </CardTitle>
          <CardDescription>
            Select filters and download format for your results
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
          
          <div className="pt-4">
            <label className="text-sm font-medium">Download Format</label>
            <div className="flex items-center space-x-4 mt-2">
              <Button 
                variant={downloadFormat === "pdf" ? "default" : "outline"} 
                onClick={() => setDownloadFormat("pdf")}
                className="flex-1"
              >
                PDF Format
              </Button>
              <Button 
                variant={downloadFormat === "excel" ? "default" : "outline"} 
                onClick={() => setDownloadFormat("excel")}
                className="flex-1"
              >
                Excel Format
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Download className="h-5 w-5 mr-2 text-rms-accent" />
            Download Summary
          </CardTitle>
          <CardDescription>
            Preview and download your selected results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-md">
                <div className="text-sm font-medium text-gray-500">Results Found</div>
                <div className="text-2xl font-bold">{studentResults.length}</div>
              </div>
              
              <div className="p-4 border rounded-md">
                <div className="text-sm font-medium text-gray-500">Download Title</div>
                <div className="text-lg font-medium truncate">{getDownloadTitle()}</div>
              </div>
              
              <div className="p-4 border rounded-md">
                <div className="text-sm font-medium text-gray-500">Format</div>
                <div className="text-2xl font-bold uppercase">{downloadFormat}</div>
              </div>
            </div>
            
            <div className="flex justify-center pt-4">
              <Button
                variant="default"
                size="lg"
                onClick={handleDownload}
                disabled={studentResults.length === 0}
                className="px-8"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Results
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDownload;
