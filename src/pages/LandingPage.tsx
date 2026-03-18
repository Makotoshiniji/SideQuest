import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-['Kanit'] flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl w-full text-center space-y-8"
      >
        <div className="inline-block bg-white/50 backdrop-blur-md px-6 py-2 rounded-full text-blue-600 font-medium tracking-wide shadow-sm border border-white/50 mb-4">
          แพลตฟอร์มค้นหาตัวตน ผ่าน "โลกจำลอง"
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-['Fredoka'] tracking-tight">
          SIDE QUEST
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          ไม่รู้ว่าตัวเองชอบอะไร? ไม่แน่ใจว่าเรียนจบไปจะทำงานอะไร?
          <br className="hidden md:block" />
          มาลองทำ "เควสต์" จำลองอาชีพจริง แล้วค้นพบตัวเองไปพร้อมกัน!
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-all hover:scale-105 active:scale-95"
          >
            เริ่มการผจญภัย (นักเรียน)
          </Link>
          <Link
            to="/coach"
            className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 text-blue-600 rounded-2xl font-bold text-lg shadow-md border border-gray-100 transition-all hover:scale-105 active:scale-95"
          >
            เข้าสู่ระบบ (โค้ช/ครู)
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 text-left">
          <FeatureCard
            icon="🎮"
            title="จำลองสถานการณ์จริง"
            desc="ได้ลองทำงานจริงๆ ผ่านเควสต์ที่ออกแบบโดยผู้เชี่ยวชาญในสายอาชีพนั้นๆ"
          />
          <FeatureCard
            icon="🧠"
            title="AI ช่วยสะท้อนความคิด"
            desc="ระบบ AI ช่วยวิเคราะห์จุดแข็งและสิ่งที่ควรพัฒนาหลังจบแต่ละเควสต์"
          />
          <FeatureCard
            icon="🛡️"
            title="พื้นที่ปลอดภัย"
            desc="ปรึกษาปัญหาและแชร์ประสบการณ์โดยไม่เปิดเผยตัวตน"
          />
        </div>
      </motion.div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white/60 backdrop-blur-lg p-6 rounded-3xl border border-white/50 shadow-xl shadow-blue-900/5 hover:-translate-y-2 transition-transform duration-300">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}
