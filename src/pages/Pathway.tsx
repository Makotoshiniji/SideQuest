import { useState } from 'react';
import { Map, Target, ArrowRight, CheckCircle2, Circle, Briefcase, GraduationCap, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const recommendations = [
  {
    id: 'r1',
    type: 'career',
    title: 'Digital Marketing Specialist',
    match: 92,
    desc: 'จากทักษะการสื่อสารและความคิดสร้างสรรค์ที่โดดเด่นของคุณ สายงานนี้จะช่วยให้คุณได้ใช้จุดแข็งอย่างเต็มที่',
    icon: <Briefcase className="text-blue-500" size={24} />,
    color: 'bg-blue-50 border-blue-100',
    textColor: 'text-blue-700'
  },
  {
    id: 'r2',
    type: 'education',
    title: 'คณะนิเทศศาสตร์ / สื่อสารมวลชน',
    match: 88,
    desc: 'หลักสูตรที่เน้นการสร้างสรรค์เนื้อหาและการสื่อสารเชิงกลยุทธ์ ตรงกับความสนใจในเควสต์ที่คุณทำสำเร็จ',
    icon: <GraduationCap className="text-purple-500" size={24} />,
    color: 'bg-purple-50 border-purple-100',
    textColor: 'text-purple-700'
  }
];

const actionPlan = [
  { id: 'a1', text: 'ทำเควสต์ "Data Analytics Basics" เพื่อเสริมทักษะการวิเคราะห์', status: 'pending' },
  { id: 'a2', text: 'เข้าร่วม Co-op Quest สาย Marketing อย่างน้อย 2 ครั้ง', status: 'in-progress' },
  { id: 'a3', text: 'พูดคุยกับรุ่นพี่ (Mentor) ในสายงาน Digital Marketing', status: 'pending' },
  { id: 'a4', text: 'สะสม EXP ให้ถึง Level 6', status: 'completed' },
];

export default function Pathway() {
  return (
    <div className="p-8 space-y-8 font-['Kanit']">
      <header className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 font-['Fredoka'] flex items-center">
            <Map className="mr-3 text-emerald-600" size={32} /> เส้นทางอนาคต (Pathway) 🗺️
          </h1>
          <p className="text-gray-500 mt-1">AI วิเคราะห์เส้นทางที่เหมาะสมจากทักษะและความสนใจของคุณ</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Recommendations */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Star className="mr-2 text-amber-500" fill="currentColor" /> AI แนะนำสำหรับคุณ
          </h2>
          
          {recommendations.map((rec) => (
            <motion.div 
              whileHover={{ y: -4 }}
              key={rec.id} 
              className={`p-6 rounded-3xl border ${rec.color} shadow-sm relative overflow-hidden group`}
            >
              <div className="absolute top-0 right-0 bg-white px-4 py-2 rounded-bl-2xl font-bold text-sm shadow-sm flex items-center">
                Match <span className={`ml-2 text-lg ${rec.textColor}`}>{rec.match}%</span>
              </div>
              
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                  {rec.icon}
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                    {rec.type === 'career' ? 'สายอาชีพ' : 'การศึกษาต่อ'}
                  </span>
                  <h3 className={`text-xl font-bold ${rec.textColor}`}>{rec.title}</h3>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-6">
                {rec.desc}
              </p>
              
              <button className={`w-full py-3 bg-white hover:bg-gray-50 ${rec.textColor} rounded-xl font-bold flex items-center justify-center transition-colors shadow-sm`}>
                ดูรายละเอียดเพิ่มเติม <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Action Plan */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <Target className="mr-2 text-rose-500" /> แผนปฏิบัติการ (Action Plan)
          </h2>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-gray-600 mb-6">ก้าวต่อไปที่คุณควรทำเพื่อไปให้ถึงเป้าหมายที่ AI แนะนำ</p>
            
            <div className="space-y-4">
              {actionPlan.map((action) => (
                <div 
                  key={action.id} 
                  className={`flex items-start p-4 rounded-2xl border transition-colors ${
                    action.status === 'completed' 
                      ? 'bg-gray-50 border-gray-200 opacity-60' 
                      : action.status === 'in-progress'
                      ? 'bg-blue-50 border-blue-200 shadow-sm'
                      : 'bg-white border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="shrink-0 mt-0.5 mr-4">
                    {action.status === 'completed' ? (
                      <CheckCircle2 className="text-emerald-500" size={24} />
                    ) : action.status === 'in-progress' ? (
                      <div className="relative">
                        <Circle className="text-blue-200" size={24} />
                        <div className="absolute inset-0 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                      </div>
                    ) : (
                      <Circle className="text-gray-300" size={24} />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <p className={`font-medium ${action.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                      {action.text}
                    </p>
                    {action.status === 'in-progress' && (
                      <span className="inline-block mt-2 text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-md">กำลังดำเนินการ</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <Link to="/quests" className="text-blue-600 font-bold hover:underline flex items-center justify-center">
                ไปหาเควสต์ทำเพิ่มกันเถอะ <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
