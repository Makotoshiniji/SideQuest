import { useState } from 'react';
import { Star, TrendingUp, Calendar, ArrowRight, Download, Award, Heart, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const activityLog = [
  { id: 1, date: '12 ต.ค. 2023', action: 'ทำเควสต์ "Digital Marketing 101" สำเร็จ', type: 'quest' },
  { id: 2, date: '10 ต.ค. 2023', action: 'ปลดล็อกทักษะ "การวิเคราะห์ข้อมูล"', type: 'skill' },
  { id: 3, date: '5 ต.ค. 2023', action: 'เข้าร่วม Co-op Quest กับเพื่อน 1 ครั้ง', type: 'coop' },
];

export default function ParentDashboard() {
  return (
    <div className="p-8 space-y-8 font-['Kanit'] max-w-6xl mx-auto">
      <header className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 font-['Fredoka'] flex items-center">
            <Heart className="mr-3 text-emerald-500" size={32} /> แดชบอร์ดผู้ปกครอง 👨‍👩‍👧
          </h1>
          <p className="text-gray-500 mt-1">ติดตามพัฒนาการและค้นพบศักยภาพที่ซ่อนอยู่ของลูกคุณ</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-bold text-gray-800">คุณแม่ สมศรี</p>
            <p className="text-xs text-gray-500">ผู้ปกครองของ: น้องสมชาย</p>
          </div>
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-xl shadow-inner">
            สศ
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Highlight of the Month */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 rounded-3xl text-white shadow-xl shadow-emerald-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center">
                  <Star className="mr-2 text-yellow-300" fill="currentColor" /> Highlight of the Month
                </h2>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold tracking-wider border border-white/30">
                  ตุลาคม 2023
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                  <h3 className="font-bold text-lg mb-2 flex items-center">
                    <Award className="mr-2 text-yellow-300" size={20} /> ทักษะที่โดดเด่น
                  </h3>
                  <p className="text-emerald-50 leading-relaxed text-sm">
                    น้องสมชายแสดงให้เห็นถึง <strong>ความคิดสร้างสรรค์</strong> และ <strong>การสื่อสาร</strong> ที่ยอดเยี่ยมผ่านการทำเควสต์จำลองอาชีพนักการตลาด สามารถคิดแคมเปญที่น่าสนใจและตรงใจกลุ่มเป้าหมายได้ดีมากค่ะ
                  </p>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                  <h3 className="font-bold text-lg mb-2 flex items-center">
                    <TrendingUp className="mr-2 text-blue-300" size={20} /> ทักษะที่กำลังพัฒนา
                  </h3>
                  <p className="text-emerald-50 leading-relaxed text-sm">
                    ตอนนี้ระบบกำลังสนับสนุนให้น้องฝึกฝนด้าน <strong>การวิเคราะห์ข้อมูล</strong> เพิ่มเติม ผ่านเควสต์สนุกๆ เพื่อเสริมสร้างกระบวนการคิดอย่างเป็นเหตุเป็นผล ซึ่งจะเป็นประโยชน์มากในอนาคตค่ะ
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/parent/export-report" className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center justify-between group">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mr-4">
                  <Download size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">ดาวน์โหลดรายงาน (PDF)</h3>
                  <p className="text-xs text-gray-500">สรุปพัฒนาการฉบับเต็ม</p>
                </div>
              </div>
              <ArrowRight className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" size={20} />
            </Link>
            
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center justify-between group cursor-pointer">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mr-4">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">นัดหมายครูแนะแนว</h3>
                  <p className="text-xs text-gray-500">พูดคุยเรื่องเส้นทางอนาคต</p>
                </div>
              </div>
              <ArrowRight className="text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" size={20} />
            </div>
          </div>
        </div>

        {/* Right Column: Activity Log */}
        <div className="space-y-6">
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-full">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Calendar className="mr-2 text-emerald-500" /> ประวัติการใช้งานล่าสุด
            </h3>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              {activityLog.map((log) => (
                <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-xl ${
                    log.type === 'quest' ? 'bg-blue-100 text-blue-600' :
                    log.type === 'skill' ? 'bg-amber-100 text-amber-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {log.type === 'quest' ? '🎮' : log.type === 'skill' ? '🌟' : '🤝'}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <p className="font-bold text-gray-800 text-sm mb-1">{log.action}</p>
                    <p className="text-xs text-gray-500 font-medium">{log.date}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-8 py-3 text-sm font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors">
              ดูประวัติทั้งหมด
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
