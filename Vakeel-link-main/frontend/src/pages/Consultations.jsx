import React, { useMemo, useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  ChevronRight, 
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import UserSidebar from '../components/UserSidebar';
import { MOCK_CONSULTATIONS } from '../utils/mockData';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

export default function Consultations() {
  const [consultations, setConsultations] = useState(MOCK_CONSULTATIONS);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(''), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const loadConsultations = async () => {
      const token = localStorage.getItem('vakeellink_token');
      if (!token || token === 'mock_jwt_token') return;

      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/consultations/mine`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const payload = await res.json();
        const normalized = (payload?.data || []).map((item) => ({
          id: item.id,
          lawyerName: item.lawyer_name || item.lawyerName || 'Assigned Lawyer',
          specialization: item.domain || item.specialization || 'General Law',
          date: item.scheduled_at ? new Date(item.scheduled_at).toLocaleDateString() : 'TBD',
          time: item.scheduled_at ? new Date(item.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'TBD',
          status: item.status || 'Pending',
          type: item.mode === 'video' ? 'Video Call' : item.mode === 'in_person' ? 'In-person' : 'Video Call',
          meetingUrl: item.meeting_url || '',
          location: item.location || '',
        }));
        if (normalized.length) setConsultations(normalized);
      } catch (_err) {
        // Keep mock fallback for local/dev usage.
      }
    };

    loadConsultations();
  }, []);

  const handleJoinMeeting = (cons) => {
    if (cons.meetingUrl) {
      window.open(cons.meetingUrl, '_blank', 'noopener,noreferrer');
      setToast('Opening meeting link');
      return;
    }
    setToast('Meeting link not available yet');
  };

  const handleViewLocation = (cons) => {
    const query = cons.location || `${cons.lawyerName} law chamber`;
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`, '_blank', 'noopener,noreferrer');
    setToast('Opening location in Maps');
  };

  const activeCount = useMemo(() => consultations.length, [consultations.length]);

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200">
      <UserSidebar />

      <main className="flex-1 md:ml-[280px] p-6 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <header className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
              My <span className="text-indigo-500">Consultations</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl leading-relaxed font-medium">
              Manage your legal appointments, view meeting links, and track your consultation history.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-8">
            {/* Active / Upcoming */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Upcoming Appointments</h2>
                <span className="px-3 py-1 bg-indigo-600/10 text-indigo-400 rounded-full text-[10px] font-black">{activeCount} Active</span>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {consultations.map((cons) => (
                  <div key={cons.id} className="glass-effect rounded-[40px] p-8 md:p-10 border border-white/5 hover:bg-white/[0.04] transition-all group flex flex-col md:flex-row gap-8 items-center">
                    <div className="w-20 h-20 rounded-[28px] bg-indigo-600/10 flex items-center justify-center text-indigo-400 shrink-0 shadow-lg shadow-indigo-600/5">
                      {cons.type === 'Video Call' ? <Video size={36} /> : <MapPin size={36} />}
                    </div>
                    
                    <div className="flex-1 space-y-3 text-center md:text-left">
                      <div className="flex flex-col md:flex-row md:items-center gap-3">
                        <h3 className="text-2xl font-black text-white">{cons.lawyerName}</h3>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mx-auto md:mx-0 ${
                          cons.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                        }`}>
                          <CheckCircle2 size={12} />
                          {cons.status}
                        </div>
                      </div>
                      <p className="text-slate-400 font-bold text-sm">{cons.specialization} • Verified Specialist</p>
                      
                      <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-2">
                        <div className="flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-widest">
                          <Calendar size={14} className="text-indigo-400" />
                          {cons.date}
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-widest">
                          <Clock size={14} className="text-indigo-400" />
                          {cons.time}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                      {cons.type === 'Video Call' ? (
                        <button onClick={() => handleJoinMeeting(cons)} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 hover:-translate-y-1 transition-all">
                          Join Meeting
                        </button>
                      ) : (
                        <button onClick={() => handleViewLocation(cons)} className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                          View Location
                        </button>
                      )}
                      <button onClick={() => setToast(`Status: ${cons.status}`)} className="p-4 bg-white/5 border border-white/10 text-slate-500 hover:text-white rounded-2xl transition-all">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Empty State / Past Section */}
            <section className="space-y-6 pt-12">
              <div className="flex items-center justify-between border-t border-white/5 pt-12">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Past Consultations</h2>
              </div>
              
              <div className="glass-effect rounded-[40px] border-2 border-dashed border-white/5 p-20 text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto text-slate-700">
                  <AlertCircle size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white">No history found</h3>
                  <p className="text-slate-500 text-sm font-medium">Completed consultations will appear here for your records.</p>
                </div>
              </div>
            </section>
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
