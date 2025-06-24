import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { mdiClose } from "@mdi/js";
import { CurriculumVitae } from "../../../types/job-application-types";
import AnimatedButton from "../../General/AnimatedButton";
import { useCVImageUrl } from "../../../hooks/useCVImageUrl";

// Function to render CV image with modal view
function CvImage(cv: CurriculumVitae) {
  const [cvView, setCVView] = React.useState(false);
  const imageUrl = useCVImageUrl(cv.imagePreviewPath);

  // If cv is undefined, we render a colored box instead of the image
  if (!cv) {
    return (
      <div className="h-full max-h-[39vh] bg-gray-200 rounded-md flex items-center justify-center">
        <p className="text-gray-600">No CV available</p>
      </div>
    );
  }
  return (
    <>
      {/* CV Image */}
      <div className="relative z-5">
        <motion.img
          // src={cv?.imagePreviewPath}
          src={imageUrl || undefined}
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
        {cvView && <FullscreenCV cv={cv} setIsExpanded={setCVView} />}
      </AnimatePresence>
    </>
  );
}

export default CvImage;

export function FullscreenCV({
  cv,
  setIsExpanded,
  imageUrl,
}: {
  cv: CurriculumVitae;
  setIsExpanded: (isExpanded: boolean) => void;
  imageUrl?: string | null;
}) {
  if (imageUrl === undefined) {
    imageUrl = useCVImageUrl(cv.imagePreviewPath);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-lg"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
      onClick={() => setIsExpanded(false)}
    >
      <motion.div
        initial={{ scale: 1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.85, 0, 0.15, 1] }}
        className="relative h-full flex flex-col items-center justify-center p-12"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        {/* <AnimatedButton
          icon={mdiClose}
          onClick={() => setIsExpanded(false)}
          caption="Close"
          className="absolute top-4 left-[70vh] p-2 bg-white bg-opacity-70 rounded-full shadow-lg hover:bg-opacity-90 transition-colors cursor-pointer"
          iconClassName="text-gray-800"
        /> */}

        {/* CV Title */}
        <motion.div className="flex w-full justify-between items-center py-4">
          <motion.h2
            className="text-2xl font-semibold text-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {cv.name || "Curriculum Vitae"}
          </motion.h2>
          <AnimatedButton
            icon={mdiClose}
            onClick={() => setIsExpanded(false)}
            caption="Close"
            className="p-2 bg-white bg-opacity-70 rounded-full shadow-lg hover:bg-yellow-100 transition-colors cursor-pointer"
            iconClassName="text-gray-800"
          />
        </motion.div>

        {/* Expanded CV Image */}
        <motion.img
          // src={cv?.imagePreviewPath}
          src={imageUrl || undefined}
          alt="CV Full View"
          className="h-full object-contain rounded-lg shadow-2xl"
          layoutId="cv-image"
        />
      </motion.div>
    </motion.div>
  );
}
