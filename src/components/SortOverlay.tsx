import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  mdiSortAlphabeticalAscending,
  mdiSortAlphabeticalDescending,
  mdiSortCalendarAscending,
  mdiSortCalendarDescending,
} from "@mdi/js";
import AnimatedButton from "./General/AnimatedButton";
import { SortConfig, sortLabelToField } from "../types/sort-types";

interface SortOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSort: (sortConfig: SortConfig) => void;
}

interface SortMode {
  label: string;
  icons: string[];
}

const SortOptions: SortMode[] = [
  {
    label: "Date Created",
    icons: [mdiSortCalendarDescending, mdiSortCalendarAscending],
  },
  {
    label: "Alphabetical (Company)",
    icons: [mdiSortAlphabeticalDescending, mdiSortAlphabeticalAscending],
  },
];

export const SortOverlay: React.FC<SortOverlayProps> = ({
  isOpen,
  onClose,
  onSort,
}) => {  const [selectedSort, setSelectedSort] = useState<SortMode>(SortOptions[0]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  
  // Handler for changing sort mode (date vs company)
  const handleModeChange = (option: SortMode) => {
    setSelectedSort(option);
    
    // Create SortConfig with new mode but keep current order
    const sortConfig: SortConfig = {
      field: sortLabelToField[option.label],
      order: sortOrder
    };
    
    onSort(sortConfig);
  };

  // Handler for toggling sort order (asc vs desc) 
  const handleOrderToggle = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    
    // Create SortConfig with current mode but new order
    const sortConfig: SortConfig = {
      field: sortLabelToField[selectedSort.label],
      order: newOrder
    };
    
    onSort(sortConfig);
  };return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-start justify-end pt-20 pr-10 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // Full-screen backdrop click to close
        >
          <motion.div
            className="bg-black/70 backdrop-blur-lg rounded-lg shadow-xl w-80"
            initial={{ y: -200 }}
            animate={{ y: 0 }}
            exit={{ scale: 0.8 }}
            onClick={(e) => e.stopPropagation()} // Prevent backdrop close when clicking inside
          >
            <h2 className="text-xl font-bold p-5 border-b w-full bg-black/20 rounded-t-lg">
              Sort Applications
            </h2>
            <ul className="space-y-2 p-4">
              {SortOptions.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center justify-start cursor-pointer"
                >                  <AnimatedButton
                    icon={
                      sortOrder === "asc" ? option.icons[0] : option.icons[1]
                    }
                    caption={sortOrder === "asc" ? `Ascending` : `Descending`}
                    className="p-2 mx-2 hover:bg-black-200 rounded-lg transition-colors"
                    iconClassName="text-gray-200"
                    animationType="click" // Use click animation instead of hover
                    onClick={handleOrderToggle} // Only toggles order
                  />
                  <motion.span
                    className={`text-gray-200 cursor-pointer transition-all duration-300 ease-out ${
                      selectedSort.label === option.label
                        ? "font-bold"
                        : "font-light"
                    }`}
                    onClick={() => handleModeChange(option)} // Only changes mode
                  >
                    {option.label}
                  </motion.span>
                </div>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
