import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { JivanSetuProvider } from './context/JivanSetuContext';
import { Emergency112Banner } from './components/common/Emergency112Banner';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/common/ToastContainer';

// JIVAN SETU Core Pages
import { LandingPage } from './pages/LandingPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { SosEmergencyPage } from './pages/SosEmergencyPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { ReviewsPage } from './pages/ReviewsPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { AmbulanceDashboardPage } from './pages/AmbulanceDashboardPage';
import { HospitalDashboardPage } from './pages/HospitalDashboardPage';
import { EmergencyStatusPage } from './pages/EmergencyStatusPage';
import { EmergencyReportPage } from './pages/EmergencyReportPage';
import { TrackAmbulancePage } from './pages/TrackAmbulancePage';
import { PatientInfoPage } from './pages/PatientInfoPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { FirstAidGuidancePage } from './pages/FirstAidGuidancePage';
import { AiAssistantPage } from './pages/AiAssistantPage';
import { RouteOptimizationPage } from './pages/RouteOptimizationPage';
import { DemoWorkflowPage } from './pages/DemoWorkflowPage';

export function App() {
  return (
    <JivanSetuProvider>
      <Router>
        <div className="flex flex-col min-h-screen font-sans bg-white dark:bg-navy-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-red-500/20 selection:text-red-600">
          {/* Top Medical Safety 112 Banner */}
          <Emergency112Banner />

          {/* Clean Navigation Bar */}
          <Navbar />

          {/* Real-time Reactive Toast Notifications */}
          <ToastContainer />

          {/* Core Routes */}
          <main className="flex-1">
            <Routes>
              {/* 1. Landing Page */}
              <Route path="/" element={<LandingPage />} />

              {/* 2. Authentication & Onboarding */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />

              {/* 3. User Dashboard & Profile */}
              <Route path="/dashboard" element={<UserDashboardPage />} />
              <Route path="/profile" element={<UserProfilePage />} />

              {/* 4. SOS Emergency System */}
              <Route path="/sos" element={<SosEmergencyPage />} />
              <Route path="/report" element={<EmergencyReportPage />} />
              <Route path="/status/:id" element={<EmergencyStatusPage />} />

              {/* 5. Nearest Ambulance Allocation Console */}
              <Route path="/ambulance" element={<AmbulanceDashboardPage />} />

              {/* 6. Pre-Hospital Booking & Patient Information Transfer */}
              <Route path="/hospital" element={<HospitalDashboardPage />} />

              {/* 7. Hospital & Ambulance Reviews System */}
              <Route path="/reviews" element={<ReviewsPage />} />

              {/* Supporting Emergency Tools */}
              <Route path="/track" element={<TrackAmbulancePage />} />
              <Route path="/patient-info" element={<PatientInfoPage />} />
              <Route path="/first-aid" element={<FirstAidGuidancePage />} />
              <Route path="/ai-assistant" element={<AiAssistantPage />} />
              <Route path="/routes" element={<RouteOptimizationPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/demo" element={<DemoWorkflowPage />} />

              {/* Fallback to Home */}
              <Route path="*" element={<LandingPage />} />
            </Routes>
          </main>

          {/* Standard Minimal Footer */}
          <Footer />
        </div>
      </Router>
    </JivanSetuProvider>
  );
}

export default App;
