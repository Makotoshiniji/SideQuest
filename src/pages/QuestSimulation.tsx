import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bot, User, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getQuestById, startQuest, updateQuestProgress } from "../services/db";
import { Quest } from "../types/db";

type Message = {
  id: number;
  sender: "ai" | "user";
  text: string;
  options?: string[];
};

// New function to call the backend API
const generateResponse = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch(
      `/api/chat`, // เรียกใช้งาน Vercel Serverless Function แทน
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt, // ส่งแค่ข้อความ prompt ไปให้ API ฝั่ง Backend จัดการต่อ
        }),
      },
    );

    if (!response.ok) {
      let errorText = `API Error: ${response.status}`;
      console.error("API Error:", await response.text());
      return `ขออภัยค่ะ เกิดข้อผิดพลาดในการสื่อสารกับ AI (${response.status}) กรุณาลองใหม่อีกครั้ง`;
    }

    const data = await response.json();

    // ตรวจสอบว่ามีข้อมูลคำตอบปกติหรือไม่
    if (data.candidates && data.candidates.length > 0) {
      return (
        data.candidates[0].content?.parts?.[0]?.text ||
        "AI ส่งคำตอบมาแต่ไม่มีข้อความ"
      );
    } else {
      // ถ้าไม่มี candidates ให้ AI ปริ้นท์ก้อนข้อมูลออกมาเลยเพื่อดูว่าเกิดอะไรขึ้น
      console.error("Gemini Response Data:", data);
      return `ระบบ AI ตอบกลับมาผิดปกติ (ข้อมูล: ${JSON.stringify(data).substring(0, 150)}...)`;
    }
  } catch (error) {
    console.error("Network or other error calling generateResponse:", error);
    return "ขออภัยค่ะ เกิดข้อผิดพลาดของระบบเครือข่าย กรุณาตรวจสอบการเชื่อมต่อและลองใหม่อีกครั้ง";
  }
};

export default function QuestSimulation() {
  const navigate = useNavigate();
  const { questId } = useParams<{ questId: string }>();
  const [quest, setQuest] = useState<Quest | null>(null);
  const [userQuestId, setUserQuestId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
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

              setMessages([
                {
                  id: 1,
                  sender: "ai",
                  text: scenario,
                },
              ]);
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

  const handleSend = async (text: string) => {
    if (!text.trim() || !quest || questEnded) return;

    const newUserMsg: Message = { id: Date.now(), sender: "user", text };
    const newMessages = [...messages, newUserMsg];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    const scenario =
      (quest as any).content?.scenario || quest.description || "Quest Scenario";

    // Construct the prompt
    const history = newMessages.map((m) => `${m.sender}: ${m.text}`).join("\n");
    const prompt = `Quest Scenario: ${scenario}\n\nConversation History:\n${history}\n\nAI, as the mentor, your task is to respond to the user and guide them through the quest. When you feel the user has resolved the scenario, end your response with the token "[QUEST_COMPLETE]".\nAI:`;

    const aiResponseText = await generateResponse(prompt);

    setIsTyping(false);

    if (aiResponseText.includes("[QUEST_COMPLETE]")) {
      const cleanedResponse = aiResponseText
        .replace("[QUEST_COMPLETE]", "")
        .trim();
      const aiResponse: Message = {
        id: Date.now() + 1,
        sender: "ai",
        text: cleanedResponse,
      };
      setMessages((prev) => [...prev, aiResponse]);
      endQuest();
    } else {
      const aiResponse: Message = {
        id: Date.now() + 1,
        sender: "ai",
        text: aiResponseText,
      };
      setMessages((prev) => [...prev, aiResponse]);
      const newProgress = Math.min(progress + 10, 90); // Increment progress, but don't complete
      setProgress(newProgress);
      if (userQuestId) {
        await updateQuestProgress(userQuestId, newProgress, "active");
      }
    }
  };

  const endQuest = () => {
    const finalProgress = 100;
    setProgress(finalProgress);
    setQuestEnded(true);

    if (userQuestId) {
      updateQuestProgress(userQuestId, finalProgress, "completed");
    }

    const completionMessage: Message = {
      id: Date.now() + 2,
      sender: "ai",
      text: "ยอดเยี่ยมมาก! คุณแก้ปัญหาได้สำเร็จและเรียนรู้ทักษะใหม่ๆ\n\nคุณทำเควสต์นี้สำเร็จแล้ว 🎉",
    };
    // Add "View evaluation" as a final option after a delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { ...completionMessage, options: ["ดูผลประเมินและรับ XP"] },
      ]);
    }, 1000);
  };

  const handleOptionClick = (opt: string) => {
    if (opt === "ดูผลประเมินและรับ XP") {
      navigate("/complete", {
        state: { questId, userQuestId, chatHistory: messages },
      });
    }
    // No other options to handle now
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

                {msg.options && (
                  <div className="flex flex-col gap-2 mt-2">
                    {msg.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleOptionClick(opt)}
                        className="text-left px-4 py-3 bg-white border border-blue-200 hover:border-blue-500 hover:bg-blue-50 text-blue-700 rounded-xl text-sm transition-colors shadow-sm"
                        disabled={questEnded}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex flex-row max-w-[80%]">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 mr-3 flex items-center justify-center mt-1">
                <Bot size={16} className="text-indigo-600" />
              </div>
              <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-2">
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t p-4">
        <div className="max-w-4xl mx-auto relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            placeholder="Talk to your AI mentor..."
            className="w-full pl-6 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner"
            disabled={questEnded}
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || questEnded}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            <Send size={18} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
