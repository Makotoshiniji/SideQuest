import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, FileText, LogOut } from 'lucide-react';

export default function ParentLayout() {
  const location = useLocation();
  
  const navItems = [
    { path: '/parent/dashboard', icon: Home, label: 'แดชบอร์ดผู้ปกครอง' },
    { path: '/parent/export-report', icon: FileText, label: 'ดาวน์โหลดรายงาน' },
  ];

  return (
    <div className="flex h-screen bg-[#F0FDF4] font-['Kanit']">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-emerald-600 font-['Fredoka']">SIDE QUEST</h1>
          <p className="text-sm text-gray-500">สำหรับผู้ปกครอง</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-emerald-50 text-emerald-600 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t">
          <Link 
            to="/"
            className="flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
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
