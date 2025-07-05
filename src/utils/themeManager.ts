/**
 * Theme management utility for dynamic theme switching.
 * 
 * Design decisions:
 * - Uses CSS custom properties for dynamic theme switching
 * - Centralized theme definitions for maintainability
 * - Simple light/dark theme system that can be extended
 * - Applies theme to document root for global coverage
 */

export type ThemeType = 'light' | 'dark';

/**
 * Theme color definitions
 */
const themes = {
  light: {
    '--theme-background': 'rgba(247, 247, 242)',
    '--theme-text': '#213547',
    '--theme-button-bg': '#f9f9f9',
    '--theme-button-hover': '#747bff',
  },
  dark: {
    '--theme-background': 'rgba(30, 30, 30)',
    '--theme-text': 'rgba(243, 243, 243, 0.87)',
    '--theme-button-bg': '#404040',
    '--theme-button-hover': '#8a92ff',
  }
} as const;

/**
 * Applies the specified theme to the document
 * @param theme - Theme type to apply
 */
export const applyTheme = (theme: ThemeType): void => {
  const root = document.documentElement;
  const themeColors = themes[theme];
  
  // Apply CSS custom properties
  Object.entries(themeColors).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
  
  // Set a data attribute for additional CSS targeting if needed
  root.setAttribute('data-theme', theme);
  
  console.log(`Theme applied: ${theme}`);
};

/**
 * Gets the current theme from the document
 * @returns Current theme type or 'light' as fallback
 */
export const getCurrentTheme = (): ThemeType => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  return currentTheme === 'dark' ? 'dark' : 'light';
};

/**
 * Initializes theme system with the provided theme
 * Should be called during app initialization
 * @param theme - Initial theme to apply
 */
export const initializeTheme = (theme: ThemeType): void => {
  applyTheme(theme);
};
