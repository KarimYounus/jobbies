import { useState } from "react";
import { motion } from "motion/react";

function App() {
  return (
    <motion.div className="flex flex-col w-full justify-center items-center">
      {/* Header Section */}
      <motion.div className="flex flex-row items-center justify-between w-full p-8 mb-2">
        <motion.h1 className="text-3xl font-bold text-gray-800">
          Jobbies
        </motion.h1>
        <motion.button className="bg-white border-amber-700 border-2 text-black px-4 py-2 rounded-4xl hover:bg-blue-600 transition-colors">
          New Application
        </motion.button>
      </motion.div>

      {/* Main Content Section - Job Lists */}

      <motion.div className="flex flex-col items-center w-full gap-4 px-4">
        <motion.div className="flex flex-col items-start justify-center bg-slate-200 rounded-4xl w-full h-[50px] p-8 shadow-lg">
          <motion.h2 className="text-2xl font-semibold text-gray-800">
            Archived
          </motion.h2>
        </motion.div>
        <motion.div className="flex flex-col items-start justify-center bg-slate-200 rounded-4xl w-full h-[50px] p-8 shadow-lg">
          <motion.h2 className="text-2xl font-semibold text-gray-800">
            Ongoing
          </motion.h2>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default App;
