import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CurriculumVitae } from "../../../../types/job-application-types";
import AnimatedButton from "../../../General/AnimatedButton";
import { mdiMagnifyExpand } from "@mdi/js";
import { FullscreenCV } from "../../ViewContent/CVImage";
import { useCVImageUrl } from "../../../../hooks/useCVImageUrl";

interface CVCardProps {
  cv: CurriculumVitae;
  onSelect: (cv: CurriculumVitae) => void;
  isSelected: boolean;
}

const CVCard: React.FC<CVCardProps> = ({ cv, onSelect, isSelected }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const imageUrl = useCVImageUrl(cv.imagePreviewPath);

  return (
    <>
      <motion.div
        className={`relative cursor-pointer border-2 rounded-lg overflow-hidden shadow-lg inline-block`}
        onClick={() => onSelect(cv)}
        whileHover="hover"
        initial="rest"
        animate={isSelected ? "selected" : "rest"}
        variants={{
          rest: { scale: 1, borderColor: "#353A47" },
          hover: { scale: 1.05 },
          selected: {
            scale: 1.02,
            borderColor: "rgb(20, 184, 166)",
          },
        }}
        transition={{ duration: 0.2 }}
      >
        {imageUrl ? (
          <img src={imageUrl} alt={cv.name} className="block h-60" />
        ) : (
          <div className="h-60 bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500 text-sm">Loading image...</p>
          </div>
        )}
        <motion.div
          className="absolute inset-0 backdrop-blur-xs bg-teal-50/20 flex flex-col justify-start py-8 px-4 space-y-2"
          variants={{
            rest: { opacity: 0 },
            hover: { opacity: 1 },
          }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-black font-bold text-sm">{cv.name}</p>
          <p className="text-black text-xs font-normal ">{cv.notes}</p>
          <p className="text-black font-medium text-sm  ">{cv.date}</p>
          <div className="flex flex-grow w-full items-center justify-center">
            <AnimatedButton
              icon={mdiMagnifyExpand}
              onClick={() => setIsExpanded(true)}
              className="mt-2 p-2 text-white rounded-4xl hover:bg-white/30 transition-colors"
            />
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <FullscreenCV
            cv={cv}
            setIsExpanded={setIsExpanded}
            imageUrl={imageUrl}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default CVCard;
