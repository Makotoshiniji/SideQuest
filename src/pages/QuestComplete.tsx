import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Award,
  Star,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Loader2,
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
  getQuestById,
  getUserProfile,
  updateUserProfile,
} from "../services/db";
import { Quest, User } from "../types/db";
import { GoogleGenAI } from "@google/genai";
import { generateReflectionProxy } from "../services/genaiProxy";

export default function QuestComplete() {
  const location = useLocation();
  const navigate = useNavigate();
  const { questId, chatHistory } = location.state || {};

  const [quest, setQuest] = useState<Quest | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [xpGained, setXpGained] = useState(0);
  const [aiReflection, setAiReflection] = useState<{
    strengths: string;
    improvements: string;
    creativity: number;
    critical_thinking: number;
    communication: number;
    collaboration: number;
  } | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [generatingReflection, setGeneratingReflection] = useState(true);

  useEffect(() => {
    const completeQuest = async () => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser && questId) {
          try {
            const questData = await getQuestById(questId);
            const userProfile = await getUserProfile(firebaseUser.uid);

            if (questData && userProfile) {
              setQuest(questData);
              setUser(userProfile);
              setXpGained(questData.xpReward);

              // Update user XP and Level
              const newXp = (userProfile.xp || 0) + questData.xpReward;
              const newLevel = Math.floor(newXp / 1000) + 1;

              // Update skills (simplified logic for demo)
              const currentSkills = userProfile.skills || {};
              const updatedSkills = { ...currentSkills };
              questData.skillsRewarded.forEach((skill) => {
                updatedSkills[skill] = (updatedSkills[skill] || 20) + 5; // Add 5 points per skill
              });

              // Store initial data before AI finishes
              setUser({
                ...userProfile,
                xp: newXp,
                level: newLevel,
                skills: updatedSkills,
              });

              await updateUserProfile(firebaseUser.uid, {
                xp: newXp,
                level: newLevel,
                skills: updatedSkills,
              });

              // Generate AI Reflection
              generateReflection(questData, userProfile, chatHistory);
            } else {
              navigate("/dashboard");
            }
          } catch (error) {
            console.error("Error completing quest:", error);
          } finally {
            setLoading(false);
          }
        } else {
          navigate("/dashboard");
        }
      });
      return () => unsubscribe();
    };

    completeQuest();
  }, [questId, navigate, chatHistory]);

  const generateReflection = async (
    questData: Quest,
    userProfile: User,
    history: any[],
  ) => {
    // Simple offline analyzer used when Gemini API is unavailable or fails.
    const offlineAnalyze = (historyItems: any[], quest?: Quest) => {
      const text = (historyItems || [])
        .map((m: any) => (m.text ? String(m.text).toLowerCase() : ""))
        .join(" ");

      const countMatches = (words: string[]) =>
        words.reduce((acc, w) => acc + (text.split(w).length - 1), 0);

      const creativityHits = countMatches([
        "idea",
        "suggest",
        "creative",
        "คิด",
        "ไอเดีย",
        "เสนอ",
      ]);
      const criticalHits = countMatches([
        "analy",
        "check",
        "investig",
        "วิเคราะห์",
        "ตรวจสอบ",
        "เหตุผล",
      ]);
      const communicationHits = countMatches([
        "tell",
        "explain",
        "สื่อสาร",
        "อธิบาย",
        "พูด",
        "แจ้ง",
      ]);
      const collaborationHits = countMatches([
        "team",
        "help",
        "ร่วมมือ",
        "ช่วย",
        "เรา",
        "ทีม",
      ]);

      const normalize = (hits: number) =>
        Math.min(10, Math.max(1, 5 + Math.round(hits / 2)));

      const creativity = normalize(creativityHits);
      const critical_thinking = normalize(criticalHits);
      const communication = normalize(communicationHits);
      const collaboration = normalize(collaborationHits);

      const strengths = `คุณมีจุดแข็งด้านการ${communication >= 7 ? "สื่อสาร" : communication >= 5 ? "สื่อสารและการอธิบาย" : "ความพยายาม"} และแสดงความตั้งใจในการเรียนรู้`;
      const improvements = `ลองฝึกฝน${critical_thinking < 6 ? "การคิดวิเคราะห์และการตรวจสอบข้อมูล" : "การตัดสินใจที่รวดเร็ว"} ให้มากขึ้นในสถานการณ์จริง`;

      return {
        creativity,
        critical_thinking,
        communication,
        collaboration,
        strengths,
        improvements,
      };
    };

    try {
      const proxyUrl = import.meta.env.VITE_GENAI_PROXY_URL;
      if (proxyUrl) {
        // Use server-side proxy to keep API key secret
        try {
          const proxyResp = await generateReflectionProxy(prompt);
          // Proxy may return JSON text or a field `text`
          let parsed: any = proxyResp;
          if (
            proxyResp &&
            proxyResp.text &&
            typeof proxyResp.text === "string"
          ) {
            try {
              parsed = JSON.parse(proxyResp.text);
            } catch (e) {
              // if proxy returned something else, keep as text
              parsed = {
                strengths: proxyResp.text,
                improvements: "",
                creativity: 6,
                critical_thinking: 6,
                communication: 6,
                collaboration: 6,
              };
            }
          }
          setAiReflection(parsed);
          setAiError(null);
          setGeneratingReflection(false);
          return;
        } catch (err: any) {
          console.warn(
            "Proxy call failed, falling back to client-side AI:",
            err,
          );
          // continue to try client-side call or offline fallback
        }
      }

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        console.warn("Gemini API key not found. Using fallback reflection.");
        const offline = offlineAnalyze(history, questData);
        setAiReflection(offline);
        setGeneratingReflection(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });

      // Format chat history for the prompt
      const formattedHistory = history
        ? history
            .map(
              (msg) =>
                `${msg.sender === "user" ? "นักเรียน" : "AI"}: ${msg.text}`,
            )
            .join("\n")
        : "ไม่มีประวัติการสนทนา";

      const prompt = `
        คุณคือ AI Mentor ที่วิเคราะห์ประวัติการตัดสินใจของนักเรียนหลังจากทำเควสต์เสร็จสิ้น
        ชื่อนักเรียน: ${userProfile.name || "นักเรียน"}
        ชื่อเควสต์: ${questData.title}
        รายละเอียดเควสต์: ${questData.description}
        ทักษะที่ได้รับ: ${questData.skillsRewarded.join(", ")}

        ประวัติการสนทนาระหว่างทำเควสต์:
        ${formattedHistory}

        กรุณาวิเคราะห์การตัดสินใจและพฤติกรรมของนักเรียนจากประวัติการสนทนา แล้ว:
        1. ประเมินทักษะ 4Cs ด้วยคะแนน 1-10 (เต็ม 10):
           - ความคิดสร้างสรรค์ (Creativity): ความสามารถในการหาทางแก้ปัญหาแบบเฉพาะตัว
           - การคิดวิเคราะห์ (Critical Thinking): ความสามารถในการปรึกษาหารือและตัดสินใจอย่างมีเหตุผล
           - การสื่อสาร (Communication): ความสามารถในการสื่อสารอย่างชัดเจนและประสิทธิผล
           - ความเป็นทีม (Collaboration): ความสามารถในการท่างานเป็นกลุ่มและรับความคิดเห็นคนอื่น

        2. เขียนคำสะท้อนคิด (Reflection) 2 ส่วน:
           - จุดแข็ง: สิ่งที่นักเรียนทำได้ดี ชื่นชมในความพยายามหรือการตัดสินใจที่ถูกต้อง (2-3 ประโยค)
           - สิ่งที่ควรพัฒนา: สิ่งที่นักเรียนสามารถปรับปรุงให้ดีขึ้นได้ (2-3 ประโยค)

        🔴 กฎเหล็ก: ตอบกลับในรูปแบบ JSON เท่านั้น โดยมีโครงสร้างเป็นไปตามนี้:
        {
          "creativity": [ตัวเลข 1-10],
          "critical_thinking": [ตัวเลข 1-10],
          "communication": [ตัวเลข 1-10],
          "collaboration": [ตัวเลข 1-10],
          "strengths": "ข้อความจุดแข็ง...",
          "improvements": "ข้อความสิ่งที่ควรพัฒนา..."
        }

        ห้ามมีข้อความเจือปน ห้ามใช้ Markdown ตอบเป็น JSON เท่านั้น
      `;

      // Retry logic: try up to 3 times before falling back to offline analysis
      const maxRetries = 2;
      let attempt = 0;
      let lastError: any = null;
      while (attempt <= maxRetries) {
        try {
          const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
            },
          });

          if (response && response.text) {
            const result = JSON.parse(response.text);
            setAiReflection(result);
            setAiError(null);
            lastError = null;
            break;
          } else {
            throw new Error("No text in response");
          }
        } catch (err: any) {
          lastError = err;
          console.warn(`Gemini attempt ${attempt + 1} failed:`, err);
          if (attempt < maxRetries) {
            // small backoff
            await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
            attempt += 1;
            continue;
          }
          // all retries failed -> fallback
          const offline = offlineAnalyze(history, questData);
          setAiReflection(offline);
          const msg =
            err?.message || (err && JSON.stringify(err)) || "Unknown error";
          setAiError(`AI service unavailable (using offline analysis). ${msg}`);
          break;
        }
      }
    } catch (error) {
      console.error("Error generating AI reflection:", error);
      // If an unexpected error occurs, attempt offline analysis as final fallback
      const offline = offlineAnalyze(history, questData);
      setAiReflection(offline);
      setAiError(
        "Unexpected error generating AI reflection (offline analysis used).",
      );
    } finally {
      setGeneratingReflection(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  const radarData = aiReflection
    ? [
        {
          subject: "ความคิดสร้างสรรค์",
          A: aiReflection.creativity * 10, // Convert 1-10 to 1-100 scale
          fullMark: 100,
        },
        {
          subject: "การคิดวิเคราะห์",
          A: aiReflection.critical_thinking * 10,
          fullMark: 100,
        },
        {
          subject: "การสื่อสาร",
          A: aiReflection.communication * 10,
          fullMark: 100,
        },
        {
          subject: "ความเป็นทีม",
          A: aiReflection.collaboration * 10,
          fullMark: 100,
        },
      ]
    : [
        { subject: "ความคิดสร้างสรรค์", A: 0, fullMark: 100 },
        { subject: "การคิดวิเคราะห์", A: 0, fullMark: 100 },
        { subject: "การสื่อสาร", A: 0, fullMark: 100 },
        { subject: "ความเป็นทีม", A: 0, fullMark: 100 },
      ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-6 font-['Kanit']">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-10 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>

          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative z-10"
          >
            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white/30 shadow-xl">
              <Award size={48} className="text-yellow-300 drop-shadow-md" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black font-['Fredoka'] mb-2 drop-shadow-sm">
              เควสต์สำเร็จ! 🎉
            </h1>
            <p className="text-blue-100 text-lg font-medium">{quest?.title}</p>
          </motion.div>
        </div>

        {/* Content */}

        {aiError && (
          <div className="p-6 bg-amber-50 border border-amber-200 text-amber-800 rounded-b-md flex items-start gap-4">
            <AlertCircle className="text-amber-700" />
            <div className="text-sm">
              <div className="font-semibold">AI service notice</div>
              <div className="mt-1">{aiError}</div>
            </div>
          </div>
        )}

        <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column: AI Reflection */}
          <div className="space-y-8">
            <section>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <span className="bg-blue-100 text-blue-600 p-2 rounded-xl mr-3">
                  <Star size={24} />
                </span>
                AI Reflection
              </h3>

              {generatingReflection ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <Loader2 className="animate-spin text-blue-500" size={32} />
                  <p className="text-gray-500 text-sm font-medium animate-pulse">
                    AI กำลังวิเคราะห์ผลงานของคุณ...
                  </p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl space-y-4 relative">
                    <div className="absolute -left-3 top-6 w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-sm"></div>
                    <h4 className="font-bold text-blue-800 text-lg">
                      จุดแข็งของคุณ (Strengths)
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {aiReflection?.strengths}
                    </p>
                  </div>

                  <div className="bg-amber-50 border border-amber-100 p-6 rounded-2xl space-y-4 relative mt-6">
                    <div className="absolute -left-3 top-6 w-6 h-6 bg-amber-500 rounded-full border-4 border-white shadow-sm"></div>
                    <h4 className="font-bold text-amber-800 text-lg">
                      สิ่งที่ควรพัฒนา (Areas for Improvement)
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {aiReflection?.improvements}
                    </p>
                  </div>
                </motion.div>
              )}
            </section>
          </div>

          {/* Right Column: Rewards & Radar */}
          <div className="space-y-8">
            <section className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center justify-center">
                <TrendingUp className="mr-2 text-green-500" /> ทักษะ 4Cs
                ที่วิเคราะห์
              </h3>

              {generatingReflection ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="animate-spin text-blue-500" size={24} />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                    <p className="text-sm text-blue-700 font-semibold mb-2">
                      ความคิดสร้างสรรค์
                    </p>
                    <p className="text-3xl font-black text-blue-600">
                      {aiReflection?.creativity || 0}/10
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                    <p className="text-sm text-purple-700 font-semibold mb-2">
                      การคิดวิเคราะห์
                    </p>
                    <p className="text-3xl font-black text-purple-600">
                      {aiReflection?.critical_thinking || 0}/10
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                    <p className="text-sm text-green-700 font-semibold mb-2">
                      การสื่อสาร
                    </p>
                    <p className="text-3xl font-black text-green-600">
                      {aiReflection?.communication || 0}/10
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
                    <p className="text-sm text-orange-700 font-semibold mb-2">
                      ความเป็นทีม
                    </p>
                    <p className="text-3xl font-black text-orange-600">
                      {aiReflection?.collaboration || 0}/10
                    </p>
                  </div>
                </div>
              )}

              <h4 className="text-lg font-bold text-gray-800 mb-4 mt-8">
                Skill Radar Chart
              </h4>
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
              <div className="flex justify-center flex-wrap gap-2 mt-4 text-sm font-medium">
                {quest?.skillsRewarded.map((skill, idx) => (
                  <span
                    key={idx}
                    className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-md"
                  >
                    <CheckCircle size={14} className="mr-1" /> {skill} +5
                  </span>
                ))}
              </div>
            </section>

            <div className="bg-gradient-to-r from-yellow-100 to-amber-100 p-6 rounded-2xl border border-yellow-200 text-center shadow-inner">
              <p className="text-sm font-bold text-amber-800 uppercase tracking-wider mb-1">
                XP ที่ได้รับ
              </p>
              <p className="text-4xl font-black text-amber-600 font-['Fredoka']">
                +{xpGained} XP
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 p-6 border-t flex justify-between items-center">
          <Link
            to="/portfolio"
            className="text-blue-600 font-medium hover:underline px-4 py-2"
          >
            ดูพอร์ตโฟลิโอของคุณ
          </Link>
          <Link
            to="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-md shadow-blue-500/30 transition-all hover:-translate-y-1 flex items-center"
          >
            กลับสู่แดชบอร์ด <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
