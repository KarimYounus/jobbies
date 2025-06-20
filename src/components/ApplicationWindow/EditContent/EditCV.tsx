import React, { useState } from "react";
import { CurriculumVitae } from "../../../types/job-application-types";
import { cvCollection as initialCVs } from "../../../data/cv-collection";
import CVCard from "./CVCard";
import CreateNewCV from "./CreateNewCV";

interface EditCVProps {
  selectedCV: CurriculumVitae | undefined;
  onCVChange: (cv: CurriculumVitae) => void;
}

const EditCV: React.FC<EditCVProps> = ({ selectedCV, onCVChange }) => {
  const [cvCollection, setCvCollection] = useState<CurriculumVitae[]>(initialCVs);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleSaveNewCV = (newCV: CurriculumVitae) => {
    const updatedCollection = [...cvCollection, newCV];
    setCvCollection(updatedCollection);
    onCVChange(newCV);
    setShowCreateForm(false);
    // Here you would also persist the updated collection to your backend/JSON file
  };

  const handleSelectCV = (cv: CurriculumVitae) => {
    if (selectedCV?.id !== undefined) {
      selectedCV = cv; // Set the selected CV to the clicked one
      onCVChange(cv); // Notify parent component of the change
    };
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold leading-6 text-gray-900">Curriculum Vitae</h2>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {showCreateForm ? 'Cancel' : 'Create New CV'}
        </button>
      </div>

      {showCreateForm ? (
        <CreateNewCV 
          onSave={handleSaveNewCV} 
          onCancel={() => setShowCreateForm(false)} 
        />
      ) : (
        <div className="flex overflow-x-auto p-2 bg-gray-100 rounded-lg">
          {cvCollection.map((cv) => (
            <div key={cv.id} className="min-w-[200px]">
              <CVCard 
                cv={cv} 
                onSelect={handleSelectCV} 
                isSelected={selectedCV?.id === cv.id} 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EditCV;
