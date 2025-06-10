import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Icon from "@mdi/react";
import {
  mdiClose,
  mdiMapMarker,
  mdiCash,
  mdiCalendar,
  mdiOfficeBuilding,
  mdiCalendarClock,
  mdiChevronDown,
  mdiChevronUp,
} from "@mdi/js";
import { Job } from "../types";
import { b } from "motion/react-client";

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
            className="w-full max-w-2xl mx-4 rounded-lg shadow-2xl font-ivysoft flex flex-col h-200 max-h-[90vh]"
            style={{ backgroundColor: "rgba(255, 255, 255, 1.0)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fixed Header with Backdrop Blur */}
            <div className="sticky top-0 z-10 rounded-t-lg border-b border-gray-200 bg-white/10 backdrop-blur-md">
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

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
              {/* Key Information */}
              <div className="mb-6">{keyInformation(job)}</div>

              {/* Top Portion */}
              <div className="flex justify-between items-start">
                {/* CV Image */}
                {cvImage(job)}

                {jobDescription(job)}
              </div>

              {job.coverLetter && (
                <div className="mt-6">
                  {" "}
                  {/* Adjust margin-top as needed for spacing */}
                  {coverLetter(job)}
                </div>
              )}
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
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
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

// Function to render key information about the job
function keyInformation(job: Job) {
  return (
    <div className="flex items-center justify-between space-x-6 mx-3">
      {/* Days Ago */}
      <div className="flex items-center space-x-3">
        <Icon path={mdiCalendarClock} size={1} className="text-gray-600" />

        <div>
          {/* <p className="text-sm text-gray-600">Days Since App.</p> */}
          <p className="text-sm text-black font-medium">
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

// Function to render CV image with modal view
function cvImage(job: Job) {
  const [cvView, setCVView] = React.useState(false);
  return (
    <>
      {/* CV Image */}
      <div className="relative z-5">
        <motion.img
          src="src/assets/images/cv.png"
          alt="CV Preview"
          className="w-[30vw] rounded-md object-cover shadow-2xl border border-gray-200 cursor-pointer hover:shadow-3xl transition-shadow"
          initial={{ opacity: 0, y: -400 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ duration: 1.0, ease: [0.85, 0, 0.15, 1] }}
          onClick={() => setCVView(true)}
          whileHover={{ scale: 1.1, x: 30, y: 20 }}
          whileTap={{ scale: 0.98 }}
        />

        {/* Overlay hint */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 rounded-md transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100 pointer-events-none">
          <p className="text-white font-medium bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm pointer-events-none">
            Click to expand
          </p>
        </div>
      </div>

      {/* CV Expanded View Modal */}
      <AnimatePresence>
        {cvView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-lg"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
            onClick={() => setCVView(false)}
          >
            <motion.div
              initial={{ scale: 1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.85, 0, 0.15, 1] }}
              className="relative max-w-[70vw] max-h-[80vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setCVView(false)}
                className="absolute top-4 right-4 z-10 p-3 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-lg transition-all"
              >
                <Icon path={mdiClose} size={1} className="text-gray-700" />
              </button>

              {/* Expanded CV Image */}
              <motion.img
                src="src/assets/images/cv.png"
                alt="CV Full View"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                layoutId="cv-image" // This creates a smooth transition between states
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function jobDescription(job: Job) {
  return (
    <div className="flex-1 ml-6">
      <h3 className="text-lg font-semibold text-black mb-2">Job Description</h3>
      <div className="relative">
        <div className="max-h-95 overflow-y-auto no-scrollbar scrollbar-track-white-100 text-justify">
          <p className="text-gray-800 leading-relaxed text-sm pb-20">
            This is a detailed description of the job position, including
            responsibilities, requirements, and any other relevant information.
            It should provide a clear understanding of what the job entails and
            what is expected from the candidate. It may be vert long, so it is
            important to keep it concise yet informative, highlighting the key
            aspects of the role to attract suitable applicants. This is a
            detailed description of the job position, including
            responsibilities, requirements, and any other relevant information.
            It should provide a clear understanding of what the job entails and
            what is expected from the candidate. It may be vert long, so it is
            important to keep it concise yet informative, highlighting the key
            aspects of the role to attract suitable applicants. This is a
            detailed description of the job position, including
            responsibilities, requirements, and any other relevant information.
            It should provide a clear understanding of what the job entails and
            what is expected from the candidate. It may be vert long, so it is
            important to keep it concise yet informative, highlighting the key
            aspects of the role to attract suitable applicants.
          </p>
        </div>
        {/* Fading gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

function coverLetter(job: Job) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  // Ensure job.coverLetter is available; fallback if necessary, though the parent component checks this.
  const textContent = job.coverLetter || "No cover letter content available.";

  return (
    // The main container for the cover letter section.
    // Styling like flex-1 or ml-6 should be handled by the parent if needed.
    <div>
      <div
        className="flex items-center justify-between mb-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }
        }}
      >
        <h3 className="text-lg font-semibold text-black">Cover Letter</h3>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-black mr-4"
        >
          ▼
        </motion.div>
      </div>
      <div
        className="relative" // `group` enables group-hover for child elements
      >
        <motion.div
          className="overflow-hidden relative"
          initial={false} // Prevents animation on initial render
          animate={{ height: isExpanded ? "auto" : "5rem" }}
          transition={{ duration: 1.0, ease: [0.85, 0, 0.15, 1] }} // Smooth animation
        >
          {/* Paragraph for the cover letter text.
           */}
          <p
            className={`text-gray-800 leading-relaxed text-sm ${
              !isExpanded ? "pb-10" : "pb-2"
            }`}
          >
            {textContent}
          </p>

          {/* Fading gradient overlay:
              Shown only when collapsed to fade out the bottom of the clipped text.
          */}
          {!isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          )}
        </motion.div>
      </div>
    </div>
  );
}
