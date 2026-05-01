import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from './useAuth';
import { 
  MessageSquare, 
  Search, 
  Users, 
  Calendar, 
  User, 
  Scale,
  Menu,
  X,
  LogOut
} from 'lucide-react';

const UserSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    const mainScrollContainer = document.querySelector('main.overflow-y-auto');
    if (mainScrollContainer) {
      mainScrollContainer.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [location.pathname]);

  const navItems = [
    { name: 'AI Assistant', path: '/assistant', icon: MessageSquare },
    { name: 'Case Search', path: '/case-search', icon: Search },
    { name: 'Find Lawyers', path: '/lawyers', icon: Users },
    { name: 'My Consultations', path: '/consultations', icon: Calendar },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-6 left-6 z-[60] glass-effect text-white p-3 rounded-2xl shadow-2xl"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-screen bg-[#020617]/80 backdrop-blur-xl border-r border-white/5 text-white flex flex-col z-50 transition-all duration-500 ease-in-out
        ${isOpen ? 'w-[280px] translate-x-0' : 'w-[280px] -translate-x-full md:translate-x-0'}
      `}>
        <Link to="/" onClick={() => setIsOpen(false)} className="p-8 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl primary-gradient flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Scale className="text-white" size={22} />
          </div>
          <span className="text-2xl font-black tracking-tighter text-gradient">VakeelLink</span>
        </Link>
        
        <nav className="flex-1 mt-8 px-6 space-y-3">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 px-4">Main Menu</div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className={`transition-colors duration-300 ${isActive ? 'text-indigo-400' : 'group-hover:text-white'}`}>
                  <Icon size={20} />
                </div>
                <span className="font-semibold text-[15px]">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto space-y-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-rose-300 hover:bg-rose-500/20 transition-all text-[10px] font-black uppercase tracking-widest"
          >
            <LogOut size={16} />
            Logout
          </button>
          <div className="glass-effect rounded-[24px] p-5 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full -mr-12 -mt-12 transition-all group-hover:bg-indigo-500/20" />
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold shadow-lg text-white">
                  {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#0f172a] rounded-full shadow-lg" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold text-white truncate">{user?.name || 'Authorized User'}</span>
                <span className="text-[11px] font-medium text-slate-500">{user?.role || 'Premium'} Plan</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default UserSidebar;
