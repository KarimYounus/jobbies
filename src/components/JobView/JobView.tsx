import React from "react";
import AnimatedButton from "../AnimatedButton";
import ApplicationQuestions from "./ApplicationQuestions";
import CvImage from "./CVImage";
import CoverLetter from "./CoverLetter";
import ApplicationStatus from "./ApplicationStatus";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "@mdi/react";
import {
  mdiClose,
  mdiMapMarker,
  mdiCash,
  mdiCalendar,
  mdiOfficeBuilding,
  mdiCalendarClock,
  mdiWeb,
  mdiApplicationEditOutline,
  mdiDeleteOutline,
  mdiCodeJson,
} from "@mdi/js";
import { Job } from "../../types/job-types";

interface JobViewProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (job: Job) => void;
  onDelete?: (jobId: string) => void;
}

const JobView: React.FC<JobViewProps> = ({
  job,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!job) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.85, 0, 0.15, 1] }}
            className="w-full mx-20 rounded-lg shadow-2xl font-ivysoft flex flex-col max-h-[90vh]"
            style={{ backgroundColor: "rgba(255, 255, 255, 1.0)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Fixed Header */}
            <div className="sticky top-0 z-10 rounded-t-lg border-b border-gray-200 bg-white/10 backdrop-blur-md">
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center space-x-4">
                  <Icon
                    path={mdiOfficeBuilding}
                    size={1.5}
                    className="text-gray-600"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-black">
                      {job.position}
                    </h2>
                    <p className="text-lg text-gray-700">{job.company}</p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex space-x-2">
                  {/* Website Link Button */}
                  {job.link && (
                    <AnimatedButton
                      icon={mdiWeb}
                      onClick={() =>
                        window.open(job.link, "_blank", "noopener,noreferrer")
                      }
                      caption="Open job link"
                      captionPosition="left"
                      className="p-2 hover:bg-blue-100 rounded-full transition-colors cursor-pointer"
                    />
                  )}

                  {/* Export to JSON Button */}
                  <AnimatedButton
                    icon={mdiCodeJson}
                    onClick={() => console.log("Export to JSON clicked")}
                    caption="Copy to JSON"
                    captionPosition="left"
                    className="p-2 hover:bg-orange-100 rounded-full transition-colors cursor-pointer"
                  />

                  {/* Edit Button */}
                  <AnimatedButton
                    icon={mdiApplicationEditOutline}
                    onClick={() => onEdit?.(job)}
                    caption="Edit job"
                    className="p-2 hover:bg-yellow-100 rounded-full transition-colors cursor-pointer"
                  />

                  {/* Delete Button */}
                  <AnimatedButton
                    icon={mdiDeleteOutline}
                    onClick={() => onDelete?.(job.id)}
                    caption="Delete job"
                    className="p-2 hover:bg-red-100 rounded-full transition-colors cursor-pointer"
                  />
                </div>

                <AnimatedButton
                  icon={mdiClose}
                  onClick={onClose}
                  caption="Close"
                  captionPosition="left"
                />
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
              {/* Key Information */}
              <div className="mb-6">{KeyInformation(job)}</div>

              {/* Application Status */}
              <div className="mb-6">{ApplicationStatus(job.status)}</div>

              {/* Top Portion (CV and Job Description) */}
              <div className="flex justify-between items-start pb-4 border-t border-gray-200 pt-6">
                {CvImage(job.cv)}
                {JobDescription(
                  job.description || "No job description available."
                )}
              </div>

              {/* Notes Section */}
              <div className="mt-6">
                {job.notes && Notes(job.notes || "No notes yet.")}
              </div>

              {/* Cover Letter */}
              {job.coverLetter && (
                <div className="py-3 border-t border-gray-200 ">
                  {CoverLetter(job.coverLetter || "No cover letter provided.")}
                </div>
              )}

              {/* Application Questions */}
              {job.questions && (
                <div className="pt-3 border-t border-gray-200">
                  {ApplicationQuestions(job.questions)}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JobView;

// Function to render key information about the job
function KeyInformation(job: Job) {
  return (
    <div className="flex items-center justify-between space-x-6 mx-3">
      {/* Days Ago */}
      <div className="flex items-center space-x-3">
        <Icon path={mdiCalendarClock} size={1} className="text-gray-600" />

        <div>
          {/* <p className="text-sm text-gray-600">Days Since App.</p> */}
          <p className=" text-black font-medium">
            {Math.floor(
              (new Date().getTime() - new Date(job.appliedDate).getTime()) /
                (1000 * 60 * 60 * 24)
            )}{" "}
            days ago
          </p>
        </div>
      </div>

      {/* Applied Date */}
      <div className="flex items-center space-x-3">
        <Icon path={mdiCalendar} size={1} className="text-gray-600" />
        <div>
          {/* <p className="text-sm text-gray-600">Applied Date</p> */}
          <p className="font-medium text-black">
            {new Date(job.appliedDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Location */}
      {job.location && (
        <div className="flex items-center space-x-3">
          <Icon path={mdiMapMarker} size={1} className="text-gray-600" />
          <div>
            {/* <p className="text-sm text-gray-600">Location</p> */}
            <p className="font-medium text-black">{job.location}</p>
          </div>
        </div>
      )}

      {/* Salary */}
      {job.salary && (
        <div className="flex items-center space-x-3">
          <Icon path={mdiCash} size={1} className="text-gray-600" />
          <div>
            {/* <p className="text-sm text-gray-600">Salary</p> */}
            <p className="font-medium text-black">{job.salary}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function JobDescription(description: string) {
  return (
    <div className="flex-1 ml-6">
      <h3 className="text-lg font-semibold text-black mb-2">Job Description</h3>
      <div className="relative">
        <div className="max-h-95 w-full overflow-y-auto no-scrollbar scrollbar-track-white-100 text-justify">
          <p className="text-gray-800 leading-relaxed text-sm pb-20">
            {description || "No job description available."}
          </p>
        </div>
        {/* Fading gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

function Notes(noteText: string) {
  return (
    <div className="flex-1 border-t border-gray-200 pt-4">
      <h3 className="text-lg font-semibold text-black mb-2">Notes</h3>
      <div className="relative">
        <div className="max-h-95 overflow-y-auto no-scrollbar scrollbar-track-white-100 text-justify">
          <p className="text-gray-800 leading-relaxed text-sm mb-10">
            {noteText || "No notes available."}
          </p>
        </div>
        {/* Fading gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
