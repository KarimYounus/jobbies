import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import JobListItem from "./JobListItem";
import { Job } from "./JobListItem";

interface JobListProps {
  title: string;
  items: any[];
  children?: React.ReactNode;
}

const defaultItems: Job[] = [
  {
    id: "1",
    company: "Tech Corp",
    position: "Software Engineer",
    status: "applied",
    appliedDate: "2023-10-01",
    salary: "$80,000",
    location: "New York, NY",
    notes: "Initial application submitted.",
  },
  {
    id: "2",
    company: "Design Studio",
    position: "UI/UX Designer",
    status: "interview",
    appliedDate: "2023-09-15",
    salary: "$70,000",
    location: "San Francisco, CA",
    notes: "Interview scheduled for next week.",
  },
];

const JobList: React.FC<JobListProps> = ({ title, items, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div className="w-full">
      {/* Header Section */}
      <motion.div
        className="flex flex-col items-start justify-center bg-slate-200 rounded-4xl w-full h-[50px] p-8 shadow-lg cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center justify-between w-full">
          <motion.h2 className="text-2xl font-semibold text-gray-800">
            {title}
          </motion.h2>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-gray-600"
          >
            ▼
          </motion.div>
        </div>
      </motion.div>

      {/* Content Section */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="px-8"
          >
            <div className="mt-4 space-y-2">
              {/* {children ||
                items.map((item, index) => (
                  <div key={index} className="p-4 bg-white rounded-lg shadow">
                    {JSON.stringify(item)}
                  </div>
                ))} */}
                <JobListItem
                  job={defaultItems[0]}
                  onEdit={(job) => console.log("Edit job:", job)}
                  onDelete={(id) => console.log("Delete job with id:", id)}
                />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default JobList;
