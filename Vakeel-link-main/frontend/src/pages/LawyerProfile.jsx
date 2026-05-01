import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  Verified, 
  MapPin, 
  Briefcase, 
  Gavel, 
  Calendar, 
  MessageSquare, 
  Award, 
  ShieldCheck, 
  ChevronRight, 
  Mail, 
  Phone,
  ArrowLeft,
  GraduationCap,
  Scale,
  ExternalLink,
  Shield,
  FileText
} from 'lucide-react';
import UserSidebar from '../components/UserSidebar';

export default function LawyerProfile() {
  const { id } = useParams();
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Simulate API fetch with delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Demo Data - Matching high-trust aesthetic
        setLawyer({
          id,
          name: 'Adv. Arjun Deshmukh',
          specialization: 'Criminal Law & Strategic Defense',
          rating: 4.9,
          review_count: 148,
          experience_years: 18,
          location: 'High Court of Mumbai',
          bio: 'With nearly two decades of experience in high-stakes criminal litigation and white-collar defense, Adv. Arjun Deshmukh has established himself as a premier legal strategist. His practice focuses on constitutional matters, bail jurisprudence, and complex corporate investigations, providing meticulous representation with a steadfast commitment to client rights and judicial integrity.',
          areas_of_practice: ['Criminal Defense', 'White Collar & Economic Crimes', 'Constitutional Law', 'Appellate Litigation', 'PMLA & ED Matters'],
          education: [
            { degree: 'LL.M. in Criminal Jurisprudence', school: 'National Law School of India University (NLSIU)' },
            { degree: 'LL.B. (Professional)', school: 'Government Law College, Mumbai' }
          ],
          achievements: [
            { title: 'Senior Counsel Designation', year: '2021' },
            { title: 'Best Criminal Defense Lawyer - Mumbai Legal Awards', year: '2019' }
          ],
          is_online: true,
          consultation_fee: '₹4,500'
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#020617] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Securing Expert Profile</p>
        </div>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="flex min-h-screen bg-[#020617] items-center justify-center flex-col gap-6">
        <div className="p-6 rounded-full bg-rose-500/10 text-rose-500">
          <Shield size={48} />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-white">Expert Profile Unavailable</h2>
          <p className="text-slate-500 font-medium">The profile you are looking for cannot be retrieved at this time.</p>
        </div>
        <Link to="/lawyers" className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
          Return to Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200 font-inter">
      <UserSidebar />
      
      <main className="flex-1 md:ml-[280px] overflow-y-auto">
        {/* Professional Banner */}
        <div className="h-64 w-full bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 relative border-b border-white/5 overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-[120px] -translate-y-1/2"></div>
            <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-[120px] -translate-y-1/2"></div>
          </div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 md:px-12 -mt-32 pb-24 relative z-10">
          {/* Hero Profile Section */}
          <section className="space-y-12">
            <div className="bg-[#0a0f1d] border border-white/10 rounded-[48px] p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                <Scale size={320} className="text-white" />
              </div>

              <div className="flex flex-col md:flex-row gap-12 items-center md:items-start relative z-10">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-40 h-40 md:w-56 md:h-56 rounded-[40px] bg-slate-800 border-4 border-[#020617] shadow-2xl flex items-center justify-center text-6xl font-black text-white overflow-hidden relative group">
                    {lawyer.avatar ? (
                      <img src={lawyer.avatar} alt={lawyer.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-indigo-950">
                        {lawyer.name.split(' ')[1].charAt(0)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  {lawyer.is_online && (
                    <div className="absolute -bottom-2 -right-2 px-4 py-2 bg-emerald-500 text-white rounded-2xl flex items-center gap-2 border-4 border-[#0a0f1d] shadow-xl">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      <span className="text-[10px] font-black uppercase tracking-widest">Available Now</span>
                    </div>
                  )}
                </div>

                {/* Profile Main Info */}
                <div className="flex-1 space-y-8 text-center md:text-left">
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white">{lawyer.name}</h1>
                      <div className="inline-flex items-center justify-center md:justify-start gap-2 px-4 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                        <ShieldCheck size={14} /> Verified Senior Counsel
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-slate-400">
                      {lawyer.specialization}
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-6">
                    <div className="flex items-center gap-3 bg-white/[0.03] border border-white/5 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                      <MapPin size={16} className="text-indigo-500" />
                      {lawyer.location}
                    </div>
                    <div className="flex items-center gap-3 bg-white/[0.03] border border-white/5 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                      <Briefcase size={16} className="text-indigo-500" />
                      {lawyer.experience_years}+ Yrs Practice
                    </div>
                  </div>

                  <div className="flex items-center justify-center md:justify-start gap-6 pt-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={20} fill={s <= 4 ? "currentColor" : "none"} strokeWidth={2.5} />
                      ))}
                    </div>
                    <div className="h-6 w-px bg-white/10"></div>
                    <span className="text-xl font-black text-white">{lawyer.rating} <span className="text-slate-500 font-bold ml-1">({lawyer.review_count} Premium Reviews)</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Main Details */}
              <div className="lg:col-span-8 space-y-16">
                <section className="space-y-8">
                  <div className="flex items-center gap-4">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 whitespace-nowrap">Professional Profile</h2>
                    <div className="flex-1 h-px bg-white/5"></div>
                  </div>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-xl text-slate-300 leading-relaxed font-medium">
                      {lawyer.bio}
                    </p>
                  </div>
                </section>

                <section className="space-y-8">
                  <div className="flex items-center gap-4">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 whitespace-nowrap">Specializations</h2>
                    <div className="flex-1 h-px bg-white/5"></div>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {lawyer.areas_of_practice?.map((area, idx) => (
                      <div key={idx} className="bg-[#0a0f1d] px-8 py-4 rounded-[24px] border border-white/10 text-white font-black text-sm hover:border-indigo-500/50 transition-all shadow-lg">
                        {area}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="space-y-8">
                  <div className="flex items-center gap-4">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500 whitespace-nowrap">Credentials & Honors</h2>
                    <div className="flex-1 h-px bg-white/5"></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-[#0a0f1d] p-8 rounded-[32px] border border-white/10 space-y-6 group hover:border-indigo-500/30 transition-all">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                        <GraduationCap size={24} />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Education</p>
                        {lawyer.education.map((edu, i) => (
                          <div key={i} className="pb-4 last:pb-0 border-b last:border-0 border-white/5">
                            <h3 className="text-sm font-black text-white leading-tight">{edu.degree}</h3>
                            <p className="text-xs text-slate-500 mt-1 font-bold">{edu.school}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-[#0a0f1d] p-8 rounded-[32px] border border-white/10 space-y-6 group hover:border-indigo-500/30 transition-all">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <Award size={24} />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Achievements</p>
                        {lawyer.achievements.map((ach, i) => (
                          <div key={i} className="pb-4 last:pb-0 border-b last:border-0 border-white/5">
                            <h3 className="text-sm font-black text-white leading-tight">{ach.title}</h3>
                            <p className="text-xs text-slate-500 mt-1 font-bold">{ach.year}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              {/* Sticky Actions Sidebar */}
              <div className="lg:col-span-4 space-y-8">
                <div className="sticky top-28 space-y-8">
                  {/* Consultation Card */}
                  <div className="bg-[#0a0f1d] p-10 rounded-[48px] border border-white/10 shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                      <ShieldCheck size={120} className="text-indigo-500" />
                    </div>
                    
                    <div className="relative z-10 space-y-8">
                      <div>
                        <h3 className="text-2xl font-black text-white mb-2">Secure Consultation</h3>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Premium Legal Access</p>
                      </div>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-6 bg-white/[0.02] border border-white/5 rounded-3xl group/item hover:border-indigo-500/20 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover/item:bg-indigo-500 group-hover/item:text-white transition-all">
                              <MessageSquare size={18} />
                            </div>
                            <span className="text-sm font-black text-slate-300">Initial Briefing</span>
                          </div>
                          <span className="text-lg font-black text-white">{lawyer.consultation_fee}</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <button className="w-full bg-indigo-600 text-white font-black py-5 rounded-[24px] shadow-2xl shadow-indigo-600/30 hover:bg-indigo-500 transition-all uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 active:scale-[0.98]">
                          <Calendar size={18} />
                          Schedule Session
                        </button>
                        <button className="w-full bg-white/[0.05] border border-white/10 text-white font-black py-5 rounded-[24px] hover:bg-white/[0.1] transition-all uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3">
                          <FileText size={18} />
                          Review Case File
                        </button>
                      </div>

                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.15em] text-center leading-relaxed">
                        Strictly confidential. Verified bar credentials. Subject to terms and conditions.
                      </p>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl text-center space-y-3">
                       <Scale size={20} className="mx-auto text-slate-500" />
                       <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Ethics Compliant</p>
                    </div>
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl text-center space-y-3">
                       <Verified size={20} className="mx-auto text-slate-500" />
                       <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Verified Identity</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
