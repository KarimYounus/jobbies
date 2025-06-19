import React from "react";
import { ApplicationWindowContext } from "../ApplicationWindow";
import ApplicationStatus from "./ApplicationStatus";
import CvImage from "./CVImage";
import CoverLetter from "./CoverLetter";
import ApplicationQuestions from "./ApplicationQuestions";
import Icon from "@mdi/react";
import {
  mdiMapMarker,
  mdiCash,
  mdiCalendar,
  mdiCalendarClock,
} from "@mdi/js";
import { JobApplication } from "../../../types/job-application-types";
import { StatusItem } from "../../../types/status-types";

// Key information section
function KeyInformation(job: JobApplication) {
  return (
    <div className="flex items-center justify-between space-x-6 mx-3">
      {/* Days Ago */}
      <div className="flex items-center space-x-3">
        <Icon path={mdiCalendarClock} size={1} className="text-gray-600" />
        <div>
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
            <p className="font-medium text-black">{job.location}</p>
          </div>
        </div>
      )}
      {/* Salary */}
      {job.salary && (
        <div className="flex items-center space-x-3">
          <Icon path={mdiCash} size={1} className="text-gray-600" />
          <div>
            <p className="font-medium text-black">{job.salary}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Job description section
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
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

// Notes section
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
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

const ViewContent: React.FC = () => {
  const { jobApplication } = React.useContext(ApplicationWindowContext);

  // Defensive: If context is missing or jobApplication is null, render nothing
  if (!jobApplication) {
    console.warn("No job application data available in context.");

    return null};

  // Optionally, you could manage status state here if you want to allow status changes in view mode
  const [currentStatus, setCurrentStatus] = React.useState(jobApplication.status);

  const handleStatusChange = (newStatus: StatusItem) => {
    setCurrentStatus(newStatus);
    // Optionally: update status in context or backend here
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
      {/* Key Information */}
      <div className="mb-6">{KeyInformation(jobApplication)}</div>

      {/* Application Status */}
      <div className="mb-6">
        <ApplicationStatus
          statusItem={currentStatus}
          onChangeStatus={handleStatusChange}
        />
      </div>

      {/* Top Portion (CV and Job Description) */}
      <div className="flex justify-between items-start pb-4 border-t border-gray-200 pt-6">
        {CvImage(jobApplication.cv)}
        {JobDescription(jobApplication.description || "No job description available.")}
      </div>

      {/* Notes Section */}
      <div className="mt-6">
        {jobApplication.notes && Notes(jobApplication.notes || "No notes yet.")}
      </div>

      {/* Cover Letter */}
      {jobApplication.coverLetter && (
        <div className="py-3 border-t border-gray-200 ">
          {CoverLetter(jobApplication.coverLetter || "No cover letter provided.")}
        </div>
      )}

      {/* Application Questions */}
      {jobApplication.questions && (
        <div className="pt-3 border-t border-gray-200">
          {ApplicationQuestions(jobApplication.questions)}
        </div>
      )}
    </div>
  );
}
export default ViewContent;