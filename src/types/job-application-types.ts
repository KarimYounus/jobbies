import { StatusItem } from "./status-types";

// Job type definition
// This interface describes the structure of a job object in the application.
export interface JobApplication {
  id: string;
  company: string;
  position: string;
  description?: string;
  status: StatusItem;
  appliedDate: string;
  salary?: string;
  location?: string;
  notes?: string;
  link?: string; // optional field to store a link to the job posting or company website
  cv?: CurriculumVitae; // field to store CV file information
  coverLetter?: string; // field to store cover letter text content
  questions?: ApplicationQuestion[]; // field to store application questions and answers
  appliedVia?: string; 
}

// CV type definition
export interface CurriculumVitae {
  id: string;
  name: string;
  imagePreviewPath: string; // local path to the CV image preview
  pdfPath?: string; // optional field to store the path to the CV PDF file
  date?: string; // optional field to store the date of the CV
  notes?: string; // optional field to store additional notes about the CV
}

// Question type definition
// This interface describes the structure of a question object in the application.
export interface ApplicationQuestion {
  question: string;
  answer: string;
}

export const defaultApplicationViaItems = [
  { text: "LinkedIn", color: "bg-blue-500" },
  { text: "Company Website", color: "bg-green-500" },
  { text: "Referral", color: "bg-yellow-500" },
  { text: "Job Board", color: "bg-purple-500" },
  { text: "Recruiter", color: "bg-red-500" }
]
