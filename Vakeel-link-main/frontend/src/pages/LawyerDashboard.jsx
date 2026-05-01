import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CalendarDays, CalendarCheck2, CheckCircle2, CircleHelp, Clock3, Download, FileText, Filter, FolderOpen, LayoutDashboard, LineChart, LogOut, Mail, MessageCircle, MessageSquare, Plus, Scale, Search, Settings, ShieldAlert, Star, UserCircle2, Video, XCircle, Zap, Bot, X, Send, ArrowRight, Sparkles, BookOpen } from 'lucide-react';
import useAuth from '../components/useAuth';

const RECENT_ACTIVITY = [
  {
    id: 1,
    title: 'Accepted request from Ravi Kumar',
    detail: 'Family Law • Case ID #9921',
    timeAgo: '2h ago',
    type: 'success',
  },
  {
    id: 2,
    title: 'Consultation completed with Sneha Kapoor',
    detail: 'Corporate Law • 45 mins session recorded',
    timeAgo: '5h ago',
    type: 'video',
  },
  {
    id: 3,
    title: 'New message from Client #3821',
    detail: 'Criminal Law • Urgent inquiry regarding bail hearing',
    timeAgo: '1d ago',
    type: 'message',
  },
  {
    id: 4,
    title: 'Profile verified by Bar Council',
    detail: 'System • Annual credential audit complete',
    timeAgo: '2d ago',
    type: 'verify',
  },
];

const TODAY_SCHEDULE = [
  {
    id: 1,
    time: '14:00 - 14:45',
    title: 'Client Onboarding: Amit V.',
    detail: 'Video Call • Property Dispute',
    active: true,
  },
  {
    id: 2,
    time: '16:30 - 17:00',
    title: 'Document Review',
    detail: 'Internal • Kapoor & Sons File',
    active: false,
  },
];

const CONSULTATION_REQUESTS = [
  {
    id: 'req-3821',
    clientName: 'Client #3821',
    category: 'Family Law',
    submittedAt: '2 hours ago',
    message: 'My husband has been denying me maintenance for 3 months now. I need legal advice on how to file for immediate relief.',
    status: 'pending',
    avatar: 'https://i.pravatar.cc/80?img=12',
  },
  {
    id: 'req-4102',
    clientName: 'Client #4102',
    category: 'Criminal Law',
    submittedAt: '5 hours ago',
    message: 'I received a notice regarding an alleged white-collar violation at my firm. I need an urgent consultation.',
    status: 'accepted',
    avatar: 'https://i.pravatar.cc/80?img=47',
  },
  {
    id: 'req-2933',
    clientName: 'Client #2933',
    category: 'Consumer Rights',
    submittedAt: '1 day ago',
    message: 'An e-commerce giant is refusing to refund my damaged high-value electronic purchase. I have all the proofs available.',
    status: 'pending',
    avatar: 'https://i.pravatar.cc/80?img=32',
  },
];

function SideNav({ activeSection, onSectionChange, onLogout, onOpenNewCase, displayName }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'consultations', label: 'Consultations', icon: CalendarDays },
    { id: 'case-files', label: 'Case Files', icon: FolderOpen },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'case-comparisons', label: 'Case Comparisons', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: LineChart },
  ];

  const initials = (displayName || 'LP')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('');

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-full w-[280px] flex-col border-r border-slate-800 bg-[#0f2d5e] text-sm text-slate-200 shadow-sm">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/20 text-white">
            <Scale size={20} />
          </div>
          <div>
            <div className="text-xl font-black tracking-tight text-white">LexPrecise</div>
            <div className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-blue-400">Legal Management</div>
          </div>
        </div>
      </div>

      <nav className="mt-4 flex-1 space-y-1 px-2">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              onClick={() => onSectionChange(id)}
              className={`flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left transition-all duration-150 ${
                isActive
                  ? 'border-l-4 border-blue-500 bg-blue-600/10 text-white'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <Icon size={18} />
              <span className="font-semibold">{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-slate-800 p-6">
        <button onClick={onOpenNewCase} className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700">
          <Plus size={16} />
          New Case
        </button>
        <button
          onClick={() => onSectionChange('profile')}
          className="mb-1 flex w-full items-center gap-3 px-4 py-3 text-left text-slate-300 transition-all duration-150 hover:bg-white/5 hover:text-white"
        >
          <UserCircle2 size={18} />
          Profile
        </button>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 px-4 py-3 text-left text-slate-300 transition-all duration-150 hover:bg-white/5 hover:text-white"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

function PendingScreen({ onRefresh }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020617] px-6 text-white">
      <div className="max-w-xl rounded-[40px] border border-white/10 bg-white/[0.04] p-10 text-center shadow-2xl shadow-indigo-500/10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-300">
          <Clock3 size={28} />
        </div>
        <h1 className="mt-6 text-4xl font-black tracking-tight">Profile under review</h1>
        <p className="mt-4 text-slate-400 leading-relaxed">
          Your lawyer account is waiting for approval. Once the verification team marks it approved, the full portal will unlock.
        </p>
        <div className="mt-8 rounded-[28px] border border-amber-500/20 bg-amber-500/10 p-5 text-left text-amber-200">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-300">Current Status</div>
          <div className="mt-2 text-sm font-semibold">Pending verification</div>
        </div>
        <button onClick={onRefresh} className="mt-8 rounded-2xl bg-indigo-600 px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-white transition-all hover:bg-indigo-500">
          Refresh status
        </button>
      </div>
    </div>
  );
}

function RejectedScreen({ reason, onReapply }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020617] px-6 text-white">
      <div className="max-w-xl rounded-[40px] border border-white/10 bg-white/[0.04] p-10 text-center shadow-2xl shadow-rose-500/10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-300">
          <ShieldAlert size={28} />
        </div>
        <h1 className="mt-6 text-4xl font-black tracking-tight">Verification rejected</h1>
        <p className="mt-4 text-slate-400 leading-relaxed">
          Your submission needs one more pass before access can be granted.
        </p>
        <div className="mt-8 rounded-[28px] border border-rose-500/20 bg-rose-500/10 p-5 text-left text-rose-200">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-300">Reason</div>
          <div className="mt-2 text-sm font-semibold">{reason}</div>
        </div>
        <button onClick={onReapply} className="mt-8 rounded-2xl bg-emerald-600 px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-white transition-all hover:bg-emerald-500">
          Re-apply for approval
        </button>
      </div>
    </div>
  );
}

function NewCaseModal({ onClose }) {
  const [caseText, setCaseText] = useState('');
  const [title, setTitle] = useState('');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm sm:p-6">
      <div className="flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Scale size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">New Case Workspace</h2>
              <p className="text-xs text-slate-500">Draft your case facts</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 md:p-8">
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Case Title / Client</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Estate of V. Sharma" className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition-shadow focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">Case Facts & Core Issues</label>
              <textarea 
                value={caseText}
                onChange={(e) => setCaseText(e.target.value)}
                rows={8} 
                placeholder="Describe the situation, claims, and context..." 
                className="w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-medium leading-relaxed text-slate-900 outline-none transition-shadow focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-3">
            <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
            <button onClick={onClose} disabled={!title || !caseText} className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700 disabled:opacity-50">Create Case</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CaseComparisonsSection({ 
  sourceFilter, setSourceFilter, 
  searchQuery, setSearchQuery, 
  precedents, setPrecedents, 
  aiMessages, setAiMessages, 
  aiInput, setAiInput,
  isSearching, setIsSearching
}) {
  const [expandedCases, setExpandedCases] = useState([]);

  const toggleDetails = (id) => {
    setExpandedCases(prev => prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]);
  };

  const handleAddToCompare = async (precedent) => {
    const userMsg = { role: 'user', text: `Please add "${precedent.title}" to our comparison context.` };
    setAiMessages(prev => [...prev, userMsg]);
    
    try {
      const token = localStorage.getItem('vakeellink_token');
      const response = await fetch('http://localhost:8000/api/v1/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ query: `I am adding the following case for comparison: ${precedent.title}. Summary: ${precedent.summary}. Please acknowledge that you have added this to your context and are ready to compare it with other cases or my input.` })
      });
      if (response.ok) {
        const data = await response.json();
        setAiMessages(prev => [...prev, { role: 'ai', text: data.analysis || `Acknowledged. I have added "${precedent.title}" to the context.` }]);
      } else {
        setAiMessages(prev => [...prev, { role: 'ai', text: `Acknowledged context locally, but failed to sync with backend.` }]);
      }
    } catch (error) {
       setAiMessages(prev => [...prev, { role: 'ai', text: `Acknowledged context locally (Network error).` }]);
    }
  };

  const handleChat = async (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    
    setAiMessages(prev => [...prev, { role: 'user', text: aiInput }]);
    const currentInput = aiInput;
    setAiInput('');
    
    try {
      const token = localStorage.getItem('vakeellink_token');
      const response = await fetch('http://localhost:8000/api/v1/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ query: currentInput })
      });
      if (response.ok) {
        const data = await response.json();
        setAiMessages(prev => [...prev, { role: 'ai', text: data.analysis || "I could not generate an analysis based on the current context." }]);
      } else {
        setAiMessages(prev => [...prev, { role: 'ai', text: "Sorry, I encountered an error while analyzing your request." }]);
      }
    } catch (error) {
      setAiMessages(prev => [...prev, { role: 'ai', text: "Sorry, I encountered a network error while connecting to the AI." }]);
    }
  };

  const handleSearch = async (e) => {
    if (e.key === 'Enter') {
      if (!searchQuery.trim() || isSearching) return;
      setIsSearching(true);
      try {
        const token = localStorage.getItem('vakeellink_token');
        const response = await fetch('http://localhost:8000/api/v1/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ query: searchQuery })
        });
        if (response.ok) {
          const data = await response.json();
          if (data.cited_cases && data.cited_cases.length > 0) {
            const newPrecedents = data.cited_cases.map((c, i) => ({
              id: Date.now() + i,
              title: c,
              similarity: 'AI Matched',
              source: 'rag',
              summary: data.analysis ? (data.analysis.substring(0, 100) + '...') : 'Found via RAG database search.'
            }));
            setPrecedents(prev => [...newPrecedents, ...prev]);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const filteredPrecedents = precedents.filter(p => sourceFilter === 'all' || p.source === sourceFilter);

  return (
    <section className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <div>
        <h2 className="text-3xl font-semibold text-[#0f2d5e]">Case Comparisons & Strategy</h2>
        <p className="mt-1 text-sm text-slate-500">Cross-reference your personal case library with RAG intelligence.</p>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden min-h-[600px] flex-col lg:flex-row">
        {/* Left Panel: Cases */}
        <div className="flex w-full lg:w-1/2 flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 p-4">
            <div className="flex items-center gap-2 rounded-lg bg-slate-100 p-1 mb-4">
              <button onClick={() => setSourceFilter('all')} className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-colors ${sourceFilter === 'all' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>All Sources</button>
              <button onClick={() => setSourceFilter('library')} className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-colors ${sourceFilter === 'library' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}>My Library</button>
              <button onClick={() => setSourceFilter('rag')} className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-colors ${sourceFilter === 'rag' ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-500 hover:text-slate-700'}`}>RAG Findings</button>
            </div>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder={isSearching ? "Searching RAG Database..." : "Search precedents (Press Enter)..."} 
                disabled={isSearching}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white disabled:opacity-70" 
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
            {filteredPrecedents.map(p => (
              <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="font-bold text-slate-800">{p.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${p.source === 'library' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                      {p.source === 'library' ? 'Library' : 'RAG'}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">{p.similarity} Match</span>
                  </div>
                </div>
                <p className={`text-xs text-slate-500 mb-3 ${expandedCases.includes(p.id) ? '' : 'line-clamp-2'}`}>{p.summary}</p>
                <div className="flex gap-2">
                  <button onClick={() => toggleDetails(p.id)} className="flex-1 rounded border border-slate-200 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                    {expandedCases.includes(p.id) ? 'Hide Details' : 'View Details'}
                  </button>
                  <button onClick={() => handleAddToCompare(p)} className="flex-1 rounded bg-blue-50 text-blue-600 py-1.5 text-xs font-semibold hover:bg-blue-100 transition-colors">Add to Compare</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: AI Chat */}
        <div className="flex w-full lg:w-1/2 flex-col rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-3">
            <MessageSquare size={18} className="text-blue-600" />
            <h3 className="font-bold text-slate-800">AI Strategy Chat</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
            {aiMessages.map((msg, idx) => (
              <div key={idx} className={`flex max-w-[85%] flex-col ${msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                <div className={`rounded-xl p-3 text-sm shadow-sm ${msg.role === 'user' ? 'rounded-tr-sm bg-blue-600 text-white' : 'rounded-tl-sm border border-slate-200 bg-white text-slate-700'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleChat} className="border-t border-slate-100 p-4 bg-white">
            <div className="relative">
              <input 
                type="text" 
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ask AI to compare selected cases..." 
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-4 pr-12 text-sm outline-none focus:border-blue-500 focus:bg-white transition-shadow focus:ring-4 focus:ring-blue-500/10"
              />
              <button type="submit" disabled={!aiInput.trim()} className="absolute bottom-1.5 right-1.5 top-1.5 flex w-9 items-center justify-center rounded-md bg-blue-600 text-white transition-colors hover:bg-blue-700 disabled:opacity-50">
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function CaseFilesSection({ onOpenNewCase }) {
  const cases = [
    { id: 'CF-9921', client: 'Ravi Kumar', type: 'Family Law', status: 'Ongoing', hearing: 'Oct 28, 2023', progress: 65 },
    { id: 'CF-8832', client: 'Sneha Kapoor', type: 'Corporate', status: 'In Review', hearing: 'Nov 2, 2023', progress: 40 },
    { id: 'CF-7719', client: 'Amit V.', type: 'Property', status: 'Drafting', hearing: 'Nov 15, 2023', progress: 20 },
    { id: 'CF-6641', client: 'Client #3821', type: 'Criminal', status: 'Closed', hearing: 'Past', progress: 100 },
  ];

  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-[#0f2d5e]">Case Files</h2>
          <p className="mt-1 text-sm text-slate-500">Manage and track your ongoing and past cases.</p>
        </div>
        <button onClick={onOpenNewCase} className="flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-blue-500/20 transition-colors hover:bg-blue-800">
          <Plus size={16} />
          New Case
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cases.map((c) => (
          <div key={c.id} className="group flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-lg border border-blue-100 bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">{c.id}</span>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                c.status === 'Ongoing' ? 'border border-amber-200 bg-amber-100 text-amber-700' :
                c.status === 'Closed' ? 'border border-emerald-200 bg-emerald-100 text-emerald-700' : 'border border-slate-200 bg-slate-100 text-slate-700'
              }`}>
                {c.status}
              </span>
            </div>
            <h3 className="mb-1 text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-700">{c.client}</h3>
            <p className="mb-6 text-sm font-medium text-slate-500">{c.type}</p>
            
            <div className="mt-auto">
              <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-600">
                <span className="flex items-center gap-1.5"><CalendarDays size={14} className="text-blue-500" /> Next Hearing: {c.hearing}</span>
                <span className="font-bold text-slate-700">{c.progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-blue-600 transition-all duration-1000" style={{ width: `${c.progress}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function DocumentsSection() {
  const docs = [
    { id: 1, name: 'Affidavit_Kumar.pdf', size: '2.4 MB', date: 'Oct 20, 2023', case: 'CF-9921' },
    { id: 2, name: 'Bail_Application_Draft.docx', size: '1.1 MB', date: 'Oct 21, 2023', case: 'CF-6641' },
    { id: 3, name: 'Property_Deed_Scan.pdf', size: '8.5 MB', date: 'Oct 22, 2023', case: 'CF-7719' },
    { id: 4, name: 'Corporate_Merger_Agreement.pdf', size: '12.0 MB', date: 'Oct 23, 2023', case: 'CF-8832' },
  ];

  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-[#0f2d5e]">Documents</h2>
          <p className="mt-1 text-sm text-slate-500">Securely store and manage your legal documents.</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-[#0f2d5e] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#143974]">
          <Plus size={16} />
          Upload Document
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">Document Name</th>
                <th className="px-6 py-4 font-semibold">Case ID</th>
                <th className="px-6 py-4 font-semibold">Size</th>
                <th className="px-6 py-4 font-semibold">Upload Date</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {docs.map((doc) => (
                <tr key={doc.id} className="group transition-colors hover:bg-slate-50/80">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-100 bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                        <FileText size={18} />
                      </div>
                      <span className="font-semibold text-slate-900">{doc.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm">{doc.case}</span>
                  </td>
                  <td className="px-6 py-4 font-medium">{doc.size}</td>
                  <td className="px-6 py-4">{doc.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-200 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40">
                      <Download size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function AnalyticsSection() {
  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-[#0f2d5e]">Analytics & Insights</h2>
          <p className="mt-1 text-sm text-slate-500">Track your performance and practice growth.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Case Success Rate</h3>
            <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">Top 10%</span>
          </div>
          <div className="flex items-center justify-center py-6">
            <div className="relative flex h-52 w-52 items-center justify-center rounded-full border-[12px] border-slate-100 shadow-inner">
              <div className="absolute inset-0 rotate-45 transform rounded-full border-[12px] border-emerald-500 border-l-transparent border-t-transparent transition-all duration-1000" />
              <div className="z-10 text-center">
                <span className="text-5xl font-black tracking-tight text-slate-900">82<span className="text-3xl text-slate-500">%</span></span>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Win Rate</p>
              </div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 divide-x divide-slate-100 border-t border-slate-100 pt-6 text-center gap-4">
            <div>
              <p className="text-3xl font-black text-emerald-600">41</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">Cases Won</p>
            </div>
            <div>
              <p className="text-3xl font-black text-slate-700">9</p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">Lost / Settled</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Monthly Consultations</h3>
            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View Full Report</button>
          </div>
          <div className="flex flex-1 items-end gap-3 pb-4 pt-8">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => {
              const height = [40, 60, 45, 80, 55, 90][i];
              return (
                <div key={month} className="group relative flex flex-1 flex-col items-center gap-2">
                  <div className="absolute -top-8 hidden rounded-md bg-slate-800 px-2 py-1 text-xs font-bold text-white shadow-lg group-hover:block">
                    {height}
                  </div>
                  <div className="relative w-full overflow-hidden rounded-t-lg bg-blue-100 transition-all duration-500 group-hover:bg-blue-600" style={{ height: `${height}%` }}>
                    <div className="absolute bottom-0 h-1/2 w-full bg-gradient-to-t from-blue-600/20 to-transparent" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{month}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-6 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[#0f2d5e]">Consultation Growth</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <Zap size={12} />
                  +15% from last month
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-md shadow-blue-500/30">
                <LineChart size={18} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProfileSection({ user }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('vakeellink_token');
        if (!token) {
          setLoading(false);
          return;
        }
        const res = await fetch('http://localhost:8000/api/lawyers/me/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProfileData(data);
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const fallbackProfile = {
    name: user?.name || 'Adv. Priya Sharma',
    specialization: 'Corporate & Family Law',
    experience_years: 8,
    bio: 'Dedicated advocate with extensive experience in corporate disputes and family settlements. Committed to providing ethical and effective legal representation.',
    location: 'Mumbai, Maharashtra',
    bar_council_id: 'MAH/1234/2015',
    email: user?.email || 'priya.sharma@lexprecise.com',
    phone: '+91 98765 43210'
  };

  const displayData = profileData || fallbackProfile;

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-blue-600">
          <Bot className="animate-bounce" size={40} />
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-400">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-[#0f2d5e]">Profile Settings</h2>
          <p className="mt-1 text-sm text-slate-500">Manage your professional identity and portal preferences.</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-blue-700 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-colors hover:bg-blue-800">
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white opacity-50" />
            <div className="relative z-10">
              <div className="mx-auto mb-5 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#0f2d5e] to-blue-700 text-4xl font-black text-white shadow-xl ring-4 ring-white transition-transform group-hover:scale-105">
                {displayData.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-slate-900">{displayData.name}</h3>
              <p className="mt-1 inline-block rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-600">{displayData.specialization}</p>
              
              <div className="mt-8 flex justify-center gap-6 border-t border-slate-100 pt-8">
                <div className="flex-1 text-center">
                  <p className="text-3xl font-black text-slate-800">{displayData.experience_years}</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Years Exp</p>
                </div>
                <div className="w-px bg-slate-200" />
                <div className="flex-1 text-center">
                  <p className="text-3xl font-black text-slate-800">18</p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">Active Cases</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50 px-8 py-5">
              <h3 className="flex items-center gap-2 text-lg font-bold text-[#0f2d5e]">
                <UserCircle2 size={20} className="text-blue-600" />
                Personal Information
              </h3>
            </div>
            <div className="p-8">
              <form className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</label>
                  <input type="text" defaultValue={displayData.name} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
                </div>
                
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                  <input type="email" defaultValue={displayData.email} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
                </div>
                
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Phone Number</label>
                  <input type="tel" defaultValue={displayData.phone} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Bar Council ID
                    <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[8px] font-black text-emerald-700">VERIFIED</span>
                  </label>
                  <input type="text" defaultValue={displayData.bar_council_id} className="cursor-not-allowed w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-500 outline-none" disabled />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Location</label>
                  <input type="text" defaultValue={displayData.location} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">Professional Bio</label>
                  <textarea rows="4" defaultValue={displayData.bio} className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LawyerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [approvalStatus, setApprovalStatus] = useState(() => localStorage.getItem('vakeellink_lawyer_approval_status') || 'approved');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [rejectionReason] = useState('Bar Council ID mismatch with the uploaded verification documents.');
  const [consultations, setConsultations] = useState(CONSULTATION_REQUESTS);

  // Case Comparisons State (Lifted for persistence)
  const [compSourceFilter, setCompSourceFilter] = useState('all');
  const [compSearchQuery, setCompSearchQuery] = useState('');
  const [isCompSearching, setIsCompSearching] = useState(false);
  const [compPrecedents, setCompPrecedents] = useState([
    { id: 1, title: 'State v. Sharma (2019)', similarity: '92%', source: 'rag', summary: 'Similar property dispute involving ancestral rights.' },
    { id: 2, title: 'Rao & Co. v. Union (2021)', similarity: '85%', source: 'library', summary: 'Corporate merger precedent from your past cases.' },
    { id: 3, title: 'Tech Solutions v. Dept of Revenue', similarity: '78%', source: 'rag', summary: 'Taxation dispute involving software licensing.' }
  ]);
  const [compAiMessages, setCompAiMessages] = useState([
    { role: 'ai', text: 'Select precedents from your library or RAG database to compare. I can highlight discrepancies and formulate arguments.' }
  ]);
  const [compAiInput, setCompAiInput] = useState('');
  const [consultationQuery, setConsultationQuery] = useState('');
  const [consultationFilter, setConsultationFilter] = useState('all');
  const [consultationSort, setConsultationSort] = useState('latest');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Hello Adv. Priya. I am LexPrecise AI. I have full context of your profile, your 18 consultations this month, and your expertise in Family and Corporate Law. How can I assist you with your caseload today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const handleSendAiMessage = (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: aiInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setAiMessages(prev => [...prev, userMessage]);
    setAiInput('');

    // Simulate AI response
    setTimeout(() => {
      setAiMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'I am analyzing your query against your case history and the latest precedents. This feature is currently in demonstration mode.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1000);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [activeSection]);

  useEffect(() => {
    if (!feedbackMessage) return undefined;
    const timeoutId = window.setTimeout(() => setFeedbackMessage(''), 2200);
    return () => window.clearTimeout(timeoutId);
  }, [feedbackMessage]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredConsultations = consultations
    .filter((request) => {
      const normalized = consultationQuery.trim().toLowerCase();
      const matchesSearch = !normalized || [request.clientName, request.category, request.message].join(' ').toLowerCase().includes(normalized);
      const matchesFilter = consultationFilter === 'all' || request.status === consultationFilter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (consultationSort === 'latest') {
        return b.id.localeCompare(a.id);
      }
      if (consultationSort === 'oldest') {
        return a.id.localeCompare(b.id);
      }
      return a.clientName.localeCompare(b.clientName);
    });

  const pendingCount = consultations.filter((request) => request.status === 'pending').length;
  const activeCount = consultations.filter((request) => request.status === 'accepted').length;
  const passiveCount = consultations.filter((request) => request.status !== 'accepted').length;
  const activeConsultations = filteredConsultations.filter((request) => request.status === 'accepted');
  const passiveConsultations = filteredConsultations.filter((request) => request.status !== 'accepted');

  const updateRequestStatus = (requestId, status) => {
    setConsultations((prev) => prev.map((request) => (request.id === requestId ? { ...request, status } : request)));
    setFeedbackMessage(status === 'accepted' ? 'Request accepted' : 'Request declined');
  };

  const openChat = (request) => {
    setFeedbackMessage(`Opening chat with ${request.clientName}`);
  };

  if (approvalStatus === 'pending') {
    return <PendingScreen onRefresh={() => setApprovalStatus('approved')} />;
  }

  if (approvalStatus === 'rejected') {
    return <RejectedScreen reason={rejectionReason} onReapply={() => setApprovalStatus('pending')} />;
  }

  return (
    <div className="min-h-screen bg-[#faf8ff] text-slate-900">
      <SideNav
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onLogout={handleLogout}
        onOpenNewCase={() => setIsNewCaseModalOpen(true)}
        displayName={user?.name || 'Adv. Priya Sharma'}
      />

      <main className="ml-[280px] min-h-screen">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              className="w-full rounded-lg bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none ring-0 transition-all focus:ring-2 focus:ring-blue-300"
              placeholder="Search case files, clients..."
              type="text"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="rounded-full p-2 text-slate-500 transition-transform hover:bg-slate-50 active:scale-95"><Bell size={18} /></button>
            <button className="rounded-full p-2 text-slate-500 transition-transform hover:bg-slate-50 active:scale-95"><Settings size={18} /></button>
            <button className="rounded-full p-2 text-slate-500 transition-transform hover:bg-slate-50 active:scale-95"><CircleHelp size={18} /></button>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">PS</div>
              <span className="text-sm font-medium text-slate-900">Lawyer Dashboard</span>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1440px] p-8">
          {activeSection === 'dashboard' ? (
            <>
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <h1 className="text-3xl font-semibold text-[#0f2d5e]">Welcome back, Adv. Priya Sharma</h1>
                  <div className="mt-1 flex items-center gap-2 text-slate-600">
                    <CalendarDays size={16} />
                    <p>Monday, October 23, 2023</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-slate-300">
                    Export Report
                  </button>
                  <button className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-800">
                    View Schedule
                  </button>
                </div>
              </div>

              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard label="Consultations This Month" value="18" badge="+12%" accent="blue" icon={CalendarCheck2} />
                <MetricCard label="Pending Requests" value="3" badge="Action Required" accent="orange" icon={Clock3} />
                <MetricCard label="Average Rating" value="4.7" badge="Top 5% Rank" accent="yellow" icon={Star} />
                <MetricCard label="Response Rate" value="92%" badge="Excellent" accent="teal" icon={Zap} />
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <section className="space-y-6 lg:col-span-2">
                  <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 p-6">
                      <h3 className="text-xl font-semibold text-[#0f2d5e]">Recent Activity</h3>
                      <button className="text-sm font-medium text-blue-600 hover:underline">View All</button>
                    </div>
                    <div>
                      {RECENT_ACTIVITY.map((item) => (
                        <ActivityItem key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                </section>

                <aside className="space-y-6">
                  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-xl font-semibold text-[#0f2d5e]">Today's Schedule</h3>
                    <div className="space-y-4">
                      {TODAY_SCHEDULE.map((meeting) => (
                        <div key={meeting.id} className={`border-l-4 pl-4 ${meeting.active ? 'border-blue-600' : 'border-slate-200'}`}>
                          <p className="text-xs font-bold uppercase text-slate-500">{meeting.time}</p>
                          <p className="font-semibold text-slate-900">{meeting.title}</p>
                          <p className="text-xs text-slate-500">{meeting.detail}</p>
                        </div>
                      ))}
                    </div>
                    <button className="mt-6 w-full rounded-lg border border-slate-200 bg-slate-50 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100">
                      Manage Calendar
                    </button>
                  </div>
                  <div className="group relative flex h-[240px] flex-col justify-end overflow-hidden rounded-xl bg-[#0f2d5e] p-6 text-white">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0f2d5e] via-[#173d7a] to-[#0f2d5e] opacity-80" />
                    <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-blue-400/20 blur-2xl" />
                    <div className="relative z-10">
                      <h4 className="mb-2 text-xl font-bold">LexPrecise AI Assistant</h4>
                      <p className="mb-4 text-sm text-blue-200">Our new case summary tool is now available for premium members.</p>
                      <button className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-400">Try Now</button>
                    </div>
                  </div>
                </aside>
              </div>
            </>
          ) : activeSection === 'consultations' ? (
            <section className="space-y-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-3xl font-semibold text-[#0f2d5e]">Consultations</h2>
                  <p className="mt-1 text-sm text-slate-500">Manage active consultations and review pending or passive requests.</p>
                </div>
                <div className="grid grid-cols-3 gap-3 sm:flex">
                  <div className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-center shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Active</p>
                    <p className="text-xl font-bold text-emerald-700">{activeCount}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-center shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Pending</p>
                    <p className="text-xl font-bold text-[#0f2d5e]">{pendingCount}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-center shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Passive</p>
                    <p className="text-xl font-bold text-slate-700">{passiveCount}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    value={consultationQuery}
                    onChange={(event) => setConsultationQuery(event.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-200/70"
                    placeholder="Search requests..."
                    type="text"
                  />
                </div>

                <div className="flex gap-2">
                  <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                    <Filter size={16} />
                    <select
                      className="bg-transparent font-medium outline-none"
                      value={consultationFilter}
                      onChange={(event) => setConsultationFilter(event.target.value)}
                    >
                      <option value="all">All</option>
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="declined">Declined</option>
                    </select>
                  </label>

                  <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                    <Download size={16} />
                    <select
                      className="bg-transparent font-medium outline-none"
                      value={consultationSort}
                      onChange={(event) => setConsultationSort(event.target.value)}
                    >
                      <option value="latest">Latest</option>
                      <option value="oldest">Oldest</option>
                      <option value="client">Client</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Active Consultations
                  </h3>
                  <div className="space-y-4">
                    {activeConsultations.length ? activeConsultations.map((request) => (
                      <article key={request.id} className="rounded-xl border border-l-4 border-l-blue-600 border-slate-200 bg-white p-5 shadow-sm transition-all">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div className="flex items-start gap-3">
                            <img src={request.avatar} alt={request.clientName} className="h-12 w-12 rounded-full border border-slate-200 object-cover" />
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-lg font-semibold text-slate-900">{request.clientName}</h3>
                                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">Active</span>
                              </div>
                              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                <span className="rounded bg-blue-50 px-2 py-0.5 font-semibold text-blue-700">{request.category}</span>
                                <span>• {request.submittedAt}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => openChat(request)}
                            className="inline-flex items-center gap-1 rounded-lg bg-[#0f2d5e] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#143974]"
                          >
                            <MessageCircle size={16} />
                            Open Chat
                          </button>
                        </div>
                        <p className="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm italic leading-relaxed text-slate-700">
                          "{request.message}"
                        </p>
                      </article>
                    )) : (
                      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500">
                        No active consultations match your current filters.
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    Pending / Passive Consultations
                  </h3>
                  <div className="space-y-4">
                    {passiveConsultations.length ? passiveConsultations.map((request) => (
                      <article key={request.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-slate-300">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div className="flex items-start gap-3">
                            <img src={request.avatar} alt={request.clientName} className="h-12 w-12 rounded-full border border-slate-200 object-cover" />
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-lg font-semibold text-slate-900">{request.clientName}</h3>
                                {request.status === 'pending' && (
                                  <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">Pending</span>
                                )}
                                {request.status === 'declined' && (
                                  <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-700">Declined</span>
                                )}
                              </div>
                              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                <span className="rounded bg-blue-50 px-2 py-0.5 font-semibold text-blue-700">{request.category}</span>
                                <span>• {request.submittedAt}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {request.status === 'pending' ? (
                              <>
                                <button
                                  onClick={() => updateRequestStatus(request.id, 'accepted')}
                                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                                >
                                  <CheckCircle2 size={16} />
                                  Accept
                                </button>
                                <button
                                  onClick={() => updateRequestStatus(request.id, 'declined')}
                                  className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-50"
                                >
                                  <XCircle size={16} />
                                  Decline
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => updateRequestStatus(request.id, 'pending')}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                              >
                                Reopen Request
                              </button>
                            )}
                          </div>
                        </div>

                        <p className="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm italic leading-relaxed text-slate-700">
                          "{request.message}"
                        </p>
                      </article>
                    )) : (
                      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500">
                        No pending or passive consultations match your current filters.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          ) : activeSection === 'case-files' ? (
            <CaseFilesSection onOpenNewCase={() => setIsNewCaseModalOpen(true)} />
          ) : activeSection === 'documents' ? (
            <DocumentsSection />
          ) : activeSection === 'case-comparisons' ? (
            <CaseComparisonsSection 
              sourceFilter={compSourceFilter} setSourceFilter={setCompSourceFilter}
              precedents={compPrecedents} setPrecedents={setCompPrecedents}
              aiMessages={compAiMessages} setAiMessages={setCompAiMessages}
              aiInput={compAiInput} setAiInput={setCompAiInput}
              searchQuery={compSearchQuery} setSearchQuery={setCompSearchQuery}
              isSearching={isCompSearching} setIsSearching={setIsCompSearching}
            />
          ) : activeSection === 'analytics' ? (
            <AnalyticsSection />
          ) : activeSection === 'profile' ? (
            <ProfileSection user={user} />
          ) : null}
        </div>

        {/* Floating Action Button */}
        <button 
          onClick={() => setIsAIChatOpen(!isAIChatOpen)}
          className={`fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-all hover:scale-105 active:scale-95 ${isAIChatOpen ? 'bg-slate-800' : 'bg-blue-700'}`}
        >
          {isAIChatOpen ? <X size={24} /> : <MessageCircle size={28} />}
        </button>

        {/* Sliding AI Chatbot Panel */}
        {isAIChatOpen && (
          <div className="fixed bottom-28 right-8 z-50 flex h-[600px] w-[400px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300">
            <div className="flex items-center justify-between bg-[#0f2d5e] p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold">LexPrecise AI</h3>
                  <p className="text-[10px] text-blue-200">Context: Adv. Priya Sharma</p>
                </div>
              </div>
              <button onClick={() => setIsAIChatOpen(false)} className="rounded-full p-1 hover:bg-white/10 transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto bg-slate-50 p-4 space-y-4">
              {aiMessages.map(msg => (
                <div key={msg.id} className={`flex max-w-[85%] flex-col ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                  <div className={`rounded-2xl p-3 text-sm shadow-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'}`}>
                    {msg.text}
                  </div>
                  <span className="mt-1 text-[10px] text-slate-400">{msg.timestamp}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendAiMessage} className="border-t border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                <input 
                  type="text"
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="Ask your AI assistant..."
                  className="flex-1 bg-transparent text-sm outline-none"
                />
                <button type="submit" disabled={!aiInput.trim()} className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white disabled:opacity-50 hover:bg-blue-700 transition-colors">
                  <Send size={14} />
                </button>
              </div>
            </form>
          </div>
        )}

        {feedbackMessage && (
          <div className="fixed bottom-8 right-28 z-50 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-lg">
            {feedbackMessage}
          </div>
        )}

        {isNewCaseModalOpen && (
          <NewCaseModal onClose={() => setIsNewCaseModalOpen(false)} />
        )}
      </main>
    </div>
  );
}

function MetricCard({ label, value, badge, accent, icon: Icon }) {
  const accentClasses = {
    blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
    orange: 'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white',
    yellow: 'bg-yellow-50 text-yellow-600 group-hover:bg-yellow-600 group-hover:text-white',
    teal: 'bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white',
  };

  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-slate-300">
      <div className="mb-4 flex items-start justify-between">
        <div className={`rounded-lg p-2 transition-colors ${accentClasses[accent]}`}>
          <Icon size={20} />
        </div>
        <span className="rounded bg-slate-50 px-2 py-1 text-xs font-bold text-slate-600">{badge}</span>
      </div>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <h3 className="mt-1 text-3xl font-bold text-[#0f2d5e]">{value}</h3>
    </div>
  );
}

function ActivityItem({ item }) {
  const typeStyles = {
    success: { wrapper: 'bg-emerald-100 text-emerald-600', icon: CheckCircle2 },
    video: { wrapper: 'bg-blue-100 text-blue-600', icon: Video },
    message: { wrapper: 'bg-orange-100 text-orange-600', icon: Mail },
    verify: { wrapper: 'bg-slate-100 text-slate-600', icon: UserCircle2 },
  };
  const { wrapper, icon: Icon } = typeStyles[item.type] || typeStyles.verify;

  return (
    <div className="flex items-start gap-4 border-b border-slate-50 p-6 transition-colors hover:bg-slate-50">
      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${wrapper}`}>
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <div className="flex justify-between gap-4">
          <p className="text-base font-semibold text-slate-900">{item.title}</p>
          <span className="text-xs text-slate-400">{item.timeAgo}</span>
        </div>
        <p className="mt-0.5 text-sm text-slate-500">{item.detail}</p>
      </div>
    </div>
  );
}