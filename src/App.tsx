import AnimatedButton from "./components/General/AnimatedButton";
import { motion } from "motion/react";
import JobList from "./components/JobList";
import { mdiNotePlusOutline } from "@mdi/js";
import { collectionHandler } from "./data/ApplicationHandler";
import { useEffect, useState } from "react";
import { JobApplication } from "./types/job-application-types";
import ApplicationWindow from "./components/ApplicationWindow/ApplicationWindow";
import { StatusItem } from "./types/status-types";

function App() {
  // State to hold the applications grouped by status
  const [applicationsByStatus, setApplicationsByStatus] = useState<
    Map<StatusItem, JobApplication[]>
  >(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [isJobViewOpen, setIsJobViewOpen] = useState(false);
  const [newApplication, setNewApplication] = useState<JobApplication | null>(
    null
  );

  // Handler for creating a new application
  const handleAddJobClick = () => {
    const freshApplication = collectionHandler.createNewApplication();
    setNewApplication(freshApplication);
    setIsJobViewOpen(true);
  };

  // Initialize the collection handler and set up event listeners
  useEffect(() => {
    const initializeData = async () => {
      try {
        await collectionHandler.initialize();
        setApplicationsByStatus(collectionHandler.getApplicationsByStatus());
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to initialize data:", error);
        setIsLoading(false);
      }
    };

    // Event listeners for data changes to keep UI reactive
    const handleDataChange = () => {
      setApplicationsByStatus(collectionHandler.getApplicationsByStatus());
    };

    collectionHandler.addEventListener("applications-loaded", handleDataChange);
    collectionHandler.addEventListener("application-added", handleDataChange);
    collectionHandler.addEventListener("application-updated", handleDataChange);
    collectionHandler.addEventListener("application-deleted", handleDataChange);

    initializeData();

    // Cleanup event listeners on component unmount
    return () => {
      collectionHandler.removeEventListener(
        "applications-loaded",
        handleDataChange
      );
      collectionHandler.removeEventListener(
        "application-added",
        handleDataChange
      );
      collectionHandler.removeEventListener(
        "application-updated",
        handleDataChange
      );
      collectionHandler.removeEventListener(
        "application-deleted",
        handleDataChange
      );
    };
  }, []);

  // Show loading state while data is being initialized
  if (isLoading) {
    return (
      <motion.div className="flex flex-col w-full justify-center items-center font-ivysoft">
        <motion.div
          className="text-center text-white mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xl">Loading Applications...</p>
        </motion.div>
      </motion.div>
    );
  }
  return (
    <motion.div className="flex flex-col w-full justify-center items-center font-ivysoft">
      {/* Header Section */}
      <motion.div
        className="flex flex-row items-center justify-between w-full pl-5 mb-2 backdrop-blur-6xl shadow-xl"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.85, 0, 0.15, 1] }}
      >
        {/* Logo */}
        <div className="w-10"></div>
        <motion.img
          src="src/assets/images/logo-trans.png"
          alt="Logo"
          className="flex h-20"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
        />

        {/* Buttons */}
        <motion.div className="flex gap-4 pr-5">
          {" "}
          <AnimatedButton
            icon={mdiNotePlusOutline}
            caption="Add Job"
            className="p-2 mx-3 hover:bg-teal-200 rounded-lg transition-colors cursor-pointer"
            iconClassName="text-gray-200 hover:text-gray-800"
            onClick={handleAddJobClick}
          />
        </motion.div>
      </motion.div>
      {/* Main Content Section - Job Lists */}
      <motion.div className="flex flex-col items-center w-full gap-4 px-4 mt-2">
        {applicationsByStatus.size === 0 ? (
          <motion.div
            className="text-center text-gray-500 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-white text-xl">No Job Applications</p>
            <p className="text-white text-sm mt-2">Create a new application to see them here</p>
          </motion.div>
        ) : (
          Array.from(applicationsByStatus.entries()).map(
            ([status, applications]) => (
              <JobList key={status.text} status={status} items={applications} />
            )
          )
        )}
      </motion.div>
      <ApplicationWindow
        isOpen={isJobViewOpen}
        onClose={() => setIsJobViewOpen(false)}
        jobApplication={newApplication}
        createNew={true}
      />
    </motion.div>
  );
}

export default App;
