import React from "react";

interface DropdownOption {
  value: string;
  label: string;
}

interface BaseSettingItemProps {
  label: string;
  description: string;
  disabled?: boolean;
}

interface ToggleSettingItemProps extends BaseSettingItemProps {
  type: "toggle";
  value: boolean;
  onChange: (value: boolean) => void;
}

interface SliderSettingItemProps extends BaseSettingItemProps {
  type: "slider";
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  unit?: string;
}

interface DropdownSettingItemProps extends BaseSettingItemProps {
  type: "dropdown";
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
}

type SettingItemProps = ToggleSettingItemProps | SliderSettingItemProps | DropdownSettingItemProps;

/**
 * Reusable setting item component for different control types.
 * Provides consistent styling and behavior across all setting controls.
 * 
 * Design decisions:
 * - Union type approach for type-safe props based on control type
 * - Consistent layout with label, description, and control
 * - Disabled state handling across all control types
 * - Tailwind styling for modern appearance
 */
const SettingItem: React.FC<SettingItemProps> = (props) => {
  const { label, description, disabled = false } = props;

  return (
    <div className={`flex items-start justify-between space-x-4 py-3 ${disabled ? 'opacity-50' : ''}`}>
      {/* Label and Description */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-800 mb-1">
          {label}
        </div>
        <div className="text-xs text-gray-600 leading-relaxed">
          {description}
        </div>
      </div>

      {/* Control */}
      <div className="flex-shrink-0">
        {props.type === "toggle" && (
          <ToggleControl
            value={props.value}
            onChange={props.onChange}
            disabled={disabled}
          />
        )}

        {props.type === "slider" && (
          <SliderControl
            value={props.value}
            onChange={props.onChange}
            min={props.min || 1}
            max={props.max || 100}
            unit={props.unit}
            disabled={disabled}
          />
        )}

        {props.type === "dropdown" && (
          <DropdownControl
            value={props.value}
            onChange={props.onChange}
            options={props.options}
            disabled={disabled}
          />
        )}
      </div>
    </div>
  );
};

/**
 * Toggle switch control component.
 */
const ToggleControl: React.FC<{
  value: boolean;
  onChange: (value: boolean) => void;
  disabled: boolean;
}> = ({ value, onChange, disabled }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => !disabled && onChange(!value)}
      disabled={disabled}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-200 focus:ring-offset-2 disabled:cursor-not-allowed
        ${value ? 'bg-teal-500' : 'bg-gray-200'}
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${value ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  );
};

/**
 * Slider control component with value display.
 */
const SliderControl: React.FC<{
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  unit?: string;
  disabled: boolean;
}> = ({ value, onChange, min, max, unit, disabled }) => {
  return (
    <div className="flex items-center justify-end space-x-3 w-32">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        disabled={disabled}
        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
      />
      <div className="text-sm text-gray-600 min-w-0 flex-shrink-0">
        {value}{unit && ` ${unit}`}
      </div>
    </div>
  );
};

/**
 * Dropdown select control component.
 */
const DropdownControl: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  disabled: boolean;
}> = ({ value, onChange, options, disabled }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className="block w-48 px-3 py-2 text-sm border border-gray-300 text-black rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default SettingItem;
