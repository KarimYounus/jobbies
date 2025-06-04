import React from "react";
import { motion } from "framer-motion";

export interface Job {
  id: string;
  company: string;
  position: string;
  status: "applied" | "interview" | "rejected" | "offer" | "archived";
  appliedDate: string;
  salary?: string;
  location?: string;
  notes?: string;
}

interface JobListItemProps {
  job: Job;
  onEdit?: (job: Job) => void;
  onDelete?: (jobId: string) => void;
}

const JobListItem: React.FC<JobListItemProps> = ({ job, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 bg-teal-200 rounded-4xl shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-center px-4">
        
        <div className="flex gap-1 justify-center items-center text-xl font-semibold">
          <h3 className=" text-gray-900">
            {job.position} - 
          </h3>
          <p className="text-gray-600">{job.company}</p>
        </div>

        <div className="flex items-center space-x-6">
          {/* Location */}
          {job.location && (
            <p className="text-sm text-gray-600">📍 {job.location}</p>
          )}

          {/* Salary */}
          {job.salary && (
            <p className="text-sm text-gray-600">💰 {job.salary}</p>
          )}

          {/* Date */}
          <div className="text-sm text-gray-500">
            Applied: {new Date(job.appliedDate).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* {job.notes && (
        <p className="text-sm text-gray-700 mt-2 p-2 bg-gray-50 rounded">
          {job.notes}
        </p>
      )} */}
    </motion.div>
  );
};

export default JobListItem;
