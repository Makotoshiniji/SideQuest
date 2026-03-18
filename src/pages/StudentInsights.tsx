import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const radarData = [
  { subject: "ความคิดสร้างสรรค์", A: 85, fullMark: 100 },
  { subject: "การวิเคราะห์", A: 65, fullMark: 100 },
  { subject: "การสื่อสาร", A: 90, fullMark: 100 },
  { subject: "ความเป็นผู้นำ", A: 70, fullMark: 100 },
  { subject: "การแก้ปัญหา", A: 85, fullMark: 100 },
  { subject: "ความร่วมมือ", A: 75, fullMark: 100 },
];

const progressData = [
  { name: "ม.ค.", xp: 400 },
  { name: "ก.พ.", xp: 800 },
  { name: "มี.ค.", xp: 1200 },
  { name: "เม.ย.", xp: 1800 },
  { name: "พ.ค.", xp: 2400 },
];

export default function StudentInsights() {
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get("id") || "1";

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 font-['Kanit']">
      <header className="mb-8">
        <Link
          to="/coach"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-4 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" /> กลับไปหน้าแดชบอร์ด
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>

          <div className="relative z-10 flex items-center space-x-6 mb-6 md:mb-0">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg border-4 border-white">
              สจ
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 font-['Fredoka'] mb-1">
                สมชาย ใจดี
              </h1>
              <p className="text-gray-500 font-medium mb-2">
                ม.5/1 • เลขที่ 12 • สายวิทย์-คณิต
              </p>
              <div className="flex space-x-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold tracking-wider uppercase flex items-center">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>{" "}
                  Active
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold tracking-wider uppercase">
                  Level 5
                </span>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-col space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <Mail size={16} className="mr-2 text-gray-400" />{" "}
              somchai.j@school.ac.th
            </div>
            <div className="flex items-center">
              <Phone size={16} className="mr-2 text-gray-400" /> 081-234-5678
            </div>
            <div className="flex items-center">
              <MapPin size={16} className="mr-2 text-gray-400" /> กรุงเทพมหานคร
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-8">
          {/* AI Analysis */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="bg-indigo-100 text-indigo-600 p-2 rounded-xl mr-3">
                <AlertTriangle size={20} />
              </span>
              AI วิเคราะห์แนวโน้ม
            </h3>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl">
                <h4 className="font-bold text-blue-800 text-sm mb-2">
                  ความสนใจที่โดดเด่น
                </h4>
                <p className="text-gray-700 text-sm">
                  นักเรียนมีความสนใจในสายงาน <strong>Marketing</strong> และ{" "}
                  <strong>Communication</strong> อย่างชัดเจน
                  ทำเควสต์ในหมวดหมู่นี้สำเร็จด้วยคะแนนสูงกว่าค่าเฉลี่ย
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl">
                <h4 className="font-bold text-amber-800 text-sm mb-2">
                  ข้อเสนอแนะสำหรับโค้ช
                </h4>
                <p className="text-gray-700 text-sm">
                  ควรแนะนำให้นักเรียนลองทำเควสต์ที่ท้าทายขึ้นในสาย Data Analysis
                  เพื่อเสริมทักษะการวิเคราะห์ที่ยังเป็นจุดอ่อน
                </p>
              </div>
            </div>
          </section>

          {/* Skill Radar */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Award className="mr-2 text-amber-500" /> ทักษะปัจจุบัน
            </h3>
            <div
              className="h-64 w-full"
              style={{
                minHeight: "256px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ResponsiveContainer width="100%" height={240}>
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
                  data={radarData}
                >
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{
                      fill: "#64748B",
                      fontSize: 12,
                      fontFamily: "Kanit",
                    }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                  />
                  <Radar
                    name="Skills"
                    dataKey="A"
                    stroke="#4F46E5"
                    fill="#4F46E5"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Progress Chart */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <TrendingUp className="mr-2 text-emerald-500" /> พัฒนาการ (XP
                Progress)
              </h3>
              <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none">
                <option>เทอม 1/2566</option>
                <option>เทอม 2/2565</option>
              </select>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={progressData}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E2E8F0"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748B", fontFamily: "Kanit" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748B", fontFamily: "Kanit" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="xp"
                    stroke="#4F46E5"
                    strokeWidth={3}
                    dot={{
                      r: 6,
                      fill: "#4F46E5",
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Recent Activity */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Calendar className="mr-2 text-blue-500" /> กิจกรรมล่าสุด
            </h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
              <ActivityItem
                title="ทำเควสต์ 'Digital Marketing 101' สำเร็จ"
                date="12 ต.ค. 2023, 14:30 น."
                type="success"
                xp="+500 XP"
              />
              <ActivityItem
                title="เริ่มเควสต์ 'Data Analysis Basics'"
                date="10 ต.ค. 2023, 09:15 น."
                type="start"
              />
              <ActivityItem
                title="ได้รับเหรียญตรา 'Creative Mind'"
                date="5 ต.ค. 2023, 16:45 น."
                type="badge"
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ title, date, type, xp }: any) {
  let icon, color, bgColor;
  switch (type) {
    case "success":
      icon = "🏆";
      color = "text-emerald-600";
      bgColor = "bg-emerald-100";
      break;
    case "start":
      icon = "🚀";
      color = "text-blue-600";
      bgColor = "bg-blue-100";
      break;
    case "badge":
      icon = "🎖️";
      color = "text-amber-600";
      bgColor = "bg-amber-100";
      break;
    default:
      icon = "📝";
      color = "text-gray-600";
      bgColor = "bg-gray-100";
  }

  return (
    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white ${bgColor} ${color} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-xl`}
      >
        {icon}
      </div>
      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-1">
          <h4 className="font-bold text-gray-800">{title}</h4>
          {xp && (
            <span
              className={`text-xs font-bold ${color} ${bgColor} px-2 py-1 rounded-md`}
            >
              {xp}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 font-medium">{date}</p>
      </div>
    </div>
  );
}
