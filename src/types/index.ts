
// User types
export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: "admin" | "student";
}

export interface Admin extends User {
  role: "admin";
}

export interface Student extends User {
  role: "student";
  rollNumber: string;
  isVoiceOverEnabled?: boolean;
}

// Result types
export interface Result {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  subjectId: string;
  subjectName: string;
  subjectCode: string;
  academicYear: string;
  semester: string;
  marksObtained: number;
  totalMarks: number;
  grade: string;
}

// Report types
export interface Report {
  id: string;
  adminId: string;
  reportType: "class" | "subject" | "student";
  generatedOn: Date;
  filePath: string;
  title: string;
}

// Subject types
export interface Subject {
  id: string;
  subjectName: string;
  subjectCode: string;
}

// Filter types
export interface ResultFilter {
  academicYear?: string;
  semester?: string;
  subjectId?: string;
}
