import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./LandingPage";
import MainSystem from "./MainSystem";

import LearnMore from "./components/LearnMore";
import StroopTest from "./components/StroopTest";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<MainSystem />} />
        <Route path="/learn-more" element={<LearnMore />} />
        <Route path="/stroop-test" element={<StroopTest />} />
        {/* Redirect unknown routes to landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
