import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import JobListItem from "./JobListItem";
import { JobApplication, defaultItems } from "../types/job-application-types"; 
import ApplicationWindow from "./ApplicationWindow/ApplicationWindow";

interface JobListProps {
  title: string;
  items: any[];
  children?: React.ReactNode;
}

const JobList: React.FC<JobListProps> = ({ title, items, children }) => {
  const [isExpanded, setIsExpanded] = useState(false); // State to track if the list is expanded

  // State to manage selected job and job view modal
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);
  const [isJobViewOpen, setIsJobViewOpen] = useState(false);

  // Function to handle job selection for viewing details
  const handleJobView = (job: JobApplication) => {
    setSelectedJob(job);
    setIsJobViewOpen(true);
  }

  // Function to close the job view modal
  const handleCloseJobView = () => {
    setSelectedJob(null);
    setIsJobViewOpen(false);
  }

  // Placeholder function to handle job editing
  const handleJobEdit = (job: JobApplication) => {
    console.log("Edit job:", job);
    // Implement edit logic here
  }

  // State to track content and header heights for animation
  const [contentHeight, setContentHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Function called when isExpanded changes to update heights
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, [isExpanded]);

  return (
    <motion.div
      className="flex flex-col w-full text-white rounded-xl shadow-lg overflow-hidden"
      initial={{ height: headerHeight }}
      animate={{
        height: isExpanded ? headerHeight + contentHeight : headerHeight,
      }}
      transition={{
        duration: 0.4,
        ease: [0.85, 0, 0.15, 1],
      }}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)'}}
    >
      {/* Header Section */}
      <motion.div
        ref={headerRef}
        className="flex items-center justify-between w-full px-8 py-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.h2 className={`text-2xl font-ivysoft tracking-wide ${isExpanded ? "font-bold" : "font-normal"}`}>
          {title}
        </motion.h2>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-white"
        >
          ▼
        </motion.div>
      </motion.div>

      {/* Content Section */}
      <motion.div
        ref={contentRef}
        initial={{ opacity: 0 }}
        animate={{
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{
          opacity: { duration: 0.3, delay: isExpanded ? 0.2 : 0 },
        }}
        className="px-8 pb-8"
      >
        <div className="space-y-2">
          <JobListItem
            job={defaultItems[0]}
            onEdit={(job) => console.log("Edit job:", job)}
            onDelete={(id) => console.log("Delete job with id:", id)}
            onView={handleJobView}
          />
          <JobListItem
            job={defaultItems[1]}
            onEdit={(job) => console.log("Edit job:", job)}
            onDelete={(id) => console.log("Delete job with id:", id)}
            onView={handleJobView}
          />
        </div>
      </motion.div>

      <ApplicationWindow
        jobApplication={selectedJob}
        isOpen={isJobViewOpen}
        onClose={handleCloseJobView}
      />

    </motion.div>
  );
};

export default JobList;
