import AnimatedButton from "./components/General/AnimatedButton";
import { motion } from "motion/react";
import JobList from "./components/HomeView/JobList";
import {
  mdiCogOutline,
  mdiNotePlusOutline,
  mdiSort,
  mdiTextBoxOutline,
} from "@mdi/js";
import { applicationHandler } from "./data/ApplicationHandler";
import { useState } from "react";
import { JobApplication } from "./types/job-application-types";
import ApplicationWindow from "./components/ApplicationWindow/ApplicationWindow";
import { SortOverlay } from "./components/HomeView/SortOverlay";
import { SortConfig } from "./types/sort-types";
import { AutoUpdatePopup } from "./components/HomeView/AutoUpdatePopup";
import SettingsWindow from "./components/SettingsWindow/SettingsWindow";
import { SettingsProvider, useSettings } from "./components/SettingsWindow/SettingsContext";
import { useApplicationData } from "./hooks/useApplicationData";
import { useSettingsIntegration } from "./hooks/useSettingsIntegration";
import CVCollectionWindow from "./components/CVCollection/CVCollectionWindow";

function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}

function AppContent() {
  const { settings } = useSettings();

  // UI state
  const [newApplication, setNewApplication] = useState<JobApplication | null>(null);
  const [isJobViewOpen, setIsJobViewOpen] = useState(false);
  const [isSortOverlayOpen, setIsSortOverlayOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCVCollectionOpen, setIsCVCollectionOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // Custom hooks for complex logic
  const {
    applicationsByStatus,
    isLoading,
    autoUpdateCount,
    autoUpdateApplications,
    showAutoUpdatePopup,
    setShowAutoUpdatePopup,
  } = useApplicationData(sortConfig);

  // Apply settings to ApplicationHandler
  useSettingsIntegration(settings, sortConfig, setSortConfig);

  // Handler functions
  const handleAddJobClick = () => {
    const freshApplication = applicationHandler.createNewApplication();
    setNewApplication(freshApplication);
    setIsJobViewOpen(true);
  };

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
            icon={mdiNotePlusOutline}
            caption="Add Job"
            className="p-2 mx-3 hover:bg-teal-200 rounded-lg transition-colors cursor-pointer"
            iconClassName="text-gray-200 hover:text-gray-800"
            onClick={handleAddJobClick}
          />
          <AnimatedButton
            icon={mdiSort}
            caption="Sort Applications"
            className="p-2 mx-3 hover:bg-teal-200 rounded-lg transition-colors cursor-pointer"
            iconClassName="text-gray-200 hover:text-gray-800"
            onClick={() => setIsSortOverlayOpen(true)}
          />
          <AnimatedButton
            icon={mdiTextBoxOutline}
            caption="CV Collection"
            className="p-2 mx-3 hover:bg-teal-200 rounded-lg transition-colors cursor-pointer"
            iconClassName="text-gray-200 hover:text-gray-800"
            onClick={() => setIsCVCollectionOpen(true)}
          />
          <AnimatedButton
            icon={mdiCogOutline}
            caption="Settings"
            className="p-2 mx-3 hover:bg-teal-200 rounded-lg transition-colors cursor-pointer"
            iconClassName="text-gray-200 hover:text-gray-800"
            onClick={() => setIsSettingsOpen(true)}
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
      />{" "}
      <SortOverlay
        isOpen={isSortOverlayOpen}
        onClose={() => setIsSortOverlayOpen(false)}
        onSort={(sort) => {
          setSortConfig(sort);
        }}
      />
      <AutoUpdatePopup
        isVisible={showAutoUpdatePopup}
        count={autoUpdateCount}
        applications={autoUpdateApplications}
        onClose={() => setShowAutoUpdatePopup(false)}
      />
      <SettingsWindow
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      <CVCollectionWindow
        isOpen={isCVCollectionOpen}
        onClose={() => setIsCVCollectionOpen(false)}
      />
    </motion.div>
  );
}

export default App;
