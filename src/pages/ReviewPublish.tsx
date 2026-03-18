import { useState } from 'react';
import { PlayCircle, Send, Smartphone, Monitor, CheckCircle2, AlertCircle, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReviewPublish() {
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 2000);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-['Kanit'] h-full flex flex-col">
      <header className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-200 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 font-['Fredoka'] flex items-center">
            <PlayCircle className="mr-3 text-rose-500" size={32} /> ทดสอบ & เผยแพร่ (Review & Publish) 🚀
          </h1>
          <p className="text-slate-500 mt-1">ทดลองเล่นเควสต์ของคุณและส่งให้ผู้ดูแลระบบอนุมัติ</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm font-bold uppercase tracking-wider">
            สถานะ: Draft
          </span>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting || submitted}
            className={`px-6 py-3 rounded-xl font-bold flex items-center shadow-md transition-all ${
              submitted 
                ? 'bg-emerald-500 text-white cursor-not-allowed' 
                : isSubmitting
                ? 'bg-slate-400 text-white cursor-wait'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:-translate-y-1 shadow-indigo-500/20'
            }`}
          >
            {submitted ? (
              <><CheckCircle2 size={20} className="mr-2" /> ส่งตรวจแล้ว</>
            ) : isSubmitting ? (
              <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div> กำลังส่ง...</>
            ) : (
              <><Send size={20} className="mr-2" /> ส่งตรวจ (Submit)</>
            )}
          </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden">
        {/* Left Column: Checklist */}
        <div className="lg:col-span-1 bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col overflow-y-auto">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <CheckCircle2 className="mr-2 text-emerald-500" /> รายการตรวจสอบก่อนส่ง
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
              <CheckCircle2 className="text-emerald-500 mt-0.5 mr-3 shrink-0" size={20} />
              <div>
                <p className="font-bold text-emerald-800">โหนดทั้งหมดเชื่อมต่อกัน</p>
                <p className="text-sm text-emerald-600 mt-1">ไม่มีโหนดปลายเปิด (Dead end) ที่ไม่ได้ตั้งใจ</p>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
              <CheckCircle2 className="text-emerald-500 mt-0.5 mr-3 shrink-0" size={20} />
              <div>
                <p className="font-bold text-emerald-800">กำหนดทักษะครบถ้วน</p>
                <p className="text-sm text-emerald-600 mt-1">ทุกตัวเลือกมีการผูกค่าทักษะอย่างน้อย 1 อย่าง</p>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-amber-50 border border-amber-200 rounded-2xl">
              <AlertCircle className="text-amber-500 mt-0.5 mr-3 shrink-0" size={20} />
              <div>
                <p className="font-bold text-amber-800">AI Prompt สั้นเกินไป</p>
                <p className="text-sm text-amber-700 mt-1">คำสั่ง AI สั้นกว่า 50 ตัวอักษร อาจทำให้ผลลัพธ์ไม่ครอบคลุม</p>
                <button className="mt-2 text-xs font-bold text-amber-600 hover:underline">แก้ไข Prompt</button>
              </div>
            </div>
          </div>
          
          <div className="mt-auto pt-6 border-t border-slate-100">
            <p className="text-sm text-slate-500 mb-4">
              เมื่อส่งตรวจแล้ว คุณจะไม่สามารถแก้ไขเควสต์ได้จนกว่าผู้ดูแลระบบจะตรวจสอบเสร็จสิ้น (ใช้เวลาประมาณ 1-2 วันทำการ)
            </p>
          </div>
        </div>

        {/* Right Column: Preview Simulator */}
        <div className="lg:col-span-2 bg-slate-100 rounded-3xl shadow-inner border-2 border-slate-200 p-6 flex flex-col items-center justify-center relative overflow-hidden">
          
          {/* Device Toggle */}
          <div className="absolute top-6 right-6 flex bg-white p-1 rounded-xl shadow-sm border border-slate-200 z-10">
            <button 
              onClick={() => setDevice('mobile')}
              className={`p-2 rounded-lg transition-colors ${device === 'mobile' ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
              title="มุมมองมือถือ"
            >
              <Smartphone size={20} />
            </button>
            <button 
              onClick={() => setDevice('desktop')}
              className={`p-2 rounded-lg transition-colors ${device === 'desktop' ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
              title="มุมมองคอมพิวเตอร์"
            >
              <Monitor size={20} />
            </button>
          </div>

          {/* Simulator Container */}
          <motion.div 
            layout
            className={`bg-white shadow-2xl overflow-hidden relative transition-all duration-500 ${
              device === 'mobile' 
                ? 'w-[375px] h-[667px] rounded-[3rem] border-8 border-slate-800' 
                : 'w-full max-w-3xl h-[600px] rounded-2xl border border-slate-200'
            }`}
          >
            {/* Mock App Header */}
            <div className="bg-blue-600 p-4 text-white flex items-center justify-between">
              <span className="font-bold font-['Fredoka']">SIDE QUEST</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Preview Mode</span>
            </div>
            
            {/* Mock Quest Content */}
            <div className="p-6 h-full flex flex-col bg-slate-50">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
                <h2 className="text-xl font-bold text-slate-800 mb-4">สถานการณ์ที่ 1</h2>
                <p className="text-slate-600 leading-relaxed">
                  ลูกค้าเดินเข้ามาในร้านด้วยสีหน้าไม่พอใจ และบอกว่าสินค้าที่ซื้อไปเมื่อวานใช้งานไม่ได้ตามที่โฆษณาไว้ คุณจะจัดการกับสถานการณ์นี้อย่างไร?
                </p>
              </div>
              
              <div className="space-y-3 mt-auto pb-12">
                <button className="w-full p-4 bg-white hover:bg-blue-50 border-2 border-slate-200 hover:border-blue-300 rounded-xl text-left transition-colors group">
                  <span className="font-bold text-slate-700 group-hover:text-blue-700">A. ขอโทษลูกค้าและเสนอเงินคืนเต็มจำนวน</span>
                </button>
                <button className="w-full p-4 bg-white hover:bg-blue-50 border-2 border-slate-200 hover:border-blue-300 rounded-xl text-left transition-colors group">
                  <span className="font-bold text-slate-700 group-hover:text-blue-700">B. สอบถามรายละเอียดเพิ่มเติมเพื่อหาสาเหตุที่แท้จริง</span>
                </button>
                <button className="w-full p-4 bg-white hover:bg-blue-50 border-2 border-slate-200 hover:border-blue-300 rounded-xl text-left transition-colors group">
                  <span className="font-bold text-slate-700 group-hover:text-blue-700">C. ปฏิเสธความรับผิดชอบเนื่องจากเลยระยะเวลารับประกัน</span>
                </button>
              </div>
            </div>
            
            {/* Mobile Notch (if mobile) */}
            {device === 'mobile' && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-xl"></div>
            )}
          </motion.div>
          
          <div className="mt-6 flex items-center text-slate-500">
            <Eye size={16} className="mr-2" /> ลองคลิกที่ตัวเลือกเพื่อดูการเปลี่ยนหน้า (จำลอง)
          </div>
        </div>
      </div>
    </div>
  );
}
