import { useState, useEffect } from "react";
import {
  Download,
  Share2,
  Briefcase,
  Award,
  Star,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
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
} from "../services/db";
import { User, Quest, UserQuest } from "../types/db";

export default function Portfolio() {
  const [user, setUser] = useState<User | null>(null);
  const [completedQuests, setCompletedQuests] = useState<
    (UserQuest & { questDetails?: Quest })[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          try {
            const userProfile = await getUserProfile(firebaseUser.uid);
            setUser(userProfile);

            const activeQuests = await getUserActiveQuests(firebaseUser.uid);
            const completed = activeQuests.filter(
              (q) => q.status === "completed",
            );

            // Fetch quest details for each completed quest
            const questsWithDetails = await Promise.all(
              completed.map(async (uq) => {
                const details = await getQuestById(uq.questId);
                return { ...uq, questDetails: details || undefined };
              }),
            );

            // Sort by completedAt descending
            questsWithDetails.sort((a, b) => {
              const dateA = a.completedAt
                ? new Date(a.completedAt).getTime()
                : 0;
              const dateB = b.completedAt
                ? new Date(b.completedAt).getTime()
                : 0;
              return dateB - dateA;
            });

            setCompletedQuests(questsWithDetails);
          } catch (error) {
            console.error("Error fetching portfolio data:", error);
          } finally {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      });
      return () => unsubscribe();
    };

    fetchPortfolioData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center text-gray-500">
        กรุณาเข้าสู่ระบบเพื่อดูพอร์ตโฟลิโอ
      </div>
    );
  }

  const radarData = user.skills
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
    : [];

  const getInitials = (name: string | undefined) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "ไม่ระบุวันที่";
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 font-['Kanit']">
      <header className="flex justify-between items-end mb-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>
        <div className="relative z-10 flex items-center space-x-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg border-4 border-white">
            {getInitials(user.displayName)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 font-['Fredoka'] mb-1">
              {user.displayName}
            </h1>
            <p className="text-gray-500 font-medium mb-2">
              Level {user.level || 1} Explorer • {user.xp || 0} XP
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(user.skills || {})
                .slice(0, 3)
                .map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold tracking-wider uppercase"
                  >
                    {skill}
                  </span>
                ))}
            </div>
          </div>
        </div>

        <div className="flex space-x-3 relative z-10">
          <button className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors">
            <Share2 size={18} className="mr-2" /> แชร์
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-500/20 transition-colors">
            <Download size={18} className="mr-2" /> ดาวน์โหลด PDF
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-8">
          {/* Skill Profile */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Award className="mr-2 text-amber-500" /> โปรไฟล์ทักษะ
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

            <div className="mt-6 space-y-4">
              <h4 className="font-bold text-gray-700 text-sm uppercase tracking-wider">
                Top Skills
              </h4>
              <div className="space-y-3">
                {Object.entries(user.skills || {})
                  .sort(([, a], [, b]) => (b as number) - (a as number))
                  .slice(0, 3)
                  .map(([skill, value]) => (
                    <div
                      key={skill}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm font-medium text-gray-600 capitalize">
                        {skill}
                      </span>
                      <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{
                            width: `${Math.min(value as number, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </section>

          {/* Badges */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <Star className="mr-2 text-yellow-400" fill="currentColor" />{" "}
              เหรียญตรา (Badges)
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-amber-200 rounded-full flex items-center justify-center text-3xl shadow-inner border-2 border-white mb-2">
                  🏆
                </div>
                <span className="text-xs font-bold text-center text-gray-600">
                  First Quest
                </span>
              </div>
              {user.level && user.level >= 5 && (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center text-3xl shadow-inner border-2 border-white mb-2">
                    💡
                  </div>
                  <span className="text-xs font-bold text-center text-gray-600">
                    Level 5
                  </span>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Action-Based Experience */}
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                <Briefcase className="mr-3 text-blue-600" size={28} />{" "}
                ประสบการณ์จากการลงมือทำ
              </h3>
              <span className="text-sm font-medium text-gray-500">
                {completedQuests.length} เควสต์
              </span>
            </div>

            {completedQuests.length > 0 ? (
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                {completedQuests.map((uq, index) => (
                  <div
                    key={uq.id}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                  >
                    {/* Icon */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-100 text-blue-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <CheckCircle size={20} />
                    </div>

                    {/* Card */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg text-gray-800">
                          {uq.questDetails?.title || "Unknown Quest"}
                        </h4>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                          {uq.questDetails?.xpReward || 0} XP
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 font-medium mb-4">
                        {uq.questDetails?.difficulty || "Beginner"} •{" "}
                        {formatDate(uq.completedAt)}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {uq.questDetails?.skillsRewarded?.map((skill) => (
                          <span
                            key={skill}
                            className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-md"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <button className="text-sm text-blue-600 font-medium hover:underline flex items-center">
                        ดูรายละเอียดผลงาน{" "}
                        <ExternalLink size={14} className="ml-1" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-2xl">
                <p className="text-lg font-medium mb-2">ยังไม่มีประสบการณ์</p>
                <p className="text-sm">ไปทำเควสต์เพื่อสะสมประสบการณ์กันเถอะ!</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
