import React from "react";
import { motion } from "framer-motion";
import Icon from "@mdi/react";
import { mdiMapMarker, mdiCash, mdiCalendarClock } from "@mdi/js";
import { Job } from "../types/job-types";

interface JobListItemProps {
  job: Job;
  onEdit?: (job: Job) => void;
  onDelete?: (jobId: string) => void;
  onView?: (job: Job) => void;
}

const JobListItem: React.FC<JobListItemProps> = ({
  job,
  onEdit,
  onDelete,
  onView,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 0px 12px rgba(255, 255, 255, 0.5)",
        cursor: "pointer",
      }}
      onClick={() => {
        onView?.(job);
      }}
      // style={{ backgroundColor: "rgba(219, 255, 246, 1.0)" }}
      className="py-4 rounded-xl shadow-md hover:shadow-lg transition-shadow font-ivysoft bg-gray-50"
    >
      <div className="flex justify-between items-center px-6">
        <div className="flex flex-col gap-1 justify-center items-start text-xl font-semibold">
          <h3 className="text-black">{job.position}</h3>
          <p className="text-gray-800 text-sm">{job.company}</p>
        </div>

        <div className="flex items-center space-x-6 font-medium">
          {/* Date */}
          <div className="flex items-center space-x-2">
            <Icon path={mdiCalendarClock} size={1} className="text-gray-600" />
            <div>
              {/* <p className="text-sm text-gray-600">Days Since App.</p> */}
              <p className="text-sm text-black font-medium">
                {Math.floor(
                  (new Date().getTime() - new Date(job.appliedDate).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                days ago
              </p>
            </div>
          </div>

          {/* Location */}
          {job.location && (
            <div className="flex items-center space-x-2">
              <Icon path={mdiMapMarker} size={1} className="text-gray-600" />
              <span className="text-sm text-gray-800">{job.location}</span>
            </div>
          )}

          {/* Salary */}
          {job.salary && (
            <div className="flex items-center space-x-2">
              <Icon path={mdiCash} size={1} className="text-gray-600" />
              <span className="text-sm text-gray-800">{job.salary}</span>
            </div>
          )}
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
