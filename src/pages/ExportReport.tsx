import { Download, FileText, Printer, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ExportReport() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 font-['Kanit'] h-full flex flex-col">
      <header className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 font-['Fredoka'] flex items-center">
            <FileText className="mr-3 text-blue-600" size={32} /> ดาวน์โหลดรายงาน (PDF) 📄
          </h1>
          <p className="text-gray-500 mt-1">สรุปผลการค้นหาตัวตนและทักษะของน้องสมชาย</p>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mx-auto border-4 border-blue-100 shadow-inner">
            <FileText size={48} className="text-blue-500" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">รายงานความก้าวหน้าประจำภาคเรียน</h2>
            <p className="text-gray-600">
              รายงานฉบับนี้สรุปทักษะที่โดดเด่น, เควสต์ที่ทำสำเร็จ, และคำแนะนำจาก AI 
              จัดทำในรูปแบบที่อ่านง่าย เหมาะสำหรับปรึกษาครูแนะแนวหรือเก็บเป็น Portfolio
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 text-left space-y-3">
            <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider mb-4">ข้อมูลในรายงานประกอบด้วย:</h3>
            <div className="flex items-center text-gray-600 text-sm">
              <CheckCircle2 size={16} className="text-emerald-500 mr-2" /> กราฟสรุปทักษะ (Radar Chart)
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <CheckCircle2 size={16} className="text-emerald-500 mr-2" /> ประวัติการทำเควสต์และเหรียญตรา
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <CheckCircle2 size={16} className="text-emerald-500 mr-2" /> AI Reflection (จุดแข็ง & สิ่งที่กำลังพัฒนา)
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <CheckCircle2 size={16} className="text-emerald-500 mr-2" /> คำแนะนำเส้นทางอาชีพและการศึกษาต่อ
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1 active:scale-95">
              <Download size={20} className="mr-2" /> ดาวน์โหลด PDF
            </button>
            <button className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl font-bold flex items-center justify-center shadow-sm transition-all hover:-translate-y-1 active:scale-95">
              <Printer size={20} className="mr-2" /> พิมพ์รายงาน
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
