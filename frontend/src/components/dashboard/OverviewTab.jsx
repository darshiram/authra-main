import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  FileBadge,
  Activity,
  TrendingUp,
  CreditCard,
  ArrowUpRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function OverviewTab({
  user,
  metrics,
  issuedCertificates,
  extraCertsQuantity,
  setExtraCertsQuantity,
  showQuantitySelector,
  setShowQuantitySelector,
  handleBuyExtraCertificates,
  theme,
  setActiveTab
}) {
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

      {user?.plan !== 'free' && user?.planExpiryDate && (() => {
        const daysLeft = Math.ceil((new Date(user.planExpiryDate) - new Date()) / (1000 * 60 * 60 * 24));
        if (daysLeft <= 7 && daysLeft > 0) {
          return (
            <div className="mb-6 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-4 rounded-xl flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm">Subscription Expiring Soon</h4>
                  <p className="text-xs">Your current plan will expire in {daysLeft} day{daysLeft !== 1 ? 's' : ''}. Renew now to keep your advanced features.</p>
                </div>
              </div>
              <Link to="/pricing" className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium shadow-md hover:bg-amber-600 transition-colors">
                Renew Now
              </Link>
            </div>
          );
        }
        return null;
      })()}

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
              {user?.plan !== 'free' && user?.planExpiryDate && (
                <div className="text-xs text-authra-text-sec-light dark:text-authra-text-sec-dark font-medium mt-1">
                  Expires on: {new Date(user.planExpiryDate).toLocaleDateString()}
                </div>
              )}
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
