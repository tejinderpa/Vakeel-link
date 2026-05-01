import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Gavel, 
  Zap, 
  Users, 
  Search, 
  ArrowRight, 
  Verified, 
  MessageSquare, 
  Scale, 
  Star,
  Globe,
  Award,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  Cpu,
  Sparkles,
  MousePointer2
} from 'lucide-react';

const LandingPage = () => {
    const [chatQuery, setChatQuery] = useState("");
    const [chatResponse, setChatResponse] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const navigate = useNavigate();

    const handleChatSubmit = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            if (!chatQuery.trim()) return;
            setIsTyping(true);
            setTimeout(() => {
                setChatResponse({
                    title: "Legal Intelligence Summary",
                    content: "Based on the IPC, Section 420 involves cheating and dishonestly inducing delivery of property. Your case requires evidence of fraudulent intent at the inception of the transaction.",
                    citation: "Section 420 IPC"
                });
                setIsTyping(false);
            }, 1500);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    };

    const cardHover = {
        initial: { scale: 1, y: 0 },
        hover: { 
            scale: 1.02, 
            y: -8,
            transition: { type: "spring", stiffness: 400, damping: 10 }
        }
    };

    return (
        <div className="bg-[#020617] text-slate-200 min-h-screen font-inter selection:bg-indigo-500/30 overflow-x-hidden relative">
            {/* Background Decorations */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#1e1b4b,transparent_70%)] opacity-50"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/5 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <motion.div 
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20"
                        >
                            <Scale size={24} className="text-white" />
                        </motion.div>
                        <span className="text-xl font-black tracking-tighter text-white">Vakeel<span className="text-indigo-500">Link</span></span>
                    </Link>
                    
                    <div className="hidden md:flex items-center gap-10">
                        {['Solutions', 'For Lawyers', 'Resources', 'Pricing'].map((item) => (
                          <Link key={item} to="#" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors relative group">
                            {item}
                            <span className="absolute -bottom-1 left-0 w-0 h-px bg-indigo-500 transition-all group-hover:w-full"></span>
                          </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-6">
                        <Link to="/login" className="text-[10px] font-black uppercase tracking-[0.2em] text-white hover:text-indigo-400 transition-colors">Login</Link>
                        <Link to="/signup" className="px-6 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-500 hover:text-white transition-all shadow-xl shadow-white/5 relative overflow-hidden group">
                           <span className="relative z-10">Get Started</span>
                           <motion.div 
                             initial={{ x: '-100%' }}
                             whileHover={{ x: '100%' }}
                             transition={{ duration: 0.5 }}
                             className="absolute inset-0 bg-indigo-400/20 skew-x-12"
                           />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <motion.section 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative pt-40 pb-32 md:pt-56 md:pb-56"
            >
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-10 text-center lg:text-left relative z-10">
                        <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-effect border border-white/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            <Sparkles size={14} className="animate-pulse" />
                            Next-Gen Legal Intelligence
                        </motion.div>
                        <motion.div variants={itemVariants} className="relative inline-block">
                            <motion.div 
                                animate={{ 
                                    opacity: [0.1, 0.2, 0.1],
                                    scale: [1, 1.2, 1]
                                }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute -inset-8 bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none -z-10"
                            />
                            <h1 className="text-6xl md:text-[100px] font-black text-white leading-[0.85] tracking-tight">
                                Justice, <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-300% animate-gradient">Simplified.</span>
                            </h1>
                        </motion.div>
                        <motion.p variants={itemVariants} className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                            VakeelLink decodes complex Indian law using advanced AI, matching you with specialized advocates in seconds. Professional clarity, finally accessible.
                        </motion.p>
                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-4">
                            <Link to="/case-curator" className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-indigo-600/40 hover:bg-indigo-500 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group">
                                Get Legal Help
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/signup?role=lawyer" className="w-full sm:w-auto px-10 py-5 glass-effect border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white/5 transition-all">
                                For Legal Experts
                            </Link>
                        </motion.div>
                        <motion.div variants={itemVariants} className="flex items-center justify-center lg:justify-start gap-8 pt-8">
                           <div className="flex -space-x-4">
                             {[1,2,3,4].map(i => (
                               <div key={i} className="w-10 h-10 rounded-full border-2 border-[#020617] bg-slate-800 flex items-center justify-center text-[10px] font-black">U{i}</div>
                             ))}
                           </div>
                           <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                             Trusted by <span className="text-white font-black">10k+ citizens</span> across India
                           </div>
                        </motion.div>
                    </div>

                    {/* AI Chat Visualization */}
                    <motion.div 
                        variants={itemVariants}
                        className="relative group"
                    >
                        <motion.div 
                            animate={{ 
                                y: [0, -10, 0],
                            }}
                            transition={{ 
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="relative z-10"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[48px] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                            <div className="relative glass-effect rounded-[48px] border border-white/10 p-10 md:p-14 overflow-hidden backdrop-blur-3xl shadow-2xl">
                               <div className="flex items-center justify-between mb-10">
                                  <div className="flex items-center gap-4">
                                     <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                                        <Cpu size={24} className="text-white" />
                                     </div>
                                     <div>
                                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Legal AI v2.0</h3>
                                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                                           <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                           Operational
                                        </p>
                                     </div>
                                  </div>
                               </div>

                               <div className="space-y-6">
                                  <div className="relative">
                                     <input 
                                        type="text" 
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-medium outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
                                        placeholder="Ask a legal question..."
                                        value={chatQuery}
                                        onChange={(e) => setChatQuery(e.target.value)}
                                        onKeyDown={handleChatSubmit}
                                     />
                                     <button 
                                        onClick={handleChatSubmit}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-colors"
                                     >
                                        <ArrowRight size={20} />
                                     </button>
                                  </div>

                                  <AnimatePresence mode="wait">
                                    {isTyping && (
                                       <motion.div 
                                         initial={{ opacity: 0 }}
                                         animate={{ opacity: 1 }}
                                         exit={{ opacity: 0 }}
                                         className="flex gap-2 p-4"
                                       >
                                          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                                          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                       </motion.div>
                                    )}

                                    {chatResponse ? (
                                       <motion.div 
                                         initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                         animate={{ opacity: 1, scale: 1, y: 0 }}
                                         className="p-8 bg-indigo-500/10 border border-indigo-500/20 rounded-[32px] space-y-4"
                                       >
                                          <h4 className="text-xs font-black uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                                            <Sparkles size={12} />
                                            {chatResponse.title}
                                          </h4>
                                          <p className="text-slate-300 leading-relaxed font-medium italic">"{chatResponse.content}"</p>
                                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 pt-4 border-t border-white/5">
                                             <BookOpen size={14} className="text-indigo-500" />
                                             Citation: {chatResponse.citation}
                                          </div>
                                       </motion.div>
                                    ) : (
                                       <div className="p-8 bg-white/5 rounded-[32px] border border-white/5 italic text-slate-500 font-medium">
                                          "Explain Section 420 in the context of digital fraud..."
                                       </div>
                                    )}
                                  </AnimatePresence>
                               </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Stats */}
            <section className="relative z-10 -mt-20">
               <div className="max-w-6xl mx-auto px-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass-effect rounded-[40px] border border-white/10 p-12 md:p-16 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center shadow-2xl shadow-indigo-600/10 backdrop-blur-2xl"
                  >
                     {[
                        { val: '500+', label: 'Elite Advocates' },
                        { val: '12+', label: 'Legal Domains' },
                        { val: '25k+', label: 'Cases Resolved' },
                        { val: '4.9', label: 'User Rating', icon: Star }
                     ].map((stat, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="space-y-3"
                        >
                           <div className="text-4xl md:text-5xl font-black text-white tracking-tighter flex items-center justify-center gap-2">
                              {stat.val}
                              {stat.icon && <stat.icon className="text-amber-400" size={24} fill="currentColor" />}
                           </div>
                           <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{stat.label}</div>
                        </motion.div>
                     ))}
                  </motion.div>
               </div>
            </section>

            {/* Process Section */}
            <section className="py-40 relative">
               <div className="max-w-7xl mx-auto px-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center space-y-6 mb-24"
                  >
                     <h2 className="text-4xl md:text-7xl font-black text-white">Three Steps to <span className="text-indigo-500">Clarity</span></h2>
                     <p className="text-slate-400 font-medium max-w-xl mx-auto text-lg leading-relaxed">Institutional legal precision, delivered in minutes through our proprietary matching engine.</p>
                  </motion.div>

                  <div className="grid md:grid-cols-3 gap-10">
                     {[
                        { step: '01', title: 'Describe situation', desc: 'Type your legal challenge in plain language. No complex jargon required.', icon: MessageSquare, link: '/case-curator' },
                        { step: '02', title: 'AI Analysis', desc: 'Our engine maps your case to specific IPC sections and statutes instantly.', icon: Cpu, link: '/case-curator' },
                        { step: '03', title: 'Expert Match', desc: 'Connect with a verified specialist for direct professional representation.', icon: Users, link: '/lawyers' }
                     ].map((item, i) => (
                        <motion.div 
                           key={i} 
                           variants={cardHover}
                           initial="initial"
                           whileHover="hover"
                           onClick={() => navigate(item.link)}
                           className="glass-effect p-12 rounded-[48px] border border-white/10 hover:bg-white/[0.04] transition-all cursor-pointer group relative overflow-hidden"
                        >
                           <div className="absolute top-0 right-0 p-8 text-6xl font-black text-white/[0.03] group-hover:text-indigo-500/10 transition-colors">{item.step}</div>
                           <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                             <item.icon size={32} className="text-indigo-500" />
                           </div>
                           <h3 className="text-2xl font-black text-white mb-4">{item.title}</h3>
                           <p className="text-slate-500 font-medium leading-relaxed mb-8">{item.desc}</p>
                           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 group-hover:text-white transition-colors">
                             Get Started <ArrowRight size={14} />
                           </div>
                        </motion.div>
                     ))}
                  </div>
               </div>
            </section>

            {/* Domains Section */}
            <section className="py-40 bg-white/[0.01] relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,#1e1b4b,transparent_50%)] opacity-30"></div>
               <div className="max-w-7xl mx-auto px-6 relative z-10">
                  <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20">
                     <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                     >
                        <h2 className="text-4xl md:text-7xl font-black text-white">Legal <span className="text-indigo-500">Ecosystem</span></h2>
                        <p className="text-slate-400 font-medium max-w-md text-lg">Specialized intelligence across all major Indian legal frameworks.</p>
                     </motion.div>
                     <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                     >
                        <Link to="/lawyers" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors group">
                            Explore All Domains
                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                     </motion.div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                     {[
                        { label: 'Constitutional', icon: Scale, color: 'indigo' },
                        { label: 'Criminal', icon: Gavel, color: 'rose' },
                        { label: 'Corporate', icon: Shield, color: 'blue' },
                        { label: 'Family', icon: Users, color: 'purple' },
                        { label: 'Property', icon: Globe, color: 'emerald' },
                        { label: 'Taxation', icon: Award, color: 'amber' }
                     ].map((domain, i) => (
                        <motion.div 
                           key={i} 
                           initial={{ opacity: 0, y: 20 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           viewport={{ once: true }}
                           transition={{ delay: i * 0.05 }}
                           whileHover={{ y: -5, borderColor: 'rgba(99, 102, 241, 0.3)' }}
                           onClick={() => navigate(`/lawyers?domain=${domain.label}`)}
                           className="glass-effect p-8 rounded-[32px] border border-white/5 transition-all cursor-pointer text-center group"
                        >
                           <domain.icon size={32} className="mx-auto mb-6 text-slate-600 group-hover:text-indigo-500 transition-colors" />
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-white transition-colors">{domain.label}</span>
                        </motion.div>
                     ))}
                  </div>
               </div>
            </section>

            {/* Lawyer CTA */}
            <section className="py-40">
               <div className="max-w-7xl mx-auto px-6">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative glass-effect p-12 md:p-24 rounded-[64px] border border-white/10 overflow-hidden text-center space-y-10 group"
                  >
                     <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-transparent to-purple-600/10 pointer-events-none group-hover:opacity-100 transition-opacity"></div>
                     <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full"
                     />
                     <motion.div 
                        animate={{ rotate: -360 }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full"
                     />
                     
                     <div className="relative z-10 space-y-10">
                        <h2 className="text-5xl md:text-[80px] font-black text-white leading-[0.9] tracking-tight">Professional <br /> <span className="text-indigo-500">Legal Practice</span></h2>
                        <p className="text-slate-400 font-medium text-xl max-w-2xl mx-auto leading-relaxed">Digitize your practice. Scale your impact. Reach clients who need your specific domain expertise.</p>
                        <div className="flex justify-center pt-6">
                           <Link to="/signup?role=lawyer" className="px-12 py-6 bg-white text-black rounded-[24px] font-black text-sm uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl relative group">
                             <span className="relative z-10">Register as Advocate</span>
                             <div className="absolute inset-0 bg-indigo-500 opacity-0 group-hover:opacity-10 rounded-[24px] transition-opacity"></div>
                           </Link>
                        </div>
                     </div>
                  </motion.div>
               </div>
            </section>

            {/* Footer */}
            <footer className="pt-32 pb-16 border-t border-white/5 relative">
               <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-20 mb-32">
                  <div className="space-y-8">
                     <Link to="/" className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                           <Scale size={20} className="text-white" />
                        </div>
                        <span className="text-lg font-black tracking-tighter text-white">Vakeel<span className="text-indigo-500">Link</span></span>
                     </Link>
                     <p className="text-slate-500 text-sm leading-relaxed font-medium">
                        Democratizing legal access through cutting-edge technology and verified expertise.
                     </p>
                  </div>
                  
                  {[
                     { title: 'Platform', links: ['Legal AI', 'Lawyer Directory', 'Case Search'] },
                     { title: 'Resources', links: ['Knowledge Base', 'Legal Codes', 'API Docs'] },
                     { title: 'Company', links: ['About Us', 'Contact', 'Privacy Policy'] }
                  ].map((col, i) => (
                     <div key={i} className="space-y-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">{col.title}</h4>
                        <ul className="space-y-4">
                           {col.links.map(link => (
                              <li key={link}>
                                <Link to="#" className="text-xs font-bold text-slate-600 hover:text-indigo-400 transition-colors flex items-center gap-2 group">
                                  {link}
                                  <ArrowRight size={12} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                </Link>
                              </li>
                           ))}
                        </ul>
                     </div>
                  ))}
               </div>
               
               <div className="max-w-7xl mx-auto px-6 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-700">© 2024 VakeelLink Legal Technologies. All Rights Reserved.</p>
                  <div className="flex gap-8">
                     {['LinkedIn', 'Twitter', 'GitHub'].map(social => (
                        <Link key={social} to="#" className="text-[10px] font-black uppercase tracking-widest text-slate-700 hover:text-white transition-colors">{social}</Link>
                     ))}
                  </div>
               </div>
            </footer>
        </div>
    );
};

export default LandingPage;;