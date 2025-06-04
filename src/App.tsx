import { useState } from "react";
import { motion } from "motion/react";
import JobList from "./components/JobList";

function App() {
  return (
    <motion.div className="flex flex-col w-full justify-center items-center">
      {/* Header Section */}
      <motion.div className="flex flex-row items-center justify-between w-full p-8 mb-2">
        {/* Logo */}
        <motion.h1 className="text-3xl font-bold text-gray-800">
          Jobbies
        </motion.h1>
        {/* Buttons */}
        <motion.div className="flex gap-4">
          <motion.button className="bg-white border-amber-700 border-2 text-black px-4 py-2 rounded-4xl hover:bg-blue-600 transition-colors">
            New List
          </motion.button>
          <motion.button className="bg-white border-amber-700 border-2 text-black px-4 py-2 rounded-4xl hover:bg-blue-600 transition-colors">
            New Application
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Main Content Section - Job Lists */}

      <motion.div className="flex flex-col items-center w-full gap-4 px-4">
        <JobList title="Ongoing" items={[]} />
        <JobList title="Archived" items={[]} />
        <JobList title="Rejected" items={[]} />
      </motion.div>
    </motion.div>
  );
}

export default App;
