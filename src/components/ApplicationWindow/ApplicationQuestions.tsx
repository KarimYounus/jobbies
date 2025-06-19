import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { mdiClose } from "@mdi/js";
import { Icon } from "@mdi/react";
import { ApplicationQuestion } from "../../types/job-application-types";

// Function to render application questions
function ApplicationQuestions(questions: ApplicationQuestion[]) {
  // State to keep track of the index of the selected question for modal view.
  // `null` means no modal is open.
  const [selectedQuestionIndex, setSelectedQuestionIndex] = React.useState<number | null>(null);

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
  const currentQuestion = selectedQuestionIndex !== null ? questions[selectedQuestionIndex] : null;

  return (
    <div>
      <h3 className="text-lg font-semibold text-black mb-4">
        Application Questions
      </h3>
      <div className="relative">
        {/* Horizontal scroll container for question cards */}
        <div
          className="flex gap-4 overflow-x-auto pb-4 no-scrollbar pt-2 px-1"
          style={{ overflowY: "visible" }}
        >
          {questions.map((qa, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-80 bg-white bg-opacity-70 p-4 rounded-lg border border-gray-200 cursor-pointer shadow-lg hover:shadow-2xl hover:border-gray-300 transition-all duration-200"
              onClick={() => openModal(index)}
              whileHover={{ y: -3 }}
              style={{ transformOrigin: "center bottom" }} // Ensures transform doesn't get clipped
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

export default ApplicationQuestions;