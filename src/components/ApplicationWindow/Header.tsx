import React from "react";
import Icon from "@mdi/react";
import {
  mdiOfficeBuilding,
  mdiWeb,
  mdiCodeJson,
  mdiApplicationEditOutline,
  mdiDeleteOutline,
  mdiClose,
  mdiContentSave,
} from "@mdi/js";
import AnimatedButton from "../AnimatedButton";
import { ApplicationWindowContext } from "./ApplicationWindow";
import { JobApplication } from "../../types/job-application-types";

interface HeaderProps {
  job: JobApplication;
  onClose: () => void;
  onDelete: (jobId: string) => void;
  onSave: () => void;
}

const Header: React.FC<HeaderProps> = ({ job, onClose, onDelete, onSave }) => {
  const { isEditing, setIsEditing } = React.useContext(ApplicationWindowContext);

  return (
    <div className="sticky top-0 z-10 rounded-t-lg border-b border-gray-200 bg-white/10 backdrop-blur-md h-[17vh]">
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-4">
          {isEditing ? (
            <Icon
              path={mdiApplicationEditOutline}
              size={1.5}
              className="text-gray-600"
            />
          ) : (
            <Icon
              path={mdiOfficeBuilding}
              size={1.5}
              className="text-gray-600"
            />
          )}
          <div>
            <h2 className="text-2xl font-bold text-black">
              {isEditing ? "Edit Application" : job.position}
            </h2>
            {!isEditing && (
              <p className="text-lg text-gray-700">{job.company}</p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-2">
          {!isEditing && (
            <>
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
              <AnimatedButton
                icon={mdiCodeJson}
                onClick={() => console.log("Export to JSON clicked")}
                caption="Copy to JSON"
                captionPosition="left"
                className="p-2 hover:bg-orange-100 rounded-full transition-colors cursor-pointer"
              />
              <AnimatedButton
                icon={mdiApplicationEditOutline}
                onClick={() => setIsEditing(true)}
                caption="Edit job"
                className="p-2 hover:bg-yellow-100 rounded-full transition-colors cursor-pointer"
              />
              <AnimatedButton
                icon={mdiDeleteOutline}
                onClick={() => onDelete?.(job.id)}
                caption="Delete job"
                className="p-2 hover:bg-red-100 rounded-full transition-colors cursor-pointer"
              />
            </>
          )}
          {isEditing && (
            <AnimatedButton
              icon={mdiContentSave}
              onClick={onSave}
              caption="Save"
              className="p-2 hover:bg-green-100 rounded-full transition-colors cursor-pointer"
            />
          )}
        </div>

        <AnimatedButton
          icon={mdiClose}
          onClick={onClose}
          caption="Close"
          captionPosition="left"
        />
      </div>
    </div>
  );
};

export default Header;
