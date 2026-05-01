import { useEffect, useMemo, useState } from 'react';
import { 
  AlertTriangle, 
  Bot, 
  CheckCircle2, 
  FileText, 
  Loader2, 
  Scale, 
  Shield, 
  Sparkles, 
  X
} from 'lucide-react';
import UserSidebar from '../components/UserSidebar';
import useAuth from '../components/useAuth';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');
const AI_ENDPOINTS = ['/api/v1/query/ask', '/api/query/ask'];

const DEMO_RESPONSE = {
  domain: 'legal_family',
  analysis: 'Demo mode response. The backend was not reachable, so this preview was generated locally. Please reconnect the API to receive live legal analysis.',
  cited_sections: ['Section 13, Hindu Marriage Act'],
  cited_cases: ['Roxann Sharma v. Arun Sharma'],
  cited_acts: ['Hindu Marriage Act, 1955'],
  disclaimer: 'This is AI-generated legal guidance, not legal advice. Please consult a verified lawyer.',
  confidence_score: 0.42,
  recommended_lawyers: [],
};

const LOADING_STEPS = [
  { title: 'Validating query', detail: 'Checking the question format and preparing the legal retrieval request.' },
  { title: 'Searching Qdrant', detail: 'Pulling embeddings and nearby legal passages from the retrieval store.' },
  { title: 'Collecting citations', detail: 'Matching the most relevant sections, acts, and case references.' },
  { title: 'Drafting summary', detail: 'Turning the retrieved material into a concise answer with guidance.' },
];

const AIAssistant = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [demoMode, setDemoMode] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [loadingStep, setLoadingStep] = useState(0);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [fullTextModalOpen, setFullTextModalOpen] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState(null);

  useEffect(() => {
    if (!loading) {
      setLoadingStep(0);
      return;
    }

    const timer = window.setInterval(() => {
      setLoadingStep((current) => (current + 1) % LOADING_STEPS.length);
    }, 2200);

    return () => window.clearInterval(timer);
  }, [loading]);

  const allCitationsRaw = useMemo(() => {
    return (response?.citations || [])
      .map((item, index) => ({
        id: `${item.source_collection || 'source'}-${item.text || 'cit'}-${index}`,
        type: item.type || 'Legal Reference',
        title: item.title || item.text || 'Legal Citation',
        source: item.source_collection || 'Legal Store',
        excerpt: item.excerpt || 'No excerpt available from the retrieved context.',
        fullText: item.full_text || item.excerpt || 'No full text available.',
        score: Number.isFinite(Number(item.score)) ? Number(item.score) : Number(response?.confidence_score || 0),
      }));
  }, [response]);

  const allCitations = useMemo(() => {
    const seen = new Set();
    return allCitationsRaw.filter(cit => {
      const key = `${cit.type}-${cit.title}`.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [allCitationsRaw]);

  const fallbackCitations = useMemo(() => {
    if (allCitations.length) return [];
    return [
      ...(response?.cited_sections || []).map((item, index) => ({ id: `s-${index}`, type: 'Section', title: item, source: 'Statutes', excerpt: 'Section reference returned in backend list.', fullText: `Full text for ${item} not retrieved.`, score: Number(response?.confidence_score || 0) })),
      ...(response?.cited_cases || []).map((item, index) => ({ id: `c-${index}`, type: 'Case', title: item, source: 'Precedents', excerpt: 'Case reference returned in backend list.', fullText: `Full text for ${item} not retrieved.`, score: Number(response?.confidence_score || 0) })),
      ...(response?.cited_acts || []).map((item, index) => ({ id: `a-${index}`, type: 'Act', title: item, source: 'Legislations', excerpt: 'Act reference returned in backend list.', fullText: `Full text for ${item} not retrieved.`, score: Number(response?.confidence_score || 0) })),
    ];
  }, [allCitations.length, response]);

  const displayedCitations = allCitations.length ? allCitations : fallbackCitations;

  const handleViewFullText = (citation) => {
    setSelectedCitation(citation);
    setFullTextModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setResultModalOpen(true);
    setLoading(true);
    setError('');
    setDemoMode(false);
    setLoadingStep(0);
    setResponse(null);
    setStatusMessage('Checking your query against the legal corpus...');

    try {
      const token = localStorage.getItem('vakeellink_token');
      const authToken = token && token !== 'mock_jwt_token' ? token : null;
      let data = null;
      let lastError = null;

      for (const endpoint of AI_ENDPOINTS) {
        try {
          const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
            },
            body: JSON.stringify({ query: trimmedQuery }),
          });
          if (!res.ok) {
            lastError = new Error(`Request failed with status ${res.status}`);
            continue;
          }
          data = await res.json();
          break;
        } catch (endpointErr) {
          lastError = endpointErr;
        }
      }

      if (!data) {
        throw lastError || new Error('Failed to fetch response');
      }
      setResponse(data);
    } catch (err) {
      setDemoMode(true);
      setResponse(DEMO_RESPONSE);
      setError(err.message || 'Unable to load response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-100 selection:bg-indigo-500/30 scroll-smooth">
      <UserSidebar />

      <main className="flex-1 md:ml-[280px] p-6 lg:p-12 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl space-y-12 mb-20">
          
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-300 text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles size={14} />
              AI Intelligence Core
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
              Vakeel<span className="text-indigo-500">Link</span> Assistant
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
              What legal question can I help you with today?
            </p>
          </div>

          <section className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[48px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative glass-morphism rounded-[48px] border border-white/10 p-2 md:p-4 shadow-2xl shadow-indigo-500/10 overflow-hidden">
              <form onSubmit={handleSubmit} className="flex flex-col">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Describe your legal matter in detail..."
                  className="w-full h-48 md:h-64 bg-transparent text-white placeholder-slate-500 resize-none p-8 text-xl font-medium outline-none"
                />
                <div className="flex items-center justify-between p-4 border-t border-white/5 bg-white/[0.02] rounded-b-[40px]">
                  <div className="flex gap-4 px-4">
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                       <Shield size={14} className="text-indigo-500" />
                       Privately Encrypted
                     </span>
                  </div>
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-10 py-5 rounded-[28px] font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/30 hover:bg-indigo-500 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-3"
                  >
                    Generate Analysis
                    <Sparkles size={18} />
                  </button>
                </div>
              </form>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              "Remedies for cruelty in divorce",
              "Section 84 IPC insanity defense",
              "Motor accident compensation rules"
            ].map((hint) => (
              <button 
                key={hint}
                onClick={() => setQuery(hint)}
                className="p-4 rounded-2xl border border-white/5 bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all text-left"
              >
                {hint}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Main Result Modal */}
      {resultModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md">
          <div className="glass-morphism w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-[48px] border border-white/10 flex flex-col shadow-2xl">
            
            <div className="p-8 border-b border-white/5 flex items-center justify-between sticky top-0 bg-[#020617]/50 backdrop-blur-xl z-20">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                  <Bot size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">AI Analysis Results</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">
                    {loading ? 'Synthesizing response...' : `Analysis Completed`}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setResultModalOpen(false)}
                className="p-4 hover:bg-white/10 text-slate-400 hover:text-white rounded-full transition-all"
              >
                <X size={28} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
              {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-8">
                   <div className="relative">
                    <div className="h-24 w-24 animate-spin rounded-full border-4 border-slate-800 border-t-indigo-500" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Scale size={28} className="text-indigo-400" />
                    </div>
                  </div>
                  <div className="text-center space-y-4">
                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Executing Step {loadingStep + 1}</div>
                    <h3 className="text-2xl font-black text-white">{LOADING_STEPS[loadingStep].title}</h3>
                    <p className="text-slate-500 text-sm max-w-md mx-auto font-medium">{LOADING_STEPS[loadingStep].detail}</p>
                  </div>
                </div>
              ) : error && !demoMode ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-6">
                  <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500">
                    <AlertTriangle size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">Error Occurred</h3>
                    <p className="text-slate-500 mt-2">{error}</p>
                  </div>
                  <button 
                    onClick={() => setResultModalOpen(false)}
                    className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all"
                  >
                    Try Again
                  </button>
                </div>
              ) : response && (
                <div className="space-y-12">
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                        <Shield size={16} />
                        Legal Analysis
                      </div>
                      <div className="px-3 py-1 bg-white/5 rounded-lg border border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-500">
                        Domain: {response.domain || 'General Law'}
                      </div>
                    </div>
                    <div className="glass-morphism p-8 rounded-[32px] border border-white/10 bg-white/[0.02]">
                       <p className="text-lg leading-relaxed text-slate-200 font-medium">
                         {response.summary || response.answer || response.analysis}
                       </p>
                       {response.disclaimer && (
                         <div className="mt-8 pt-8 border-t border-white/5 text-xs text-slate-500 italic">
                           {response.disclaimer}
                         </div>
                       )}
                    </div>
                  </section>

                  {displayedCitations.length > 0 && (
                    <section className="space-y-6">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Relevant Citations</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {displayedCitations.map((item) => (
                          <div key={item.id} className="glass-morphism p-6 rounded-[32px] border border-white/5 hover:border-indigo-500/30 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                              <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-indigo-500/20">
                                {item.type}
                              </span>
                              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                                {Math.round(item.score * 100)}% Match
                              </span>
                            </div>
                            <h4 className="text-lg font-black text-white group-hover:text-indigo-400 transition-colors">{item.title}</h4>
                            <p className="mt-4 text-sm text-slate-400 line-clamp-3 leading-relaxed">"{item.excerpt}"</p>
                            <button 
                              onClick={() => handleViewFullText(item)}
                              className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors"
                            >
                              <FileText size={14} /> Read Full Text
                            </button>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </div>

            <div className="p-8 border-t border-white/5 bg-white/[0.02] flex justify-end gap-4">
               <button 
                onClick={() => setResultModalOpen(false)}
                className="px-10 py-5 bg-white text-black rounded-[24px] font-black uppercase tracking-widest text-[10px] transition-all hover:bg-indigo-600 hover:text-white"
              >
                Close Results
              </button>
            </div>
          </div>
        </div>
      )}

      {fullTextModalOpen && selectedCitation && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl">
          <div className="glass-morphism w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-[40px] border border-white/10 flex flex-col shadow-2xl">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <Scale size={24} className="text-indigo-400" />
                 <div>
                   <h3 className="text-xl font-black text-white">{selectedCitation.title}</h3>
                   <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{selectedCitation.source}</span>
                 </div>
              </div>
              <button 
                onClick={() => setFullTextModalOpen(false)}
                className="p-3 hover:bg-white/10 text-slate-400 hover:text-white rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-10 md:p-14 custom-scrollbar">
              <p className="text-lg leading-relaxed text-slate-200 whitespace-pre-wrap font-serif opacity-90">
                {selectedCitation.fullText}
              </p>
            </div>
            <div className="p-8 border-t border-white/5 bg-white/[0.02] flex justify-end">
              <button 
                onClick={() => setFullTextModalOpen(false)}
                className="px-10 py-5 bg-indigo-600 text-white rounded-[24px] font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-600/20"
              >
                Back to Analysis
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
