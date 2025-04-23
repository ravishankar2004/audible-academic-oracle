
import { 
  calculateGPA,
  mockResults, 
  mockSubjects, 
  mockReports,
  getAcademicYears,
  getSemesters 
} from "@/lib/mock-data";
import { Report, Result, ResultFilter, Subject } from "@/types";
import React, { createContext, useContext, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface ResultContextType {
  results: Result[];
  subjects: Subject[];
  reports: Report[];
  academicYears: string[];
  semesters: string[];
  addResult: (result: Omit<Result, "id">) => void;
  updateResult: (result: Result) => void;
  deleteResult: (id: string) => void;
  getResultsByStudent: (studentId: string, filter?: ResultFilter) => Result[];
  getResultById: (id: string) => Result | undefined;
  filterResults: (filter: ResultFilter) => Result[];
  addReport: (report: Omit<Report, "id" | "generatedOn">) => void;
  deleteReport: (id: string) => void;
  calculateStudentGPA: (studentId: string, filter?: ResultFilter) => number;
}

const ResultContext = createContext<ResultContextType | undefined>(undefined);

export const useResult = () => {
  const context = useContext(ResultContext);
  if (!context) {
    throw new Error("useResult must be used within a ResultProvider");
  }
  return context;
};

export const ResultProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [results, setResults] = useState<Result[]>(mockResults);
  const [subjects] = useState<Subject[]>(mockSubjects);
  const [reports, setReports] = useState<Report[]>(mockReports);
  const { toast } = useToast();
  
  const academicYears = getAcademicYears();
  const semesters = getSemesters();

  const addResult = (result: Omit<Result, "id">) => {
    const newResult: Result = {
      ...result,
      id: `result${results.length + 1}`,
    };
    setResults([...results, newResult]);
    toast({
      title: "Result added",
      description: "The result has been added successfully",
    });
  };

  const updateResult = (result: Result) => {
    const updatedResults = results.map((r) =>
      r.id === result.id ? result : r
    );
    setResults(updatedResults);
    toast({
      title: "Result updated",
      description: "The result has been updated successfully",
    });
  };

  const deleteResult = (id: string) => {
    setResults(results.filter((r) => r.id !== id));
    toast({
      title: "Result deleted",
      description: "The result has been deleted successfully",
    });
  };

  const getResultsByStudent = (studentId: string, filter?: ResultFilter): Result[] => {
    let filteredResults = results.filter((r) => r.studentId === studentId);
    
    if (filter) {
      if (filter.academicYear) {
        filteredResults = filteredResults.filter(r => r.academicYear === filter.academicYear);
      }
      if (filter.semester) {
        filteredResults = filteredResults.filter(r => r.semester === filter.semester);
      }
      if (filter.subjectId) {
        filteredResults = filteredResults.filter(r => r.subjectId === filter.subjectId);
      }
    }
    
    return filteredResults;
  };

  const getResultById = (id: string): Result | undefined => {
    return results.find((r) => r.id === id);
  };

  const filterResults = (filter: ResultFilter): Result[] => {
    let filteredResults = [...results];
    
    if (filter.academicYear) {
      filteredResults = filteredResults.filter(r => r.academicYear === filter.academicYear);
    }
    if (filter.semester) {
      filteredResults = filteredResults.filter(r => r.semester === filter.semester);
    }
    if (filter.subjectId) {
      filteredResults = filteredResults.filter(r => r.subjectId === filter.subjectId);
    }
    
    return filteredResults;
  };

  const addReport = (report: Omit<Report, "id" | "generatedOn">) => {
    const newReport: Report = {
      ...report,
      id: `report${reports.length + 1}`,
      generatedOn: new Date(),
    };
    setReports([...reports, newReport]);
    toast({
      title: "Report generated",
      description: "The report has been generated successfully",
    });
  };

  const deleteReport = (id: string) => {
    setReports(reports.filter((r) => r.id !== id));
    toast({
      title: "Report deleted",
      description: "The report has been deleted successfully",
    });
  };
  
  const calculateStudentGPA = (studentId: string, filter?: ResultFilter): number => {
    const studentResults = getResultsByStudent(studentId, filter);
    return calculateGPA(studentResults);
  };

  return (
    <ResultContext.Provider
      value={{
        results,
        subjects,
        reports,
        academicYears,
        semesters,
        addResult,
        updateResult,
        deleteResult,
        getResultsByStudent,
        getResultById,
        filterResults,
        addReport,
        deleteReport,
        calculateStudentGPA,
      }}
    >
      {children}
    </ResultContext.Provider>
  );
};
