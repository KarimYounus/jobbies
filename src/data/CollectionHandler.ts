import { JobApplication } from "../types/job-application-types";
import { applicationCollection } from "./application-collection";

/**
 * Groups job applications by their status text.
 *
 * This function takes an array of JobApplication objects and organizes them into a Map,
 * where each key is a status text (e.g., "Applied", "Interview Stage") and the value
 * is an array of applications with that status. This is useful for displaying
 * applications in categorized lists.
 *
 * @param applications - An array of JobApplication objects to be grouped.
 * @returns A Map with status text as keys and arrays of JobApplication objects as values.
 */
const groupApplicationsByStatus = (applications: JobApplication[]): Map<string, JobApplication[]> => {
  // Using a Map to store the grouped applications. Maps are efficient for this kind of key-value storage
  // and retrieval, and they preserve insertion order of keys, which can be useful.
  const grouped = new Map<string, JobApplication[]>();

  // Iterate over each application to place it in the correct group.
  applications.forEach(app => {
    const status = app.status.text; // The status text is used as the key.

    // If a group for this status doesn't exist yet, create it.
    if (!grouped.has(status)) {
      grouped.set(status, []);
    }

    // Add the current application to its corresponding status group.
    grouped.get(status)!.push(app);
  });

  return grouped;
};

/**
 * A pre-processed collection of all job applications, grouped by their status.
 * This Map can be directly used by UI components to render lists of applications
 * for each status category.
 */
export const applicationsByStatus = groupApplicationsByStatus(applicationCollection);
