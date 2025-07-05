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
  mdiFileCancel,
} from "@mdi/js";
import AnimatedButton from "../General/AnimatedButton";
import { ApplicationWindowContext } from "./ApplicationWindow";
import { motion } from "framer-motion";

interface HeaderProps {
  onClose: () => void;
  onDelete: () => void;
  onSave: () => void;
}

const Header: React.FC<HeaderProps> = ({ onClose, onDelete, onSave }) => {
  const { jobApplication, isEditing, setIsEditing } = React.useContext(
    ApplicationWindowContext
  );

  if (!jobApplication) {
    throw new Error("Job application data is not available inside Header");
  }
  return (
    <div
      className="sticky top-0 z-10 rounded-t-lg border-b border-gray-200"
      style={{
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
      }}
    >
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-4">
          {isEditing ? (
            <motion.div
              className="p-2 bg-teal-100/50 rounded-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Icon
                path={mdiApplicationEditOutline}
                size={1.5}
                className="text-gray-600"
              />
            </motion.div>
          ) : (
            <motion.div
              className="p-2 bg-teal-100/50 rounded-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Icon
                path={mdiOfficeBuilding}
                size={1.3}
                className="text-gray-600"
              />
            </motion.div>
          )}
          <div>
            <h2 className="text-2xl font-bold text-black">
              {isEditing ? "Edit Application" : jobApplication.position}
            </h2>
            {!isEditing && (
              <p className="text-lg text-gray-700">{jobApplication.company}</p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2 bg-gray-100 rounded-4xl p-2">
            {!isEditing && (
              <>
                {jobApplication.link && (
                  <AnimatedButton
                    icon={mdiWeb}
                    onClick={() =>
                      window.open(
                        jobApplication.link,
                        "_blank",
                        "noopener,noreferrer"
                      )
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
                  onClick={onDelete}
                  caption="Delete job"
                  className="p-2 hover:bg-red-100 rounded-full transition-colors cursor-pointer"
                />
              </>
            )}
            {isEditing && (
              <>
                <AnimatedButton
                  icon={mdiFileCancel}
                  onClick={() => setIsEditing(false)}
                  caption="Discard changes"
                  className="p-2 hover:bg-red-100 rounded-full transition-colors cursor-pointer"
                />
                <AnimatedButton
                  icon={mdiContentSave}
                  onClick={onSave}
                  caption="Save"
                  className="p-2 hover:bg-green-100 rounded-full transition-colors cursor-pointer"
                />
              </>
            )}
          </div>
          <AnimatedButton
            icon={mdiClose}
            onClick={onClose}
            caption="Close"
            captionPosition="left"
            className="p-2 hover:bg-red-200 rounded-full transition-colors cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
