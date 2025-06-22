import React, { useContext } from "react";
import { CurriculumVitae } from "../../../types/job-application-types";
import { ApplicationWindowContext } from "../ApplicationWindow";
import EditCV from "./EditCV";
import EditQuestions from "./EditQuestions";
import EditTextArea from "./EditTextArea";
import EditTextField from "./EditTextField";
import EditDropdownList from "./EditDropdownList";

const EditContent: React.FC = () => {
  const { jobApplication, updateField } = useContext(ApplicationWindowContext);

  if (!jobApplication) return null;

  // Handler for input changes
  // This function updates the job application state when input fields change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    updateField(name as keyof typeof jobApplication, value);
  };

  const handleCVChange = (cv: CurriculumVitae) => {
    updateField('cv', cv);
  };

  const handleQuestionChange = (
    index: number,
    question: string,
    answer: string
  ) => {
    const questions = [...(jobApplication.questions || [])];
    questions[index] = { question, answer };
    updateField('questions', questions);
  };

  const handleAddQuestion = () => {
    const questions = [...(jobApplication.questions || [])];
    questions.push({ question: "", answer: "" });
    updateField('questions', questions);
  };

  const handleRemoveQuestion = (index: number) => {
    const questions = [...(jobApplication.questions || [])];
    questions.splice(index, 1);
    updateField('questions', questions);
  };
  return (
    <div className="p-4 space-y-4 bg-gray-50">
      {/* Company */}
      <EditTextField
        label="Company"
        name="company"
        value={jobApplication.company}
        onChange={handleInputChange}
      />
      {/* Position */}
      <EditTextField
        label="Position"
        name="position"
        value={jobApplication.position}
        onChange={handleInputChange}
      />
      {/* Description */}
      <EditTextArea
        label="Description"
        name="description"
        value={jobApplication.description || ""}
        onChange={handleInputChange}
      />
      {/* Salary */}
      <EditTextField
        label="Salary"
        name="salary"
        value={jobApplication.salary || ""}
        onChange={handleInputChange}
      />
      {/* Location */}
      <EditTextField
        label="Location"
        name="location"
        value={jobApplication.location || ""}
        onChange={handleInputChange}
      />
      {/* Notes */}
      <EditTextArea
        label="Notes"
        name="notes"
        value={jobApplication.notes || ""}
        onChange={handleInputChange}
      />
      {/* Web Link */}
      <EditTextField
        label="Link"
        name="link"
        value={jobApplication.link || ""}
        onChange={handleInputChange}
      />
      {/* Applied Via */}
      <EditDropdownList
        label="Applied Via"
        name="appliedVia"
        options={["LinkedIn", "Website", "Referral", "Other"]}
        value={jobApplication.appliedVia || ""}
        onSelect={(value) => updateField('appliedVia', value)}
      />
      <EditCV selectedCV={jobApplication.cv} onCVChange={handleCVChange} />
      <EditTextArea
        label="Cover Letter"
        name="coverLetter"
        value={jobApplication.coverLetter || ""}
        onChange={handleInputChange}
      />
      <EditQuestions
        questions={jobApplication.questions || []}
        onQuestionChange={handleQuestionChange}
        onAddQuestion={handleAddQuestion}
        onRemoveQuestion={handleRemoveQuestion}
      />
    </div>  );
};

export default EditContent;
