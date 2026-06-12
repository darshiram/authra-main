import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import SiteMetrics from './components/SiteMetrics';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/UserProfile';
import PublicProfile from './pages/PublicProfile';
import PublicCertificates from './pages/PublicCertificates';
import VerifyCertificate from './pages/VerifyCertificate';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';
import Settings from './pages/Settings';
import ManagePortfolio from './pages/ManagePortfolio';
import Pricing from './pages/Pricing';
import OrgProfile from './pages/OrgProfile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import About from './pages/About';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import Features from './pages/Features';
import TermsConditions from './pages/TermsConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AdminDashboard from './pages/AdminDashboard';
import AdminUserDetails from './pages/AdminUserDetails';

function App() {
  return (
    <HelmetProvider>
      <ToastProvider>
        <Router>
          <SiteMetrics />
          <div className="relative overflow-hidden w-full min-h-screen bg-authra-bg-light dark:bg-authra-bg-dark transition-colors duration-300 font-inter text-authra-text-light dark:text-authra-text-dark">
            <Routes>
              <Route path="/" element={
              <>
                <Navbar />
                <Home />
                <Footer />
              </>
            } />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/user/:username" element={<UserProfile />} />
            <Route path="/o/:username" element={<OrgProfile />} />
            <Route path="/u/:username" element={<PublicProfile />} />
            <Route path="/u/:username/certificates" element={<PublicCertificates />} />
            <Route path="/verify/:credentialId" element={<VerifyCertificate />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/signup" element={<Auth />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/manage-portfolio" element={
              <>
                <Navbar />
                <ManagePortfolio />
              </>
            } />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users/:id" element={<AdminUserDetails />} />
          </Routes>
        </div>
        </Router>
      </ToastProvider>
    </HelmetProvider>
  );
}

export default App;
