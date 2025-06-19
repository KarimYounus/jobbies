import React from "react";
import Header from "./Header";
import ViewContent from "./ViewContent/ViewContent";
import EditContent from "./EditContent/EditContent";
import { motion, AnimatePresence } from "framer-motion";
import { JobApplication } from "../../types/job-application-types";

interface ApplicationWindowProps {
  jobApplication: JobApplication | null; // Job Application Data Structure
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (jobId: string) => void;
}

interface ApplicationWindowContextType {
  jobApplication?: JobApplication | null; // Job Application Data Structure
  setJobApplication: (job: JobApplication) => void;
  isEditing: boolean; // boolean to swtch between edit and view mode
  setIsEditing: (isEditing: boolean) => void;
}

export const ApplicationWindowContext =
  React.createContext<ApplicationWindowContextType>({
    jobApplication: null,
    setJobApplication: () => {},
    isEditing: false,
    setIsEditing: () => {},
  });

const ApplicationWindow: React.FC<ApplicationWindowProps> = ({
  jobApplication: job,
  isOpen,
  onClose,
  onDelete,
}) => {
  if (!job) return null;

  const [jobApplication, setJobApplication] = React.useState<JobApplication | null>(job);
  const [isEditing, setIsEditing] = React.useState(false);

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    // todo: Implement delete logic
  };

  return (
    <ApplicationWindowContext.Provider
      value={{ jobApplication, setJobApplication, isEditing, setIsEditing }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.85, 0, 0.15, 1] }}
              className="w-full mx-20 rounded-lg shadow-2xl font-ivysoft flex flex-col max-h-[90vh]"
              style={{ backgroundColor: "rgba(255, 255, 255, 1.0)" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Fixed Header */}
              <Header
                job={job}
                onClose={onClose}
                onDelete={handleDelete}
                onSave={handleSave}
              />

              <AnimatePresence>
                {/* Conditional Content Rendering */}
                {!isEditing ? <ViewContent /> : <EditContent />}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ApplicationWindowContext.Provider>
  );
};

export default ApplicationWindow;


