/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import QuestsHub from "./pages/QuestsHub";
import QuestSimulation from "./pages/QuestSimulation";
import QuestComplete from "./pages/QuestComplete";
import Portfolio from "./pages/Portfolio";
import CoachDashboard from "./pages/CoachDashboard";
import Layout from "./components/Layout";
import CoachLayout from "./components/CoachLayout";
import QuestBuilder from "./pages/QuestBuilder";
import { initializeSampleQuests } from "./data/initializeData";

export default function App() {
  useEffect(() => {
    // Initialize sample quests on app load (safe to call multiple times)
    initializeSampleQuests().catch((error) => {
      console.warn("Could not initialize sample quests:", error);
    });
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Protected Routes with Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/quests" element={<QuestsHub />} />
          <Route path="/simulation" element={<QuestSimulation />} />
          <Route path="/simulation/:questId" element={<QuestSimulation />} />
          <Route path="/complete" element={<QuestComplete />} />
          <Route path="/portfolio" element={<Portfolio />} />
        </Route>

        {/* Teacher/Coach Routes with CoachLayout */}
        <Route element={<CoachLayout />}>
          <Route path="/coach" element={<CoachDashboard />} />
          <Route path="/builder" element={<QuestBuilder />} />
        </Route>
      </Routes>
    </Router>
  );
}
