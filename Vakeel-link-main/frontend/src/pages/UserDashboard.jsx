import { Link } from 'react-router-dom';
import { 
  ArrowUpRight, 
  CalendarDays, 
  MessageSquare, 
  Scale, 
  Search, 
  UserRound, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Video,
  MapPin,
  History,
  Zap
} from 'lucide-react';
import UserSidebar from '../components/UserSidebar';
import useAuth from '../components/useAuth';
import { MOCK_CONSULTATIONS, MOCK_ACTIVITY, MOCK_STATS } from '../utils/mockData';

const quickActions = [
  { title: 'Search Case Law', description: 'Ask the AI engine for cases, statutes, and precedents.', path: '/case-search', icon: Search },
  { title: 'AI Assistant', description: 'Generate a structured analysis for your legal question.', path: '/assistant', icon: MessageSquare },
  { title: 'Find Lawyers', description: 'Browse verified advocates by domain and rating.', path: '/lawyers', icon: Scale },
  { title: 'My Consultations', description: 'Review active matters and upcoming appointments.', path: '/consultations', icon: CalendarDays },
];

export default function UserDashboard() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200">
      <UserSidebar />

      <main className="flex-1 md:ml-[280px] p-6 md:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Welcome & Stats Header */}
          <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.03] p-8 md:p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-cyan-500/10" />
            <div className="relative flex flex-col lg:flex-row gap-8 lg:items-end lg:justify-between">
              <div className="max-w-3xl space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  <UserRound size={14} className="text-indigo-400" />
                  Client Dashboard
                </div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
                  Welcome back, {user?.name || 'Client'}.
                </h1>
                <p className="max-w-2xl text-lg text-slate-400 leading-relaxed">
                  Your legal workspace is ready. Search precedents, launch AI review, and manage consultations from a single command center.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 min-w-[280px]">
                {[
                  { label: 'Open Matters', value: MOCK_STATS.openMatters },
                  { label: 'Saved Lawyers', value: MOCK_STATS.savedLawyers },
                  { label: 'AI Runs', value: MOCK_STATS.aiRuns },
                  { label: 'Response Time', value: MOCK_STATS.responseTime },
                ].map((item) => (
                  <div key={item.label} className="rounded-[24px] border border-white/10 bg-[#020617]/60 p-4 backdrop-blur-xl">
                    <div className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">{item.label}</div>
                    <div className="mt-2 text-2xl font-black text-white">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Quick Actions Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  to={action.path}
                  className="group rounded-[32px] border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:bg-white/[0.06]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/15 text-indigo-400 ring-1 ring-indigo-500/20">
                    <Icon size={22} />
                  </div>
                  <div className="mt-6 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-black text-white">{action.title}</h2>
                      <p className="mt-2 text-sm leading-relaxed text-slate-400">{action.description}</p>
                    </div>
                    <ArrowUpRight size={18} className="mt-1 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </div>
                </Link>
              );
            })}
          </section>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            {/* Upcoming Consultations */}
            <section className="xl:col-span-7 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                  <CalendarDays className="text-indigo-400" size={24} />
                  Upcoming Consultations
                </h2>
                <Link to="/consultations" className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors">View All</Link>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {MOCK_CONSULTATIONS.map((cons) => (
                  <div key={cons.id} className="glass-effect rounded-[32px] p-6 border border-white/5 hover:bg-white/[0.05] transition-all group flex flex-col md:flex-row md:items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 shrink-0">
                      {cons.type === 'Video Call' ? <Video size={28} /> : <MapPin size={28} />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-black text-white">{cons.lawyerName}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                          cons.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {cons.status}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-500">{cons.specialization} • {cons.type}</p>
                    </div>
                    <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-1 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6">
                      <div className="text-sm font-black text-white">{cons.time}</div>
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{cons.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Activity */}
            <section className="xl:col-span-5 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                  <History className="text-indigo-400" size={24} />
                  Recent Activity
                </h2>
              </div>
              
              <div className="glass-effect rounded-[40px] border border-white/10 overflow-hidden bg-white/[0.02]">
                <div className="p-2 space-y-1">
                  {MOCK_ACTIVITY.map((activity, idx) => (
                    <div key={activity.id} className={`flex items-start gap-4 p-5 rounded-[28px] transition-all hover:bg-white/5 ${idx !== MOCK_ACTIVITY.length - 1 ? 'border-b border-white/5' : ''}`}>
                      <div className="mt-1">
                        {activity.type === 'AI_SEARCH' && <Zap size={16} className="text-indigo-400" />}
                        {activity.type === 'LAWYER_SAVE' && <CheckCircle2 size={16} className="text-emerald-400" />}
                        {activity.type === 'CONSULTATION' && <CalendarDays size={16} className="text-blue-400" />}
                        {activity.type === 'DOCUMENT' && <AlertCircle size={16} className="text-purple-400" />}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-black text-white tracking-tight">{activity.title}</h4>
                          <span className="text-[9px] font-bold text-slate-600 uppercase">{activity.timestamp}</span>
                        </div>
                        <p className="text-xs font-medium text-slate-500 leading-relaxed">{activity.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}