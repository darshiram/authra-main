import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../config/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  LayoutDashboard,
  FileBadge,
  Users,
  Settings,
  Bell,
  Search,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Mail,
  Calendar,
  Award,
  TrendingUp,
  Activity,
  CreditCard,
  ArrowUpRight,
  Sun,
  Moon,
  UploadCloud,
  FileText,
  AlertCircle,
  Send,
  Loader2,
  Hexagon,
  QrCode,
  Trash2,
  Eye,
  Menu,
  X,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import horizontalLogo from '../assets/horziontal logo.png';
import { Link } from 'react-router-dom';
import ModernMinimalist from '../components/certificate-templates/ModernMinimalist';
import CyberpunkGrid from '../components/certificate-templates/CyberpunkGrid';
import ExecutiveGlass from '../components/certificate-templates/ExecutiveGlass';

export default function Dashboard() {
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
  const [additionalDetails, setAdditionalDetails] = useState({ skills: '', college: '', eventName: '' });
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
    aboutOrg: '',
    gallery: []
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const navigate = useNavigate();

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit');
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
      alert(err.response?.data?.message || 'Error uploading logo');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      // Clear all auth state
      localStorage.removeItem('token'); // In case it's used
      sessionStorage.clear();
      // Force a full page reload to clear memory and redirect
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API fails, clear local state
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
        aboutOrg: settingsForm.aboutOrg,
        gallery: settingsForm.gallery,
      });
      setUser(res.data);
      alert('Settings saved successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving settings');
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
      alert(res.data.message);
      setIssueRecipients([{ name: '', email: '' }]);
      setAdditionalDetails({ skills: '', college: '', eventName: '' });
      setActiveTab('overview');
    } catch (err) {
      alert(err.response?.data?.message || 'Error issuing certificates');
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
        alert("Razorpay is not configured on the backend. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env file to enable actual payments.");
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
              alert(`Payment successful! ${certsAmount} extra certificates have been added to your limit.`);
              setShowQuantitySelector(false);
              // Reload page to reflect new limits
              window.location.reload();
            }
          } catch (err) {
            console.error(err);
            alert("Payment verification failed: " + (err.response?.data?.message || err.message));
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
      alert(error.response?.data?.message || "Error initiating payment.");
    }
  };

  useEffect(() => {
    // Initial theme setup
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
            aboutOrg: res.data.aboutOrg || '',
            gallery: res.data.gallery || []
          });
          
          // Fetch issued certificates
          const certsRes = await axiosInstance.get('/certificates/issued');
          const certs = certsRes.data || [];
          setIssuedCertificates(certs);
          
          // Calculate metrics
          const now = new Date();
          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();
          
          let thisMonthCount = 0;
          let lastMonthCount = 0;
          
          // Initialize graph data for last 6 months
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
        // Redirect to login if not authenticated
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
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-[590] text-authra-text-light dark:text-white mb-2">
              Welcome back, {user?.name || 'User'}
            </h1>
            <p className="text-authra-text-sec-light dark:text-authra-text-sec-dark">
              Here is what's happening with your credentials today.
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Metric 1 */}
            <div className="bg-white dark:bg-[#0D0F16] p-6 border border-authra-border-light dark:border-authra-border-dark rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-authra-text-sec-light dark:text-authra-text-sec-dark text-sm font-medium">Total Certificates Issued</h3>
                <div className="p-2.5 bg-brand-steel/10 text-brand-steel rounded-xl">
                  <FileBadge className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-authra-text-light dark:text-white tracking-tight">{metrics.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Metric 2 */}
            <div className="bg-white dark:bg-[#0D0F16] p-6 border border-authra-border-light dark:border-authra-border-dark rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-authra-text-sec-light dark:text-authra-text-sec-dark text-sm font-medium">Issued This Month</h3>
                <div className="p-2.5 bg-brand-steel/10 text-brand-steel rounded-xl">
                  <Activity className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-authra-text-light dark:text-white tracking-tight">{metrics.thisMonth.toLocaleString()}</span>
                <span className={`flex items-center text-xs font-semibold px-2 py-1 rounded-full ${metrics.percentageChange >= 0 ? 'text-emerald-500 bg-emerald-500/10' : 'text-red-500 bg-red-500/10'}`}>
                  {metrics.percentageChange >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingUp className="w-3 h-3 mr-1 transform rotate-180" />} 
                  {metrics.percentageChange >= 0 ? '+' : ''}{metrics.percentageChange}%
                </span>
              </div>
              <div className="mt-2 text-xs text-authra-text-sec-light dark:text-authra-text-sec-dark font-medium">
                vs {metrics.lastMonth} last month
              </div>
            </div>

            {/* Plan Info */}
            <div className="bg-gradient-to-br from-brand-steel/5 to-brand-ice/10 dark:from-brand-steel/10 dark:to-[#0D0F16] p-6 border border-brand-steel/20 dark:border-authra-border-dark rounded-2xl shadow-sm relative overflow-hidden group">
              <div className="absolute -top-4 -right-4 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <CreditCard className="w-24 h-24 text-brand-steel" />
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-authra-text-sec-light dark:text-authra-text-sec-dark text-sm font-medium mb-4">Current Plan</h3>
                  <div className="flex items-end gap-3 mb-2">
                    <span className="text-3xl font-bold text-authra-text-light dark:text-white tracking-tight capitalize">{user?.plan || 'Free'}</span>
                    <span className="text-[10px] uppercase tracking-wider text-brand-steel font-bold px-2 py-1 bg-brand-steel/10 rounded-full mb-1">Active</span>
                  </div>
                </div>
                <div className="mt-5">
                  {user?.plan === 'enterprise' ? (
                    <>
                      <div className="flex justify-between text-xs font-medium text-authra-text-sec-light dark:text-authra-text-sec-dark mb-1.5">
                        <span>API Usage (Unlimited)</span>
                        <span className="text-brand-steel">100%</span>
                      </div>
                      <div className="w-full bg-white/50 dark:bg-black/50 h-2 rounded-full overflow-hidden">
                        <div className="bg-brand-steel h-full rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </>
                  ) : user?.plan === 'pro' ? (
                    <>
                      <div className="flex justify-between text-xs font-medium text-authra-text-sec-light dark:text-authra-text-sec-dark mb-1.5">
                        <span>Issuance Limit ({metrics.thisMonth} / {1000 + (user?.extraCertificates || 0)})</span>
                        <span className="text-brand-steel">{Math.round((metrics.thisMonth / (1000 + (user?.extraCertificates || 0))) * 100)}%</span>
                      </div>
                      <div className="w-full bg-white/50 dark:bg-black/50 h-2 rounded-full overflow-hidden mb-3">
                        <div className="bg-brand-steel h-full rounded-full" style={{ width: `${Math.min(100, Math.round((metrics.thisMonth / (1000 + (user?.extraCertificates || 0))) * 100))}%` }}></div>
                      </div>
                      
                      {showQuantitySelector ? (
                        <>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] text-authra-text-sec-light dark:text-authra-text-sec-dark font-medium uppercase tracking-wider">Units (100 certs)</span>
                            <div className="flex items-center bg-white dark:bg-[#111522] border border-authra-border-light dark:border-[#2A3155] rounded flex-1 overflow-hidden">
                              <button onClick={() => setExtraCertsQuantity(Math.max(1, extraCertsQuantity - 1))} className="px-2 py-0.5 text-authra-text-sec-light hover:text-brand-steel transition-colors font-bold bg-gray-50 dark:bg-white/5">-</button>
                              <span className="px-2 text-xs font-semibold flex-1 text-center">{extraCertsQuantity}</span>
                              <button onClick={() => setExtraCertsQuantity(extraCertsQuantity + 1)} className="px-2 py-0.5 text-authra-text-sec-light hover:text-brand-steel transition-colors font-bold bg-gray-50 dark:bg-white/5">+</button>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setShowQuantitySelector(false)}
                              className="w-1/3 py-1.5 border border-authra-border-light dark:border-authra-border-dark text-authra-text-sec-light dark:text-authra-text-sec-dark hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={handleBuyExtraCertificates}
                              className="w-2/3 py-1.5 bg-brand-steel text-white hover:bg-brand-steel/90 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors"
                            >
                              Pay ₹{10 * extraCertsQuantity}
                            </button>
                          </div>
                        </>
                      ) : (
                        <button 
                          onClick={() => {
                            setExtraCertsQuantity(1);
                            setShowQuantitySelector(true);
                          }}
                          className="w-full py-1.5 border border-brand-steel/30 text-brand-steel hover:bg-brand-steel/10 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors"
                        >
                          + Buy Extra Certificates
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between text-xs font-medium text-authra-text-sec-light dark:text-authra-text-sec-dark mb-1.5">
                        <span>Monthly Limit ({metrics.thisMonth} / 100)</span>
                        <span className="text-brand-steel">{Math.round((metrics.thisMonth / 100) * 100)}%</span>
                      </div>
                      <div className="w-full bg-white/50 dark:bg-black/50 h-2 rounded-full overflow-hidden">
                        <div className="bg-brand-steel h-full rounded-full" style={{ width: `${Math.min(100, Math.round((metrics.thisMonth / 100) * 100))}%` }}></div>
                      </div>
                    </>
                  )}
                  <Link to="/pricing" className="mt-4 block text-center w-full py-2 bg-brand-steel/10 hover:bg-brand-steel/20 text-brand-steel text-xs font-semibold rounded-lg transition-colors">
                    Upgrade Plan
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Graph Section */}
          <div className="bg-white dark:bg-[#0D0F16] p-6 border border-authra-border-light dark:border-authra-border-dark rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-authra-text-light dark:text-white mb-6">Issuance Trends</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.graphData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIssuances" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7387C5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#7387C5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#2A3155' : '#E5E7EB'} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: theme === 'dark' ? '#9AA8D6' : '#6B7280', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: theme === 'dark' ? '#9AA8D6' : '#6B7280', fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: theme === 'dark' ? '#111522' : '#FFFFFF', borderColor: theme === 'dark' ? '#2A3155' : '#E5E7EB', borderRadius: '8px', color: theme === 'dark' ? '#F5F8FF' : '#111827' }}
                    itemStyle={{ color: '#7387C5' }}
                  />
                  <Area type="monotone" dataKey="issuances" stroke="#7387C5" strokeWidth={3} fillOpacity={1} fill="url(#colorIssuances)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-authra-border-dark rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-authra-border-light dark:border-authra-border-dark flex justify-between items-center bg-authra-bg-light/30 dark:bg-authra-bg-dark/30">
              <h3 className="font-semibold text-authra-text-light dark:text-white">Recent Issuances</h3>
              <button onClick={() => setActiveTab('sent')} className="text-sm text-brand-steel hover:text-brand-ice flex items-center gap-1 font-medium transition-colors">
                View All <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
            <div className="divide-y divide-authra-border-light dark:divide-authra-border-dark">
              {issuedCertificates.length === 0 ? (
                <div className="px-6 py-8 text-center text-authra-text-sec-light dark:text-authra-text-sec-dark text-sm">
                  No recent issuances found.
                </div>
              ) : (
                issuedCertificates.slice(0, 5).map((cert, i) => (
                  <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-authra-bg-light/50 dark:hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-brand-steel/10 flex items-center justify-center text-brand-steel font-semibold text-sm">
                        {cert.recipientName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-authra-text-light dark:text-white">{cert.recipientName}</p>
                        <p className="text-xs text-authra-text-sec-light dark:text-authra-text-sec-dark">{cert.recipientEmail}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-authra-text-light dark:text-white">{new Date(cert.issueDate).toLocaleDateString()}</p>
                      <Link to={`/verify/${cert.credentialId}`} target="_blank" className="text-xs text-brand-steel hover:text-brand-ice transition-colors">View Certificate</Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'issue') {
      return (
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-2xl md:text-3xl font-[590] text-authra-text-light dark:text-white mb-2">
              Issue New Certificates
            </h1>
            <p className="text-authra-text-sec-light dark:text-authra-text-sec-dark">
              Issue a cryptographically verified credential to multiple recipients simultaneously.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Column: Form */}
            <div className="w-full lg:w-[500px] xl:w-[600px] flex-shrink-0 bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-authra-border-dark rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 border-b border-authra-border-light dark:border-authra-border-dark flex items-center justify-between bg-authra-bg-light/30 dark:bg-authra-bg-dark/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-steel/10 flex items-center justify-center text-brand-steel">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-authra-text-light dark:text-white text-base">Credential Details</h3>
                    <p className="text-xs text-authra-text-sec-light dark:text-authra-text-sec-dark">Configure certificate properties.</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-8 flex-1 overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark mb-2">Certificate Template</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-authra-text-sec-light dark:text-authra-text-sec-dark">
                        <Award className="w-4 h-4" />
                      </div>
                      <select 
                        value={selectedTemplate}
                        onChange={(e) => setSelectedTemplate(e.target.value)}
                        className="w-full bg-white dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white appearance-none"
                      >
                        <option value="modern">Modern Minimalist (Advanced Full-Stack Engineering)</option>
                        <option value="cyberpunk">Cyberpunk Grid (Cloud Native Architecture)</option>
                        <option value="executive">Executive Glass (Cybersecurity Risk Management)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark mb-2">Issue Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-authra-text-sec-light dark:text-authra-text-sec-dark">
                        <Calendar className="w-4 h-4" />
                      </div>
                    <input 
                      type="date" 
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className="w-full bg-white dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white" 
                    />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-authra-border-light dark:border-authra-border-dark">
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark">Recipients</label>
                    <span className="text-xs text-brand-steel font-medium">{issueRecipients.length} Recipient(s)</span>
                  </div>
                  
                  <div className="space-y-4">
                    {issueRecipients.map((rec, i) => (
                      <div key={i} className="flex items-start gap-3 bg-authra-bg-light/50 dark:bg-white/5 p-4 rounded-xl relative group">
                        {issueRecipients.length > 1 && (
                          <button 
                            onClick={() => setIssueRecipients(prev => prev.filter((_, idx) => idx !== i))}
                            className="absolute -right-2 -top-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                        <div className="flex-1 space-y-3">
                          <input 
                            type="text" 
                            value={rec.name}
                            onChange={(e) => {
                              const newRec = [...issueRecipients];
                              newRec[i].name = e.target.value;
                              setIssueRecipients(newRec);
                            }}
                            className="w-full bg-white dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white" 
                            placeholder="Recipient Name (e.g. Alex Developer)" 
                          />
                          <input 
                            type="email" 
                            value={rec.email}
                            onChange={(e) => {
                              const newRec = [...issueRecipients];
                              newRec[i].email = e.target.value;
                              setIssueRecipients(newRec);
                            }}
                            className="w-full bg-white dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white" 
                            placeholder="Email Address" 
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setIssueRecipients([...issueRecipients, { name: '', email: '' }])}
                    className="w-full mt-4 py-3 rounded-xl border border-dashed border-brand-steel/50 text-brand-steel hover:bg-brand-steel/5 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" /> Add Another Recipient
                  </button>
                </div>
                <div className="pt-2 border-t border-authra-border-light dark:border-authra-border-dark">
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark">Additional Details (Optional)</label>
                    <span className="text-xs text-authra-text-sec-light dark:text-authra-text-sec-dark font-medium">Stored securely on ledger</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <input 
                        type="text" 
                        value={additionalDetails.skills}
                        onChange={(e) => setAdditionalDetails({...additionalDetails, skills: e.target.value})}
                        className="w-full bg-white dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white" 
                        placeholder="Skills Learned (e.g. React, Node.js, Blockchain)" 
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <input 
                          type="text" 
                          value={additionalDetails.college}
                          onChange={(e) => setAdditionalDetails({...additionalDetails, college: e.target.value})}
                          className="w-full bg-white dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white" 
                          placeholder="College / Institution" 
                        />
                      </div>
                      <div>
                        <input 
                          type="text" 
                          value={additionalDetails.eventName}
                          onChange={(e) => setAdditionalDetails({...additionalDetails, eventName: e.target.value})}
                          className="w-full bg-white dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white" 
                          placeholder="Event Name" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-authra-border-light dark:border-authra-border-dark">
                  <label className="flex items-center gap-3 cursor-pointer group w-fit">
                    <div className="relative flex items-center justify-center w-5 h-5 border border-authra-border-light dark:border-authra-border-dark rounded-md group-hover:border-brand-steel transition-colors">
                      <input type="checkbox" className="peer absolute opacity-0 w-full h-full cursor-pointer" defaultChecked />
                      <CheckCircle2 className="w-3 h-3 text-brand-steel opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-sm text-authra-text-sec-light dark:text-authra-text-sec-dark group-hover:text-authra-text-light dark:group-hover:text-white transition-colors">
                      Send email notification to recipients
                    </span>
                  </label>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-6 border-t border-authra-border-light dark:border-authra-border-dark bg-authra-bg-light/30 dark:bg-authra-bg-dark/30 flex items-center justify-end gap-4">
                <button className="px-6 py-2.5 rounded-full text-sm font-medium text-authra-text-sec-light dark:text-authra-text-sec-dark hover:text-authra-text-light dark:hover:text-white transition-colors border border-transparent hover:border-authra-border-light dark:hover:border-authra-border-dark">
                  Save Draft
                </button>
                <button 
                  onClick={handleIssueCertificates}
                  disabled={isIssuing || issueRecipients.filter(r => r.name && r.email).length === 0}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isIssuing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  {isIssuing ? 'Issuing...' : `Issue ${issueRecipients.filter(r => r.name && r.email).length} Certificate${issueRecipients.filter(r => r.name && r.email).length !== 1 ? 's' : ''}`}
                </button>
              </div>
            </div>

            {/* Right Column: Live Preview */}
            <div className="flex-1 w-full bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-authra-border-dark rounded-2xl shadow-sm p-6 lg:sticky top-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-authra-text-light dark:text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-brand-steel" /> Live Preview
                </h3>
                <span className="text-xs bg-brand-steel/10 text-brand-steel px-2 py-1 rounded-md font-medium uppercase tracking-wider">
                  Updates in Realtime
                </span>
              </div>
              
              <div className="w-full relative rounded-xl overflow-hidden shadow-xl border border-authra-border-light dark:border-authra-border-dark bg-[#0A0C10]">
                <svg viewBox="0 0 1000 772.72" className="w-full h-auto block">
                  <foreignObject width="1000" height="772.72">
                    <div className="w-[1000px] h-[772.72px] origin-top-left pointer-events-none">
                      {selectedTemplate === 'modern' && <ModernMinimalist />}
                      {selectedTemplate === 'cyberpunk' && <CyberpunkGrid />}
                      {selectedTemplate === 'executive' && <ExecutiveGlass />}
                    </div>
                  </foreignObject>
                </svg>
              </div>
              
              <div className="mt-4 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400 flex gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>The preview above shows the layout for the first recipient. The system will automatically generate identical certificates customized for each individual recipient upon issuance.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'templates') {
      return (
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-[590] text-authra-text-light dark:text-white mb-2">
                Certificate Templates
              </h1>
              <p className="text-authra-text-sec-light dark:text-authra-text-sec-dark">
                Manage your reusable credential designs.
              </p>
            </div>
            <button className="btn-primary w-fit flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Template
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
            
            {/* Template 1: Modern Minimalist */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-brand-steel/20 text-brand-steel flex items-center justify-center text-xs font-bold">1</span>
                  <h2 className="text-lg font-semibold text-authra-text-light dark:text-white">Modern Minimalist</h2>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-lg border border-authra-border-light dark:border-authra-border-dark hover:border-brand-steel text-xs font-medium transition-colors text-authra-text-light dark:text-white">Edit</button>
                  <button className="px-3 py-1.5 rounded-lg bg-brand-steel hover:brightness-110 text-white text-xs font-medium transition-colors">Issue</button>
                </div>
              </div>
              
              <div className="w-full relative rounded-xl overflow-hidden shadow-lg border border-authra-border-light dark:border-authra-border-dark group bg-white dark:bg-[#0A0C10]">
                <svg viewBox="0 0 1000 772.72" className="w-full h-auto block">
                  <foreignObject width="1000" height="772.72">
                    <div className="w-[1000px] h-[772.72px] origin-top-left pointer-events-none">
                      <ModernMinimalist />
                    </div>
                  </foreignObject>
                </svg>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-auto cursor-pointer" onClick={() => {}}></div>
              </div>
            </div>

            {/* Template 2: Cyberpunk Hex */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center text-xs font-bold">2</span>
                  <h2 className="text-lg font-semibold text-authra-text-light dark:text-white">Cyberpunk Grid</h2>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-lg border border-authra-border-light dark:border-authra-border-dark hover:border-purple-500 hover:text-purple-500 text-xs font-medium transition-colors text-authra-text-light dark:text-white">Edit</button>
                  <button className="px-3 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-xs font-medium transition-colors shadow-lg shadow-purple-500/20">Issue</button>
                </div>
              </div>
              
              <div className="w-full relative rounded-xl overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.1)] border border-purple-500/20 group bg-[#050505]">
                <svg viewBox="0 0 1000 772.72" className="w-full h-auto block">
                  <foreignObject width="1000" height="772.72">
                    <div className="w-[1000px] h-[772.72px] origin-top-left pointer-events-none">
                      <CyberpunkGrid />
                    </div>
                  </foreignObject>
                </svg>
                <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/5 transition-colors pointer-events-auto cursor-pointer" onClick={() => {}}></div>
              </div>
            </div>

            {/* Template 3: Executive Glass */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-xs font-bold">3</span>
                  <h2 className="text-lg font-semibold text-authra-text-light dark:text-white">Executive Glass</h2>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-lg border border-authra-border-light dark:border-authra-border-dark hover:border-emerald-500 hover:text-emerald-500 text-xs font-medium transition-colors text-authra-text-light dark:text-white">Edit</button>
                  <button className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium transition-colors shadow-lg shadow-emerald-500/20">Issue</button>
                </div>
              </div>
              
              <div className="w-full relative rounded-xl overflow-hidden shadow-xl border border-slate-700/50 group bg-[#020617]">
                <svg viewBox="0 0 1000 772.72" className="w-full h-auto block">
                  <foreignObject width="1000" height="772.72">
                    <div className="w-[1000px] h-[772.72px] origin-top-left pointer-events-none">
                      <ExecutiveGlass />
                    </div>
                  </foreignObject>
                </svg>
                <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/5 transition-colors pointer-events-auto cursor-pointer" onClick={() => {}}></div>
              </div>
            </div>

            {/* Create Blank Template Card */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-4 opacity-0">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-transparent flex items-center justify-center text-xs font-bold">4</span>
                  <h2 className="text-lg font-semibold">Blank</h2>
                </div>
              </div>
              <div className="w-full aspect-[11/8.5] bg-white dark:bg-[#0D0F16] border-2 border-dashed border-authra-border-light dark:border-authra-border-dark rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center cursor-pointer hover:border-brand-steel hover:bg-brand-steel/5 group">
                <div className="w-12 h-12 rounded-full bg-brand-steel/10 flex items-center justify-center text-brand-steel mb-3 group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6" />
                </div>
                <h3 className="font-medium text-authra-text-light dark:text-white">Create Blank Template</h3>
                <p className="text-xs text-authra-text-sec-light dark:text-authra-text-sec-dark mt-1">Design from scratch</p>
              </div>
            </div>

          </div>
        </div>
      );
    }

    if (activeTab === 'bulk') {
      return (
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-[590] text-authra-text-light dark:text-white mb-2">
              Bulk Issue Certificates
            </h1>
            <p className="text-authra-text-sec-light dark:text-authra-text-sec-dark">
              Upload a CSV file to issue multiple credentials simultaneously.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-authra-border-dark rounded-2xl shadow-sm overflow-hidden p-8 md:p-12">
            
            <div className="w-full border-2 border-dashed border-authra-border-light dark:border-authra-border-dark hover:border-brand-steel dark:hover:border-brand-steel bg-authra-bg-light/30 dark:bg-[#0A0D14] rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group">
              <div className="w-16 h-16 rounded-full bg-brand-steel/10 flex items-center justify-center text-brand-steel mb-6 group-hover:scale-110 transition-transform duration-300">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-authra-text-light dark:text-white mb-2">Drag & Drop your CSV file here</h3>
              <p className="text-sm text-authra-text-sec-light dark:text-authra-text-sec-dark mb-6">or click to browse from your computer (max 5MB)</p>
              
              <button className="px-6 py-2.5 rounded-full text-sm font-[510] bg-brand-steel text-white shadow-[0_0_15px_rgba(95,110,183,0.4)] hover:shadow-[0_0_25px_rgba(95,110,183,0.6)] hover:brightness-110 hover:scale-105 transition-all duration-300">
                Browse Files
              </button>
            </div>

            <div className="mt-8 flex flex-col md:flex-row gap-6">
              <div className="flex-1 bg-brand-steel/5 dark:bg-brand-steel/10 border border-brand-steel/20 rounded-xl p-5 flex items-start gap-4">
                <AlertCircle className="w-5 h-5 text-brand-steel shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-authra-text-light dark:text-white mb-1">Formatting Required</h4>
                  <p className="text-xs text-authra-text-sec-light dark:text-authra-text-sec-dark leading-relaxed">
                    Ensure your CSV contains columns exactly named <strong>Name</strong>, <strong>Email</strong>, and <strong>Issue Date</strong>. Maximum of 500 rows allowed per batch upload.
                  </p>
                </div>
              </div>

              <div className="flex-shrink-0 flex items-center justify-center p-5 md:p-0">
                <button className="flex items-center gap-2 text-sm font-medium text-brand-steel hover:text-brand-ice transition-colors">
                  <FileText className="w-4 h-4" />
                  Download CSV Template
                </button>
              </div>
            </div>

          </div>
        </div>
      );
    }

    if (activeTab === 'sent') {
      const getStatusStyles = (status) => {
        switch (status) {
          case 'Delivered': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
          case 'Opened': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
          case 'Bounced': return 'bg-red-500/10 text-red-600 dark:text-red-400';
          case 'Revoked': return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
          default: return 'bg-brand-steel/10 text-brand-steel';
        }
      };

      return (
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-[590] text-authra-text-light dark:text-white mb-2">
                Sent Certificates
              </h1>
              <p className="text-authra-text-sec-light dark:text-authra-text-sec-dark">
                View issuance logs, track delivery status, and manage access.
              </p>
            </div>
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-authra-text-sec-light dark:text-authra-text-sec-dark" />
              <input 
                type="text" 
                placeholder="Search name, email, or mobile..." 
                className="w-full bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-authra-border-dark rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white placeholder-authra-text-sec-light dark:placeholder-authra-text-sec-dark"
              />
            </div>
          </div>

          <div className="bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-authra-border-dark rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-authra-border-light dark:border-authra-border-dark bg-authra-bg-light/50 dark:bg-authra-bg-dark/50">
                    <th className="py-4 px-6 text-xs font-semibold text-authra-text-sec-light dark:text-authra-text-sec-dark uppercase tracking-wider">Recipient</th>
                    <th className="py-4 px-6 text-xs font-semibold text-authra-text-sec-light dark:text-authra-text-sec-dark uppercase tracking-wider">Credential ID</th>
                    <th className="py-4 px-6 text-xs font-semibold text-authra-text-sec-light dark:text-authra-text-sec-dark uppercase tracking-wider">Date Sent</th>
                    <th className="py-4 px-6 text-xs font-semibold text-authra-text-sec-light dark:text-authra-text-sec-dark uppercase tracking-wider">Status</th>
                    <th className="py-4 px-6 text-xs font-semibold text-authra-text-sec-light dark:text-authra-text-sec-dark uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-authra-border-light dark:divide-authra-border-dark">
                  {issuedCertificates.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-authra-text-sec-light dark:text-authra-text-sec-dark text-sm">
                        No sent certificates found.
                      </td>
                    </tr>
                  ) : (
                    issuedCertificates.map((cert, i) => (
                      <tr key={i} className="hover:bg-authra-bg-light/50 dark:hover:bg-[#111522] transition-colors group">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand-steel/10 flex items-center justify-center text-brand-steel font-semibold text-xs">
                              {cert.recipientName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-authra-text-light dark:text-white">{cert.recipientName}</p>
                              <p className="text-xs text-authra-text-sec-light dark:text-authra-text-sec-dark">{cert.recipientEmail}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-sm font-medium text-authra-text-light dark:text-white bg-authra-bg-light dark:bg-[#111522] px-2.5 py-1 rounded-md border border-authra-border-light dark:border-authra-border-dark">
                            {cert.credentialId}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-authra-text-sec-light dark:text-authra-text-sec-dark">
                          {new Date(cert.issueDate).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyles('Delivered')}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
                            Delivered
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <Link to={`/verify/${cert.credentialId}`} target="_blank" className="text-brand-steel hover:text-brand-ice transition-colors p-2 hover:bg-brand-steel/10 rounded-lg inline-flex" title="View Certificate">
                            <Eye className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination placeholder */}
            <div className="p-4 border-t border-authra-border-light dark:border-authra-border-dark flex items-center justify-between text-sm text-authra-text-sec-light dark:text-authra-text-sec-dark bg-authra-bg-light/30 dark:bg-authra-bg-dark/30">
              <p>Showing 1 to 4 of 1,204 entries</p>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 rounded-md border border-authra-border-light dark:border-authra-border-dark hover:bg-white dark:hover:bg-[#0D0F16] disabled:opacity-50 transition-colors" disabled>Prev</button>
                <button className="px-3 py-1.5 rounded-md border border-authra-border-light dark:border-authra-border-dark hover:bg-white dark:hover:bg-[#0D0F16] transition-colors">Next</button>
              </div>
            </div>

          </div>
        </div>
      );
    }

    if (activeTab === 'settings') {
      return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-[590] text-authra-text-light dark:text-white mb-2">
              Organization Settings
            </h1>
            <p className="text-authra-text-sec-light dark:text-authra-text-sec-dark">
              Manage your public organization profile and contact details.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-authra-border-dark rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-authra-border-light dark:border-authra-border-dark bg-authra-bg-light/30 dark:bg-authra-bg-dark/30">
              <h3 className="font-semibold text-authra-text-light dark:text-white">Profile Information</h3>
            </div>
            
            <div className="p-6 md:p-8 space-y-6">
              {/* Logo Upload Section */}
              <div className="flex items-center gap-6 pb-6 border-b border-authra-border-light dark:border-authra-border-dark">
                <div className="relative w-20 h-20 rounded-xl bg-authra-bg-light dark:bg-[#0A0C10] border border-authra-border-light dark:border-authra-border-dark flex items-center justify-center overflow-hidden shrink-0">
                  {settingsForm.logoUrl ? (
                    <img src={settingsForm.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <UploadCloud className="w-8 h-8 text-authra-text-sec-light dark:text-authra-text-sec-dark" />
                  )}
                  {isUploadingLogo && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-authra-text-light dark:text-white mb-1">Organization Logo</h4>
                  <p className="text-xs text-authra-text-sec-light dark:text-authra-text-sec-dark mb-3">JPG or PNG. Max 5MB.</p>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-authra-border-light dark:border-authra-border-dark hover:bg-authra-bg-light dark:hover:bg-[#0A0C10] text-xs font-medium transition-colors text-authra-text-light dark:text-white">
                    <UploadCloud className="w-3.5 h-3.5" />
                    Upload Logo
                    <input type="file" accept="image/jpeg,image/png,image/jpg" className="hidden" onChange={handleLogoUpload} disabled={isUploadingLogo} />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark">Organization Name</label>
                  <input 
                    type="text" 
                    value={settingsForm.name}
                    onChange={(e) => setSettingsForm({...settingsForm, name: e.target.value})}
                    className="w-full bg-white dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark">Username (Public Profile URL)</label>
                  <input 
                    type="text" 
                    value={settingsForm.username}
                    onChange={(e) => setSettingsForm({...settingsForm, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')})}
                    className="w-full bg-white dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white" 
                    placeholder="your_org"
                  />
                </div>
              </div>

              <div className="space-y-2 mt-6">
                <label className="text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark">Email Address <span className="text-xs text-authra-text-sec-light dark:text-authra-text-sec-dark">(Read-only)</span></label>
                <input 
                  type="email" 
                  value={user?.email || ''}
                  disabled
                  className="w-full bg-gray-50 dark:bg-[#0A0C10] border border-authra-border-light dark:border-authra-border-dark rounded-xl px-4 py-3 text-sm text-authra-text-sec-light dark:text-authra-text-sec-dark cursor-not-allowed opacity-70" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark">Contact Number</label>
                  <input 
                    type="text" 
                    value={settingsForm.mobileNo}
                    onChange={(e) => setSettingsForm({...settingsForm, mobileNo: e.target.value})}
                    className="w-full bg-white dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white" 
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark">Website URL</label>
                  <input 
                    type="url" 
                    value={settingsForm.website}
                    onChange={(e) => setSettingsForm({...settingsForm, website: e.target.value})}
                    className="w-full bg-white dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white" 
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark">LinkedIn Profile</label>
                  <input 
                    type="url" 
                    value={settingsForm.linkedin}
                    onChange={(e) => setSettingsForm({...settingsForm, linkedin: e.target.value})}
                    className="w-full bg-white dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white" 
                    placeholder="https://linkedin.com/company/your-org"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark">GitHub Organization</label>
                  <input 
                    type="url" 
                    value={settingsForm.github}
                    onChange={(e) => setSettingsForm({...settingsForm, github: e.target.value})}
                    className="w-full bg-white dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white" 
                    placeholder="https://github.com/your-org"
                  />
                </div>
              </div>

              <div className="space-y-2 mt-6">
                <label className="text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark">About Organization</label>
                <textarea 
                  value={settingsForm.aboutOrg}
                  onChange={(e) => setSettingsForm({...settingsForm, aboutOrg: e.target.value})}
                  className="w-full bg-white dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white h-24 resize-none" 
                  placeholder="Tell us about your organization..."
                />
              </div>

              <div className="space-y-2 mt-6">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark">Gallery Images (URLs)</label>
                  <button 
                    onClick={() => setSettingsForm({...settingsForm, gallery: [...settingsForm.gallery, '']})}
                    className="text-xs text-brand-steel hover:text-brand-ice font-medium transition-colors"
                  >
                    + Add Image URL
                  </button>
                </div>
                {settingsForm.gallery.map((url, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-2">
                    <input 
                      type="url" 
                      value={url}
                      onChange={(e) => {
                        const newGallery = [...settingsForm.gallery];
                        newGallery[idx] = e.target.value;
                        setSettingsForm({...settingsForm, gallery: newGallery});
                      }}
                      className="flex-1 bg-white dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white" 
                      placeholder="https://example.com/image.jpg"
                    />
                    <button 
                      onClick={() => {
                        const newGallery = settingsForm.gallery.filter((_, i) => i !== idx);
                        setSettingsForm({...settingsForm, gallery: newGallery});
                      }}
                      className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 border-t border-authra-border-light dark:border-authra-border-dark bg-authra-bg-light/30 dark:bg-authra-bg-dark/30 flex items-center justify-end">
              <button 
                onClick={handleSaveSettings}
                disabled={isSavingSettings}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSavingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Settings className="w-4 h-4" />}
                {isSavingSettings ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
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
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 border-r border-authra-border-light dark:border-authra-border-dark bg-white dark:bg-[#0D0F16] flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-authra-border-light dark:border-authra-border-dark">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <img src={horizontalLogo} alt="Authra" className="h-6 w-auto object-contain" />
          </Link>
          <button 
            className="md:hidden p-2 -mr-2 text-authra-text-sec-light dark:text-authra-text-sec-dark hover:text-authra-text-light dark:hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          <button
            onClick={() => handleTabChange('overview')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-brand-steel/10 text-brand-steel' : 'text-authra-text-sec-light dark:text-authra-text-sec-dark hover:bg-authra-border-light/50 dark:hover:bg-white/5 hover:text-authra-text-light dark:hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Overview
          </button>

          <button
            onClick={() => handleTabChange('issue')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'issue' ? 'bg-brand-steel/10 text-brand-steel' : 'text-authra-text-sec-light dark:text-authra-text-sec-dark hover:bg-authra-border-light/50 dark:hover:bg-white/5 hover:text-authra-text-light dark:hover:text-white'}`}
          >
            <Plus className="w-5 h-5" />
            Issue Certificate
          </button>

          <button 
            onClick={() => handleTabChange('bulk')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'bulk' ? 'bg-brand-steel/10 text-brand-steel' : 'text-authra-text-sec-light dark:text-authra-text-sec-dark hover:bg-authra-border-light/50 dark:hover:bg-white/5 hover:text-authra-text-light dark:hover:text-white'}`}
          >
            <UploadCloud className="w-5 h-5" />
            Bulk Issue
          </button>

          <button 
            onClick={() => handleTabChange('templates')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'templates' ? 'bg-brand-steel/10 text-brand-steel' : 'text-authra-text-sec-light dark:text-authra-text-sec-dark hover:bg-authra-border-light/50 dark:hover:bg-white/5 hover:text-authra-text-light dark:hover:text-white'}`}
          >
            <FileBadge className="w-5 h-5" />
            My Templates
          </button>

          <button 
            onClick={() => handleTabChange('sent')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'sent' ? 'bg-brand-steel/10 text-brand-steel' : 'text-authra-text-sec-light dark:text-authra-text-sec-dark hover:bg-authra-border-light/50 dark:hover:bg-white/5 hover:text-authra-text-light dark:hover:text-white'}`}
          >
            <Send className="w-5 h-5" />
            Sent Logs
          </button>

          <button className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-authra-text-sec-light dark:text-authra-text-sec-dark hover:bg-authra-border-light/50 dark:hover:bg-white/5 hover:text-authra-text-light dark:hover:text-white`}>
            <Users className="w-5 h-5" />
            Recipients
          </button>
        </div>

        <div className="p-4 border-t border-authra-border-light dark:border-authra-border-dark flex flex-col gap-2">
          <button onClick={toggleTheme} className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors text-authra-text-sec-light dark:text-authra-text-sec-dark hover:bg-authra-border-light/50 dark:hover:bg-white/5 hover:text-authra-text-light dark:hover:text-white">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <div className={`w-8 h-4 rounded-full flex items-center p-0.5 transition-colors ${theme === 'dark' ? 'bg-brand-steel' : 'bg-gray-300'}`}>
              <div className={`w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${theme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </div>
          </button>
          
          <button 
            onClick={() => handleTabChange('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-brand-steel/10 text-brand-steel' : 'text-authra-text-sec-light dark:text-authra-text-sec-dark hover:bg-authra-border-light/50 dark:hover:bg-white/5 hover:text-authra-text-light dark:hover:text-white'}`}
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-20 flex-shrink-0 flex items-center justify-between px-6 lg:px-10 border-b border-authra-border-light dark:border-authra-border-dark bg-white/50 dark:bg-[#0D0F16]/50 backdrop-blur-md">
          <div className="flex items-center gap-4 w-full max-w-md">
            <button 
              className="md:hidden p-2 -ml-2 text-authra-text-sec-light dark:text-authra-text-sec-dark hover:text-authra-text-light dark:hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-authra-text-sec-light dark:text-authra-text-sec-dark" />
              <input
                type="text"
                placeholder="Search certificates, recipients..."
                className="w-full bg-white dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-brand-steel focus:ring-1 focus:ring-brand-steel transition-all text-authra-text-light dark:text-white placeholder-authra-text-sec-light dark:placeholder-authra-text-sec-dark"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative text-authra-text-sec-light dark:text-authra-text-sec-dark hover:text-authra-text-light dark:hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-brand-steel rounded-full border border-white dark:border-[#0D0F16]"></span>
            </button>
            <div className="relative" ref={profileMenuRef}>
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-steel to-brand-ice flex items-center justify-center text-white font-semibold text-sm shadow-sm cursor-pointer overflow-hidden hover:shadow-[0_0_15px_rgba(115,135,197,0.4)] hover:scale-105 transition-all"
              >
                {(user?.logoUrl || user?.profilePicture) ? (
                  <img src={user.logoUrl || user.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.name ? user.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'U'
                )}
              </button>

              {/* Dropdown Menu */}
              <div className={`absolute right-0 mt-3 w-56 bg-white dark:bg-[#111522] border border-authra-border-light dark:border-[#2A3155] rounded-2xl shadow-xl overflow-hidden transition-all duration-200 origin-top-right z-50 ${isProfileMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                <div className="p-4 border-b border-authra-border-light dark:border-[#2A3155]">
                  <p className="text-sm font-medium text-authra-text-light dark:text-[#F5F8FF] truncate">{user?.name || 'User'}</p>
                  <p className="text-xs text-authra-text-sec-light dark:text-[#9AA8D6] truncate">{user?.email}</p>
                </div>
                <div className="p-2">
                  <Link 
                    to={user?.accountType === 'organization' ? `/o/${user?.username || 'profile'}` : `/user/${user?.username || user?.email?.split('@')[0] || 'profile'}`} 
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-3 w-full p-2 text-sm text-authra-text-light dark:text-[#F5F8FF] hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-brand-steel" />
                    Public Profile
                  </Link>
                  <button 
                    onClick={() => { setIsProfileMenuOpen(false); handleTabChange('settings'); }}
                    className="flex items-center gap-3 w-full p-2 text-sm text-authra-text-light dark:text-[#F5F8FF] hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors"
                  >
                    <Settings className="w-4 h-4 text-brand-steel" />
                    Settings
                  </button>
                </div>
                <div className="p-2 border-t border-authra-border-light dark:border-[#2A3155]">
                  <button 
                    onClick={() => { setIsProfileMenuOpen(false); handleLogout(); }}
                    className="flex items-center gap-3 w-full p-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
