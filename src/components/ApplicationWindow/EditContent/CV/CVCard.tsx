import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CurriculumVitae } from "../../../../types/job-application-types";
import AnimatedButton from "../../../General/AnimatedButton";
import ConfirmationDialog from "../../../General/ConfirmationDialog";
import { mdiMagnifyExpand, mdiTrashCan } from "@mdi/js";
import { FullscreenCV } from "../../ViewContent/CVImage";
import { useCVImageUrl } from "../../../../hooks/useCVImageUrl";
import { cvHandler } from "../../../../data/CVHandler";

interface CVCardProps {
  cv: CurriculumVitae;
  onSelect: (cv: CurriculumVitae) => void;
  isSelected: boolean;
  enlarged?: boolean;
  onDelete?: (cv: CurriculumVitae) => void;
}

const CVCard: React.FC<CVCardProps> = ({ 
  cv, 
  onSelect, 
  isSelected, 
  enlarged = false, 
  onDelete 
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const imageUrl = useCVImageUrl(cv.imagePreviewPath);

  // Calculate dimensions based on enlarged prop
  const cardHeight = enlarged ? "h-80" : "h-60";
  const cardWidth = enlarged ? "w-72" : "w-auto";

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setIsDeleting(true);
    try {
      await cvHandler.deleteCV(cv.id);
      onDelete(cv);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Failed to delete CV:", error);
      // You might want to show an error toast here
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleExpandClick = () => {
    setIsExpanded(true);
  };

  return (
    <>
      <motion.div
        className={`relative cursor-pointer border-2 rounded-lg overflow-hidden shadow-lg inline-block ${cardWidth}`}
        onClick={() => onSelect(cv)}
        whileHover="hover"
        initial="rest"
        animate={isSelected ? "selected" : "rest"}
        variants={{
          rest: { scale: 1, borderColor: "#353A47" },
          hover: { scale: enlarged ? 1.02 : 1.05 },
          selected: {
            scale: 1.02,
            borderColor: "rgb(20, 184, 166)",
          },
        }}
        transition={{ duration: 0.2 }}
      >
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={cv.name} 
            className={`block ${cardHeight} w-full object-cover`} 
          />
        ) : (
          <div className={`${cardHeight} bg-gray-200 flex items-center justify-center`}>
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
          <p className="text-black text-xs font-normal">{cv.notes}</p>
          <p className="text-black font-medium text-sm">{cv.date}</p>
          
          <div className="flex flex-grow w-full items-center justify-center space-x-2">
            <AnimatedButton
              icon={mdiMagnifyExpand}
              onClick={handleExpandClick}
              className="p-2 text-white rounded-lg hover:bg-white/30 transition-colors"
              caption="View Full Size"
            />
            
            {enlarged && onDelete && (
              <AnimatedButton
                icon={mdiTrashCan}
                onClick={handleDeleteClick}
                className="p-2 text-white rounded-lg hover:bg-red-500/50 transition-colors"
                caption="Delete CV"
              />
            )}
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

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        title="Delete CV"
        message={`Are you sure you want to delete "${cv.name}"? This action cannot be undone.`}
        onClose={() => setShowDeleteDialog(false)}
        primaryButton={{
          text: isDeleting ? "Deleting..." : "Delete",
          onClick: handleDelete,
          disabled: isDeleting,
          className: "bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
        }}
        secondaryButton={{
          text: "Cancel",
          onClick: () => setShowDeleteDialog(false),
          disabled: isDeleting
        }}
      />
    </>
  );
};

export default CVCard;
