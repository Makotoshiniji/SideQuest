import { useState } from 'react';
import { MessageSquare, Send, Smile, Users, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function CoOpQuest() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'system', text: 'ยินดีต้อนรับสู่ภารกิจ "กู้ภัยสถานีอวกาศ" 🚀' },
    { id: 2, sender: 'system', text: 'เป้าหมาย: ซ่อมแซมแผงควบคุมหลักภายใน 5 นาที' },
    { id: 3, sender: 'partner', text: 'สวัสดีครับ! ผมรับหน้าที่ซ่อมระบบไฟฟ้านะ คุณจัดการระบบสื่อสารได้ไหม?' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: 'me', text: input }]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 font-['Kanit'] text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center shadow-md z-10 shrink-0">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-indigo-900 rounded-full flex items-center justify-center border border-indigo-500">
            <Users className="text-indigo-400" size={20} />
          </div>
          <div>
            <h1 className="font-bold text-gray-100 font-['Fredoka']">ห้องภารกิจ #402</h1>
            <p className="text-xs text-emerald-400 flex items-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-1 animate-pulse"></span> 2/2 ผู้เล่น
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">เวลาที่เหลือ</p>
            <div className="text-xl font-mono font-bold text-rose-400">04:59</div>
          </div>
          <Link 
            to="/student/co-op-lobby"
            className="text-gray-400 hover:text-rose-500 transition-colors p-2 bg-gray-700 rounded-lg"
          >
            <AlertCircle size={20} /> ออกจากห้อง
          </Link>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Shared Workspace (Canvas/Game Area) */}
        <div className="flex-1 relative bg-gray-950 flex flex-col items-center justify-center p-8 border-r border-gray-800">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(#1F2937 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}></div>
          
          <div className="relative z-10 w-full max-w-2xl bg-gray-800 rounded-3xl border-2 border-gray-700 shadow-2xl overflow-hidden">
            <div className="bg-gray-700 px-4 py-2 flex justify-between items-center border-b border-gray-600">
              <span className="text-sm font-bold text-gray-300 uppercase tracking-wider">แผงควบคุมหลัก</span>
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              </div>
            </div>
            <div className="p-8 grid grid-cols-2 gap-8">
              {/* Task 1 */}
              <div className="bg-gray-900 p-6 rounded-2xl border border-gray-700 text-center">
                <h3 className="text-lg font-bold text-gray-200 mb-4">ระบบไฟฟ้า</h3>
                <div className="w-24 h-24 mx-auto border-4 border-dashed border-gray-600 rounded-full flex items-center justify-center mb-4">
                  <span className="text-gray-500 text-sm">รอการซ่อมแซม...</span>
                </div>
                <p className="text-xs text-gray-400">รับผิดชอบโดย: นักผจญภัยนิรนาม</p>
              </div>
              
              {/* Task 2 */}
              <div className="bg-gray-900 p-6 rounded-2xl border border-indigo-500/50 text-center shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <h3 className="text-lg font-bold text-indigo-300 mb-4">ระบบสื่อสาร</h3>
                <button className="w-24 h-24 mx-auto bg-indigo-600 hover:bg-indigo-500 rounded-full flex items-center justify-center mb-4 shadow-lg transition-colors active:scale-95">
                  <span className="text-white font-bold">เชื่อมต่อ</span>
                </button>
                <p className="text-xs text-indigo-400 font-bold">หน้าที่ของคุณ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="w-80 bg-gray-800 flex flex-col shrink-0">
          <div className="p-4 border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
            <h3 className="font-bold text-gray-200 flex items-center">
              <MessageSquare size={18} className="mr-2 text-gray-400" /> แชททีม
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                {msg.sender === 'system' ? (
                  <div className="w-full text-center my-2">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-900/30 px-3 py-1 rounded-full border border-emerald-800/50">
                      {msg.text}
                    </span>
                  </div>
                ) : (
                  <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.sender === 'me' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-gray-700 text-gray-200 rounded-tl-none border border-gray-600'
                  }`}>
                    {msg.sender !== 'me' && <p className="text-[10px] font-bold text-gray-400 mb-1">นักผจญภัยนิรนาม</p>}
                    {msg.text}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-700 bg-gray-900">
            <div className="flex items-center space-x-2 mb-2">
              <button className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded-lg transition-colors">👍</button>
              <button className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded-lg transition-colors">🙏</button>
              <button className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded-lg transition-colors">🚀</button>
            </div>
            <div className="flex items-center bg-gray-800 rounded-xl border border-gray-700 p-1">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="พิมพ์ข้อความ..." 
                className="flex-1 bg-transparent border-none text-sm text-white px-3 py-2 focus:outline-none placeholder-gray-500"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-50 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
