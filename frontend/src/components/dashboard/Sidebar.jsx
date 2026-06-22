import React from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  LayoutDashboard,
  Plus,
  UploadCloud,
  FileBadge,
  Send,
  Users,
  Moon,
  Sun,
  Settings,
  Palette
} from 'lucide-react';
import horizontalLogo from '../../assets/horziontal logo.png';

export default function Sidebar({
  activeTab,
  handleTabChange,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  theme,
  toggleTheme
}) {
  return (
    <>
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
            onClick={() => handleTabChange('design-requests')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'design-requests' ? 'bg-brand-steel/10 text-brand-steel' : 'text-authra-text-sec-light dark:text-authra-text-sec-dark hover:bg-authra-border-light/50 dark:hover:bg-white/5 hover:text-authra-text-light dark:hover:text-white'}`}
          >
            <Palette className="w-5 h-5" />
            Design Requests
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
    </>
  );
}
