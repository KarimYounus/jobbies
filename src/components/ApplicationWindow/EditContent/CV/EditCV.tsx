import React, { useState, useEffect } from "react";
import { CurriculumVitae } from "../../../../types/job-application-types";
import { cvHandler } from "../../../../data/CVHandler";
import CVCard from "./CVCard";
import CreateNewCV from "./CreateNewCV";
import AnimatedButton from "../../../General/AnimatedButton";
import { mdiCloseCircle, mdiTextBoxPlus } from "@mdi/js";

interface EditCVProps {
  selectedCV: CurriculumVitae | undefined;
  onCVChange: (cv: CurriculumVitae) => void;
}

const EditCV: React.FC<EditCVProps> = ({ selectedCV, onCVChange }) => {
  const [cvCollection, setCvCollection] = useState<CurriculumVitae[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize CV collection from CVHandler
  useEffect(() => {
    const initializeCVs = async () => {
      try {
        await cvHandler.initialize();
        setCvCollection(cvHandler.getAllCVs());
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize CVs:', err);
        setError('Failed to load CV collection');
        setIsLoading(false);
      }
    };

    // Event listeners for CV data changes
    const handleCVChange = () => {
      setCvCollection(cvHandler.getAllCVs());
    };

    cvHandler.addEventListener('cv-added', handleCVChange);
    cvHandler.addEventListener('cv-updated', handleCVChange);
    cvHandler.addEventListener('cv-deleted', handleCVChange);
    cvHandler.addEventListener('cvs-loaded', handleCVChange);

    initializeCVs();

    // Cleanup event listeners on unmount
    return () => {
      cvHandler.removeEventListener('cv-added', handleCVChange);
      cvHandler.removeEventListener('cv-updated', handleCVChange);
      cvHandler.removeEventListener('cv-deleted', handleCVChange);
      cvHandler.removeEventListener('cvs-loaded', handleCVChange);
    };
  }, []);

  const handleSaveNewCV = async (newCV: CurriculumVitae) => {
    try {
      await cvHandler.addCV(newCV);
      onCVChange(newCV);
      setShowCreateForm(false);
    } catch (err) {
      console.error('Failed to save new CV:', err);
      setError('Failed to save CV');
    }
  };
  const handleSelectCV = (cv: CurriculumVitae) => {
    onCVChange(cv); // Notify parent component of the change
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold leading-6 text-gray-900">Curriculum Vitae</h2>
        <div className="text-center py-4">
          <p className="text-gray-500">Loading CVs...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold leading-6 text-gray-900">Curriculum Vitae</h2>
        <div className="text-center py-4">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
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
