import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Play, Star, TrendingUp, Award, Clock } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  getUserProfile,
  getUserActiveQuests,
  getQuestById,
  getPublishedQuests,
} from "../services/db";
import { User, Quest } from "../types/db";

export default function StudentDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [recommendedQuests, setRecommendedQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch user profile
          const profile = await getUserProfile(firebaseUser.uid);
          setUser(profile);

          // Fetch active quests
          const activeUserQuests = await getUserActiveQuests(firebaseUser.uid);
          if (activeUserQuests.length > 0) {
            const questDetails = await getQuestById(
              activeUserQuests[0].questId,
            );
            setActiveQuest(questDetails);
          }

          // Fetch recommended quests
          const allPublished = await getPublishedQuests();
          // Filter out the active quest if any, and take top 2
          const filtered = allPublished
            .filter((q) => q.id !== activeUserQuests[0]?.questId)
            .slice(0, 2);
          setRecommendedQuests(filtered);
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const radarData = user?.skills
    ? [
        {
          subject: "ความคิดสร้างสรรค์",
          A: user.skills["creative"] || 20,
          fullMark: 100,
        },
        {
          subject: "การวิเคราะห์",
          A: user.skills["analytical"] || 20,
          fullMark: 100,
        },
        {
          subject: "การสื่อสาร",
          A: user.skills["communication"] || 20,
          fullMark: 100,
        },
        {
          subject: "ความเป็นผู้นำ",
          A: user.skills["leadership"] || 20,
          fullMark: 100,
        },
        {
          subject: "การแก้ปัญหา",
          A: user.skills["problem_solving"] || 20,
          fullMark: 100,
        },
        {
          subject: "ความร่วมมือ",
          A: user.skills["collaboration"] || 20,
          fullMark: 100,
        },
      ]
    : [
        { subject: "ความคิดสร้างสรรค์", A: 10, fullMark: 100 },
        { subject: "การวิเคราะห์", A: 10, fullMark: 100 },
        { subject: "การสื่อสาร", A: 10, fullMark: 100 },
        { subject: "ความเป็นผู้นำ", A: 10, fullMark: 100 },
        { subject: "การแก้ปัญหา", A: 10, fullMark: 100 },
        { subject: "ความร่วมมือ", A: 10, fullMark: 100 },
      ];

  const getInitials = (name: string) => {
    return name ? name.substring(0, 2).toUpperCase() : "ST";
  };

  return (
    <div className="p-8 space-y-8 font-['Kanit']">
      <header className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 font-['Fredoka']">
            สวัสดี, {user?.name || "นักผจญภัย"}! 👋
          </h1>
          <p className="text-gray-500 mt-1">
            พร้อมที่จะค้นพบตัวเองในวันนี้หรือยัง?
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">
              Level {user?.level || 1}
            </p>
            <div className="w-32 h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                style={{ width: `${((user?.xp || 0) % 1000) / 10}%` }}
              ></div>
            </div>
          </div>
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl shadow-inner uppercase">
            {getInitials(user?.name || "")}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Active Quest */}
          {activeQuest ? (
            <section className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>
              <div className="relative z-10 flex justify-between items-center">
                <div>
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold tracking-wider mb-4 border border-white/30">
                    เควสต์ปัจจุบัน
                  </span>
                  <h2 className="text-3xl font-bold mb-2">
                    {activeQuest.title}
                  </h2>
                  <p className="text-blue-100 mb-6 max-w-md line-clamp-2">
                    {activeQuest.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-blue-100">
                    <span className="flex items-center">
                      <Star size={16} className="mr-1" /> +
                      {activeQuest.xpReward} XP
                    </span>
                    <span className="flex items-center px-2 py-1 bg-white/10 rounded-md">
                      {activeQuest.difficulty}
                    </span>
                  </div>
                </div>
                <Link
                  to="/simulation"
                  className="w-16 h-16 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform active:scale-95 shrink-0 ml-4"
                >
                  <Play fill="currentColor" size={24} className="ml-1" />
                </Link>
              </div>
            </section>
          ) : (
            <section className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-8 text-gray-600 shadow-inner relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[200px]">
              <h2 className="text-2xl font-bold mb-2 text-gray-800">
                ยังไม่มีเควสต์ที่กำลังทำ
              </h2>
              <p className="mb-6">
                เลือกเควสต์ใหม่เพื่อเริ่มการผจญภัยและเก็บ XP!
              </p>
              <Link
                to="/quests"
                className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
              >
                ค้นหาเควสต์
              </Link>
            </section>
          )}

          {/* Recommended Quests */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <TrendingUp className="mr-2 text-blue-500" />{" "}
                เควสต์แนะนำสำหรับคุณ
              </h3>
              <Link
                to="/quests"
                className="text-sm text-blue-600 font-medium hover:underline"
              >
                ดูทั้งหมด
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedQuests.length > 0 ? (
                recommendedQuests.map((quest, idx) => (
                  <QuestCard
                    key={quest.id || idx}
                    title={quest.title}
                    category={quest.skillsRewarded[0] || "General"}
                    difficulty={quest.difficulty}
                    xp={quest.xpReward}
                    color={idx % 2 === 0 ? "bg-emerald-50" : "bg-purple-50"}
                    iconColor={
                      idx % 2 === 0 ? "text-emerald-500" : "text-purple-500"
                    }
                  />
                ))
              ) : (
                <div className="col-span-2 text-center py-8 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  กำลังเตรียมเควสต์ใหม่ๆ สำหรับคุณ...
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Skill Radar */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <Award className="mr-2 text-amber-500" /> ทักษะของคุณ
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
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">
                ทำเควสต์เพื่อเพิ่มระดับทักษะของคุณ!
              </p>
            </div>
          </section>

          {/* Recent Achievements */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              ความสำเร็จล่าสุด
            </h3>
            <div className="space-y-4">
              <AchievementItem
                title="เข้าร่วม Side Quest"
                date="วันนี้"
                icon="🎉"
              />
              {user?.level && user.level > 1 && (
                <AchievementItem
                  title={`อัปเลเวลเป็น ${user.level}`}
                  date="เมื่อเร็วๆ นี้"
                  icon="⭐"
                />
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function QuestCard({ title, category, difficulty, xp, color, iconColor }: any) {
  return (
    <div
      className={`p-5 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer ${color}`}
    >
      <div className="flex justify-between items-start mb-4">
        <span
          className={`text-xs font-bold px-2 py-1 rounded-md bg-white/60 backdrop-blur-sm ${iconColor}`}
        >
          {category}
        </span>
        <span className="text-xs font-medium text-gray-500 bg-white/60 px-2 py-1 rounded-md">
          {difficulty}
        </span>
      </div>
      <h4 className="font-bold text-gray-800 mb-2 truncate">{title}</h4>
      <div className="flex items-center text-sm text-gray-600 font-medium">
        <Star size={14} className="mr-1 text-amber-500" fill="currentColor" />{" "}
        {xp} XP
      </div>
    </div>
  );
}

function AchievementItem({ title, date, icon }: any) {
  return (
    <div className="flex items-center p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-default">
      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-xl mr-4 shadow-sm">
        {icon}
      </div>
      <div>
        <h4 className="font-medium text-gray-800 text-sm">{title}</h4>
        <p className="text-xs text-gray-500">{date}</p>
      </div>
    </div>
  );
}
