import React from "react";
import Header from "./Header";
import ViewContent from "./ViewContent/ViewContent";
import EditContent, { EditContentRef } from "./EditContent/EditContent";
import { motion, AnimatePresence } from "framer-motion";
import { JobApplication } from "../../types/job-application-types";

interface ApplicationWindowProps {
  jobApplication: JobApplication | null; // Job Application Data Structure
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (jobId: string) => void;
  onSave?: (job: JobApplication) => void;
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
  onSave,
}) => {
  if (!job) return null;

  const [jobApplication, setJobApplication] = React.useState<JobApplication | null>(job);
  const [isEditing, setIsEditing] = React.useState(false);
  const editContentRef = React.useRef<EditContentRef>(null);

  React.useEffect(() => {
    setJobApplication(job);
  }, [job]);

  const handleSave = () => {
    if (editContentRef.current) {
      editContentRef.current.handleSaveChanges();
    }
    if (onSave && jobApplication) {
      onSave(jobApplication);
    }
    setIsEditing(false);
  };

  const handleDeleteAndClose = () => {
    if (onDelete && jobApplication) {
      onDelete(jobApplication.id);
    }
    onClose();
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
              {jobApplication && (
                <Header
                  job={jobApplication}
                  onClose={onClose}
                  onSave={handleSave}
                  onDelete={handleDeleteAndClose}
                />
              )}
              <div className="flex-grow overflow-y-auto">
                {isEditing ? (
                  <EditContent ref={editContentRef} />
                ) : (
                  <ViewContent />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ApplicationWindowContext.Provider>
  );
};

export default ApplicationWindow;


