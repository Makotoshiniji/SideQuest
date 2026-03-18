import { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreVertical, Play, Edit3, Trash2, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getQuestsByCreator } from '../services/db';
import { Quest } from '../types/db';

export default function StudioDashboard() {
  const [activeTab, setActiveTab] = useState('all');
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const creatorQuests = await getQuestsByCreator(user.uid);
          setQuests(creatorQuests);
        } catch (error) {
          console.error("Error fetching creator quests:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setQuests([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const filteredQuests = quests.filter(quest => {
    if (activeTab === 'all') return true;
    return quest.status.toLowerCase() === activeTab.toLowerCase();
  });

  const totalPlays = quests.reduce((sum, quest) => sum + (quest.plays || 0), 0);
  const avgCompletion = quests.length > 0 
    ? Math.round(quests.reduce((sum, quest) => sum + (quest.completionRate || 0), 0) / quests.length) 
    : 0;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-['Kanit']">
      <header className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 font-['Fredoka']">แดชบอร์ดจัดการเควสต์ 🛠️</h1>
          <p className="text-slate-500 mt-1">ติดตามผลงานและสร้างสถานการณ์จำลองใหม่ๆ</p>
        </div>
        <Link 
          to="/studio/builder"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-md shadow-indigo-500/20 transition-all hover:-translate-y-1"
        >
          <Plus size={20} className="mr-2" /> สร้างเควสต์ใหม่
        </Link>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500 mb-1">เควสต์ทั้งหมด</p>
          <h3 className="text-3xl font-black text-slate-800 font-['Fredoka']">{quests.length}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500 mb-1">ยอดผู้เล่นรวม</p>
          <h3 className="text-3xl font-black text-slate-800 font-['Fredoka']">{totalPlays.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <p className="text-sm font-medium text-slate-500 mb-1">อัตราการเล่นจบเฉลี่ย</p>
          <h3 className="text-3xl font-black text-slate-800 font-['Fredoka']">{avgCompletion}%</h3>
        </div>
      </div>

      {/* Quest List */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <div className="flex space-x-2">
            {['all', 'published', 'draft'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors capitalize ${
                  activeTab === tab 
                    ? 'bg-indigo-100 text-indigo-700' 
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="ค้นหาเควสต์..." 
                className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-64"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
                <th className="p-4 font-medium">ชื่อเควสต์</th>
                <th className="p-4 font-medium">สถานะ</th>
                <th className="p-4 font-medium">ยอดผู้เล่น</th>
                <th className="p-4 font-medium">อัตราเล่นจบ</th>
                <th className="p-4 font-medium">สร้างเมื่อ</th>
                <th className="p-4 font-medium text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQuests.length > 0 ? (
                filteredQuests.map(quest => (
                  <tr key={quest.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 font-bold text-slate-800">{quest.title}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                        quest.status === 'published' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {quest.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-600 font-medium">{(quest.plays || 0).toLocaleString()}</td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <span className="text-slate-600 font-medium mr-2 w-8">{quest.completionRate || 0}%</span>
                        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${quest.completionRate || 0}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500 text-sm">{formatDate(quest.createdAt)}</td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="แก้ไข">
                          <Edit3 size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="ลบ">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    ไม่พบเควสต์ในหมวดหมู่นี้
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
