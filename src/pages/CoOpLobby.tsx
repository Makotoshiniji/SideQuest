import { useState } from 'react';
import { Users, Search, Play, MessageSquare, Send, Smile } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function CoOpLobby() {
  const [isSearching, setIsSearching] = useState(false);
  const [matchFound, setMatchFound] = useState(false);

  const startSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      setMatchFound(true);
    }, 3000);
  };

  return (
    <div className="p-8 space-y-8 font-['Kanit'] h-full flex flex-col">
      <header className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 font-['Fredoka'] flex items-center">
            <Users className="mr-3 text-indigo-600" size={32} /> Co-op Lobby 🤝
          </h1>
          <p className="text-gray-500 mt-1">ร่วมมือกับเพื่อนนักผจญภัยเพื่อทำภารกิจพิเศษ</p>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center">
        {!isSearching && !matchFound && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100 text-center max-w-md w-full"
          >
            <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">ค้นหาเพื่อนร่วมทีม</h2>
            <p className="text-gray-600 mb-8">ระบบจะสุ่มจับคู่คุณกับนักผจญภัยคนอื่นที่มีระดับใกล้เคียงกัน (ไม่แสดงชื่อจริง)</p>
            <button 
              onClick={startSearch}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
            >
              <Play fill="currentColor" size={20} className="mr-2" /> เริ่มค้นหา
            </button>
          </motion.div>
        )}

        {isSearching && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
                <Search size={32} className="animate-pulse" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">กำลังค้นหาเพื่อนร่วมทีม...</h2>
            <p className="text-gray-500">คาดว่าจะพบในอีก 0:15 นาที</p>
          </motion.div>
        )}

        {matchFound && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100 text-center max-w-md w-full"
          >
            <div className="flex justify-center items-center space-x-4 mb-8">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl border-4 border-white shadow-md z-10">
                JD
              </div>
              <div className="w-12 h-2 bg-gray-200 rounded-full"></div>
              <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-3xl border-4 border-white shadow-md z-10">
                👻
              </div>
            </div>
            <h2 className="text-2xl font-bold text-emerald-600 mb-2 font-['Fredoka']">จับคู่สำเร็จ! 🎉</h2>
            <p className="text-gray-600 mb-8">คุณได้จับคู่กับ "นักผจญภัยนิรนาม"</p>
            <Link 
              to="/student/co-op-quest"
              className="block w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95"
            >
              เข้าสู่ห้องภารกิจ
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
