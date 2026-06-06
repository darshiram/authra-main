import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building2, Award, Settings, CreditCard, Search, ArrowUpRight, ArrowDownRight, Edit2, Shield, Eye, Palette, Activity, Megaphone } from 'lucide-react';
import { axiosInstance } from '../config/api';
import { useToast } from '../context/ToastContext';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState({ data: [], total: 0, page: 1, pages: 1 });
  const [designRequests, setDesignRequests] = useState([]);
  const [systemSettings, setSystemSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterPlan, setFilterPlan] = useState('');
  
  // Logs State
  const [systemLogs, setSystemLogs] = useState({ data: [], total: 0, page: 1, pages: 1 });
  const [logSearch, setLogSearch] = useState('');
  const [logActionType, setLogActionType] = useState('');

  // Broadcast State
  const [broadcastAudience, setBroadcastAudience] = useState('organization');
  const [broadcastSubject, setBroadcastSubject] = useState('');
  const [broadcastHtml, setBroadcastHtml] = useState('');
  const [broadcasting, setBroadcasting] = useState(false);

  // Sponsorship Modal State
  const [sponsorModal, setSponsorModal] = useState({ isOpen: false, user: null });
  const [sponsorDuration, setSponsorDuration] = useState(12);
  const [sponsorCerts, setSponsorCerts] = useState(100);

  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    // Check if user is admin
    const checkAdmin = async () => {
      try {
        const res = await axiosInstance.get('/users/me');
        if (res.data.role !== 'Admin' && res.data.role !== 'SuperAdmin') {
          showToast('Access denied', 'error');
          navigate('/');
        } else {
          fetchData();
        }
      } catch (error) {
        navigate('/login');
      }
    };
    
    checkAdmin();
  }, [navigate]);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'designs') fetchDesignRequests();
    if (activeTab === 'settings') fetchSettings();
    if (activeTab === 'logs') fetchLogs();
  }, [activeTab, users.page, filterType, filterPlan, systemLogs.page, logActionType]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get('/admin/stats');
      setStats(data);
    } catch (err) {
      showToast('Error loading stats', 'error');
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axiosInstance.get(`/admin/users?page=${users.page}&search=${searchQuery}&accountType=${filterType}&plan=${filterPlan}`);
      setUsers(data);
    } catch (err) {
      showToast('Error loading users', 'error');
    }
  };

  const fetchDesignRequests = async () => {
    try {
      const { data } = await axiosInstance.get('/admin/design-requests');
      setDesignRequests(data);
    } catch (err) {
      showToast('Error loading requests', 'error');
    }
  };

  const fetchSettings = async () => {
    try {
      const { data } = await axiosInstance.get('/admin/settings');
      setSystemSettings(data);
    } catch (err) {
      showToast('Error loading settings', 'error');
    }
  };

  const fetchLogs = async () => {
    try {
      const { data } = await axiosInstance.get(`/admin/logs?page=${systemLogs.page}&search=${logSearch}&actionType=${logActionType}`);
      setSystemLogs(data);
    } catch (err) {
      showToast('Error loading logs', 'error');
    }
  };

  const handleUpdatePlan = async (userId, newPlan) => {
    try {
      await axiosInstance.put(`/admin/users/${userId}/plan`, { plan: newPlan });
      showToast('Plan updated successfully', 'success');
      fetchUsers();
    } catch (err) {
      showToast('Error updating plan', 'error');
    }
  };

  const handleIssueSponsorship = async (e) => {
    e.preventDefault();
    if (!sponsorModal.user) return;
    
    try {
      await axiosInstance.put(`/admin/users/${sponsorModal.user._id}/plan`, { 
        plan: 'sponsor',
        durationMonths: sponsorDuration,
        extraCertificates: sponsorCerts
      });
      showToast('Sponsorship issued successfully!', 'success');
      setSponsorModal({ isOpen: false, user: null });
      fetchUsers();
    } catch (err) {
      showToast('Error issuing sponsorship', 'error');
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastSubject || !broadcastHtml) {
      return showToast('Subject and HTML content are required', 'error');
    }

    setBroadcasting(true);
    try {
      await axiosInstance.post('/admin/broadcast', {
        targetAudience: broadcastAudience,
        subject: broadcastSubject,
        htmlContent: broadcastHtml
      });
      showToast('Broadcast sent successfully!', 'success');
      setBroadcastSubject('');
      setBroadcastHtml('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Error sending broadcast', 'error');
    } finally {
      setBroadcasting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-authra-text-light dark:text-white">Loading Admin...</div>;
  }

  return (
    <div className="min-h-screen bg-authra-bg-light dark:bg-[#0A0C10] pb-20">
      {/* Admin Header */}
      <div className="bg-white dark:bg-[#0D0F16] border-b border-authra-border-light dark:border-authra-border-dark sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-500 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h1 className="font-bold text-xl text-authra-text-light dark:text-white">Master Admin</h1>
            </div>
            <button onClick={() => navigate('/dashboard')} className="text-sm font-medium text-brand-steel hover:text-brand-ice transition-colors">
              Exit Admin
            </button>
          </div>
          
          <div className="flex space-x-8 overflow-x-auto no-scrollbar">
            {[
              { id: 'overview', label: 'Overview', icon: <Eye className="w-4 h-4" /> },
              { id: 'users', label: 'Users & Orgs', icon: <Users className="w-4 h-4" /> },
              { id: 'designs', label: 'Design Requests', icon: <Palette className="w-4 h-4" /> },
              { id: 'logs', label: 'Activity Logs', icon: <Activity className="w-4 h-4" /> },
              { id: 'broadcast', label: 'Broadcast', icon: <Megaphone className="w-4 h-4" /> },
              { id: 'settings', label: 'System Settings', icon: <Settings className="w-4 h-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 border-b-2 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id 
                    ? 'border-indigo-500 text-indigo-500' 
                    : 'border-transparent text-authra-text-sec-light dark:text-authra-text-sec-dark hover:text-authra-text-light dark:hover:text-white'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-[#0D0F16] p-6 rounded-2xl border border-authra-border-light dark:border-authra-border-dark shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl"><Users className="w-6 h-6" /></div>
                  <p className="text-sm font-medium text-authra-text-sec-light dark:text-authra-text-sec-dark">Total Users</p>
                </div>
                <h3 className="text-3xl font-bold text-authra-text-light dark:text-white">{stats.totalUsers.toLocaleString()}</h3>
              </div>
              <div className="bg-white dark:bg-[#0D0F16] p-6 rounded-2xl border border-authra-border-light dark:border-authra-border-dark shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-purple-500/10 text-purple-500 rounded-xl"><Building2 className="w-6 h-6" /></div>
                  <p className="text-sm font-medium text-authra-text-sec-light dark:text-authra-text-sec-dark">Total Orgs</p>
                </div>
                <h3 className="text-3xl font-bold text-authra-text-light dark:text-white">{stats.totalOrgs.toLocaleString()}</h3>
              </div>
              <div className="bg-white dark:bg-[#0D0F16] p-6 rounded-2xl border border-authra-border-light dark:border-authra-border-dark shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-brand-steel/10 text-brand-steel rounded-xl"><Award className="w-6 h-6" /></div>
                  <p className="text-sm font-medium text-authra-text-sec-light dark:text-authra-text-sec-dark">Certificates Issued</p>
                </div>
                <h3 className="text-3xl font-bold text-authra-text-light dark:text-white">{stats.totalCertificates.toLocaleString()}</h3>
              </div>
              <div className="bg-white dark:bg-[#0D0F16] p-6 rounded-2xl border border-authra-border-light dark:border-authra-border-dark shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl"><CreditCard className="w-6 h-6" /></div>
                  <p className="text-sm font-medium text-authra-text-sec-light dark:text-authra-text-sec-dark">Paid Plans</p>
                </div>
                <h3 className="text-3xl font-bold text-authra-text-light dark:text-white">
                  {stats.planDistribution.filter(p => p._id !== 'free').reduce((acc, curr) => acc + curr.count, 0)}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              {/* Plan Distribution Chart */}
              <div className="bg-white dark:bg-[#0D0F16] p-6 rounded-2xl border border-authra-border-light dark:border-authra-border-dark shadow-sm">
                <h3 className="font-semibold text-authra-text-light dark:text-white mb-6">Plan Distribution (Organizations)</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.planDistribution.map(p => ({ name: p._id === 'free' ? 'Free' : p._id === 'pro' ? 'Pro' : p._id === 'enterprise' ? 'Enterprise' : p._id === 'sponsor' ? 'Sponsor' : 'Other', value: p.count }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        isAnimationActive={false}
                      >
                        {stats.planDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'][index % 5]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0D0F16', borderColor: '#1E293B', color: '#fff', borderRadius: '8px' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Signups */}
              <div className="bg-white dark:bg-[#0D0F16] p-6 rounded-2xl border border-authra-border-light dark:border-authra-border-dark shadow-sm">
                <h3 className="font-semibold text-authra-text-light dark:text-white mb-6">Recent Signups</h3>
                <div className="space-y-4">
                  {stats.recentSignups.map(user => (
                    <div key={user._id} className="flex items-center justify-between p-4 bg-authra-bg-light/50 dark:bg-black/50 rounded-xl border border-authra-border-light dark:border-authra-border-dark">
                      <div>
                        <p className="font-medium text-authra-text-light dark:text-white text-sm">{user.fullName || user.email.split('@')[0]}</p>
                        <p className="text-xs text-authra-text-sec-light dark:text-authra-text-sec-dark">{user.email}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${
                          user.accountType === 'organization' ? 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
                        }`}>
                          {user.accountType}
                        </span>
                        <p className="text-[10px] text-authra-text-sec-light mt-1">{new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                  {stats.recentSignups.length === 0 && (
                    <p className="text-sm text-authra-text-sec-light">No recent signups.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-authra-border-dark rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-authra-border-light dark:border-authra-border-dark flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4">
              <h2 className="text-lg font-semibold text-authra-text-light dark:text-white whitespace-nowrap">User Management</h2>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-authra-bg-light dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-steel text-authra-text-light dark:text-white"
                >
                  <option value="">All Types</option>
                  <option value="user">User</option>
                  <option value="organization">Organization</option>
                </select>
                <select 
                  value={filterPlan}
                  onChange={(e) => setFilterPlan(e.target.value)}
                  className="bg-authra-bg-light dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-steel text-authra-text-light dark:text-white"
                >
                  <option value="">All Plans</option>
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="enterprise">Enterprise</option>
                  <option value="sponsor">Sponsor</option>
                </select>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-authra-text-sec-light" />
                  <input 
                    type="text" 
                    placeholder="Search emails..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                    className="w-full bg-authra-bg-light dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-brand-steel text-authra-text-light dark:text-white"
                  />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-authra-bg-light/50 dark:bg-black/50 text-xs uppercase text-authra-text-sec-light dark:text-authra-text-sec-dark">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Name / Org</th>
                    <th className="px-6 py-4 font-semibold">Email</th>
                    <th className="px-6 py-4 font-semibold">Type</th>
                    <th className="px-6 py-4 font-semibold">Current Plan</th>
                    <th className="px-6 py-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-authra-border-light dark:divide-authra-border-dark">
                  {users.data.map(user => (
                    <tr key={user._id} className="hover:bg-authra-bg-light/30 dark:hover:bg-white/[0.02]">
                      <td className="px-6 py-4 text-sm text-authra-text-light dark:text-white font-medium">{user.orgName || user.fullName || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-authra-text-sec-light dark:text-[#9AA8D6]">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-authra-text-sec-light dark:text-[#9AA8D6] capitalize">{user.accountType}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold capitalize ${
                          user.plan === 'free' ? 'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400' :
                          user.plan === 'pro' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' :
                          user.plan === 'enterprise' ? 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400' :
                          'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
                        }`}>
                          {user.plan}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex items-center gap-2">
                        <select 
                          value={user.plan}
                          onChange={(e) => handleUpdatePlan(user._id, e.target.value)}
                          className="bg-transparent border border-authra-border-light dark:border-authra-border-dark rounded p-1 text-xs text-authra-text-light dark:text-white focus:outline-none focus:border-brand-steel"
                        >
                          <option value="free">Free</option>
                          <option value="pro">Pro</option>
                          <option value="enterprise">Enterprise</option>
                          {user.accountType === 'organization' && <option value="sponsor">Sponsor</option>}
                        </select>
                        {user.accountType === 'organization' && (
                          <button 
                            onClick={() => setSponsorModal({ isOpen: true, user })}
                            className="px-2 py-1 bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400 rounded text-xs font-medium hover:bg-yellow-500/20 transition-colors"
                          >
                            Issue Sponsership
                          </button>
                        )}
                        <button 
                          onClick={() => navigate(`/admin/users/${user._id}`)}
                          className="px-2 py-1 bg-brand-steel/10 text-brand-steel rounded text-xs font-medium hover:bg-brand-steel/20 transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'designs' && (
          <div className="bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-authra-border-dark rounded-2xl p-6 shadow-sm">
             <h2 className="text-lg font-semibold text-authra-text-light dark:text-white mb-6">Custom Design Requests</h2>
             {designRequests.length === 0 ? (
               <p className="text-authra-text-sec-light dark:text-authra-text-sec-dark text-sm">No requests found.</p>
             ) : (
               <div className="space-y-4">
                 {designRequests.map(req => (
                   <div key={req._id} className="p-4 border border-authra-border-light dark:border-authra-border-dark rounded-xl">
                     <div className="flex justify-between items-start mb-2">
                       <div>
                         <h4 className="font-semibold text-authra-text-light dark:text-white">{req.userId?.orgName || req.userId?.fullName}</h4>
                         <p className="text-xs text-authra-text-sec-light">{req.userId?.email}</p>
                       </div>
                       <span className="px-2 py-1 bg-yellow-500/10 text-yellow-600 text-xs font-semibold rounded capitalize">{req.status}</span>
                     </div>
                     <p className="text-sm text-authra-text-light dark:text-white mt-4 whitespace-pre-wrap">{req.description}</p>
                     {req.link && (
                       <a href={req.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-brand-steel hover:underline mt-4">
                         View Reference <ArrowUpRight className="w-3 h-3" />
                       </a>
                     )}
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-authra-border-dark rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-authra-border-light dark:border-authra-border-dark flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4">
              <h2 className="text-lg font-semibold text-authra-text-light dark:text-white whitespace-nowrap">System Logs</h2>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <select 
                  value={logActionType}
                  onChange={(e) => setLogActionType(e.target.value)}
                  className="bg-authra-bg-light dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-steel text-authra-text-light dark:text-white"
                >
                  <option value="">All Actions</option>
                  <option value="LOGIN">Login</option>
                  <option value="REGISTER">Register</option>
                  <option value="ISSUE_CERTIFICATE">Issue Certificate</option>
                  <option value="BULK_ISSUE">Bulk Issue</option>
                  <option value="UPDATE_PLAN">Update Plan</option>
                </select>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-authra-text-sec-light" />
                  <input 
                    type="text" 
                    placeholder="Search logs..." 
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchLogs()}
                    className="w-full bg-authra-bg-light dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-brand-steel text-authra-text-light dark:text-white"
                  />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-authra-bg-light/50 dark:bg-black/50 text-xs uppercase text-authra-text-sec-light dark:text-authra-text-sec-dark">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Timestamp</th>
                    <th className="px-6 py-4 font-semibold">Actor</th>
                    <th className="px-6 py-4 font-semibold">Action</th>
                    <th className="px-6 py-4 font-semibold">Details</th>
                    <th className="px-6 py-4 font-semibold">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-authra-border-light dark:divide-authra-border-dark">
                  {systemLogs.data.map(log => (
                    <tr key={log._id} className="hover:bg-authra-bg-light/30 dark:hover:bg-white/[0.02]">
                      <td className="px-6 py-4 text-sm text-authra-text-sec-light dark:text-[#9AA8D6] whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-authra-text-light dark:text-white font-medium">
                        {log.userId ? (log.userId.orgName || log.userId.fullName) : 'System'}
                        <div className="text-xs text-authra-text-sec-light font-normal">{log.userId?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          log.action === 'LOGIN' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' :
                          log.action === 'REGISTER' ? 'bg-green-100 text-green-600 dark:bg-green-500/20 dark:text-green-400' :
                          log.action.includes('CERTIFICATE') || log.action.includes('ISSUE') ? 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400' :
                          'bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-authra-text-sec-light dark:text-[#9AA8D6]">
                        {log.details}
                      </td>
                      <td className="px-6 py-4 text-sm text-authra-text-sec-light dark:text-authra-text-sec-dark font-mono text-xs">
                        {log.ipAddress}
                      </td>
                    </tr>
                  ))}
                  {systemLogs.data.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-sm text-authra-text-sec-light">
                        No activity logs found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && systemSettings && (
          <div className="bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-authra-border-dark rounded-2xl p-6 shadow-sm max-w-4xl">
             <div className="flex justify-between items-center mb-6">
               <h2 className="text-lg font-semibold text-authra-text-light dark:text-white">System Settings</h2>
               <button 
                  onClick={async () => {
                    try {
                      await axiosInstance.put('/admin/settings', systemSettings);
                      showToast('Settings saved successfully', 'success');
                    } catch(err) {
                      showToast('Error saving settings', 'error');
                    }
                  }}
                  className="btn-primary"
                >
                  Save Global Settings
                </button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Contact Information */}
               <div className="space-y-4">
                  <h3 className="font-medium text-authra-text-light dark:text-white border-b border-authra-border-light dark:border-authra-border-dark pb-2">Contact Information</h3>
                  <div>
                    <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark mb-1">Support Email</label>
                    <input 
                      type="email" 
                      value={systemSettings.contactEmail || ''} 
                      onChange={(e) => setSystemSettings({...systemSettings, contactEmail: e.target.value})}
                      className="w-full bg-authra-bg-light dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-steel text-authra-text-light dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark mb-1">Careers Email</label>
                    <input 
                      type="email" 
                      value={systemSettings.careersEmail || ''} 
                      onChange={(e) => setSystemSettings({...systemSettings, careersEmail: e.target.value})}
                      className="w-full bg-authra-bg-light dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-steel text-authra-text-light dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark mb-1">Phone Number</label>
                    <input 
                      type="text" 
                      value={systemSettings.contactPhone || ''} 
                      onChange={(e) => setSystemSettings({...systemSettings, contactPhone: e.target.value})}
                      className="w-full bg-authra-bg-light dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-steel text-authra-text-light dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark mb-1">Live Chat Hours</label>
                    <input 
                      type="text" 
                      value={systemSettings.contactLiveChatHours || ''} 
                      onChange={(e) => setSystemSettings({...systemSettings, contactLiveChatHours: e.target.value})}
                      className="w-full bg-authra-bg-light dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-steel text-authra-text-light dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark mb-1">Physical Address</label>
                    <textarea 
                      value={systemSettings.contactAddress || ''} 
                      onChange={(e) => setSystemSettings({...systemSettings, contactAddress: e.target.value})}
                      rows="3"
                      className="w-full bg-authra-bg-light dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-steel text-authra-text-light dark:text-white"
                    />
                  </div>
               </div>

               {/* Social Links */}
               <div className="space-y-4">
                  <h3 className="font-medium text-authra-text-light dark:text-white border-b border-authra-border-light dark:border-authra-border-dark pb-2">Social Links</h3>
                  <div>
                    <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark mb-1">LinkedIn URL</label>
                    <input 
                      type="url" 
                      value={systemSettings.socialLinks?.linkedin || ''} 
                      onChange={(e) => setSystemSettings({
                        ...systemSettings, 
                        socialLinks: { ...systemSettings.socialLinks, linkedin: e.target.value }
                      })}
                      className="w-full bg-authra-bg-light dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-steel text-authra-text-light dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark mb-1">Twitter (X) URL</label>
                    <input 
                      type="url" 
                      value={systemSettings.socialLinks?.twitter || ''} 
                      onChange={(e) => setSystemSettings({
                        ...systemSettings, 
                        socialLinks: { ...systemSettings.socialLinks, twitter: e.target.value }
                      })}
                      className="w-full bg-authra-bg-light dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-steel text-authra-text-light dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark mb-1">Instagram URL</label>
                    <input 
                      type="url" 
                      value={systemSettings.socialLinks?.instagram || ''} 
                      onChange={(e) => setSystemSettings({
                        ...systemSettings, 
                        socialLinks: { ...systemSettings.socialLinks, instagram: e.target.value }
                      })}
                      className="w-full bg-authra-bg-light dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-steel text-authra-text-light dark:text-white"
                    />
                  </div>
               </div>
             </div>
          </div>
        )}

        {activeTab === 'broadcast' && (
          <div className="bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-authra-border-dark rounded-2xl p-6 shadow-sm max-w-3xl">
             <div className="mb-6">
               <h2 className="text-lg font-semibold text-authra-text-light dark:text-white flex items-center gap-2">
                 <Megaphone className="w-5 h-5 text-indigo-500" />
                 Broadcast to Organizations
               </h2>
               <p className="text-sm text-authra-text-sec-light dark:text-authra-text-sec-dark mt-1">
                 Send an email update to all registered organizations.
               </p>
             </div>
             
             <form onSubmit={handleBroadcast} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark mb-2">Target Audience</label>
                  <select 
                    value={broadcastAudience}
                    onChange={(e) => setBroadcastAudience(e.target.value)}
                    className="w-full bg-authra-bg-light dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-steel text-authra-text-light dark:text-white"
                  >
                    <option value="organization">Organizations Only</option>
                    <option value="user">Regular Users Only</option>
                    <option value="all">Everyone (All Accounts)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark mb-2">Email Subject</label>
                  <input 
                    type="text" 
                    value={broadcastSubject}
                    onChange={(e) => setBroadcastSubject(e.target.value)}
                    placeholder="E.g., New Feature Update: Bulk Certification is Here!"
                    className="w-full bg-authra-bg-light dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-steel text-authra-text-light dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark mb-2">HTML Content</label>
                  <textarea 
                    value={broadcastHtml}
                    onChange={(e) => setBroadcastHtml(e.target.value)}
                    placeholder="<p>Write your HTML content here...</p>"
                    rows="8"
                    className="w-full bg-authra-bg-light dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-steel text-authra-text-light dark:text-white font-mono"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  disabled={broadcasting}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {broadcasting ? 'Sending...' : 'Send Broadcast'}
                </button>
             </form>
          </div>
        )}
      </div>

      {/* Sponsorship Modal */}
      {sponsorModal.isOpen && sponsorModal.user && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-authra-border-dark rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-authra-text-light dark:text-white mb-2">Issue Sponsorship</h3>
            <p className="text-sm text-authra-text-sec-light dark:text-authra-text-sec-dark mb-6">
              Granting sponsorship to <span className="font-semibold text-brand-steel">{sponsorModal.user.orgName || sponsorModal.user.fullName}</span>.
            </p>
            
            <form onSubmit={handleIssueSponsorship} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark mb-1">Duration (Months)</label>
                <input 
                  type="number" 
                  min="1"
                  value={sponsorDuration}
                  onChange={(e) => setSponsorDuration(e.target.value)}
                  className="w-full bg-authra-bg-light dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-steel text-authra-text-light dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark mb-1">Custom Certificate Limit</label>
                <input 
                  type="number" 
                  min="1"
                  value={sponsorCerts}
                  onChange={(e) => setSponsorCerts(e.target.value)}
                  className="w-full bg-authra-bg-light dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-steel text-authra-text-light dark:text-white"
                  required
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setSponsorModal({ isOpen: false, user: null })}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-authra-text-sec-light hover:text-authra-text-light dark:text-authra-text-sec-dark dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-brand-steel hover:bg-brand-ice text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Issue Sponsorship
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
