import React, { useState } from "react";
import {
  FiHome,
  FiUpload,
  FiActivity,
  FiBarChart2,
  FiMenu,
  FiLogOut,
  FiArrowLeft,
} from "react-icons/fi";
import { GoogleLogin } from "@react-oauth/google";
import NavigationButton from "./shared/NavigationButton";
import Dashboard from "./Dashboard";
import DataUpload from "./DataUpload";
import StressPrediction from "./StressPrediction";
import Explanations from "./Explanations";
import ThemeToggle from "./ThemeToggle";
import brainLogo from "./assets/brain.png";

const EEGMSP = ({ user, onLogin, onLogout, onBackToHome }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [prediction, setPrediction] = useState(null);
  const [stressScore, setStressScore] = useState(null);
  const [features, setFeatures] = useState(null);
  const [visualizations, setVisualizations] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [heatmap, setHeatmap] = useState(null); // Head Heatmap Image (Base64)

  const renderContent = () => {
    switch (activeTab) {
      case "upload":
        return <DataUpload
          setPrediction={setPrediction}
          setStressScore={setStressScore}
          setVisualizations={setVisualizations}
          setFeatures={setFeatures}
          setExplanation={setExplanation}
          setHeatmap={setHeatmap}
          setActiveTab={setActiveTab} // Pass navigation control
        />;
      case "prediction":
        return StressPrediction ? <StressPrediction
          prediction={prediction}
          stressScore={stressScore}
          visualizations={visualizations}
        /> : null;
      case "explanations":
        return Explanations ? <Explanations
          explanation={explanation}
          heatmap={heatmap}
          stressScore={stressScore}
        /> : null;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div
        className={`${isSidebarOpen ? "w-64" : "w-20"} 
          bg-white dark:bg-gray-800 shadow-md p-4 flex flex-col 
          transition-all duration-300`}
        style={{ backgroundColor: "var(--sidebar-bg)", color: "var(--sidebar-text)" }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center mb-6 px-2 justify-between h-[50px] overflow-hidden">
          {isSidebarOpen ? (
            <div className="flex items-center font-bold text-xl transition-all duration-300 ease-in-out">
              <img
                src={brainLogo}
                alt="Brain Logo"
                className="mr-3 flex-shrink-0"
                style={{ width: "45px", height: "45px" }}
              />
              <span className="font-bold text-lg break-words max-w-[120px] leading-tight">
                NeuroStress Insight
              </span>
              <FiMenu
                className="ml-auto cursor-pointer flex-shrink-0"
                size={22}
                onClick={() => setIsSidebarOpen(false)}
              />
            </div>
          ) : (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="cursor-pointer rounded-lg hover:bg-secondary transition flex items-center justify-center w-full"
            >
              <FiMenu size={24} />
            </button>
          )}
        </div>

        {/* User Info / Login Section */}
        <div
          className={`mb-6 border-b border-gray-300 dark:border-gray-700 pb-4 transition-all duration-300 ${isSidebarOpen ? "px-2 opacity-100" : "opacity-100 w-full flex justify-center"
            }`}
        >
          {user ? (
            <div className="flex items-center space-x-3">
              <img
                src={user.picture}
                alt="User avatar"
                className="w-10 h-10 rounded-full border"
              />
              {isSidebarOpen && (
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <>
              {isSidebarOpen ? (
                <div className="flex flex-col items-center">
                  <p className="text-sm text-center mb-2"></p>
                  <div className="flex justify-center">
                    <GoogleLogin
                      onSuccess={onLogin}
                      onError={() => console.log("Login Failed")}
                    />
                  </div>
                </div>
              ) : (
                <button
                  onClick={onLogin}
                  className="bg-white dark:bg-gray-700 rounded-full p-2 shadow hover:scale-105 transition"
                  title="Sign in with Google"
                >
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                </button>
              )}
            </>
          )}
        </div>

        {/* Navigation */}
        <div className="space-y-2 flex-1">
          <NavigationButton
            icon={<FiHome size={18} />}
            label={isSidebarOpen ? "Dashboard" : ""}
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <NavigationButton
            icon={<FiUpload size={18} />}
            label={isSidebarOpen ? "Data Upload" : ""}
            active={activeTab === "upload"}
            onClick={() => setActiveTab("upload")}
          />
          <NavigationButton
            icon={<FiActivity size={18} />}
            label={isSidebarOpen ? "Stress Prediction" : ""}
            active={activeTab === "prediction"}
            onClick={() => setActiveTab("prediction")}
          />
          <NavigationButton
            icon={<FiBarChart2 size={18} />}
            label={isSidebarOpen ? "Explanations" : ""}
            active={activeTab === "explanations"}
            onClick={() => setActiveTab("explanations")}
          />
        </div>

        {/* Bottom actions */}
        <div className="mt-auto space-y-4">
          <ThemeToggle />

          <button
            onClick={onBackToHome}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            <FiArrowLeft size={16} />
            {isSidebarOpen && <span>Back to Home</span>}
          </button>

          {user && (
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center space-x-2 py-2 px-3 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              <FiLogOut size={16} />
              {isSidebarOpen && <span>Logout</span>}
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div
        className="flex-1 p-8 overflow-auto"
        style={{ backgroundColor: "var(--main-bg)", color: "var(--main-text)" }}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default EEGMSP;
