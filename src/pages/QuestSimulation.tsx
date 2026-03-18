import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bot, User, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getQuestById, startQuest, updateQuestProgress } from "../services/db";
import { Quest } from "../types/db";

// โครงสร้างของตัวเลือกที่มาจากข้อมูลเควสต์
type QuestChoice = {
  label: string;
  text: string;
  skillId: string;
};

type Message = {
  id: number;
  sender: "ai" | "user";
  text: string;
};

export default function QuestSimulation() {
  const navigate = useNavigate();
  const { questId } = useParams<{ questId: string }>();
  const [quest, setQuest] = useState<Quest | null>(null);
  const [userQuestId, setUserQuestId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [choices, setChoices] = useState<QuestChoice[]>([]);
  const [progress, setProgress] = useState(0);
  const [questEnded, setQuestEnded] = useState(false);

  useEffect(() => {
    const initQuest = async () => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user && questId) {
          try {
            const questData = await getQuestById(questId);
            if (questData) {
              setQuest(questData);
              const uqId = await startQuest(user.uid, questId);
              setUserQuestId(uqId);

              const scenario =
                (questData as any).content?.scenario ||
                questData.description ||
                "เริ่มจำลองสถานการณ์";

              const questChoices = (questData as any).content?.choices || [];

              setMessages([
                {
                  id: 1,
                  sender: "ai",
                  text: scenario,
                },
              ]);
              setChoices(questChoices);
              setProgress(10);
            } else {
              console.error("Quest not found");
              navigate("/quests");
            }
          } catch (error) {
            console.error("Error initializing quest:", error);
          } finally {
            setLoading(false);
          }
        } else if (!user) {
          navigate("/login");
        } else {
          navigate("/quests");
        }
      });
      return () => unsubscribe();
    };

    initQuest();
  }, [questId, navigate]);

  const handleChoiceSelect = async (choice: QuestChoice) => {
    if (!quest || questEnded) return;

    setQuestEnded(true);
    setChoices([]); // ซ่อนตัวเลือกหลังจากเลือกแล้ว

    const newUserMsg: Message = {
      id: Date.now(),
      sender: "user",
      text: choice.text,
    };
    const newMessages = [...messages, newUserMsg];
    setMessages(newMessages);

    setProgress(100);
    if (userQuestId) {
      await updateQuestProgress(userQuestId, 100, "completed");
    }

    // นำทางไปยังหน้าสรุปผล
    setTimeout(() => {
      navigate("/complete", {
        state: { questId, userQuestId, chatHistory: newMessages },
      });
    }, 1500); // หน่วงเวลาเพื่อให้ผู้ใช้เห็นตัวเลือกของตน
  };

  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-['Kanit']">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Bot className="text-blue-600" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-gray-800 font-['Fredoka']">
              AI Mentor: {quest?.title || "Quest"}
            </h1>
            <p className="text-xs text-green-500 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>{" "}
              Online
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
              ความคืบหน้าเควสต์
            </p>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-gray-400 hover:text-red-500 transition-colors p-2"
            title="ออกจากการจำลอง"
          >
            <AlertCircle size={24} />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex max-w-[80%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 ${
                  msg.sender === "user"
                    ? "bg-blue-600 ml-3"
                    : "bg-indigo-100 mr-3"
                }`}
              >
                {msg.sender === "user" ? (
                  <User size={16} className="text-white" />
                ) : (
                  <Bot size={16} className="text-indigo-600" />
                )}
              </div>

              <div className="space-y-2">
                <div
                  className={`p-4 rounded-2xl shadow-sm whitespace-pre-wrap ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white border border-gray-100 text-gray-800 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* แสดงตัวเลือกของเควสต์ */}
        {!questEnded && choices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex max-w-[80%] flex-row">
              <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 mr-3">
                <Bot size={16} className="text-indigo-600" />
              </div>
              <div className="space-y-2">
                <div className="p-4 text-gray-800 bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-none">
                  โปรดเลือกการตัดสินใจของคุณ:
                </div>
                <div className="mt-2 flex flex-col gap-2">
                  {choices.map((choice, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleChoiceSelect(choice)}
                      className="text-left px-4 py-3 bg-white border border-blue-200 hover:border-blue-500 hover:bg-blue-50 text-blue-700 rounded-xl text-sm transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                      disabled={questEnded}
                    >
                      <span className="font-bold mr-2">{choice.label}:</span>{" "}
                      {choice.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
