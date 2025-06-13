import { getStatusByText, StatusItem } from "./status-types";

// Job type definition
// This interface describes the structure of a job object in the application.
export interface Job {
  id: string;
  company: string;
  position: string;
  description?: string; // optional field to store job description
  status: StatusItem;
  appliedDate: string;
  salary?: string;
  location?: string;
  notes?: string;
  link?: string; // optional field to store a link to the job posting or company website
  cv?: cvFile; // field to store CV file information
  coverLetter?: string; // field to store cover letter text content
  questions?: ApplicationQuestion[]; // field to store application questions and answers
}

// cvFile type definition
export interface cvFile {
  name: string;
  path: string;
}

// Question type definition
// This interface describes the structure of a question object in the application.
export interface ApplicationQuestion {
  question: string;
  answer: string;
}

// Default job items for initial state
export const defaultItems: Job[] = [
  {
    id: "1",
    company: "Tech Corp",
    position: "Software Engineer",
    description: `This is a detailed description of the job position, including responsibilities, requirements, and any other relevant information. It should provide a clear understanding of what the job entails and what is expected from the candidate. It may be vert long, so it is important to keep it concise yet informative, highlighting the key aspects of the role to attract suitable applicants. This is a detailed description of the job position, including responsibilities, requirements, and any other relevant information. It should provide a clear understanding of what the job entails and what is expected from the candidate. It may be vert long, so it is important to keep it concise yet informative, highlighting the key aspects of the role to attract suitable applicants. This is a detailed description of the job position, including responsibilities, requirements, and any other relevant information. It should provide a clear understanding of what the job entails and what is expected from the candidate. It may be vert long, so it is important to keep it concise yet informative, highlighting the key aspects of the role to attract suitable applicants.`,
    status: { text: "Completed Test", color: "#4A90E2" },
    appliedDate: "2025-06-01",
    salary: "$80,000",
    location: "New York, NY",
    notes: "Initial application submitted.",
    link: "https://google.com",
    questions: [
      {
        question: "Why do you think you are the best fit for this role?",
        answer: ` I think I'm a strong fit for this role because I bring exactly what digital consultancy needs: technical versatility, client-facing experience, and the ability to quickly adapt to new challenges. My experience at 21 Exclusive showed me that I can work effectively with non-technical clients, translating their business needs into working solutions. Building their e-commerce site from scratch taught me how to balance technical considerations with real business requirements, which seems important for consultancy work where you're solving different problems for different clients. The variety in my technical background is another strength of mine. I've worked across many different paradigms and projects - from robotics programming in C++, to machine learning research in Python, to web development with React. I've proven I can pick up new technologies quickly when the projects demand it. I'm comfortable in both independent and collaborative environments. Throughout my academic history, I've done solo deep-dives like my dissertation, and tightly coupled group work such as my Masters project. I can thrive in either environment. What I think sets me apart is my ceaseless curiosity. I can't help but wonder 'Is there a better way of doing this?' or 'Why does this work?'. This drives me to really understand and explore problems which leads to more thoughtful and innovative solutions.`
      },
      {
        question: "In your own words please describe why you have applied for this role?",
        answer:   `The reason I'm drawn to Accolite is because it seems like a company that explores many different areas which should present me with lots of different opportunities to learn and explore my field. Personally, I am still not sure exactly what I want to specialise in, which is why digital consultancy seems like an excellent entry point. The projects and goals that differing clients might bring to the table sounds like an exciting prospect, and will continually bring in new challenges from which I can learn from. Essentially, I'm looking for a role where I can contribute meaningfully while exploring what kind of engineer I want to become, and Accolite seems like the ideal place to do exactly that.`
      }
    ],
    cv: {
      name: "cv.png",
      path:"C:/Users/younu/Documents/Git/jobbies/src/assets/images/cv.png"
    },
    coverLetter: "Perfect. I'm creating a similar but not identical sub component now for showing the cover letter text content. I want this to feature the same gradient effect on the bottom edge, but instead of being scrollable, I want this component to be exapndable and animated using Framer Motion. The collapsed state should be short (say h-30) showing the clipped text content by the gradient, and on hover should display a '▼' in the row. On click, it should expand downwards displaying the full height needed for the text. Perfect. I'm creating a similar but not identical sub component now for showing the cover letter text content. I want this to feature the same gradient effect on the bottom edge, but instead of being scrollable, I want this component to be exapndable and animated using Framer Motion. The collapsed state should be short (say h-30) showing the clipped text content by the gradient, and on hover should display a '▼' in the row. On click, it should expand downwards displaying the full height needed for the text.",
  },
  {
    id: "2",
    company: "Design Studio",
    position: "UI/UX Designer",
    status: getStatusByText("Applied") || { text: "Rejected", color: "bg-red-500" },
    appliedDate: "2025-02-15",
    salary: "$70,000",
    location: "San Francisco, CA",
    notes: "Interview scheduled for next week.",
  },
];