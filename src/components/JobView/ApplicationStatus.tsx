import { motion, AnimatePresence } from "framer-motion";
import { StatusItem, defaultStatusItems } from "../../types/status-types";
import AnimatedButton from "../AnimatedButton";
import { mdiClose, mdiApplicationEditOutline } from "@mdi/js";
import React, { useEffect } from "react";

// Function to render the application status component
function ApplicationStatus(statusItem: StatusItem) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [showMargin, setShowMargin] = React.useState(false);

  // Exclude current status from the list of other statuses
  const otherStatuses = defaultStatusItems.filter((s) => s.text !== statusItem.text);

  // When hover starts, show margin immediately
  useEffect(() => {
    if (isHovered) setShowMargin(true);
    // When hover ends, delay margin removal until after exit animation
    else if (showMargin) {
      const timeout = setTimeout(() => setShowMargin(false), 300); // match exit duration
      return () => clearTimeout(timeout);
    }
  }, [isHovered, showMargin]);

  return (
    <div
      className="relative flex items-center justify-center my-4 h-8 w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Current status */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="z-10 pr-4"
        style={{
          marginRight: showMargin ? 16 : 0,
          transition: "margin-right 0.3s cubic-bezier(0.85,0,0.15,1)",
          borderRight: showMargin ? `2px solid ${statusItem.color}` : "none",
        }}
      >
        <StatusDisplay
          text={statusItem.text}
          color={statusItem.color}
          selected={true}
          className={showMargin ? "w-auto" : "w-100"}
        />
      </motion.div>
      {/* Other statuses appear to the right on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="flex space-x-5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {otherStatuses.map((s) => (
              <StatusDisplay key={s.text} text={s.text} color={s.color} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ApplicationStatus;

interface StatusDisplayProps {
  text: string;
  color: string;
  selected?: boolean;
  className?: string;
}

function StatusDisplay({
  text, 
  color, 
  selected, 
  className, 
}: StatusDisplayProps) { 
  const [isHovered, setIsHovered] = React.useState(false); 

  // Animate font weight between 400 and 700
  const fontWeight = selected || isHovered ? 700 : 400;

  return (
    <motion.div
      className={`relative flex items-center justify-center h-8${
        className ?? ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ cursor: "pointer" }}
    >
      <motion.div
        className="absolute inset-0 w-full blur-xl"
        style={{
          backgroundImage:
            selected || isHovered
              ? `radial-gradient(ellipse 100% 60% at 50% 50%, ${color}, transparent 70%)`
              : "",
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <motion.span
        className="relative z-10 text-black tracking-wider"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.85, 0, 0.15, 1] }}
        style={{
          fontSize: selected || isHovered ? "1.25rem" : "1.125rem",
          padding: isHovered ? "0 0.7rem" : "0 0.25rem",
          fontWeight,
          transition: "font-weight 0.3s, font-size 0.3s, padding 0.3s",
        }}
      >
        {text}
      </motion.span>
    </motion.div>
  );
}
