import React from "react";
import { motion } from "framer-motion";


function CoverLetter(coverLetter: string) {
  const [isExpanded, setIsExpanded] = React.useState(false);

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
            {coverLetter || "No cover letter provided. You can add one in the job details."}
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

export default CoverLetter;