import { useState } from 'react';
import { UsersRound, Search, MessageCircle, Star, Briefcase, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

const mentors = [
  { id: 1, name: 'พี่เอก', role: 'Senior Digital Marketer', company: 'Tech Startup', rating: 4.9, reviews: 120, tags: ['Marketing', 'Content', 'SEO'], avatar: '👨‍💼' },
  { id: 2, name: 'พี่ฟ้า', role: 'Data Analyst', company: 'E-commerce', rating: 4.8, reviews: 85, tags: ['Data', 'Python', 'SQL'], avatar: '👩‍💻' },
  { id: 3, name: 'พี่ต้น', role: 'นักศึกษาปี 4', company: 'คณะนิเทศศาสตร์ จุฬาฯ', rating: 4.7, reviews: 42, tags: ['Communication', 'Media'], avatar: '👨‍🎓' },
];

const qaBoard = [
  { id: 1, author: 'น้อง A', question: 'อยากเรียน Data Science ต้องเริ่มจากภาษาอะไรดีครับ?', answers: 3, tags: ['Data Science', 'Programming'] },
  { id: 2, author: 'น้อง B', question: 'สาย Marketing จำเป็นต้องเก่งเลขไหมคะ?', answers: 5, tags: ['Marketing', 'Math'] },
];

export default function MentorConnect() {
  const [activeTab, setActiveTab] = useState('directory');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="p-8 space-y-8 font-['Kanit'] h-full flex flex-col">
      <header className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 font-['Fredoka'] flex items-center">
            <UsersRound className="mr-3 text-purple-600" size={32} /> ปรึกษารุ่นพี่ (Mentor Connect) 🤝
          </h1>
          <p className="text-gray-500 mt-1">พูดคุยและขอคำแนะนำจากรุ่นพี่หรือผู้เชี่ยวชาญในสายอาชีพ</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex space-x-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 w-fit">
        <button 
          onClick={() => setActiveTab('directory')}
          className={`px-6 py-2 rounded-xl font-bold transition-colors ${activeTab === 'directory' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          รายชื่อรุ่นพี่ (Mentors)
        </button>
        <button 
          onClick={() => setActiveTab('qa')}
          className={`px-6 py-2 rounded-xl font-bold transition-colors ${activeTab === 'qa' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          กระดานถาม-ตอบ (Q&A Board)
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'directory' ? (
          <div className="space-y-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="ค้นหารุ่นพี่, สายอาชีพ, หรือทักษะ..." 
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-shadow shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mentors.map(mentor => (
                <motion.div whileHover={{ y: -4 }} key={mentor.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center text-3xl border border-purple-100">
                        {mentor.avatar}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{mentor.name}</h3>
                        <p className="text-sm text-gray-500 flex items-center"><Briefcase size={14} className="mr-1"/> {mentor.role}</p>
                        <p className="text-xs text-gray-400 flex items-center mt-1"><GraduationCap size={14} className="mr-1"/> {mentor.company}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <Star size={16} className="text-amber-400" fill="currentColor" />
                    <span className="font-bold text-gray-700">{mentor.rating}</span>
                    <span className="text-xs text-gray-400">({mentor.reviews} รีวิว)</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {mentor.tags.map(tag => (
                      <span key={tag} className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold flex items-center justify-center transition-colors shadow-sm">
                    <MessageCircle size={18} className="mr-2" /> นัดหมาย / ทักแชท
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
              <p className="text-gray-600">มีคำถามเกี่ยวกับสายอาชีพหรือการเรียนต่อไหม?</p>
              <button className="px-6 py-2 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors shadow-sm">
                ตั้งคำถามใหม่
              </button>
            </div>

            <div className="space-y-4">
              {qaBoard.map(qa => (
                <div key={qa.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-purple-200 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-gray-800">{qa.question}</h3>
                    <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{qa.answers} คำตอบ</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">👤</div>
                      <span className="text-sm text-gray-500">{qa.author}</span>
                    </div>
                    <div className="flex space-x-2">
                      {qa.tags.map(tag => (
                        <span key={tag} className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
