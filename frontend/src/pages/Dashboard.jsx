import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../config/api';
import { Loader2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';

import Sidebar from '../components/dashboard/Sidebar';
import Header from '../components/dashboard/Header';
import OverviewTab from '../components/dashboard/OverviewTab';
import IssueTab from '../components/dashboard/IssueTab';
import TemplatesTab from '../components/dashboard/TemplatesTab';
import BulkIssueTab from '../components/dashboard/BulkIssueTab';
import SentTab from '../components/dashboard/SentTab';
import SettingsTab from '../components/dashboard/SettingsTab';
import DesignRequestsTab from '../components/dashboard/DesignRequestsTab';
import RequestDesignModal from '../components/dashboard/RequestDesignModal';

export default function Dashboard() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };
  const [isLoading, setIsLoading] = useState(true);
  const [issuedCertificates, setIssuedCertificates] = useState([]);
  const [metrics, setMetrics] = useState({
    total: 0,
    thisMonth: 0,
    lastMonth: 0,
    percentageChange: 0,
    graphData: []
  });
  const [issueRecipients, setIssueRecipients] = useState([{ name: '', email: '' }]);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [additionalDetails, setAdditionalDetails] = useState({ title: '', rank: '', skills: '', college: '', eventName: '' });
  const [skillInput, setSkillInput] = useState('');
  const [isIssuing, setIsIssuing] = useState(false);
  const [extraCertsQuantity, setExtraCertsQuantity] = useState(1);
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);

  const [settingsForm, setSettingsForm] = useState({
    name: '',
    username: '',
    mobileNo: '',
    website: '',
    linkedin: '',
    github: '',
    logoUrl: '',
    bannerUrl: '',
    aboutOrg: '',
    gallery: []
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  const [showRequestDesignModal, setShowRequestDesignModal] = useState(false);
  const [requestDesignForm, setRequestDesignForm] = useState({ description: '', link: '' });

  const navigate = useNavigate();

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('File size exceeds 5MB limit', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploadingLogo(true);
      const res = await axiosInstance.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSettingsForm(prev => ({ ...prev, logoUrl: res.data.url }));
    } catch (err) {
      showToast(err.response?.data?.message || 'Error uploading logo', 'error');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('File size exceeds 5MB limit', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploadingBanner(true);
      const res = await axiosInstance.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSettingsForm(prev => ({ ...prev, bannerUrl: res.data.url }));
    } catch (err) {
      showToast(err.response?.data?.message || 'Error uploading banner', 'error');
    } finally {
      setIsUploadingBanner(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      localStorage.removeItem('token');
      sessionStorage.clear();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/login';
    }
  };

  const handleSaveSettings = async () => {
    try {
      setIsSavingSettings(true);
      const res = await axiosInstance.put('/users/me', {
        name: settingsForm.name,
        username: settingsForm.username,
        mobileNo: settingsForm.mobileNo,
        website: settingsForm.website,
        linkedin: settingsForm.linkedin,
        github: settingsForm.github,
        logoUrl: settingsForm.logoUrl,
        bannerUrl: settingsForm.bannerUrl,
        aboutOrg: settingsForm.aboutOrg,
        gallery: settingsForm.gallery,
      });
      setUser(res.data);
      showToast('Settings saved successfully!', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Error saving settings', 'error');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleIssueCertificates = async () => {
    try {
      setIsIssuing(true);
      const res = await axiosInstance.post('/certificates/issue', {
        templateId: selectedTemplate,
        issueDate,
        recipients: issueRecipients.filter(r => r.name && r.email),
        additionalDetails
      });
      showToast(res.data.message, 'success');
      setIssueRecipients([{ name: '', email: '' }]);
      setAdditionalDetails({ skills: '', college: '', eventName: '' });
      setActiveTab('overview');
    } catch (err) {
      showToast(err.response?.data?.message || 'Error issuing certificates', 'error');
    } finally {
      setIsIssuing(false);
    }
  };

  const handleBuyExtraCertificates = async () => {
    try {
      const price = 10 * extraCertsQuantity;
      const certsAmount = 100 * extraCertsQuantity;
      const res = await axiosInstance.post('/payments/order', {
        amount: price,
        plan: 'pro',
        extraCerts: certsAmount
      });

      if (!res.data.keyId) {
        showToast("Razorpay is not configured on the backend. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env file to enable actual payments.", "error");
        return;
      }

      const options = {
        key: res.data.keyId,
        amount: res.data.order.amount,
        currency: "INR",
        name: "Authra",
        description: `Buy ${certsAmount} Extra Certificates`,
        order_id: res.data.order.id,
        handler: async function (response) {
          try {
            const verifyRes = await axiosInstance.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              extraCerts: certsAmount
            });
            if (verifyRes.data.success) {
              showToast(`Payment successful! ${certsAmount} extra certificates have been added to your limit.`, 'success');
              setShowQuantitySelector(false);
              window.location.reload();
            }
          } catch (err) {
            console.error(err);
            showToast("Payment verification failed: " + (err.response?.data?.message || err.message), 'error');
          }
        },
        theme: {
          color: "#7387C5",
        },
      };

      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
          const rzp = new window.Razorpay(options);
          rzp.open();
        };
        document.body.appendChild(script);
      } else {
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || "Error initiating payment.", 'error');
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(savedTheme);
    if (savedTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');

    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get('/users/me');
        if (res.data.accountType !== 'organization') {
          navigate(`/user/${res.data.username || 'profile'}`);
        } else {
          setUser(res.data);
          setSettingsForm({
            name: res.data.name || '',
            username: res.data.username || '',
            mobileNo: res.data.mobileNo || '',
            website: res.data.website || '',
            linkedin: res.data.linkedin || '',
            github: res.data.github || '',
            logoUrl: res.data.logoUrl || '',
            bannerUrl: res.data.bannerUrl || '',
            aboutOrg: res.data.aboutOrg || '',
            gallery: res.data.gallery || []
          });

          const certsRes = await axiosInstance.get('/certificates/issued');
          const certs = certsRes.data || [];
          setIssuedCertificates(certs);

          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();

          let thisMonthCount = 0;
          let lastMonthCount = 0;

          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const graphDataMap = new Map();

          for (let i = 5; i >= 0; i--) {
            const d = new Date(currentYear, currentMonth - i, 1);
            const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
            graphDataMap.set(key, { name: monthNames[d.getMonth()], issuances: 0, year: d.getFullYear(), month: d.getMonth() });
          }

          certs.forEach(cert => {
            const date = new Date(cert.issueDate);
            const m = date.getMonth();
            const y = date.getFullYear();

            if (y === currentYear && m === currentMonth) {
              thisMonthCount++;
            } else if ((y === currentYear && m === currentMonth - 1) || (currentMonth === 0 && y === currentYear - 1 && m === 11)) {
              lastMonthCount++;
            }

            const key = `${monthNames[m]} ${y}`;
            if (graphDataMap.has(key)) {
              const data = graphDataMap.get(key);
              data.issuances++;
              graphDataMap.set(key, data);
            }
          });

          let percentageChange = 0;
          if (lastMonthCount === 0) {
            percentageChange = thisMonthCount > 0 ? 100 : 0;
          } else {
            percentageChange = Math.round(((thisMonthCount - lastMonthCount) / lastMonthCount) * 100);
          }

          setMetrics({
            total: certs.length,
            thisMonth: thisMonthCount,
            lastMonth: lastMonthCount,
            percentageChange,
            graphData: Array.from(graphDataMap.values())
          });
        }
      } catch (err) {
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const renderContent = () => {
    if (activeTab === 'overview') {
      return (
        <OverviewTab
          user={user}
          metrics={metrics}
          issuedCertificates={issuedCertificates}
          extraCertsQuantity={extraCertsQuantity}
          setExtraCertsQuantity={setExtraCertsQuantity}
          showQuantitySelector={showQuantitySelector}
          setShowQuantitySelector={setShowQuantitySelector}
          handleBuyExtraCertificates={handleBuyExtraCertificates}
          theme={theme}
          setActiveTab={setActiveTab}
        />
      );
    }

    if (activeTab === 'issue') {
      return (
        <IssueTab
          user={user}
          settingsForm={settingsForm}
          issueRecipients={issueRecipients}
          setIssueRecipients={setIssueRecipients}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          issueDate={issueDate}
          setIssueDate={setIssueDate}
          additionalDetails={additionalDetails}
          setAdditionalDetails={setAdditionalDetails}
          skillInput={skillInput}
          setSkillInput={setSkillInput}
          isIssuing={isIssuing}
          handleIssueCertificates={handleIssueCertificates}
        />
      );
    }

    if (activeTab === 'templates') {
      return (
        <TemplatesTab
          user={user}
          settingsForm={settingsForm}
          setSelectedTemplate={setSelectedTemplate}
          setActiveTab={setActiveTab}
          setShowRequestDesignModal={setShowRequestDesignModal}
        />
      );
    }

    if (activeTab === 'bulk') {
      return (
        <BulkIssueTab
          user={user}
          settingsForm={settingsForm}
          issueRecipients={issueRecipients}
          setIssueRecipients={setIssueRecipients}
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          issueDate={issueDate}
          setIssueDate={setIssueDate}
          additionalDetails={additionalDetails}
          setAdditionalDetails={setAdditionalDetails}
          skillInput={skillInput}
          setSkillInput={setSkillInput}
          isIssuing={isIssuing}
          handleIssueCertificates={handleIssueCertificates}
        />
      );
    }

    if (activeTab === 'sent') {
      return <SentTab issuedCertificates={issuedCertificates} />;
    }

    if (activeTab === 'settings') {
      return (
        <SettingsTab
          user={user}
          settingsForm={settingsForm}
          setSettingsForm={setSettingsForm}
          isSavingSettings={isSavingSettings}
          handleSaveSettings={handleSaveSettings}
          isUploadingLogo={isUploadingLogo}
          isUploadingBanner={isUploadingBanner}
          handleLogoUpload={handleLogoUpload}
          handleBannerUpload={handleBannerUpload}
        />
      );
    }

    if (activeTab === 'design-requests') {
      return (
        <DesignRequestsTab
          setShowRequestDesignModal={setShowRequestDesignModal}
        />
      );
    }

    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#090b11]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-steel" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] dark:bg-[#090b11] overflow-hidden font-inter">
      <Sidebar
        activeTab={activeTab}
        handleTabChange={handleTabChange}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <Header
          user={user}
          isProfileMenuOpen={isProfileMenuOpen}
          setIsProfileMenuOpen={setIsProfileMenuOpen}
          handleLogout={handleLogout}
          profileMenuRef={profileMenuRef}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          handleTabChange={handleTabChange}
          theme={theme}
          toggleTheme={toggleTheme}
        />

        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          {renderContent()}
        </div>
      </main>

      <RequestDesignModal
        showRequestDesignModal={showRequestDesignModal}
        setShowRequestDesignModal={setShowRequestDesignModal}
        requestDesignForm={requestDesignForm}
        setRequestDesignForm={setRequestDesignForm}
      />
    </div>
  );
}
