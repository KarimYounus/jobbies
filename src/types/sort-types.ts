/**
 * Sort configuration types for job application sorting functionality.
 * 
 * Design decisions:
 * - Simple field-based sorting with clear order specification
 * - Extensible for future sort criteria (salary, location, etc.)
 * - Immutable sorting approach to maintain React optimization
 */

export interface SortConfig {
  field: 'date' | 'company';
  order: 'asc' | 'desc';
}

/**
 * Maps SortOverlay labels to SortConfig fields for consistent data flow.
 */
export const sortLabelToField: Record<string, SortConfig['field']> = {
  'Date Created': 'date',
  'Alphabetical (Company)': 'company'
};
