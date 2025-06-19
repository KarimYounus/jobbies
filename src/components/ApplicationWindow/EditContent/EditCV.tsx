import React from "react";
import { cvFile } from "../../../types/job-application-types";

interface EditCVProps {
  cv: cvFile | undefined;
  onCVChange: (cv: cvFile) => void;
}

const EditCV: React.FC<EditCVProps> = ({ cv, onCVChange }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // In Electron, the 'path' property is available on the File object
      const filePath = (file as any).path;
      onCVChange({ name: file.name, path: filePath });
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold leading-6 text-gray-900">CV Image</h2>
      <div className="mt-1 flex items-center justify-start">
        <span className="mr-2">{cv?.path || "No CV selected"}</span>
        <input type="file" onChange={handleFileChange} className="hidden" id="cv-upload" accept=".pdf,.doc,.docx,.png,.jpg"/>
        <label htmlFor="cv-upload" className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Upload CV
        </label>
      </div>
    </div>
  );
};

export default EditCV;
