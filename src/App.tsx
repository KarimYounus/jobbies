import AnimatedButton from "./components/General/AnimatedButton";
import { motion } from "motion/react";
import JobList from "./components/JobList";
import { mdiNotePlusOutline, mdiSort } from "@mdi/js";
import { applicationHandler } from "./data/ApplicationHandler";
import { useEffect, useState } from "react";
import { JobApplication } from "./types/job-application-types";
import ApplicationWindow from "./components/ApplicationWindow/ApplicationWindow";
import { StatusItem } from "./types/status-types";
import { SortOverlay } from "./components/SortOverlay";
import { SortConfig } from "./types/sort-types";
import { AutoUpdatePopup } from "./components/AutoUpdatePopup";

function App() {
  // State to hold the applications grouped by status
  const [applicationsByStatus, setApplicationsByStatus] = useState<
    Map<StatusItem, JobApplication[]>
  >(new Map());  const [isLoading, setIsLoading] = useState(true);
  const [isJobViewOpen, setIsJobViewOpen] = useState(false);
  const [isSortOverlayOpen, setIsSortOverlayOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [newApplication, setNewApplication] = useState<JobApplication | null>(
    null
  );
  
  // State for auto-update popup
  const [showAutoUpdatePopup, setShowAutoUpdatePopup] = useState(false);
  const [autoUpdateCount, setAutoUpdateCount] = useState(0);
  const [autoUpdateApplications, setAutoUpdateApplications] = useState<Array<{company: string, position: string}>>([]);// Handler for creating a new application
  
  const handleAddJobClick = () => {
    const freshApplication = applicationHandler.createNewApplication();
    setNewApplication(freshApplication);
    setIsJobViewOpen(true);
  };
  
  // Initialize the collection handler and set up event listeners
  useEffect(() => {
    const initializeData = async () => {
      try {
        await applicationHandler.initialize();
        setApplicationsByStatus(applicationHandler.getApplicationsByStatus(sortConfig || undefined));
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to initialize data:", error);
        setIsLoading(false);
      }
    };    // Event listeners for data changes to keep UI reactive
    const handleDataChange = () => {
      setApplicationsByStatus(applicationHandler.getApplicationsByStatus(sortConfig || undefined));
    };

    // Event listener for auto-updates
    const handleAutoUpdate = (event: CustomEvent) => {
      const count = event.detail?.count || 0;
      const applications = event.detail?.applications || [];
      
      if (count > 0) {
        setAutoUpdateCount(count);
        setAutoUpdateApplications(applications);
        setShowAutoUpdatePopup(true);
      }
      // Also refresh the applications display
      handleDataChange();
    };

    applicationHandler.addEventListener(
      "applications-loaded",
      handleDataChange
    );
    applicationHandler.addEventListener("application-added", handleDataChange);
    applicationHandler.addEventListener(
      "application-updated",
      handleDataChange
    );
    applicationHandler.addEventListener(
      "application-deleted",
      handleDataChange
    );
    applicationHandler.addEventListener(
      "applications-auto-updated",
      handleAutoUpdate as EventListener
    );

    initializeData();

    // Cleanup event listeners on component unmount
    return () => {
      applicationHandler.removeEventListener(
        "applications-loaded",
        handleDataChange
      );
      applicationHandler.removeEventListener(
        "application-added",
        handleDataChange
      );
      applicationHandler.removeEventListener(
        "application-updated",
        handleDataChange
      );      applicationHandler.removeEventListener(
        "application-deleted",
        handleDataChange
      );
      applicationHandler.removeEventListener(
        "applications-auto-updated",
        handleAutoUpdate as EventListener
      );
    };
  }, [sortConfig]); // Re-run when sort configuration changes

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
        <motion.img
          src="src/assets/images/logo-trans.png"
          alt="Logo"
          className="flex h-20 p-2"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
        />

        {/* Buttons */}
        <motion.div className="flex gap-4 pr-5">
          <AnimatedButton
            icon={mdiSort}
            caption="Sort Applications"
            className="p-2 mx-3 hover:bg-teal-200 rounded-lg transition-colors cursor-pointer"
            iconClassName="text-gray-200 hover:text-gray-800"
            onClick={() => setIsSortOverlayOpen(true)}
          />
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
            <p className="text-white text-sm mt-2">
              Create a new application to see them here
            </p>
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
      />      <SortOverlay
        isOpen={isSortOverlayOpen}
        onClose={() => setIsSortOverlayOpen(false)}        onSort={(sort) => {
          setSortConfig(sort);
          // Keep overlay open for multiple selections
        }}      />
      
      <AutoUpdatePopup
        isVisible={showAutoUpdatePopup}
        count={autoUpdateCount}
        applications={autoUpdateApplications}
        onClose={() => setShowAutoUpdatePopup(false)}
      />
    </motion.div>
  );
}

export default App;
