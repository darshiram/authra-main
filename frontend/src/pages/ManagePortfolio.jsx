import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Loader2, ArrowLeft, Plus, Trash2, Folder, Award, Upload, FileText, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../config/api';

export default function ManagePortfolio() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('projects');
  const [uploadingIndex, setUploadingIndex] = useState(null);

  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('/users/me');
        setProjects(res.data.projects || []);
        setCertificates(res.data.certificates || []);
      } catch (error) {
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await axiosInstance.put('/users/me', {
        projects,
        certificates
      });
      setMessage({ type: 'success', text: 'Portfolio updated successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update portfolio.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (index, file) => {
    if (!file) return;
    
    setUploadingIndex(index);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await axiosInstance.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      updateCertificate(index, 'fileUrl', res.data.url);
      setMessage({ type: 'success', text: 'File uploaded successfully!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to upload file.' });
    } finally {
      setUploadingIndex(null);
    }
  };

  const addProject = () => {
    setProjects([...projects, { title: '', description: '', link: '', github: '', tags: [] }]);
  };

  const updateProject = (index, field, value) => {
    const newProjects = [...projects];
    if (field === 'tags') {
      newProjects[index][field] = value.split(',').map(t => t.trim()).filter(t => t);
    } else {
      newProjects[index][field] = value;
    }
    setProjects(newProjects);
  };

  const removeProject = (index) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const addCertificate = () => {
    setCertificates([...certificates, { title: '', issuer: '', issueDate: '', link: '', fileUrl: '', skills: [] }]);
  };

  const updateCertificate = (index, field, value) => {
    const newCerts = [...certificates];
    if (field === 'skills') {
      newCerts[index][field] = value.split(',').map(s => s.trim()).filter(s => s);
    } else {
      newCerts[index][field] = value;
    }
    setCertificates(newCerts);
  };

  const removeCertificate = (index) => {
    setCertificates(certificates.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 bg-authra-bg-light dark:bg-[#0D0F16]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-steel" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-authra-bg-light dark:bg-[#0D0F16]">
      <div className="max-w-[800px] mx-auto px-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-2 text-authra-text-sec-light dark:text-[#9AA8D6] hover:text-authra-text-light dark:hover:text-[#F5F8FF] transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <h1 className="text-3xl font-[590] text-authra-text-light dark:text-[#F5F8FF]">Manage Portfolio</h1>
            <p className="text-authra-text-sec-light dark:text-[#9AA8D6] mt-2">Add your projects and upload external certificates.</p>
          </div>
          
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="flex items-center gap-2 bg-gradient-to-r from-brand-ice to-brand-steel text-white px-6 py-2.5 rounded-xl font-[510] text-sm shadow-[0_0_15px_rgba(115,135,197,0.4)] hover:shadow-[0_0_25px_rgba(115,135,197,0.6)] hover:brightness-110 transition-all disabled:opacity-70 disabled:cursor-not-allowed shrink-0 w-fit"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Portfolio
          </button>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'}`}>
            {message.text}
          </div>
        )}

        {/* Custom Tabs */}
        <div className="flex p-1 bg-white dark:bg-[#111522] border border-authra-border-light dark:border-[#2A3155] rounded-xl mb-6 w-full max-w-sm">
          <button 
            onClick={() => setActiveTab('projects')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'projects' ? 'bg-authra-bg-light dark:bg-[#2A3155] text-authra-text-light dark:text-white shadow-sm' : 'text-authra-text-sec-light dark:text-[#9AA8D6] hover:text-authra-text-light dark:hover:text-white'}`}
          >
            <Folder className="w-4 h-4" /> Projects
          </button>
          <button 
            onClick={() => setActiveTab('certificates')}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'certificates' ? 'bg-authra-bg-light dark:bg-[#2A3155] text-authra-text-light dark:text-white shadow-sm' : 'text-authra-text-sec-light dark:text-[#9AA8D6] hover:text-authra-text-light dark:hover:text-white'}`}
          >
            <Award className="w-4 h-4" /> Certificates
          </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#111522] border border-authra-border-light dark:border-[#2A3155] rounded-3xl p-6 sm:p-8 shadow-sm"
        >
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-authra-text-light dark:text-[#F5F8FF]">Your Projects</h2>
                <button onClick={addProject} className="flex items-center gap-1.5 text-sm font-medium text-brand-steel hover:text-brand-ice transition-colors">
                  <Plus className="w-4 h-4" /> Add Project
                </button>
              </div>
              
              <AnimatePresence>
                {projects.length === 0 ? (
                  <p className="text-sm text-authra-text-sec-light dark:text-[#9AA8D6] text-center py-8">No projects added yet.</p>
                ) : (
                  projects.map((proj, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-5 border border-authra-border-light dark:border-[#2A3155] rounded-2xl bg-authra-bg-light dark:bg-[#0D0F16] relative group"
                    >
                      <button onClick={() => removeProject(i)} className="absolute top-4 right-4 text-authra-text-sec-light hover:text-red-500 transition-colors p-1" title="Remove Project">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-authra-text-sec-light dark:text-[#9AA8D6] ml-1">Project Title</label>
                          <input type="text" value={proj.title} onChange={e => updateProject(i, 'title', e.target.value)} className="w-full bg-white dark:bg-[#111522] border border-authra-border-light dark:border-[#2A3155] rounded-xl py-2 px-3 text-sm text-authra-text-light dark:text-[#F5F8FF] focus:border-brand-steel outline-none transition-all" />
                        </div>
                        
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-authra-text-sec-light dark:text-[#9AA8D6] ml-1">Live Demo Link</label>
                          <input type="url" placeholder="https://" value={proj.link} onChange={e => updateProject(i, 'link', e.target.value)} className="w-full bg-white dark:bg-[#111522] border border-authra-border-light dark:border-[#2A3155] rounded-xl py-2 px-3 text-sm text-authra-text-light dark:text-[#F5F8FF] focus:border-brand-steel outline-none transition-all" />
                        </div>

                        <div className="sm:col-span-2 space-y-1.5">
                          <label className="text-xs font-medium text-authra-text-sec-light dark:text-[#9AA8D6] ml-1">Description</label>
                          <textarea rows="2" value={proj.description} onChange={e => updateProject(i, 'description', e.target.value)} className="w-full bg-white dark:bg-[#111522] border border-authra-border-light dark:border-[#2A3155] rounded-xl py-2 px-3 text-sm text-authra-text-light dark:text-[#F5F8FF] focus:border-brand-steel outline-none transition-all resize-none"></textarea>
                        </div>
                        
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-authra-text-sec-light dark:text-[#9AA8D6] ml-1">GitHub Repo</label>
                          <input type="url" placeholder="https://github.com/..." value={proj.github} onChange={e => updateProject(i, 'github', e.target.value)} className="w-full bg-white dark:bg-[#111522] border border-authra-border-light dark:border-[#2A3155] rounded-xl py-2 px-3 text-sm text-authra-text-light dark:text-[#F5F8FF] focus:border-brand-steel outline-none transition-all" />
                        </div>
                        
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-authra-text-sec-light dark:text-[#9AA8D6] ml-1">Tech Stack (comma separated)</label>
                          <input type="text" placeholder="React, Node.js" value={proj.tags?.join(', ')} onChange={e => updateProject(i, 'tags', e.target.value)} className="w-full bg-white dark:bg-[#111522] border border-authra-border-light dark:border-[#2A3155] rounded-xl py-2 px-3 text-sm text-authra-text-light dark:text-[#F5F8FF] focus:border-brand-steel outline-none transition-all" />
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          )}

          {activeTab === 'certificates' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-semibold text-authra-text-light dark:text-[#F5F8FF]">External Certificates</h2>
                <button onClick={addCertificate} className="flex items-center gap-1.5 text-sm font-medium text-brand-steel hover:text-brand-ice transition-colors">
                  <Plus className="w-4 h-4" /> Add Certificate
                </button>
              </div>

              <div className="bg-brand-steel/10 border border-brand-steel/30 rounded-xl p-4 flex gap-3 text-sm text-authra-text-light dark:text-[#F5F8FF]">
                <Award className="w-5 h-5 text-brand-steel shrink-0" />
                <p>Upload your external certifications here. Note: Since these were not issued on Authra, they will appear without the cryptographically verified badge on your profile.</p>
              </div>
              
              <AnimatePresence>
                {certificates.length === 0 ? (
                  <p className="text-sm text-authra-text-sec-light dark:text-[#9AA8D6] text-center py-8">No certificates added yet.</p>
                ) : (
                  certificates.map((cert, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-5 border border-authra-border-light dark:border-[#2A3155] rounded-2xl bg-authra-bg-light dark:bg-[#0D0F16] relative group"
                    >
                      <button onClick={() => removeCertificate(i)} className="absolute top-4 right-4 text-authra-text-sec-light hover:text-red-500 transition-colors p-1" title="Remove Certificate">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-authra-text-sec-light dark:text-[#9AA8D6] ml-1">Certificate Title</label>
                          <input type="text" placeholder="e.g. AWS Solutions Architect" value={cert.title} onChange={e => updateCertificate(i, 'title', e.target.value)} className="w-full bg-white dark:bg-[#111522] border border-authra-border-light dark:border-[#2A3155] rounded-xl py-2 px-3 text-sm text-authra-text-light dark:text-[#F5F8FF] focus:border-brand-steel outline-none transition-all" />
                        </div>
                        
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-authra-text-sec-light dark:text-[#9AA8D6] ml-1">Issuer Organization</label>
                          <input type="text" placeholder="e.g. Amazon Web Services" value={cert.issuer} onChange={e => updateCertificate(i, 'issuer', e.target.value)} className="w-full bg-white dark:bg-[#111522] border border-authra-border-light dark:border-[#2A3155] rounded-xl py-2 px-3 text-sm text-authra-text-light dark:text-[#F5F8FF] focus:border-brand-steel outline-none transition-all" />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-authra-text-sec-light dark:text-[#9AA8D6] ml-1">Issue Date</label>
                          <input type="text" placeholder="e.g. May 2026" value={cert.issueDate} onChange={e => updateCertificate(i, 'issueDate', e.target.value)} className="w-full bg-white dark:bg-[#111522] border border-authra-border-light dark:border-[#2A3155] rounded-xl py-2 px-3 text-sm text-authra-text-light dark:text-[#F5F8FF] focus:border-brand-steel outline-none transition-all" />
                        </div>
                        
                        <div className="space-y-1.5">
                          <label className="text-xs font-medium text-authra-text-sec-light dark:text-[#9AA8D6] ml-1">Credential URL or File (Optional)</label>
                          <div className="flex gap-2">
                            <input type="url" placeholder="https://" value={cert.link} onChange={e => updateCertificate(i, 'link', e.target.value)} className="w-full bg-white dark:bg-[#111522] border border-authra-border-light dark:border-[#2A3155] rounded-xl py-2 px-3 text-sm text-authra-text-light dark:text-[#F5F8FF] focus:border-brand-steel outline-none transition-all" />
                            <label className="flex items-center justify-center bg-white dark:bg-[#111522] border border-authra-border-light dark:border-[#2A3155] rounded-xl px-3 hover:border-brand-steel cursor-pointer transition-colors shrink-0" title="Upload Certificate File (PNG, JPG, PDF)">
                              {uploadingIndex === i ? (
                                <Loader2 className="w-4 h-4 animate-spin text-brand-steel" />
                              ) : cert.fileUrl ? (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              ) : (
                                <Upload className="w-4 h-4 text-authra-text-sec-light dark:text-[#9AA8D6] hover:text-brand-steel transition-colors" />
                              )}
                              <input type="file" className="hidden" accept="image/png, image/jpeg, application/pdf" onChange={(e) => handleFileUpload(i, e.target.files[0])} />
                            </label>
                          </div>
                          {cert.fileUrl && (
                            <p className="text-[10px] text-green-500 ml-1">File attached successfully</p>
                          )}
                        </div>
                        
                        <div className="sm:col-span-2 space-y-1.5">
                          <label className="text-xs font-medium text-authra-text-sec-light dark:text-[#9AA8D6] ml-1">Skills Validated (comma separated)</label>
                          <input type="text" placeholder="AWS, Cloud, Architecture" value={cert.skills?.join(', ')} onChange={e => updateCertificate(i, 'skills', e.target.value)} className="w-full bg-white dark:bg-[#111522] border border-authra-border-light dark:border-[#2A3155] rounded-xl py-2 px-3 text-sm text-authra-text-light dark:text-[#F5F8FF] focus:border-brand-steel outline-none transition-all" />
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
}
