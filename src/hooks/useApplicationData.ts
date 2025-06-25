import { useEffect, useState } from "react";
import { applicationHandler } from "../data/ApplicationHandler";
import { JobApplication } from "../types/job-application-types";
import { StatusItem } from "../types/status-types";
import { SortConfig } from "../types/sort-types";

/**
 * Custom hook for managing application data state and event handling.
 * 
 * Encapsulates:
 * - Application data initialization and loading
 * - Event listener setup and cleanup
 * - Auto-update popup state management
 * - Data refresh triggers
 */
export const useApplicationData = (sortConfig: SortConfig | null) => {
  const [applicationsByStatus, setApplicationsByStatus] = useState<
    Map<StatusItem, JobApplication[]>
  >(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [autoUpdateCount, setAutoUpdateCount] = useState(0);
  const [autoUpdateApplications, setAutoUpdateApplications] = useState<
    Array<{ company: string; position: string }>
  >([]);
  const [showAutoUpdatePopup, setShowAutoUpdatePopup] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      try {
        await applicationHandler.initialize();
        setApplicationsByStatus(
          applicationHandler.getApplicationsByStatus(sortConfig || undefined)
        );
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to initialize data:", error);
        setIsLoading(false);
      }
    };

    // Event handlers for reactive updates
    const handleDataChange = () => {
      setApplicationsByStatus(
        applicationHandler.getApplicationsByStatus(sortConfig || undefined)
      );
    };

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

    // Register event listeners
    const events = [
      { name: "applications-loaded", handler: handleDataChange },
      { name: "application-added", handler: handleDataChange },
      { name: "application-updated", handler: handleDataChange },
      { name: "application-deleted", handler: handleDataChange },
      { name: "applications-auto-updated", handler: handleAutoUpdate as EventListener },
    ] as const;

    events.forEach(({ name, handler }) => {
      applicationHandler.addEventListener(name, handler);
    });

    initializeData();

    // Cleanup event listeners
    return () => {
      events.forEach(({ name, handler }) => {
        applicationHandler.removeEventListener(name, handler);
      });
    };
  }, [sortConfig]);

  return {
    applicationsByStatus,
    isLoading,
    autoUpdateCount,
    autoUpdateApplications,
    showAutoUpdatePopup,
    setShowAutoUpdatePopup,
  };
};
