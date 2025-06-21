import React, {
  forwardRef,
  useContext,
  useImperativeHandle,
  useState,
} from "react";
import {
  CurriculumVitae,
  JobApplication,
} from "../../../types/job-application-types";
import { ApplicationWindowContext } from "../ApplicationWindow";
import EditCV from "./EditCV";
import EditQuestions from "./EditQuestions";
import EditTextArea from "./EditTextArea";
import EditTextField from "./EditTextField";
import EditDropdownList from "./EditDropdownList";

export interface EditContentRef {
  handleSaveChanges: () => void;
}

const EditContent = forwardRef<EditContentRef>((_, ref) => {
  const { jobApplication, setJobApplication } = useContext(
    ApplicationWindowContext
  );

  if (!jobApplication) return null;

  const [editedJob, setEditedJob] = useState<JobApplication>(jobApplication);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditedJob({ ...editedJob, [name]: value });
  };

  const handleCVChange = (cv: CurriculumVitae) => {
    setEditedJob({ ...editedJob, cv });
  };

  const handleQuestionChange = (
    index: number,
    question: string,
    answer: string
  ) => {
    const questions = [...(editedJob.questions || [])];
    questions[index] = { question, answer };
    setEditedJob({ ...editedJob, questions });
  };

  const handleAddQuestion = () => {
    const questions = [...(editedJob.questions || [])];
    questions.push({ question: "", answer: "" });
    setEditedJob({ ...editedJob, questions });
  };

  const handleRemoveQuestion = (index: number) => {
    const questions = [...(editedJob.questions || [])];
    questions.splice(index, 1);
    setEditedJob({ ...editedJob, questions });
  };

  const handleSaveChanges = () => {
    if (setJobApplication) {
      setJobApplication(editedJob);
    }
    console.log("Saved changes:", editedJob);
  };

  useImperativeHandle(ref, () => ({
    handleSaveChanges,
  }));

  return (
    <div className="p-4 space-y-4 bg-gray-50">
      {/* Company */}
      <EditTextField
        label="Company"
        name="company"
        value={editedJob.company}
        onChange={handleInputChange}
      />
      {/* Position */}
      <EditTextField
        label="Position"
        name="position"
        value={editedJob.position}
        onChange={handleInputChange}
      />
      {/* Description */}
      <EditTextArea
        label="Description"
        name="description"
        value={editedJob.description || ""}
        onChange={handleInputChange}
      />
      {/* Salary */}
      <EditTextField
        label="Salary"
        name="salary"
        value={editedJob.salary || ""}
        onChange={handleInputChange}
      />
      {/* Location */}
      <EditTextField
        label="Location"
        name="location"
        value={editedJob.location || ""}
        onChange={handleInputChange}
      />
      {/* Notes */}
      <EditTextArea
        label="Notes"
        name="notes"
        value={editedJob.notes || ""}
        onChange={handleInputChange}
      />
      {/* Web Link */}
      <EditTextField
        label="Link"
        name="link"
        value={editedJob.link || ""}
        onChange={handleInputChange}
      />
      {/* Applied Via */}
      <EditDropdownList
        label="Applied Via"
        name="appliedVia"
        options={["LinkedIn", "Website", "Referral", "Other"]}
        value={editedJob.appliedVia || ""}
        onSelect={(value) => setEditedJob({ ...editedJob, appliedVia: value })}
      />
      <EditCV selectedCV={editedJob.cv} onCVChange={handleCVChange} />
      <EditTextArea
        label="Cover Letter"
        name="coverLetter"
        value={editedJob.coverLetter || ""}
        onChange={handleInputChange}
      />
      <EditQuestions
        questions={editedJob.questions || []}
        onQuestionChange={handleQuestionChange}
        onAddQuestion={handleAddQuestion}
        onRemoveQuestion={handleRemoveQuestion}
      />
    </div>
  );
});

export default EditContent;
