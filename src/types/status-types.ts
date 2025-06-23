// StatusItem type definition
// This interface describes the structure of a status item used in the job tracking application.
export interface StatusItem {
  text: string;
  color: string;
  round?: number; // Optional field indicating the round of the status, if applicable
  updatedAt?: string; // Optional field to store the last updated date of the status
}

// Default status items for initial state
export const defaultStatusItems: StatusItem[] = [
  { text: "Applied", color: "#184e77" },
  { text: "Assessment Stage", color: "#168aad" },
  { text: "Interview Stage", color: "#76c893" },
  { text: "Offer", color: "#abff4f" },
  { text: "No Response", color: "#F05D23" },
  { text: "Rejected", color: "#ef233c" },
];

// Helper function to get status item by text (identifier)
export const getStatusByText = (text: string): StatusItem | undefined => {
  return Array.from(defaultStatusItems).find((item) => item.text === text);
};

// Helper function to check if a status exists
export const statusExists = (text: string): boolean => {
  return Array.from(defaultStatusItems).some((item) => item.text === text);
};

// Available colors (in hex) for status items
export const statusColors = [
  // TODO
] as const;

// Helper function to get color display name
export const getColorDisplayName = (colorClass: string): string => {
  const colorMap: Record<string, string> = {
    // TODO
  };
  return colorMap[colorClass] || "Unknown";
};
