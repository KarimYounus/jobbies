import React from "react";
import { ApplicationQuestion } from "../../../types/job-application-types";

interface EditQuestionsProps {
  questions: ApplicationQuestion[];
  onQuestionChange: (index: number, question: string, answer: string) => void;
  onAddQuestion: () => void;
  onRemoveQuestion: (index: number) => void;
}

const EditQuestions: React.FC<EditQuestionsProps> = ({
  questions,
  onQuestionChange,
  onAddQuestion,
  onRemoveQuestion,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold leading-6 text-gray-900">Application Questions</h2>
      {questions.map((q, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-md space-y-2 bg-gray-50">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">Question {index + 1}</label>
            <button onClick={() => onRemoveQuestion(index)} className="text-sm font-medium text-red-600 hover:text-red-800">Remove</button>
          </div>
          <textarea
            value={q.question}
            onChange={(e) => onQuestionChange(index, e.target.value, q.answer)}
            placeholder="Question"
            rows={2}
            className="mt-1 block w-full px-3 py-2 text-black bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <textarea
            value={q.answer}
            onChange={(e) => onQuestionChange(index, q.question, e.target.value)}
            placeholder="Answer"
            rows={4}
            className="mt-1 block w-full px-3 py-2 text-black bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      ))}
      <button
        onClick={onAddQuestion}
        className="mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add Question
      </button>
    </div>
  );
};

export default EditQuestions;
