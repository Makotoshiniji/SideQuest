import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PenTool, GitMerge, PlayCircle, LogOut } from 'lucide-react';

export default function StudioLayout() {
  const location = useLocation();
  
  const navItems = [
    { path: '/studio/dashboard', icon: LayoutDashboard, label: 'แดชบอร์ดจัดการ' },
    { path: '/studio/builder', icon: PenTool, label: 'สร้างสถานการณ์ (Builder)' },
    { path: '/studio/mapping', icon: GitMerge, label: 'กำหนดทักษะ & AI' },
    { path: '/studio/review', icon: PlayCircle, label: 'ทดสอบ & เผยแพร่' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-['Kanit']">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 shadow-xl flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-white font-['Fredoka']">QUEST STUDIO</h1>
          <p className="text-sm text-slate-400">ระบบสร้างโลกจำลอง</p>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-indigo-600 text-white font-medium shadow-md shadow-indigo-900/20' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <Link 
            to="/"
            className="flex items-center space-x-3 px-4 py-3 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            <span>ออกจากระบบ</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
