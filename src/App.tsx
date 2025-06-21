import AnimatedButton from "./components/AnimatedButton";
import { motion } from "motion/react";
import JobList from "./components/JobList";
import { mdiNotePlusOutline } from "@mdi/js";
import { applicationsByStatus } from "./data/CollectionHandler";

function App() {
  return (
    <motion.div className="flex flex-col w-full justify-center items-center font-ivysoft">
      {/* Header Section */}
      <motion.div
        className="flex flex-row items-center justify-between w-full pl-5 mb-2 backdrop-blur-6xl shadow-xl"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.85, 0, 0.15, 1] }}
      >
        {/* Logo */}
        <div className="w-10"></div>

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
          <AnimatedButton
            icon={mdiNotePlusOutline}
            caption="Add Job"
            className="p-2 mx-3 hover:bg-teal-200 rounded-lg transition-colors cursor-pointer"
            iconClassName="text-gray-200 hover:text-gray-800"
            onClick={() => console.log("Add Job Clicked")}
          />
        </motion.div>
      </motion.div>

      {/* Main Content Section - Job Lists */}
      <motion.div className="flex flex-col items-center w-full gap-4 px-4 mt-2">
        {applicationsByStatus.size === 0 ? (
          <motion.div
            className="text-center text-gray-500 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-white text-xl">No Job Applications</p>
            <p className="text-white text-sm mt-2">
              Create a new application to see them here
            </p>
          </motion.div>
        ) : (
          Array.from(applicationsByStatus.entries()).map(
            ([status, applications]) => (
              <JobList key={status} title={status} items={applications} />
            )
          )
        )}
      </motion.div>
    </motion.div>
  );
}

export default App;
