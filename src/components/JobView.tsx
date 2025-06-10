import React from "react";
import AnimatedButton from "./AnimatedButton";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "@mdi/react";
import {
  mdiClose,
  mdiMapMarker,
  mdiCash,
  mdiCalendar,
  mdiOfficeBuilding,
  mdiCalendarClock,
  mdiWeb,
  mdiApplicationEditOutline,
  mdiDeleteOutline,
} from "@mdi/js";
import { Job } from "../types/job-types";

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
            {/* Fixed Header */}
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

                {/* Buttons */}
                <div className="flex space-x-1 pl-40">
                  {job.link && (
                    <AnimatedButton
                      icon={mdiWeb}
                      onClick={() =>
                        window.open(job.link, "_blank", "noopener,noreferrer")
                      }
                      caption="Open job link"
                      captionPosition="left"
                      className="p-2 hover:bg-blue-100 rounded-full transition-colors cursor-pointer"
                    />
                  )}

                  {/* Edit Button */}
                  <AnimatedButton
                    icon={mdiApplicationEditOutline}
                    onClick={() => onEdit?.(job)}
                    caption="Edit job"
                    className="p-2 hover:bg-yellow-100 rounded-full transition-colors cursor-pointer"
                  />

                  {/* Delete Button */}
                  <AnimatedButton
                    icon={mdiDeleteOutline}
                    onClick={() => onDelete?.(job.id)}
                    caption="Delete job"
                    className="p-2 hover:bg-red-100 rounded-full transition-colors cursor-pointer"
                  />
                </div>

                <AnimatedButton
                  icon={mdiClose}
                  onClick={onClose}
                  caption="Close"
                  captionPosition="left"
                />
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 no-scrollbar  pb-20">
              {/* Key Information */}
              <div className="mb-6">{keyInformation(job)}</div>

              {/* Top Portion (CV and Job Description) */}
              <div className="flex justify-between items-start pb-4">
                {cvImage(job)}
                {jobDescription(job)}
              </div>

              {/* Cover Letter */}
              {job.coverLetter && (
                <div className="py-3 border-t border-gray-200 ">
                  {coverLetter(job)}
                </div>
              )}

              {/* Application Questions */}
              {job.questions && (
                <div className="pt-3 border-t border-gray-200">
                  {applicationQuestions(job.questions)}
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
  // State to keep track of the index of the selected question for modal view.
  // `null` means no modal is open.
  const [selectedQuestionIndex, setSelectedQuestionIndex] = React.useState<
    number | null
  >(null);

  // Handler to open the modal for a specific question.
  const openModal = (index: number) => {
    setSelectedQuestionIndex(index);
  };

  // Handler to close the currently open modal.
  const closeModal = () => {
    setSelectedQuestionIndex(null);
  };

  // Return early if there are no questions.
  if (!questions || questions.length === 0) {
    return <p className="text-gray-600">No application questions available.</p>;
  }

  // Get the currently selected question object, if any.
  const currentQuestion =
    selectedQuestionIndex !== null ? questions[selectedQuestionIndex] : null;

  return (
    <div>
      <h3 className="text-lg font-semibold text-black mb-4">
        Application Questions
      </h3>
      <div className="relative">
        {/* Horizontal scroll container for question cards */}
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar overflow-y-visible">
          {questions.map((qa, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-80 bg-white bg-opacity-70 p-4 rounded-lg border border-gray-200 cursor-pointer shadow-lg hover:shadow-2xl hover:border-gray-300 transition-all duration-200"
              onClick={() => openModal(index)} // Set this question as selected on click
              whileHover={{ y: -3 }} // Subtle lift effect on hover
            >
              {/* Question Preview */}
              <div className="mb-3">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Question {index + 1}
                </h4>
                <p className="text-sm text-gray-800 font-medium leading-relaxed line-clamp-3">
                  {" "}
                  {/* Truncate long questions in card */}
                  {qa.question}
                </p>
              </div>
              {/* Answer Preview */}
              <div>
                <h5 className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                  Answer
                </h5>
                <p className="text-sm text-gray-700 leading-relaxed line-clamp-4 text-justify">
                  {" "}
                  {/* Truncate long answers in card */}
                  {qa.answer}
                </p>
                {/* <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" /> */}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Gradient */}
        {questions.length > 2 && (
          <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none" />
        )}
      </div>

      {/* Modal for displaying the full question and answer */}
      <AnimatePresence>
        {currentQuestion && selectedQuestionIndex !== null && (
          <motion.div
            // Backdrop styling: fixed position, covers screen, backdrop blur.
            // z-index is set high to appear above other content.
            className="fixed inset-0 z-[70] flex items-center justify-center backdrop-blur-md"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }} // Semi-transparent black background
            onClick={closeModal} // Close modal if backdrop is clicked
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Modal content container: stops click propagation to backdrop. */}
            <motion.div
              className="bg-white rounded-xl shadow-2xl p-6 pt-4 w-full max-w-xl mx-4 flex flex-col" // Added flex-col
              onClick={(e) => e.stopPropagation()} // Prevents modal from closing when its content is clicked
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ duration: 0.2, ease: "circOut" }}
            >
              {/* Modal Header with Close Button */}
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-xl font-semibold text-black">
                  Question {selectedQuestionIndex + 1}
                </h4>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                  aria-label="Close question details"
                >
                  <Icon path={mdiClose} size={1.1} />
                </button>
              </div>

              {/* Scrollable Content Area for Question and Answer */}
              <div className="overflow-y-auto max-h-[70vh] px-2 no-scrollbar">
                {/* Full Question */}
                <div className="mb-5">
                  <p className="font-bold text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {currentQuestion.question}
                  </p>
                </div>
                {/* Full Answer */}
                <div>
                  <h5 className="text-md font-semibold text-black mb-2 border-t border-gray-200 pt-3">
                    Answer
                  </h5>
                  <p className="text-gray-700 leading-relaxed text-justify">
                    {currentQuestion.answer}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
          className="h-full max-h-[39vh] rounded-md object-cover shadow-2xl border border-gray-200 cursor-pointer hover:shadow-3xl transition-shadow"
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
                className="max-w-full max-h-[95vh] object-contain rounded-lg shadow-2xl"
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
        className="flex items-center justify-between mb-2 cursor-pointer"
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
      <div className="relative">
        <motion.div
          className="overflow-hidden relative"
          initial={false} // Prevents animation on initial render
          animate={{ height: isExpanded ? "auto" : "5rem" }}
          transition={{ duration: 1.0, ease: [0.85, 0, 0.15, 1] }} // Smooth animation
        >
          {/* Paragraph for the cover letter text */}
          <p
            className={`text-gray-800 leading-relaxed text-sm text-justify pb-2`}
          >
            {textContent}
          </p>

          {/* Fading gradient overlay */}
          <motion.div
            className={`absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none`}
            initial={{ opacity: 1.0 }}
            animate={{ opacity: isExpanded ? 0 : 1.0 }}
            transition={{ duration: 1.0 }}
          />
        </motion.div>
      </div>
    </div>
  );
}
