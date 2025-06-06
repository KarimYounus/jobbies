import { useState } from "react";
import { motion } from "motion/react";
import JobList from "./components/JobList";

function App() {
  return (
    <motion.div className="flex flex-col w-full justify-center items-center">
      {/* Header Section */}
      <motion.div className="flex flex-row items-center justify-between w-full pl-5 mb-2 backdrop-blur-6xl shadow-xl"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
      >
        {/* Logo */}
        <motion.img
          src="src/assets/images/logo-trans.png"
          alt="Logo"
          className="flex h-20"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
        />
        {/* <motion.h1 className="text-6xl font-ivysoft font-bold tracking-wide my-2" style={{ color: '#2F3E46' }}>
          Jobbies
        </motion.h1> */}
        {/* Buttons */}
        <motion.div className="flex gap-4 pr-5">
          {/* <motion.button className="bg-white border-amber-700 border-2 text-black px-4 py-2 rounded-xl hover:bg-blue-600 transition-colors">
            New List
          </motion.button> */}
          <motion.button className="border-2 text-white px-4 py-2 rounded-sm transition-colors shadow-xl"
            whileHover={{ scale: 1.05, boxShadow: "0 0px 4px rgba(255, 255, 255, 0.2)" }}
            style={{ backgroundColor: 'rgba(53, 79, 82, 0.8)', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
            New Application
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Main Content Section - Job Lists */}

      <motion.div className="flex flex-col items-center w-full gap-4 px-4 mt-2">
        <JobList title="Ongoing" items={[]} />
        <JobList title="Archived" items={[]} />
        <JobList title="Rejected" items={[]} />
      </motion.div>
    </motion.div>
  );
}

export default App;
