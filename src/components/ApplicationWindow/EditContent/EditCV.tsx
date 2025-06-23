import React, { useState } from "react";
import { CurriculumVitae } from "../../../types/job-application-types";
import { cvCollection as initialCVs } from "../../../data/cv/cv-collection";
import CVCard from "./CVCard";
import CreateNewCV from "./CreateNewCV";
import AnimatedButton from "../../General/AnimatedButton";
import { mdiCloseCircle, mdiTextBoxPlus } from "@mdi/js";

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
        {!showCreateForm ? (
          <AnimatedButton
            onClick={() => setShowCreateForm(true)}
            className="bg-teal-200 text-white px-4 py-2 rounded-lg hover:bg-teal-300 transition-colors"
            caption="Create New CV"
            icon={mdiTextBoxPlus}
          />
        ) : (
          <AnimatedButton
            onClick={() => setShowCreateForm(false)}
            className="bg-red-200 text-white px-4 py-2 rounded-lg hover:bg-red-400 transition-colors"
            caption="Cancel"
            icon={mdiCloseCircle}
          />
        )}
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
