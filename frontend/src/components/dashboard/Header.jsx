import React from 'react';
import { Link } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  Settings,
  LogOut,
  User as UserIcon
} from 'lucide-react';

export default function Header({
  user,
  isProfileMenuOpen,
  setIsProfileMenuOpen,
  handleLogout,
  profileMenuRef,
  setIsMobileMenuOpen,
  handleTabChange
}) {
  return (
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
  );
}
