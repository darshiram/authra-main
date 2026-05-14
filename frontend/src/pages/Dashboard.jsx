import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../config/api';
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
  Eye
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
  const [isLoading, setIsLoading] = useState(true);
  const [issueRecipients, setIssueRecipients] = useState([{ name: '', email: '' }]);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [additionalDetails, setAdditionalDetails] = useState({ skills: '', college: '', eventName: '' });
  const [isIssuing, setIsIssuing] = useState(false);
  const navigate = useNavigate();

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
                <span className="text-4xl font-bold text-authra-text-light dark:text-white tracking-tight">12,845</span>
                <span className="flex items-center text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3 mr-1" /> +14%
                </span>
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
                <span className="text-4xl font-bold text-authra-text-light dark:text-white tracking-tight">1,204</span>
                <span className="text-xs text-authra-text-sec-light dark:text-authra-text-sec-dark font-medium">
                  vs 980 last month
                </span>
              </div>
            </div>

            {/* Plan Info */}
            <div className="bg-gradient-to-br from-brand-steel/5 to-brand-ice/10 dark:from-brand-steel/10 dark:to-[#0D0F16] p-6 border border-brand-steel/20 dark:border-authra-border-dark rounded-2xl shadow-sm relative overflow-hidden group">
              <div className="absolute -top-4 -right-4 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <CreditCard className="w-24 h-24 text-brand-steel" />
              </div>
              <div className="relative z-10">
                <h3 className="text-authra-text-sec-light dark:text-authra-text-sec-dark text-sm font-medium mb-4">Current Plan</h3>
                <div className="flex items-end gap-3 mb-2">
                  <span className="text-3xl font-bold text-authra-text-light dark:text-white tracking-tight">Enterprise</span>
                  <span className="text-[10px] uppercase tracking-wider text-brand-steel font-bold px-2 py-1 bg-brand-steel/10 rounded-full mb-1">Active</span>
                </div>
                <div className="mt-5">
                  <div className="flex justify-between text-xs font-medium text-authra-text-sec-light dark:text-authra-text-sec-dark mb-1.5">
                    <span>API Usage (24k / 50k)</span>
                    <span className="text-brand-steel">48%</span>
                  </div>
                  <div className="w-full bg-white/50 dark:bg-black/50 h-2 rounded-full overflow-hidden">
                    <div className="bg-brand-steel h-full rounded-full" style={{ width: '48%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-authra-border-dark rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-authra-border-light dark:border-authra-border-dark flex justify-between items-center bg-authra-bg-light/30 dark:bg-authra-bg-dark/30">
              <h3 className="font-semibold text-authra-text-light dark:text-white">Recent Issuances</h3>
              <button className="text-sm text-brand-steel hover:text-brand-ice flex items-center gap-1 font-medium transition-colors">
                View All <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
            <div className="divide-y divide-authra-border-light dark:divide-authra-border-dark">
              {/* Dummy data removed. Will be populated from backend */}
              <div className="px-6 py-8 text-center text-authra-text-sec-light dark:text-authra-text-sec-dark text-sm">
                No recent issuances found.
              </div>
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
                  {/* Dummy data removed */}
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-authra-text-sec-light dark:text-authra-text-sec-dark text-sm">
                      No sent certificates found.
                    </td>
                  </tr>
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
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-authra-border-light dark:border-authra-border-dark bg-white dark:bg-[#0D0F16] flex flex-col hidden md:flex">
        <Link to="/" className="h-20 flex items-center px-6 border-b border-authra-border-light dark:border-authra-border-dark hover:opacity-80 transition-opacity">
          <img src={horizontalLogo} alt="Authra" className="h-6 w-auto object-contain " />
        </Link>

        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-brand-steel/10 text-brand-steel' : 'text-authra-text-sec-light dark:text-authra-text-sec-dark hover:bg-authra-border-light/50 dark:hover:bg-white/5 hover:text-authra-text-light dark:hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Overview
          </button>

          <button
            onClick={() => setActiveTab('issue')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'issue' ? 'bg-brand-steel/10 text-brand-steel' : 'text-authra-text-sec-light dark:text-authra-text-sec-dark hover:bg-authra-border-light/50 dark:hover:bg-white/5 hover:text-authra-text-light dark:hover:text-white'}`}
          >
            <Plus className="w-5 h-5" />
            Issue Certificate
          </button>

          <button 
            onClick={() => setActiveTab('bulk')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'bulk' ? 'bg-brand-steel/10 text-brand-steel' : 'text-authra-text-sec-light dark:text-authra-text-sec-dark hover:bg-authra-border-light/50 dark:hover:bg-white/5 hover:text-authra-text-light dark:hover:text-white'}`}
          >
            <UploadCloud className="w-5 h-5" />
            Bulk Issue
          </button>

          <button 
            onClick={() => setActiveTab('templates')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'templates' ? 'bg-brand-steel/10 text-brand-steel' : 'text-authra-text-sec-light dark:text-authra-text-sec-dark hover:bg-authra-border-light/50 dark:hover:bg-white/5 hover:text-authra-text-light dark:hover:text-white'}`}
          >
            <FileBadge className="w-5 h-5" />
            My Templates
          </button>

          <button 
            onClick={() => setActiveTab('sent')}
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
          
          <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors text-authra-text-sec-light dark:text-authra-text-sec-dark hover:bg-authra-border-light/50 dark:hover:bg-white/5 hover:text-authra-text-light dark:hover:text-white`}>
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
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-steel to-brand-ice flex items-center justify-center text-white font-semibold text-sm shadow-sm cursor-pointer">
              {user?.name ? user.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'U'}
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
