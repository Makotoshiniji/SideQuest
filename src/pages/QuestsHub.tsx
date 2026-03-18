import { useState, useEffect } from 'react';
import { Search, Filter, Star, Clock, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPublishedQuests } from '../services/db';
import { Quest } from '../types/db';

export default function QuestsHub() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(['All']);

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const publishedQuests = await getPublishedQuests();
        setQuests(publishedQuests);
        
        // Extract unique categories from quests
        const uniqueCategories = new Set<string>();
        publishedQuests.forEach(q => {
          if (q.skillsRewarded && q.skillsRewarded.length > 0) {
            uniqueCategories.add(q.skillsRewarded[0]); // Use first skill as category for now
          }
        });
        setCategories(['All', ...Array.from(uniqueCategories)]);
      } catch (error) {
        console.error("Error fetching quests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuests();
  }, []);

  const filteredQuests = quests.filter(q => {
    const categoryMatch = activeCategory === 'All' || (q.skillsRewarded && q.skillsRewarded[0] === activeCategory);
    const searchMatch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        q.description.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 font-['Kanit']">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 font-['Fredoka'] mb-2">เควสต์ฮับ (Quests Hub) 🎯</h1>
        <p className="text-gray-500">เลือกเส้นทางอาชีพที่คุณสนใจ และเริ่มจำลองการทำงานจริง</p>
      </header>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="ค้นหาเควสต์ หรือ อาชีพ..." 
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <Filter className="text-gray-400 mr-2 shrink-0" size={20} />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Quests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredQuests.map(quest => (
          <div key={quest.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
            <div className="h-48 overflow-hidden relative bg-gray-100">
              {quest.imageUrl ? (
                <img 
                  src={quest.imageUrl} 
                  alt={quest.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-100 to-gray-200">
                  <Star size={48} className="opacity-20" />
                </div>
              )}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
                {quest.difficulty}
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-grow">
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
                {quest.skillsRewarded && quest.skillsRewarded[0] ? quest.skillsRewarded[0] : 'General'}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{quest.title}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">{quest.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                <div className="flex items-center"><Clock size={16} className="mr-1" /> {quest.estimatedMinutes} นาที</div>
                <div className="flex items-center"><Users size={16} className="mr-1" /> {quest.plays || 0}</div>
                <div className="flex items-center font-bold text-amber-500"><Star size={16} className="mr-1" fill="currentColor" /> {quest.xpReward} XP</div>
              </div>
              
              <Link 
                to={`/simulation/${quest.id}`}
                className="w-full py-3 bg-gray-50 hover:bg-blue-50 text-blue-600 rounded-xl font-bold flex items-center justify-center transition-colors group-hover:bg-blue-600 group-hover:text-white mt-auto"
              >
                เริ่มเควสต์ <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {filteredQuests.length === 0 && (
        <div className="text-center py-20 text-gray-500 bg-white rounded-3xl border border-dashed border-gray-200">
          <p className="text-xl mb-2 font-bold text-gray-700">ไม่พบเควสต์ที่คุณค้นหา 🕵️‍♂️</p>
          <p>ลองเปลี่ยนคำค้นหา หรือหมวดหมู่ดูนะ</p>
        </div>
      )}
    </div>
  );
}
