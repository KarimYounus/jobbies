// This file defines the types used in the job tracking application.

// Job type definition
// This interface describes the structure of a job object in the application.
export interface Job {
  id: string;
  company: string;
  position: string;
  status: "applied" | "interview" | "rejected" | "offer" | "archived";
  appliedDate: string;
  salary?: string;
  location?: string;
  notes?: string;
  cv?: cvFile; // field to store CV file information
  coverLetter?: string; // field to store cover letter text content
  questions?: ApplicationQuestion[]; // field to store application questions and answers
}

interface cvFile {
  name: string;
  path: string;
}

// Question type definition
// This interface describes the structure of a question object in the application.
interface ApplicationQuestion {
  question: string;
  answer: string;
}
