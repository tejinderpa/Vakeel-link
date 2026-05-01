import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserSidebar from '../components/UserSidebar';
import { 
  Download, 
  Trash2, 
  Bookmark, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Filter, 
  Clock, 
  Shield, 
  Gavel, 
  BookOpen, 
  ArrowUpRight 
} from 'lucide-react';

const MOCK_CASES = [
  {
    id: 1,
    title: 'Maneka Gandhi vs Union of India',
    citation: '1978 AIR 597, 1978 SCR (2) 621 • Supreme Court of India',
    domain: 'CONSTITUTIONAL',
    date: 'Saved 3 days ago',
  },
  {
    id: 2,
    title: 'Kesavananda Bharati v. State of Kerala',
    citation: 'AIR 1973 SC 1461 • Supreme Court of India',
    domain: 'CONSTITUTIONAL',
    date: 'Saved 5 days ago',
  },
  {
    id: 3,
    title: 'State of Punjab vs Dalbir Singh',
    citation: 'Civil Appeal No. 117 of 2012 • Supreme Court of India',
    domain: 'CRIMINAL LAW',
    date: 'Saved 1 week ago',
  },
  {
    id: 4,
    title: 'Vishaka & Ors vs State of Rajasthan',
    citation: 'AIR 1997 SC 3011 • Supreme Court of India',
    domain: 'CONSTITUTIONAL',
    date: 'Saved 2 weeks ago',
  },
];

const Archive = () => {
  const [activeTab, setActiveTab] = useState('saved');
  const [cases, setCases] = useState(MOCK_CASES);
  const [selectedCases, setSelectedCases] = useState([]);
  const [filters, setFilters] = useState({
    constitutional: true,
    criminal: false,
    corporate: false,
    civil: false,
  });
  const [loading, setLoading] = useState(false);

  const toggleSelection = (id) => {
    setSelectedCases((prev) =>
      prev.includes(id) ? prev.filter((caseId) => caseId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCases(cases.map((c) => c.id));
    } else {
      setSelectedCases([]);
    }
  };

  const handleFilterChange = (domain) => {
    setFilters((prev) => ({
      ...prev,
      [domain]: !prev[domain],
    }));
  };

  const handleDeleteSelected = async () => {
    if (selectedCases.length === 0) return;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setCases((prev) => prev.filter((c) => !selectedCases.includes(c.id)));
    setSelectedCases([]);
    setLoading(false);
  };

  const filteredCases = cases.filter((c) => {
    const domainMapping = {
      'CONSTITUTIONAL': filters.constitutional,
      'CRIMINAL LAW': filters.criminal,
    };
    const anyFilterSelected = Object.values(filters).some(Boolean);
    if (!anyFilterSelected) return true;
    return domainMapping[c.domain] === true;
  });

  const tabs = [
    { id: 'saved', label: 'Saved Cases', icon: Bookmark },
    { id: 'research', label: 'AI Research', icon: Clock },
    { id: 'downloads', label: 'Downloads', icon: Download },
    { id: 'bookmarks', label: 'Bookmarks', icon: BookOpen },
  ];

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200">
      <UserSidebar />
      
      <main className="flex-1 md:ml-[280px] p-6 md:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
              Case <span className="text-indigo-500">Archive</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
              Your saved cases, research sessions, and AI history records.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-4 p-2 glass-effect rounded-[28px] border border-white/5 mb-10 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-8 py-4 rounded-[22px] font-black uppercase tracking-widest text-[10px] transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Filters Sidebar */}
            <aside className="hidden lg:block lg:col-span-3 space-y-8">
              <div className="glass-effect rounded-[32px] border border-white/10 p-8 space-y-8">
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6">Jurisdictions</h3>
                  <div className="space-y-4">
                    {['Constitutional', 'Criminal Law', 'Corporate', 'Civil'].map((domain) => (
                      <label key={domain} className="flex items-center gap-4 group cursor-pointer">
                        <div className="relative flex items-center justify-center">
                          <input
                            type="checkbox"
                            className="peer appearance-none w-6 h-6 rounded-lg border-2 border-white/10 checked:border-indigo-500 checked:bg-indigo-500/20 transition-all cursor-pointer"
                            checked={filters[domain.toLowerCase().replace(' ', '')]}
                            onChange={() => handleFilterChange(domain.toLowerCase().replace(' ', ''))}
                          />
                          <div className="absolute opacity-0 peer-checked:opacity-100 text-indigo-400 pointer-events-none">
                            <Plus size={14} className="rotate-45" />
                          </div>
                        </div>
                        <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">{domain}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="pt-8 border-t border-white/5">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-6">Time Period</h3>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none appearance-none">
                    <option className="bg-[#020617]">Last 30 Days</option>
                    <option className="bg-[#020617]">Last 6 Months</option>
                    <option className="bg-[#020617]">All Time</option>
                  </select>
                </div>
              </div>
            </aside>

            {/* List Content */}
            <section className="lg:col-span-9 space-y-8">
              {/* Action Bar */}
              <div className="glass-effect px-8 py-5 rounded-[32px] border border-white/10 flex items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <input
                    type="checkbox"
                    className="peer appearance-none w-6 h-6 rounded-lg border-2 border-white/10 checked:border-indigo-500 checked:bg-indigo-500/20 transition-all cursor-pointer"
                    onChange={handleSelectAll}
                    checked={selectedCases.length === cases.length && cases.length > 0}
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">
                    {selectedCases.length} Selected
                  </span>
                </div>
                <div className="flex gap-4">
                  <button 
                    disabled={selectedCases.length === 0}
                    className="p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <Download size={20} />
                  </button>
                  <button 
                    onClick={handleDeleteSelected}
                    disabled={selectedCases.length === 0 || loading}
                    className="p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-rose-500 hover:border-rose-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-6">
                {filteredCases.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => toggleSelection(c.id)}
                    className={`glass-effect p-8 rounded-[40px] border border-white/10 hover:bg-white/[0.04] transition-all cursor-pointer group relative overflow-hidden flex gap-8 items-start ${selectedCases.includes(c.id) ? 'ring-2 ring-indigo-500 border-transparent' : ''}`}
                  >
                    <div className="mt-1" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="peer appearance-none w-6 h-6 rounded-lg border-2 border-white/10 checked:border-indigo-500 checked:bg-indigo-500 transition-all cursor-pointer"
                        checked={selectedCases.includes(c.id)}
                        onChange={() => toggleSelection(c.id)}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start gap-6 mb-4">
                        <h3 className="text-2xl font-black text-white group-hover:text-indigo-400 transition-colors leading-tight">
                          {c.title}
                        </h3>
                        <div className="flex gap-3 shrink-0" onClick={(e) => e.stopPropagation()}>
                          <button className="px-5 py-2 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-all">
                            View
                          </button>
                        </div>
                      </div>
                      <p className="text-slate-500 font-medium text-sm mb-6 font-mono">{c.citation}</p>
                      <div className="flex items-center gap-8">
                        <span className="px-3 py-1 bg-white/5 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-lg border border-white/5">
                          {c.domain}
                        </span>
                        <div className="flex items-center gap-2 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                          <Calendar size={14} />
                          {c.date}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center pt-10">
                <div className="flex items-center gap-3">
                  <button className="p-3 bg-white/5 border border-white/5 rounded-2xl text-slate-600 hover:text-white transition-all">
                    <ChevronLeft size={24} />
                  </button>
                  <span className="w-12 h-12 flex items-center justify-center font-black bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-600/20">1</span>
                  <button className="w-12 h-12 flex items-center justify-center font-black text-slate-600 hover:bg-white/5 rounded-2xl transition-all">2</button>
                  <button className="p-3 bg-white/5 border border-white/5 rounded-2xl text-slate-600 hover:text-white transition-all">
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Archive;