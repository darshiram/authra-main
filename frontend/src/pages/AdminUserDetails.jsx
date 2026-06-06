import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../config/api';
import { useToast } from '../context/ToastContext';
import { ArrowLeft, Save, User, Building2, Link as LinkIcon, MapPin, Briefcase } from 'lucide-react';

export default function AdminUserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const { data } = await axiosInstance.get(`/admin/users/${id}`);
      setUser(data);
      setLoading(false);
    } catch (err) {
      showToast('Error loading user details', 'error');
      navigate('/admin');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosInstance.put(`/admin/users/${id}`, user);
      showToast('User updated successfully', 'success');
      fetchUser();
    } catch (err) {
      showToast('Error updating user', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-authra-text-light dark:text-white">Loading User Details...</div>;
  }

  const isOrg = user.accountType === 'organization';

  return (
    <div className="min-h-screen bg-authra-bg-light dark:bg-[#0A0C10] pb-20 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/admin')}
              className="p-2 bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-authra-border-dark rounded-xl text-authra-text-sec-light hover:text-brand-steel transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-authra-text-light dark:text-white flex items-center gap-2">
                {isOrg ? <Building2 className="w-6 h-6 text-indigo-500" /> : <User className="w-6 h-6 text-indigo-500" />}
                {isOrg ? user.orgName : user.fullName}
              </h1>
              <p className="text-sm text-authra-text-sec-light dark:text-authra-text-sec-dark">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <form className="space-y-6">
          {/* Core Info */}
          <div className="bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-authra-border-dark rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-authra-text-light dark:text-white mb-4 border-b border-authra-border-light dark:border-authra-border-dark pb-2">Core Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark mb-1">Email</label>
                <input 
                  type="email" 
                  value={user.email || ''} 
                  onChange={(e) => setUser({...user, email: e.target.value})}
                  className="w-full bg-authra-bg-light dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-steel text-authra-text-light dark:text-white"
                />
              </div>
              {isOrg ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark mb-1">Organization Name</label>
                    <input 
                      type="text" 
                      value={user.orgName || ''} 
                      onChange={(e) => setUser({...user, orgName: e.target.value})}
                      className="w-full bg-authra-bg-light dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-steel text-authra-text-light dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark mb-1">Mobile No</label>
                    <input 
                      type="text" 
                      value={user.mobileNo || ''} 
                      onChange={(e) => setUser({...user, mobileNo: e.target.value})}
                      className="w-full bg-authra-bg-light dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-steel text-authra-text-light dark:text-white"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={user.fullName || ''} 
                      onChange={(e) => setUser({...user, fullName: e.target.value})}
                      className="w-full bg-authra-bg-light dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-steel text-authra-text-light dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark mb-1">Username</label>
                    <input 
                      type="text" 
                      value={user.username || ''} 
                      onChange={(e) => setUser({...user, username: e.target.value})}
                      className="w-full bg-authra-bg-light dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-steel text-authra-text-light dark:text-white"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Extended Info */}
          <div className="bg-white dark:bg-[#0D0F16] border border-authra-border-light dark:border-authra-border-dark rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-authra-text-light dark:text-white mb-4 border-b border-authra-border-light dark:border-authra-border-dark pb-2">Profile Details</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark mb-1">
                  {isOrg ? 'About Organization' : 'Bio'}
                </label>
                <textarea 
                  rows="4"
                  value={isOrg ? (user.aboutOrg || '') : (user.bio || '')} 
                  onChange={(e) => isOrg ? setUser({...user, aboutOrg: e.target.value}) : setUser({...user, bio: e.target.value})}
                  className="w-full bg-authra-bg-light dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-steel text-authra-text-light dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {!isOrg && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark mb-1 flex items-center gap-1"><Briefcase className="w-3 h-3"/> College / University</label>
                      <input 
                        type="text" 
                        value={user.college || ''} 
                        onChange={(e) => setUser({...user, college: e.target.value})}
                        className="w-full bg-authra-bg-light dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-steel text-authra-text-light dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark mb-1">Degree</label>
                      <input 
                        type="text" 
                        value={user.degree || ''} 
                        onChange={(e) => setUser({...user, degree: e.target.value})}
                        className="w-full bg-authra-bg-light dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-steel text-authra-text-light dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark mb-1">Branch</label>
                      <input 
                        type="text" 
                        value={user.branch || ''} 
                        onChange={(e) => setUser({...user, branch: e.target.value})}
                        className="w-full bg-authra-bg-light dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-steel text-authra-text-light dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark mb-1">Graduation Year</label>
                      <input 
                        type="text" 
                        value={user.year || ''} 
                        onChange={(e) => setUser({...user, year: e.target.value})}
                        className="w-full bg-authra-bg-light dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-steel text-authra-text-light dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark mb-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Location</label>
                      <input 
                        type="text" 
                        value={user.location || ''} 
                        onChange={(e) => setUser({...user, location: e.target.value})}
                        className="w-full bg-authra-bg-light dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-steel text-authra-text-light dark:text-white"
                      />
                    </div>
                  </>
                )}
                
                {isOrg && (
                  <div>
                    <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark mb-1 flex items-center gap-1"><LinkIcon className="w-3 h-3"/> Website</label>
                    <input 
                      type="url" 
                      value={user.website || ''} 
                      onChange={(e) => setUser({...user, website: e.target.value})}
                      className="w-full bg-authra-bg-light dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-steel text-authra-text-light dark:text-white"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark mb-1 flex items-center gap-1"><LinkIcon className="w-3 h-3"/> LinkedIn</label>
                  <input 
                    type="url" 
                    value={user.linkedin || ''} 
                    onChange={(e) => setUser({...user, linkedin: e.target.value})}
                    className="w-full bg-authra-bg-light dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-steel text-authra-text-light dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-authra-text-light dark:text-authra-text-sec-dark mb-1 flex items-center gap-1"><LinkIcon className="w-3 h-3"/> GitHub</label>
                  <input 
                    type="url" 
                    value={user.github || ''} 
                    onChange={(e) => setUser({...user, github: e.target.value})}
                    className="w-full bg-authra-bg-light dark:bg-black border border-authra-border-light dark:border-authra-border-dark rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-steel text-authra-text-light dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
