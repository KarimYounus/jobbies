import { getStatusByText, StatusItem, defaultStatusItems } from "./status-types";

// Job type definition
// This interface describes the structure of a job object in the application.
export interface JobApplication {
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
export const defaultItems: JobApplication[] = [
  {
    id: "1",
    company: "Tech Corp",
    position: "Software Engineer",
    description: `This is a detailed description of the job position, including responsibilities, requirements, and any other relevant information. It should provide a clear understanding of what the job entails and what is expected from the candidate. It may be vert long, so it is important to keep it concise yet informative, highlighting the key aspects of the role to attract suitable applicants. This is a detailed description of the job position, including responsibilities, requirements, and any other relevant information. It should provide a clear understanding of what the job entails and what is expected from the candidate. It may be vert long, so it is important to keep it concise yet informative, highlighting the key aspects of the role to attract suitable applicants. This is a detailed description of the job position, including responsibilities, requirements, and any other relevant information. It should provide a clear understanding of what the job entails and what is expected from the candidate. It may be vert long, so it is important to keep it concise yet informative, highlighting the key aspects of the role to attract suitable applicants.`,
    status: defaultStatusItems[0],
    appliedDate: "2025-06-01",
    salary: "£80,000",
    location: "Edinburgh, UK",
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
    coverLetter: `Dear Sir/Madam,
I am writing to express my keen interest in contributing to ClearSky Medical's mission of advancing healthcare
through machine learning. As a final-year MEng Software Engineering student at Heriot-Watt University, on
track for a first-class degree, I bring a strong foundation in software engineering with specialised experience in
machine learning. My technical expertise, combined with a passion for tackling meaningful challenges in
healthcare, positions me as a versatile candidate capable of contributing across a variety of roles at ClearSky
Medical.
During my thesis research under your CSO, Dr. Michael Lones, I demonstrated my capabilities in machine
learning and signal processing through the development of exoplanet detection systems. I built end-to-end ML
pipelines that achieved 99.8% accuracy in identifying subtle exoplanet transit signatures within noisy timeseries
data, matching the performance of current state-of-the-art detection methods. While my experience has
been in astronomical applications, the fundamental skills I developed - building pipelines, implementing
sophisticated ML architectures, and solving signal processing challenges - provide a strong foundation for
working with other types of data. I further expanded this research by developing an innovative denoising
approach using conditional GANs, which offered a potential pathway to surpass current detection methods by
training on synthetic noisy-clean data pairs. This work showcased not only my technical abilities in
implementing effective ML systems, but also my capacity to explore novel solutions to complex signal
processing challenges.
Beyond machine learning, I have developed strong software engineering practices through both academic
projects and industry experience. During my placement at 21 Exclusive I obtained valuable industry experience,
managing all aspects of developing an e-commerce website from concept to deployment. Working directly with
stakeholders, I learned to translate business requirements into technical solutions, manage project timelines,
and deliver production-quality code that met client expectations. While the domain was different, this
experience provided me with crucial insights into professional software development practices and project
management in an industry setting. This, combined with my consistent academic performance (27/32 courses
at A-grade), shows I have a comprehensive set of software engineering expertise that complements my
machine learning skills. This technical versatility would enable me to contribute effectively across ClearSky
Medical's technology stack, from ML systems to backend services and development tools.
My recent industry placement, while successful, reinforced my desire to work on innovative projects that create
meaningful impact. While developing e-commerce solutions demonstrated my technical capabilities, I found
myself drawn to challenges that push technological boundaries and directly benefit human lives. ClearSky
Medical represents an opportunity to combine my passion for machine learning with the meaningful goal of
advancing healthcare. The prospect of applying my skills to novel, challenging problems that could genuinely
improve patient outcomes is the kind of work I am eager to pursue.
Thank you for considering my application. I would welcome the opportunity to discuss how my skills and
experiences can support ClearSky Medical’s mission. If there is any additional information I can provide or any
steps I can take to move forward in the process, please let me know.
Sincerely,
Karim Younus`,
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