import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Scale, 
  FileText, 
  Settings, 
  History, 
  Search, 
  BarChart3, 
  AlertTriangle, 
  FolderOpen, 
  Baby, 
  Gavel, 
  Shield,
  Plus,
  Zap,
  ChevronRight,
  ArrowRight,
  X,
  Loader2,
  User as UserIcon,
  Cpu,
  CheckCircle2
} from 'lucide-react';
import UserSidebar from '../components/UserSidebar';
import useAuth from '../components/useAuth';

const CaseCurator = () => {
    const { user } = useAuth();
    
    // Form States
    const [caseType, setCaseType] = useState('');
    const [incidentDate, setIncidentDate] = useState('');
    const [jurisdiction, setJurisdiction] = useState('');
    const [complexity, setComplexity] = useState('Standard');
    const [description, setDescription] = useState('');
    const [opposingParty, setOpposingParty] = useState('');
    
    // UI States
    const [isLoading, setIsLoading] = useState(false);
    const [report, setReport] = useState(null);
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
    const [errors, setErrors] = useState({});

    const caseTypes = [
        'Property Dispute', 'Custody & Family', 'Contractual Breach', 
        'Criminal Defense', 'Consumer Complaint', 'Labour Dispute', 
        'Motor Accident Claim', 'Constitutional Matter', 'Cyber Crime', 
        'Cheque Bounce (NI Act)'
    ];

    const jurisdictions = [
        'District Court', 'High Court', 'Supreme Court', 
        'Consumer Forum', 'Labour Tribunal', 'Family Court', 
        'MACT (Motor Accident Claims Tribunal)'
    ];

    const opposingPartyTypes = [
        'Individual', 'Corporation', 'Government Body', 'Employer', 'Bank/NBFC'
    ];

    const legalFrameworkMap = {
        'Property Dispute': ['Transfer of Property Act 1882', 'Specific Relief Act 1963', 'Registration Act 1908'],
        'Custody & Family': ['Hindu Marriage Act 1955', 'Guardians and Wards Act 1890', 'Special Marriage Act 1954'],
        'Contractual Breach': ['Indian Contract Act 1872', 'Specific Relief Act 1963'],
        'Criminal Defense': ['Indian Penal Code 1860', 'Code of Criminal Procedure 1973', 'Indian Evidence Act 1872'],
        'Consumer Complaint': ['Consumer Protection Act 2019', 'Competition Act 2002'],
        'Labour Dispute': ['Industrial Disputes Act 1947', 'Factories Act 1948', 'Minimum Wages Act 1948'],
        'Motor Accident Claim': ['Motor Vehicles Act 1988', 'Central Motor Vehicles Rules 1989'],
        'Constitutional Matter': ['Constitution of India', 'Article 32 & 226 Procedures'],
        'Cyber Crime': ['Information Technology Act 2000', 'IT Rules 2021'],
        'Cheque Bounce (NI Act)': ['Negotiable Instruments Act 1881 (Sec 138-142)']
    };

    const precedentMap = {
        'Property Dispute': [
            { name: 'Suraj Lamp & Industries v. State of Haryana', court: 'Supreme Court', year: '2011', summary: 'GPA/SA/Will transfers do not confer title.' },
            { name: 'Anathula Sudhakar v. P. Buchi Reddy', court: 'Supreme Court', year: '2008', summary: 'Scope of suits for prohibition, injunction and declaration.' }
        ],
        'Custody & Family': [
            { name: 'Githa Hariharan v. RBI', court: 'Supreme Court', year: '1999', summary: 'Mother as natural guardian equal to father.' },
            { name: 'Roxann Sharma v. Arun Sharma', court: 'Supreme Court', year: '2015', summary: 'Interim custody of child below 5 years with mother.' }
        ],
        'Contractual Breach': [
            { name: 'Satyabrata Ghose v. Mugneeram Bangur', court: 'Supreme Court', year: '1954', summary: 'Doctrine of frustration of contracts.' },
            { name: 'Kailash Nath Associates v. DDA', court: 'Supreme Court', year: '2015', summary: 'Liquidated damages and Section 74 of ICA.' }
        ]
    };

    const handleGenerateReport = async () => {
        const newErrors = {};
        if (!caseType) newErrors.caseType = 'Required';
        if (!jurisdiction) newErrors.jurisdiction = 'Required';
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setIsLoading(true);
        setReport(null);

        const queryText = `
Case Type: ${caseType}
Incident Date: ${incidentDate}
Jurisdiction: ${jurisdiction}
Opposing Party: ${opposingParty}
Complexity: ${complexity}
Description: ${description}
        `.trim();
        
        try {
            const token = localStorage.getItem('vakeellink_token');
            const response = await fetch('http://localhost:8000/api/v1/query', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ query: queryText })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || 'Failed to fetch insights');
            }

            const data = await response.json();
            
            // Map the API response to the `report` state
            let derivedActions = [
                'Issue formal legal notice to opposing party',
                'Document all communications and financial records',
                'Consult a specialized advocate for procedural filing'
            ];
            
            if (data.analysis) {
                const sentences = data.analysis.split('.').filter(s => s.trim().length > 10).map(s => s.trim() + '.').slice(0, 3);
                if (sentences.length > 0) derivedActions = sentences;
            }

            setReport({
                caseType,
                jurisdiction,
                framework: data.cited_acts?.length ? data.cited_acts : legalFrameworkMap[caseType] || ['Indian Penal Code', 'Indian Evidence Act'],
                risk: complexity === 'Litigation' ? 'High' : complexity === 'Complex' ? 'Medium' : 'Low',
                timeline: complexity === 'Litigation' ? '18-24 months' : complexity === 'Complex' ? '12-18 months' : '6-12 months',
                actions: derivedActions,
                specialization: `${caseType.split(' ')[0]} Specialist`,
                analysis: data.analysis,
                citedCases: data.cited_cases || [],
                citedSections: data.cited_sections || [],
                domain: data.domain,
                confidenceScore: data.confidence_score,
                recommendedLawyers: data.recommended_lawyers || [],
                disclaimer: data.disclaimer || 'AI-generated analysis. Not legal advice.'
            });
        } catch (error) {
            console.error("Error fetching report:", error);
            alert("Error: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    return (
        <div className="flex min-h-screen bg-[#f8fafc] text-[#0f2d5e] font-inter selection:bg-blue-100">
            <UserSidebar />

            <main className="flex-1 md:ml-[280px] p-6 md:p-12 overflow-y-auto">
                <div className="max-w-7xl mx-auto space-y-12">
                    
                    {/* Header with User Info */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-black text-[#0f2d5e] leading-tight tracking-tight">
                                Advanced <span className="text-[#2563eb]">Case Curator</span>
                            </h1>
                            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-2">Legal Intelligence Portal</p>
                        </div>

                        <div className="flex items-center gap-4 bg-white p-3 pr-8 rounded-3xl border border-slate-200 shadow-sm">
                            <div className="w-12 h-12 rounded-2xl bg-[#2563eb] flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-500/20">
                                {getInitials(user?.name)}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-black text-[#0f2d5e] leading-none">{user?.name || 'Authorized User'}</span>
                                <span className="text-[10px] font-black text-[#2563eb] uppercase tracking-widest mt-1">{user?.role || 'Premium'} Plan</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                        {/* Input Interface Column */}
                        <div className="lg:col-span-5 space-y-8">
                            <div className="bg-white p-8 rounded-[40px] border border-slate-200 space-y-8 shadow-sm">
                                <div className="space-y-6">
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-[#2563eb] flex items-center gap-2">
                                        <FileText size={14} /> Incident Particulars
                                    </label>
                                    
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Brief Description</label>
                                        <textarea 
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            className="w-full h-32 p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-[#0f2d5e] placeholder:text-slate-400 resize-none text-sm leading-relaxed focus:border-[#2563eb] transition-all" 
                                            placeholder="Describe what happened in 2–3 sentences..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Case Type</label>
                                            <select 
                                                value={caseType}
                                                onChange={(e) => setCaseType(e.target.value)}
                                                className={`w-full bg-slate-50 border ${errors.caseType ? 'border-red-500' : 'border-slate-200'} rounded-xl px-4 py-3 text-xs text-[#0f2d5e] focus:border-[#2563eb] outline-none transition-all appearance-none cursor-pointer`}
                                            >
                                                <option value="" disabled>Select Type</option>
                                                {caseTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Incident Date</label>
                                            <input 
                                                type="date"
                                                value={incidentDate}
                                                onChange={(e) => setIncidentDate(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-[#0f2d5e] focus:border-[#2563eb] outline-none transition-all" 
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jurisdiction</label>
                                            <select 
                                                value={jurisdiction}
                                                onChange={(e) => setJurisdiction(e.target.value)}
                                                className={`w-full bg-slate-50 border ${errors.jurisdiction ? 'border-red-500' : 'border-slate-200'} rounded-xl px-4 py-3 text-xs text-[#0f2d5e] focus:border-[#2563eb] outline-none transition-all appearance-none cursor-pointer`}
                                            >
                                                <option value="" disabled>Select Court</option>
                                                {jurisdictions.map(j => <option key={j} value={j}>{j}</option>)}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Opposing Party</label>
                                            <select 
                                                value={opposingParty}
                                                onChange={(e) => setOpposingParty(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-[#0f2d5e] focus:border-[#2563eb] outline-none transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="" disabled>Select Type</option>
                                                {opposingPartyTypes.map(o => <option key={o} value={o}>{o}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Complexity Tier</label>
                                        <div className="flex gap-3">
                                            {['Standard', 'Complex', 'Litigation'].map(tier => (
                                                <button 
                                                    key={tier} 
                                                    type="button"
                                                    onClick={() => setComplexity(tier)}
                                                    className={`flex-1 py-3 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                        complexity === tier 
                                                        ? 'bg-[#2563eb] border-[#2563eb] text-white shadow-lg shadow-blue-600/20' 
                                                        : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                                                    }`}
                                                >
                                                    {tier}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 space-y-4">
                                    <button 
                                        onClick={handleGenerateReport}
                                        disabled={isLoading}
                                        className="w-full py-5 bg-[#0f2d5e] text-white rounded-2xl font-black tracking-[0.2em] uppercase text-[10px] shadow-2xl shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} className="fill-white" />}
                                        Generate Intelligence Report
                                    </button>

                                    <button 
                                        onClick={() => setIsArchiveModalOpen(true)}
                                        className="w-full py-5 bg-white border border-slate-200 text-[#0f2d5e] rounded-2xl font-black tracking-[0.2em] uppercase text-[10px] hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
                                    >
                                        <History size={18} />
                                        Archival Context
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* AI Assistant Column */}
                        <div className="lg:col-span-7 h-full min-h-[600px]">
                            <div className="bg-white rounded-[48px] border border-slate-200 p-8 lg:p-12 shadow-sm flex flex-col h-full relative overflow-hidden group min-h-[600px]">
                                
                                {!report && !isLoading ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 relative z-10">
                                        <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center border border-slate-100 shadow-inner">
                                            <Gavel size={40} className="text-slate-300" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-2xl font-black text-[#0f2d5e] tracking-tight">Describe your legal situation</h3>
                                            <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
                                                Fill in the case details and generate an intelligence report to see AI-powered analysis.
                                            </p>
                                        </div>
                                    </div>
                                ) : isLoading ? (
                                    <div className="flex-1 flex flex-col items-center justify-center space-y-6 relative z-10">
                                        <div className="relative">
                                            <div className="w-20 h-20 border-4 border-blue-100 border-t-[#2563eb] rounded-full animate-spin" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Cpu size={24} className="text-[#2563eb] animate-pulse" />
                                            </div>
                                        </div>
                                        <div className="text-center space-y-2">
                                            <p className="text-[10px] font-black text-[#2563eb] uppercase tracking-[0.3em]">Synthesizing Data</p>
                                            <p className="text-slate-400 text-xs font-medium">Scanning precedents and legal codes...</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-10 flex-1 relative animate-in fade-in slide-in-from-bottom-4 duration-700">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="px-3 py-1 bg-blue-50 text-[#2563eb] text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-100">
                                                        AI Synthesized
                                                    </span>
                                                    <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">v4.2.0 Stable</span>
                                                </div>
                                                <h2 className="text-3xl font-black text-[#0f2d5e]">Intelligence Report — {report.caseType}</h2>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <Shield size={14} className="text-[#2563eb]" /> Legal Framework (Acts Cited)
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {report.framework.map((act, i) => (
                                                    <span key={i} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-[#0f2d5e]">
                                                        {act}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {report.citedSections?.length > 0 && (
                                            <div className="space-y-4">
                                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                    <FileText size={14} className="text-[#2563eb]" /> Relevant Sections & Provisions
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {report.citedSections.map((section, i) => (
                                                        <span key={i} className="px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl text-[11px] font-bold text-[#2563eb]">
                                                            {section}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {report.analysis && (
                                            <div className="space-y-2 py-4">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Legal Analysis</p>
                                                <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
                                                    <p className="text-sm text-[#0f2d5e] leading-relaxed">{report.analysis}</p>
                                                </div>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-6 py-6 border-y border-slate-100">
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Assessment</p>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${report.risk === 'High' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 'bg-[#2563eb] shadow-[0_0_10px_rgba(37,99,235,0.3)]'}`} />
                                                    <span className="text-sm font-bold text-[#0f2d5e]">{report.risk} Complexity</span>
                                                </div>
                                                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                                                    Litigation likely to span {report.timeline} in {report.jurisdiction}.
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recommended Actions</p>
                                                <ul className="space-y-2">
                                                    {report.actions.map((action, i) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <CheckCircle2 size={12} className="text-emerald-500 mt-0.5" />
                                                            <span className="text-[11px] font-medium text-slate-600">{action}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Suggested Lawyer Specialization</p>
                                                <p className="text-sm font-black text-[#0f2d5e]">{report.specialization}</p>
                                            </div>
                                            <Link to="/lawyers" className="p-3 bg-white rounded-xl border border-slate-200 hover:border-[#2563eb] transition-colors shadow-sm">
                                                <Search size={18} className="text-[#2563eb]" />
                                            </Link>
                                        </div>

                                        <div className="flex items-start gap-2 text-slate-400">
                                            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                                                {report.disclaimer}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {report && (
                                    <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-8 border-t border-slate-100 mt-auto relative">
                                        <div className="flex items-center gap-5">
                                            <div className="flex -space-x-3">
                                                {report.recommendedLawyers && report.recommendedLawyers.length > 0 ? (
                                                    report.recommendedLawyers.slice(0, 3).map((lawyer, i) => (
                                                        <img key={lawyer.id || i} className="w-11 h-11 rounded-2xl border-4 border-white object-cover" src={lawyer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(lawyer.name)}`} alt={lawyer.name} title={lawyer.name} />
                                                    ))
                                                ) : (
                                                    [1, 2, 3].map(i => (
                                                        <img key={i} className="w-11 h-11 rounded-2xl border-4 border-white object-cover" src={`https://i.pravatar.cc/150?u=lawyer${i}`} alt="Specialist" />
                                                    ))
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Qualified Specialists Ready</p>
                                                {report.recommendedLawyers && report.recommendedLawyers[0] && (
                                                    <p className="text-[10px] font-bold text-[#2563eb]">Including {report.recommendedLawyers[0].name}</p>
                                                )}
                                            </div>
                                        </div>
                                        <Link to="/lawyers" className="w-full sm:w-auto px-10 py-5 bg-[#2563eb] text-white rounded-[22px] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-[#0f2d5e] transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 group">
                                            Expert Consultation <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Precedent Archive Modal */}
            {isArchiveModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-slate-900/40 animate-in fade-in duration-300">
                    <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-[40px] shadow-2xl overflow-hidden relative">
                        <button 
                            onClick={() => setIsArchiveModalOpen(false)}
                            className="absolute top-8 right-8 text-slate-400 hover:text-[#0f2d5e] transition-colors"
                        >
                            <X size={24} />
                        </button>
                        
                        <div className="p-12 space-y-10">
                            <div className="space-y-3">
                                <h3 className="text-3xl font-black text-[#0f2d5e]">Precedent Archive</h3>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                                    Historical judicial decisions related to {caseType || 'General Law'}
                                </p>
                            </div>

                            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                                {(report?.citedCases?.length > 0 ? report.citedCases.map(c => {
                                    const match = c.match(/\b(19|20)\d{2}\b/);
                                    const year = match ? match[0] : 'Historical';
                                    return { 
                                        name: c, 
                                        court: 'Cited AI Precedent', 
                                        year, 
                                        summary: 'Identified as highly relevant precedent by AI Knowledge System based on your case particulars.' 
                                    };
                                }) : (precedentMap[caseType] || precedentMap['Property Dispute'])).map((precedent, i) => (
                                    <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:border-blue-200 transition-all group mb-4">
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="text-sm font-black text-[#0f2d5e] group-hover:text-[#2563eb] transition-colors">{precedent.name}</h4>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-3 py-1 rounded-lg border border-slate-100">
                                                {precedent.year}
                                            </span>
                                        </div>
                                        <div className="flex gap-4 items-center mb-3">
                                            <span className="text-[10px] font-black text-[#2563eb] uppercase tracking-widest">{precedent.court}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                            {precedent.summary}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <button 
                                onClick={() => setIsArchiveModalOpen(false)}
                                className="w-full py-5 bg-[#0f2d5e] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#2563eb] transition-all shadow-xl shadow-blue-900/20"
                            >
                                Close Archive
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CaseCurator;