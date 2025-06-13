import { motion } from 'framer-motion';
import { StatusItem } from '../../types/status-types';

// Function to render the application status component
function ApplicationStatus(statusItem: StatusItem) {
  // Get the status object based on the job's status text

  // Fallback for statuses not in the default list, like 'Awaiting Response'
  const text = statusItem.text 
  const color = statusItem.color

  return (
    <div className="relative flex justify-center items-center my-8 h-10">
      {/* Elliptical Gradient Background */}
      <motion.div
        className="absolute inset-0 blur-2xl"
        style={{
          backgroundImage: `radial-gradient(ellipse 80% 40% at 50% 50%, ${color}, transparent 100%)`,
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      ></motion.div>

      {/* Status Text */}
      <motion.p 
        className="relative z-10 text-xl font-semibold text-black tracking-wider"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {text}
      </motion.p>
    </div>
  );
}

export default ApplicationStatus;