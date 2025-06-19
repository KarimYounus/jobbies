import React from "react";
import Header from "./Header";
import ApplicationQuestions from "./ApplicationQuestions";
import CvImage from "./CVImage";
import CoverLetter from "./CoverLetter";
import ApplicationStatus from "./ApplicationStatus";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "@mdi/react";
import {
  mdiMapMarker,
  mdiCash,
  mdiCalendar,
  mdiCalendarClock,
} from "@mdi/js";
import { JobApplication } from "../../types/job-application-types";
import { StatusItem } from "../../types/status-types";

interface ApplicationWindowProps {
  job: JobApplication | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete?: (jobId: string) => void;
}

interface EditModeContextType {
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

export const EditModeContext = React.createContext<EditModeContextType>({
  isEditing: false,
  setIsEditing: () => {},
});

const ApplicationWindow: React.FC<ApplicationWindowProps> = ({
  job,
  isOpen,
  onClose,
}) => {
  if (!job) return null;

  const [currentStatus, setCurrentStatus] = React.useState(job.status);
  const [isEditing, setIsEditing] = React.useState(false);

  const handleStatusChange = (newStatus: StatusItem) => {
    setCurrentStatus(newStatus);
    // TODO: Implement logic to update job status in the backend
  };

  const handleSave = () => {
  // Todo: Implement save logic
  };

  const handleDelete = () => {
    // todo: Implement delete logic

  };

  return (
    <EditModeContext.Provider value={{ isEditing, setIsEditing }}>
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
              <Header job={job} onClose={onClose} onDelete={handleDelete} onSave={handleSave} />

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
                {/* Key Information */}
                <div className="mb-6">{KeyInformation(job)}</div>

                {/* Application Status */}
                <div className="mb-6">
                  <ApplicationStatus
                    statusItem={currentStatus}
                    onChangeStatus={handleStatusChange}
                  />
                </div>

                {/* Top Portion (CV and Job Description) */}
                <div className="flex justify-between items-start pb-4 border-t border-gray-200 pt-6">
                  {CvImage(job.cv)}
                  {JobDescription(
                    job.description || "No job description available."
                  )}
                </div>

                {/* Notes Section */}
                <div className="mt-6">
                  {job.notes && Notes(job.notes || "No notes yet.")}
                </div>

                {/* Cover Letter */}
                {job.coverLetter && (
                  <div className="py-3 border-t border-gray-200 ">
                    {CoverLetter(
                      job.coverLetter || "No cover letter provided."
                    )}
                  </div>
                )}

                {/* Application Questions */}
                {job.questions && (
                  <div className="pt-3 border-t border-gray-200">
                    {ApplicationQuestions(job.questions)}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </EditModeContext.Provider>
  );
};

export default ApplicationWindow;
       

// Function to render key information about the job
function KeyInformation(job: JobApplication) {
  return (
    <div className="flex items-center justify-between space-x-6 mx-3">
      {/* Days Ago */}
      <div className="flex items-center space-x-3">
        <Icon path={mdiCalendarClock} size={1} className="text-gray-600" />

        <div>
          {/* <p className="text-sm text-gray-600">Days Since App.</p> */}
          <p className=" text-black font-medium">
            {Math.floor(
              (new Date().getTime() - new Date(job.appliedDate).getTime()) /
                (1000 * 60 * 60 * 24)
            )}{" "}
            days ago
          </p>
        </div>
      </div>

      {/* Applied Date */}
      <div className="flex items-center space-x-3">
        <Icon path={mdiCalendar} size={1} className="text-gray-600" />
        <div>
          {/* <p className="text-sm text-gray-600">Applied Date</p> */}
          <p className="font-medium text-black">
            {new Date(job.appliedDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Location */}
      {job.location && (
        <div className="flex items-center space-x-3">
          <Icon path={mdiMapMarker} size={1} className="text-gray-600" />
          <div>
            {/* <p className="text-sm text-gray-600">Location</p> */}
            <p className="font-medium text-black">{job.location}</p>
          </div>
        </div>
      )}

      {/* Salary */}
      {job.salary && (
        <div className="flex items-center space-x-3">
          <Icon path={mdiCash} size={1} className="text-gray-600" />
          <div>
            {/* <p className="text-sm text-gray-600">Salary</p> */}
            <p className="font-medium text-black">{job.salary}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function JobDescription(description: string) {
  return (
    <div className="flex-1 ml-6">
      <h3 className="text-lg font-semibold text-black mb-2">Job Description</h3>
      <div className="relative">
        <div className="max-h-95 w-full overflow-y-auto no-scrollbar scrollbar-track-white-100 text-justify">
          <p className="text-gray-800 leading-relaxed text-sm pb-20">
            {description || "No job description available."}
          </p>
        </div>
        {/* Fading gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

function Notes(noteText: string) {
  return (
    <div className="flex-1 border-t border-gray-200 pt-4">
      <h3 className="text-lg font-semibold text-black mb-2">Notes</h3>
      <div className="relative">
        <div className="max-h-95 overflow-y-auto no-scrollbar scrollbar-track-white-100 text-justify">
          <p className="text-gray-800 leading-relaxed text-sm mb-10">
            {noteText || "No notes available."}
          </p>
        </div>
        {/* Fading gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
