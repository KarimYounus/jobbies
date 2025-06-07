import React from "react";
import { motion, AnimatePresence } from "motion/react";
import Icon from "@mdi/react";
import {
  mdiClose,
  mdiMapMarker,
  mdiCash,
  mdiCalendar,
  mdiOfficeBuilding,
} from "@mdi/js";
import { Job } from "../types";

interface JobViewProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (job: Job) => void;
  onDelete?: (jobId: string) => void;
}

const JobView: React.FC<JobViewProps> = ({
  job,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!job) return null;

  // Format status for display
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-800";
      case "interview":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "offer":
        return "bg-green-100 text-green-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
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
            className="w-full max-w-2xl mx-4 rounded-lg shadow-2xl font-ivysoft flex flex-col max-h-[90vh] bg-white"
            // style={{ backgroundColor: "#FFFFFF" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fixed Header */}
            <div className="sticky top-0 z-10 rounded-t-lg border-b backdrop-blur-md bg-white/10 border-gray-200">
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center space-x-4">
                  <Icon
                    path={mdiOfficeBuilding}
                    size={1.5}
                    className="text-gray-600"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-black">
                      {job.position}
                    </h2>
                    <p className="text-lg text-gray-700">{job.company}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <Icon path={mdiClose} size={1} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex justify-start">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    job.status
                  )}`}
                >
                  {formatStatus(job.status)}
                </span>
              </div>

              {/* Key Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Applied Date */}
                <div className="flex items-center space-x-3">
                  <Icon path={mdiCalendar} size={1} className="text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Applied Date</p>
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
                    <Icon
                      path={mdiMapMarker}
                      size={1}
                      className="text-gray-600"
                    />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium text-black">{job.location}</p>
                    </div>
                  </div>
                )}

                {/* Salary */}
                {job.salary && (
                  <div className="flex items-center space-x-3">
                    <Icon path={mdiCash} size={1} className="text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Salary</p>
                      <p className="font-medium text-black">{job.salary}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Notes Section */}
              {job.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-black mb-2">
                    Notes
                  </h3>
                  <div className="bg-white bg-opacity-50 p-4 rounded-lg">
                    <p className="text-gray-800 leading-relaxed">{job.notes}</p>
                  </div>
                </div>
              )}

              {job.questions &&
                job.questions.length > 0 &&
                applicationQuestions(job.questions)}

              {/* Placeholder */}
              <div className="h-100 w-full bg-amber-300"></div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JobView;

// Function to render application questions
function applicationQuestions(questions: Job["questions"]) {
  if (!questions || questions.length === 0) {
    return <p className="text-gray-600">No application questions available.</p>;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-black mb-4">
        Application Questions
      </h3>
      <div className="relative">
        {/* Horizontal scroll container */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {questions.map((qa, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-80 bg-white bg-opacity-60 p-4 rounded-lg border border-gray-200"
            >
              {/* Question */}
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Question {index + 1}
                </h4>
                <p className="text-sm text-gray-800 font-medium leading-relaxed">
                  {qa.question}
                </p>
              </div>
              {/* Answer */}
              <div>
                <h5 className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                  Answer
                </h5>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {qa.answer}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scroll indicator (optional visual hint) */}
        {questions.length > 2 && (
          <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
        )}
      </div>
    </div>
  );
}
