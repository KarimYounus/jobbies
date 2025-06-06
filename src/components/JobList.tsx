import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
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
  const [contentHeight, setContentHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

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
      className="flex flex-col w-full text-white rounded-sm shadow-lg overflow-hidden"
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
          />
          <JobListItem
            job={defaultItems[1]}
            onEdit={(job) => console.log("Edit job:", job)}
            onDelete={(id) => console.log("Delete job with id:", id)}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default JobList;
