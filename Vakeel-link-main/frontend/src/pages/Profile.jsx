import React, { useEffect, useState } from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  Bell, 
  CreditCard, 
  Settings, 
  Camera,
  CheckCircle2,
  Lock,
  Smartphone,
  Globe,
  Trash2
} from 'lucide-react';
import UserSidebar from '../components/UserSidebar';
import useAuth from '../components/useAuth';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [fullName, setFullName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(''), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem('vakeellink_token');
      if (!token || token === 'mock_jwt_token') return;
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data?.full_name) setFullName(data.full_name);
      } catch (_err) {
        // Keep local fallback when backend isn't available.
      }
    };
    loadProfile();
  }, []);

  const handleSaveProfile = async () => {
    const trimmedName = fullName.trim();
    if (!trimmedName) {
      setToast('Name cannot be empty');
      return;
    }

    const token = localStorage.getItem('vakeellink_token');
    if (!token || token === 'mock_jwt_token') {
      const savedUser = JSON.parse(localStorage.getItem('vakeellink_user') || '{}');
      localStorage.setItem('vakeellink_user', JSON.stringify({ ...savedUser, name: trimmedName }));
      setToast('Saved locally (demo mode)');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ full_name: trimmedName }),
      });
      if (!res.ok) throw new Error();
      setToast('Profile updated');
    } catch (_err) {
      setToast('Unable to save profile right now');
    }
  };

  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword) {
      setToast('Enter current and new password');
      return;
    }
    setCurrentPassword('');
    setNewPassword('');
    setToast('Password update request submitted');
  };

  const handleToggle2FA = () => {
    setTwoFactorEnabled((prev) => !prev);
    setToast(twoFactorEnabled ? 'Two-factor disabled' : 'Two-factor enabled');
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200">
      <UserSidebar />

      <main className="flex-1 md:ml-[280px] p-6 md:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <header className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
              Account <span className="text-indigo-500">Settings</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl leading-relaxed font-medium">
              Manage your personal information, account security, and subscription preferences.
            </p>
          </header>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-64 shrink-0">
              <nav className="flex flex-col gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                      activeTab === tab.id 
                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                        : 'text-slate-500 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </aside>

            {/* Content Area */}
            <div className="flex-1">
              <div className="glass-effect rounded-[40px] border border-white/10 p-8 md:p-12 space-y-12">
                
                {activeTab === 'personal' && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="relative group">
                        <div className="w-32 h-32 rounded-full border-4 border-white/10 bg-slate-900 flex items-center justify-center text-4xl font-black text-white overflow-hidden shadow-2xl relative">
                          {user?.name?.charAt(0) || 'U'}
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <Camera size={24} className="text-white" />
                          </div>
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-indigo-600 rounded-full border-4 border-[#020617] flex items-center justify-center shadow-lg">
                          <CheckCircle2 size={12} className="text-white" />
                        </div>
                      </div>
                      <div className="text-center md:text-left space-y-1">
                        <h2 className="text-2xl font-black text-white">{user?.name || 'User Name'}</h2>
                        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">{user?.role || 'Client'} Account</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                      <div className="space-y-4">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Full Name</label>
                        <div className="relative">
                          <User size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" />
                          <input 
                            type="text" 
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:border-indigo-500 outline-none transition-all font-bold" 
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Address</label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" />
                          <input 
                            type="email" 
                            defaultValue={user?.email}
                            disabled
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm text-slate-400 cursor-not-allowed outline-none font-bold" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6">
                      <button onClick={handleSaveProfile} className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 hover:-translate-y-1 transition-all">
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-white">Security & Password</h3>
                      <p className="text-slate-500 text-sm font-medium">Update your password and manage two-factor authentication.</p>
                    </div>

                    <div className="space-y-8 pt-6 border-t border-white/5">
                      <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-4">
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Password</label>
                          <div className="relative">
                            <Lock size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" />
                            <input 
                              type="password" 
                              placeholder="••••••••••••"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:border-indigo-500 outline-none transition-all font-bold" 
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">New Password</label>
                          <div className="relative">
                            <Lock size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" />
                            <input 
                              type="password" 
                              placeholder="New password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-sm text-white focus:border-indigo-500 outline-none transition-all font-bold" 
                            />
                          </div>
                        </div>
                      </div>
                      
                      <button onClick={handleUpdatePassword} className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 hover:-translate-y-1 transition-all">
                        Update Password
                      </button>
                    </div>

                    <div className="bg-white/5 rounded-3xl p-8 border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-400">
                          <Smartphone size={24} />
                        </div>
                        <div>
                          <h4 className="text-white font-black text-sm tracking-tight">Two-Factor Authentication</h4>
                          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Status: {twoFactorEnabled ? 'Enabled' : 'Disabled'}</p>
                        </div>
                      </div>
                      <button onClick={handleToggle2FA} className="text-indigo-400 font-black text-[10px] uppercase tracking-widest hover:text-white transition-colors">{twoFactorEnabled ? 'Disable' : 'Enable'}</button>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-white">Notification Preferences</h3>
                      <p className="text-slate-500 text-sm font-medium">Control which updates you receive via email and push.</p>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-white/5">
                      {[
                        { title: 'Case Updates', desc: 'Alerts for status changes in your active matters.' },
                        { title: 'Meeting Reminders', desc: 'Reminders for upcoming consultations.' },
                        { title: 'Marketplace Offers', desc: 'Exclusive deals from legal professionals.' },
                        { title: 'System Alerts', desc: 'Security alerts and system maintenance notes.' }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-6 rounded-3xl hover:bg-white/5 transition-all">
                          <div className="space-y-1">
                            <h4 className="text-white font-black text-sm tracking-tight">{item.title}</h4>
                            <p className="text-slate-500 text-xs font-medium">{item.desc}</p>
                          </div>
                          <div className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-indigo-600">
                            <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'billing' && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-white">Subscription & Billing</h3>
                      <p className="text-slate-500 text-sm font-medium">Manage your plan and view recent transaction history.</p>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-600/20">
                      <div className="absolute top-0 right-0 p-8 opacity-10">
                        <CreditCard size={120} />
                      </div>
                      <div className="relative space-y-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest">Active Plan</span>
                            <h4 className="text-3xl font-black mt-3">VakeelLink Premium</h4>
                          </div>
                          <span className="text-3xl font-black">$49<span className="text-sm opacity-60">/mo</span></span>
                        </div>
                        <div className="pt-6 border-t border-white/20 flex justify-between items-center">
                          <p className="text-xs font-bold uppercase tracking-widest opacity-80">Next Renewal: June 15, 2024</p>
                          <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all">Manage</button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Billing History</h4>
                      <div className="space-y-4">
                        {[
                          { date: 'May 15, 2024', amount: '$49.00', status: 'Success' },
                          { date: 'Apr 15, 2024', amount: '$49.00', status: 'Success' }
                        ].map((inv, i) => (
                          <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/5">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                                <CreditCard size={18} />
                              </div>
                              <div>
                                <p className="text-white font-black text-sm">{inv.date}</p>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{inv.status}</p>
                              </div>
                            </div>
                            <span className="text-white font-black">{inv.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Danger Zone */}
              <div className="mt-12 p-8 rounded-[40px] border border-rose-500/10 bg-rose-500/[0.02] flex items-center justify-between">
                <div>
                  <h4 className="text-rose-400 font-black text-sm tracking-tight">Danger Zone</h4>
                  <p className="text-slate-500 text-xs font-medium mt-1">Permanently delete your account and all associated data.</p>
                </div>
                <button className="flex items-center gap-2 text-rose-500 font-black text-[10px] uppercase tracking-widest px-6 py-3 hover:bg-rose-500/10 rounded-xl transition-all">
                  <Trash2 size={16} />
                  Delete Account
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>

      {toast && (
        <div className="fixed bottom-8 right-8 z-[120] glass-effect text-white px-6 py-4 rounded-2xl border border-white/10 shadow-2xl text-[10px] font-black uppercase tracking-widest">
          {toast}
        </div>
      )}
    </div>
  );
}
