
import { Admin, Report, Result, Student, Subject } from "@/types";

// Mock admin users
export const mockAdmins: Admin[] = [
  {
    id: "admin1",
    username: "admin",
    name: "Admin User",
    email: "admin@srm.edu",
    role: "admin",
  },
];

// Mock student users
export const mockStudents: Student[] = [
  {
    id: "student1",
    username: "jaswanth",
    name: "Jaswanth Kumar Addepalli",
    email: "jaswanth@srm.edu",
    role: "student",
    rollNumber: "AP22110010489",
    isVoiceOverEnabled: false,
  },
  {
    id: "student2",
    username: "raja",
    name: "Raja Venkat Venigalla",
    email: "raja@srm.edu",
    role: "student",
    rollNumber: "AP22110010376",
    isVoiceOverEnabled: false,
  },
  {
    id: "student3",
    username: "ravi",
    name: "Ravi Shankar Thota",
    email: "ravi@srm.edu",
    role: "student",
    rollNumber: "AP22110010466",
    isVoiceOverEnabled: false,
  },
  {
    id: "student4",
    username: "hasini",
    name: "Hasini Kallepalli",
    email: "hasini@srm.edu",
    role: "student",
    rollNumber: "AP22110010695",
    isVoiceOverEnabled: true,
  },
];

// Mock subjects
export const mockSubjects: Subject[] = [
  {
    id: "subject1",
    subjectName: "Mathematics",
    subjectCode: "MATH101",
  },
  {
    id: "subject2",
    subjectName: "Computer Science",
    subjectCode: "CS101",
  },
  {
    id: "subject3",
    subjectName: "Physics",
    subjectCode: "PHY101",
  },
  {
    id: "subject4",
    subjectName: "Database Systems",
    subjectCode: "CS201",
  },
  {
    id: "subject5",
    subjectName: "Data Structures",
    subjectCode: "CS202",
  },
];

// Mock results
export const mockResults: Result[] = [
  {
    id: "result1",
    studentId: "student1",
    studentName: "Jaswanth Kumar Addepalli",
    rollNumber: "AP22110010489",
    subjectId: "subject1",
    subjectName: "Mathematics",
    subjectCode: "MATH101",
    academicYear: "2023-2024",
    semester: "Semester 1",
    marksObtained: 85,
    totalMarks: 100,
    grade: "A",
  },
  {
    id: "result2",
    studentId: "student1",
    studentName: "Jaswanth Kumar Addepalli",
    rollNumber: "AP22110010489",
    subjectId: "subject2",
    subjectName: "Computer Science",
    subjectCode: "CS101",
    academicYear: "2023-2024",
    semester: "Semester 1",
    marksObtained: 92,
    totalMarks: 100,
    grade: "A+",
  },
  {
    id: "result3",
    studentId: "student1",
    studentName: "Jaswanth Kumar Addepalli",
    rollNumber: "AP22110010489",
    subjectId: "subject3",
    subjectName: "Physics",
    subjectCode: "PHY101",
    academicYear: "2023-2024",
    semester: "Semester 1",
    marksObtained: 78,
    totalMarks: 100,
    grade: "B+",
  },
  {
    id: "result4",
    studentId: "student2",
    studentName: "Raja Venkat Venigalla",
    rollNumber: "AP22110010376",
    subjectId: "subject1",
    subjectName: "Mathematics",
    subjectCode: "MATH101",
    academicYear: "2023-2024",
    semester: "Semester 1",
    marksObtained: 88,
    totalMarks: 100,
    grade: "A",
  },
  {
    id: "result5",
    studentId: "student2",
    studentName: "Raja Venkat Venigalla",
    rollNumber: "AP22110010376",
    subjectId: "subject2",
    subjectName: "Computer Science",
    subjectCode: "CS101",
    academicYear: "2023-2024",
    semester: "Semester 1",
    marksObtained: 95,
    totalMarks: 100,
    grade: "A+",
  },
  {
    id: "result6",
    studentId: "student3",
    studentName: "Ravi Shankar Thota",
    rollNumber: "AP22110010466",
    subjectId: "subject4",
    subjectName: "Database Systems",
    subjectCode: "CS201",
    academicYear: "2023-2024",
    semester: "Semester 2",
    marksObtained: 84,
    totalMarks: 100,
    grade: "B+",
  },
  {
    id: "result7",
    studentId: "student3",
    studentName: "Ravi Shankar Thota",
    rollNumber: "AP22110010466",
    subjectId: "subject5",
    subjectName: "Data Structures",
    subjectCode: "CS202",
    academicYear: "2023-2024",
    semester: "Semester 2",
    marksObtained: 91,
    totalMarks: 100,
    grade: "A+",
  },
  {
    id: "result8",
    studentId: "student4",
    studentName: "Hasini Kallepalli",
    rollNumber: "AP22110010695",
    subjectId: "subject4",
    subjectName: "Database Systems",
    subjectCode: "CS201",
    academicYear: "2023-2024",
    semester: "Semester 2",
    marksObtained: 89,
    totalMarks: 100,
    grade: "A",
  },
  {
    id: "result9",
    studentId: "student4",
    studentName: "Hasini Kallepalli",
    rollNumber: "AP22110010695",
    subjectId: "subject5",
    subjectName: "Data Structures",
    subjectCode: "CS202",
    academicYear: "2023-2024",
    semester: "Semester 2",
    marksObtained: 88,
    totalMarks: 100,
    grade: "A",
  },
];

// Mock reports
export const mockReports: Report[] = [
  {
    id: "report1",
    adminId: "admin1",
    reportType: "class",
    generatedOn: new Date("2024-04-15"),
    filePath: "/reports/class-report-2023-2024-sem1.pdf",
    title: "Class Performance Report - 2023-2024 Semester 1",
  },
  {
    id: "report2",
    adminId: "admin1",
    reportType: "subject",
    generatedOn: new Date("2024-04-16"),
    filePath: "/reports/subject-report-math101.pdf",
    title: "Subject Performance Report - Mathematics (MATH101)",
  },
  {
    id: "report3",
    adminId: "admin1",
    reportType: "student",
    generatedOn: new Date("2024-04-17"),
    filePath: "/reports/student-report-AP22110010489.pdf",
    title: "Student Performance Report - Jaswanth Kumar (AP22110010489)",
  },
];

// Helper function to get academic years
export const getAcademicYears = (): string[] => {
  const uniqueYears = new Set<string>();
  mockResults.forEach(result => uniqueYears.add(result.academicYear));
  return Array.from(uniqueYears);
};

// Helper function to get semesters
export const getSemesters = (): string[] => {
  const uniqueSemesters = new Set<string>();
  mockResults.forEach(result => uniqueSemesters.add(result.semester));
  return Array.from(uniqueSemesters);
};

// Helper function to calculate GPA
export const calculateGPA = (results: Result[]): number => {
  if (results.length === 0) return 0;
  
  const gradePoints = {
    'A+': 10,
    'A': 9,
    'B+': 8,
    'B': 7,
    'C+': 6,
    'C': 5,
    'D': 4,
    'F': 0
  };
  
  const totalPoints = results.reduce((sum, result) => {
    return sum + (gradePoints[result.grade as keyof typeof gradePoints] || 0);
  }, 0);
  
  return parseFloat((totalPoints / results.length).toFixed(2));
};
