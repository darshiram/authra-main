import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Moon, Sun, User as UserIcon, Settings, LogOut, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../config/api';
import horizontalLogo from '../assets/horziontal logo.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Initial theme setup based on OS or localStorage
    const savedTheme = localStorage.getItem('theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(savedTheme);
    if (savedTheme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get('/users/me');
        setUser(res.data);
      } catch (err) {
        // Not logged in, that's fine for navbar
      }
    };
    fetchUser();

    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      setUser(null);
      setIsProfileMenuOpen(false);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

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

  const navLinks = ['Dashboard', 'Profile', 'Developers', 'Pricing'];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${isScrolled ? 'pt-2 md:pt-4' : 'pt-4 md:pt-6'}`}>
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
        <div className={`relative flex items-center justify-between px-6 py-3 rounded-full transition-all duration-500 ease-in-out
          ${isScrolled
            ? 'bg-white/80 dark:bg-[#0D0F16]/80 backdrop-blur-xl border border-authra-border-light dark:border-brand-steel/30 shadow-[0_4px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_0_20px_rgba(115,135,197,0.15)]'
            : 'bg-white/60 dark:bg-[#0D0F16]/50 backdrop-blur-lg border border-authra-border-light/50 dark:border-white/5'
          }`}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <img src={horizontalLogo} alt="Authra" className="h-7 w-auto object-contain cursor-pointer" />
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link, index) => {
              const isRoute = link === 'Dashboard' || link === 'Profile';
              const path = link === 'Dashboard' ? '/dashboard' : link === 'Profile' ? (user ? `/user/${user.username || 'profile'}` : '/login') : `/#${link.toLowerCase()}`;
              
              return (
                <React.Fragment key={link}>
                  {isRoute ? (
                    <Link to={path} className="group relative text-sm font-[510] text-authra-text-sec-light dark:text-authra-text-sec-dark hover:text-authra-text-light dark:hover:text-brand-ice transition-colors duration-300">
                      {link}
                      <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-brand-ice transition-all duration-300 ease-out group-hover:w-full group-hover:shadow-[0_0_8px_rgba(168,211,232,0.8)]"></span>
                    </Link>
                  ) : (
                    <a href={path} className="group relative text-sm font-[510] text-authra-text-sec-light dark:text-authra-text-sec-dark hover:text-authra-text-light dark:hover:text-brand-ice transition-colors duration-300">
                      {link}
                      <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-brand-ice transition-all duration-300 ease-out group-hover:w-full group-hover:shadow-[0_0_8px_rgba(168,211,232,0.8)]"></span>
                    </a>
                  )}
                  {index < navLinks.length - 1 && (
                    <span className="w-1 h-1 rounded-full bg-authra-border-light dark:bg-authra-border-dark"></span>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <button onClick={toggleTheme} className="p-2 rounded-full text-authra-text-sec-light dark:text-authra-text-sec-dark hover:bg-black/5 dark:hover:bg-white/10 transition-colors" aria-label="Toggle Theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <button 
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center gap-2 w-10 h-10 rounded-full bg-gradient-to-tr from-brand-steel to-brand-ice text-sm font-bold text-white shadow-md hover:shadow-[0_0_15px_rgba(115,135,197,0.4)] hover:scale-105 transition-all overflow-hidden"
                >
                  <div className="w-full h-full flex items-center justify-center">
                    {user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : 'U'}
                  </div>
                </button>
                
                {/* Dropdown Menu */}
                <div className={`absolute right-0 mt-3 w-56 bg-white dark:bg-[#111522] border border-authra-border-light dark:border-[#2A3155] rounded-2xl shadow-xl overflow-hidden transition-all duration-200 origin-top-right ${isProfileMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                  <div className="p-4 border-b border-authra-border-light dark:border-[#2A3155]">
                    <p className="text-sm font-medium text-authra-text-light dark:text-[#F5F8FF] truncate">{user.name || 'User'}</p>
                    <p className="text-xs text-authra-text-sec-light dark:text-[#9AA8D6] truncate">{user.email}</p>
                  </div>
                  <div className="p-2">
                    <Link 
                      to={user.accountType === 'organization' ? '/dashboard' : `/user/${user.username || user.email?.split('@')[0] || 'profile'}`} 
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-3 w-full p-2 text-sm text-authra-text-light dark:text-[#F5F8FF] hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-brand-steel" />
                      {user.accountType === 'organization' ? 'Dashboard' : 'My Profile'}
                    </Link>
                    <Link 
                      to="/settings" 
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-3 w-full p-2 text-sm text-authra-text-light dark:text-[#F5F8FF] hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors"
                    >
                      <Settings className="w-4 h-4 text-brand-steel" />
                      Settings
                    </Link>
                  </div>
                  <div className="p-2 border-t border-authra-border-light dark:border-[#2A3155]">
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full p-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="px-5 py-2 rounded-full text-sm font-[510] bg-transparent border border-brand-steel/50 dark:border-brand-steel text-authra-text-light dark:text-brand-ice hover:bg-brand-steel/10 dark:hover:bg-brand-steel/20 hover:shadow-[0_0_15px_rgba(95,110,183,0.3)] transition-all duration-300">
                  Sign In
                </Link>
                <Link to="/signup" className="px-5 py-2 rounded-full text-sm font-[510] bg-gradient-to-r from-brand-ice to-brand-steel text-white shadow-[0_0_15px_rgba(115,135,197,0.4)] hover:shadow-[0_0_25px_rgba(115,135,197,0.6)] hover:brightness-110 hover:scale-105 transition-all duration-300">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 text-authra-text-sec-light dark:text-authra-text-sec-dark" aria-label="Toggle Theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-authra-text-light dark:text-white" aria-label="Toggle Menu">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`md:hidden absolute top-full left-0 right-0 mt-4 mx-4 p-6 rounded-2xl bg-white/95 dark:bg-[#0D0F16]/95 backdrop-blur-xl border border-authra-border-light dark:border-authra-border-dark shadow-2xl transition-all duration-300 ease-in-out origin-top ${isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
        <div className="flex flex-col gap-6">
          {navLinks.map((link) => {
            const isRoute = link === 'Dashboard' || link === 'Profile';
            const path = link === 'Dashboard' ? '/dashboard' : link === 'Profile' ? (user ? `/user/${user.username || 'profile'}` : '/login') : `/#${link.toLowerCase()}`;
            
            return isRoute ? (
              <Link key={link} to={path} onClick={() => setIsOpen(false)} className="text-lg font-[510] text-authra-text-light dark:text-white hover:text-brand-periwinkle dark:hover:text-brand-ice transition-colors">
                {link}
              </Link>
            ) : (
              <a key={link} href={path} onClick={() => setIsOpen(false)} className="text-lg font-[510] text-authra-text-light dark:text-white hover:text-brand-periwinkle dark:hover:text-brand-ice transition-colors">
                {link}
              </a>
            );
          })}
          <div className="h-px w-full bg-authra-border-light dark:bg-authra-border-dark my-2"></div>
          {user ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4 px-4 py-3 bg-black/5 dark:bg-white/5 rounded-2xl mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-steel to-brand-ice flex items-center justify-center text-sm font-bold text-white shrink-0">
                  {user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase() : 'U'}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-authra-text-light dark:text-[#F5F8FF] truncate">{user.name || 'User'}</p>
                  <p className="text-xs text-authra-text-sec-light dark:text-[#9AA8D6] truncate">{user.email}</p>
                </div>
              </div>
              <Link 
                to={user.accountType === 'organization' ? '/dashboard' : `/user/${user.username || user.email?.split('@')[0] || 'profile'}`} 
                onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 py-3 px-4 rounded-xl text-authra-text-light dark:text-[#F5F8FF] font-[510] transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              >
                <UserIcon className="w-5 h-5 text-brand-steel" />
                {user.accountType === 'organization' ? 'Dashboard' : 'My Profile'}
              </Link>
              <Link 
                to="/settings" 
                onClick={() => setIsOpen(false)} 
                className="flex items-center gap-3 py-3 px-4 rounded-xl text-authra-text-light dark:text-[#F5F8FF] font-[510] transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              >
                <Settings className="w-5 h-5 text-brand-steel" />
                Settings
              </Link>
              <button 
                onClick={() => { setIsOpen(false); handleLogout(); }} 
                className="flex items-center gap-3 py-3 px-4 rounded-xl text-red-600 dark:text-red-400 font-[510] transition-colors hover:bg-red-50 dark:hover:bg-red-500/10 w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                Log Out
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)} className="text-center py-3 rounded-full border border-brand-steel/50 dark:border-brand-steel text-authra-text-light dark:text-brand-ice font-[510] transition-colors hover:bg-brand-steel/10">
                Sign In
              </Link>
              <Link to="/signup" onClick={() => setIsOpen(false)} className="text-center py-3 rounded-full bg-gradient-to-r from-brand-ice to-brand-steel text-white shadow-[0_0_15px_rgba(115,135,197,0.4)] font-[510] hover:brightness-110">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
