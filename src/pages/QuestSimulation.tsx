import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bot, User, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getQuestById, startQuest, updateQuestProgress } from "../services/db";
import { Quest } from "../types/db";

// --- โครงสร้างข้อมูลใหม่สำหรับเควสต์แบบมีลำดับขั้น ---
type QuestNode = {
  ai_text: string;
  is_final?: boolean;
  choices?: QuestChoice[];
};

type QuestContent = {
  start_node_id: string;
  nodes: Record<string, QuestNode>;
};

type QuestChoice = {
  text: string;
  skillId: string;
  next_node_id: string;
  label?: string; // สำหรับ A, B, C (optional)
};

// --- เนื้อเรื่องตัวอย่างสำหรับเควสต์ "ลูกค้าหัวร้อนที่ร้านกาแฟ" ---
const DEMO_STORY_QUEST_ID = "angry-customer-kafe";
const storyContent: QuestContent = {
  start_node_id: "start",
  nodes: {
    start: {
      ai_text:
        "ลูกค้าเดินเข้ามาที่เคาน์เตอร์ด้วยสีหน้าบูดบึ้งและวางแก้วกาแฟลงบนโต๊ะอย่างแรง 'นี่มันกาแฟอะไรเนี่ย! ผมสั่งลาเต้ร้อน แต่ได้อะไรมาก็ไม่รู้ รสชาติจืดชืดเหมือนน้ำล้างแก้วแถมยังไม่ร้อนอีก!'",
      choices: [
        {
          text: "ขอประทานโทษด้วยค่ะ! ไม่ทราบว่าพอจะให้โอกาสทางเราแก้ไขให้ใหม่ได้ไหมคะ เดี๋ยวทำให้ใหม่ทันทีเลยค่ะ",
          skillId: "communication",
          next_node_id: "apologize_offer_remake",
          label: "A",
        },
        {
          text: "รบกวนขอตรวจสอบสักครู่นะคะ ไม่ทราบว่าคุณลูกค้าสั่งเมนูไหนไปคะ",
          skillId: "critical",
          next_node_id: "ask_for_details",
          label: "B",
        },
        {
          text: "แก้วนี้เป็นลาเต้ร้อนถูกต้องแล้วนะคะ บาริสต้าของเราทำตามสูตรเป๊ะเลยค่ะ",
          skillId: "collaboration",
          next_node_id: "defensive_stance",
          label: "C",
        },
      ],
    },
    apologize_offer_remake: {
      ai_text:
        "ลูกค้าดูใจเย็นลงเล็กน้อย 'ก็ได้! ทำให้มันดีๆ หน่อยแล้วกัน รีบด้วยนะ ผมมีประชุมต่อ'",
      choices: [
        {
          text: "ได้เลยค่ะ! เพื่อเป็นการขอโทษ ทางเราขอมอบคุกกี้ให้ทานคู่กับกาแฟแก้วใหม่นะคะ รอสักครู่นะคะ",
          skillId: "creative",
          next_node_id: "offer_cookie_end",
          label: "A",
        },
        {
          text: "รับทราบค่ะ เดี๋ยวรีบทำให้เลยค่ะ",
          skillId: "communication",
          next_node_id: "remake_quickly_end",
          label: "B",
        },
      ],
    },
    ask_for_details: {
      ai_text:
        "ลูกค้าขมวดคิ้ว 'ก็บอกว่าลาเต้ร้อนไง! นี่ใบเสร็จ!' เขายื่นใบเสร็จให้คุณ ซึ่งในใบเสร็จก็เขียนว่า 'ลาเต้ร้อน' จริงๆ",
      choices: [
        {
          text: "ขอบคุณค่ะ... ไม่แน่ใจว่าปกติคุณลูกค้าชอบทานแบบหวานน้อย หรือว่าเมล็ดกาแฟคั่วระดับไหนเป็นพิเศษไหมคะ ทางเราจะได้ปรับให้ถูกใจค่ะ",
          skillId: "critical",
          next_node_id: "inquire_preference",
          label: "A",
        },
        {
          text: "ขอโทษอีกครั้งค่ะ ดูเหมือนจะมีการสื่อสารผิดพลาด เดี๋ยวทางเราทำให้ใหม่ตามที่คุณลูกค้าต้องการเลยนะคะ",
          skillId: "communication",
          next_node_id: "apologize_offer_remake",
          label: "B",
        },
      ],
    },
    defensive_stance: {
      ai_text:
        "ลูกค้าหน้าแดงก่ำด้วยความโกรธ 'นี่คุณจะบอกว่าผมโกหกเหรอ! เรียกผู้จัดการมาเลย! ผมจะร้องเรียนให้ถึงที่สุด!' สถานการณ์ดูตึงเครียดขึ้นมาก",
      choices: [
        {
          text: "ใจเย็นๆ ก่อนนะคะ ขอโทษจริงๆ ค่ะที่ทำให้ไม่พอใจ เดี๋ยวทางเราทำให้ใหม่ทันทีเลยค่ะ ไม่มีค่าใช้จ่ายเพิ่มเติมค่ะ",
          skillId: "communication",
          next_node_id: "deescalate_remake_end",
          label: "A",
        },
        {
          text: "ก็ได้ค่ะ เดี๋ยวไปตามผู้จัดการมาให้ค่ะ",
          skillId: "critical",
          next_node_id: "get_manager_end",
          label: "B",
        },
      ],
    },
    inquire_preference: {
      ai_text:
        "ลูกค้าชะงักไปนิดหน่อย 'เอ่อ... ปกติผมก็กินแบบนี้แหละ แต่ร้านอื่นมันเข้มกว่านี้' เขาดูสับสนเล็กน้อย",
      choices: [
        {
          text: "เข้าใจแล้วค่ะ! งั้นเดี๋ยวแก้วใหม่นี้ทางเราขออนุญาตเพิ่มช็อตกาแฟให้ฟรีนะคะ จะได้เข้มข้นถูกใจคุณลูกค้าค่ะ",
          skillId: "creative",
          next_node_id: "offer_extra_shot_end",
          label: "A",
        },
        {
          text: "ถ้าอย่างนั้นเดี๋ยวทำให้ใหม่ตามสูตรปกติ แต่จะดูแลเรื่องอุณหภูมิให้ดีเป็นพิเศษเลยค่ะ",
          skillId: "communication",
          next_node_id: "remake_quickly_end",
          label: "B",
        },
      ],
    },
    offer_cookie_end: {
      ai_text:
        "ลูกค้าพยักหน้า 'อืม ก็ดีเหมือนกัน' คุณรีบทำกาแฟแก้วใหม่ที่ร้อนและได้มาตรฐาน พร้อมเสิร์ฟคู่กับคุกกี้ ลูกค้าหยิบไปโดยไม่พูดอะไร แต่สีหน้าดูดีขึ้นมาก คุณจัดการสถานการณ์ได้ยอดเยี่ยม!",
      is_final: true,
    },
    remake_quickly_end: {
      ai_text:
        "คุณรีบทำกาแฟแก้วใหม่อย่างรวดเร็วและตรวจสอบอุณหภูมิอย่างดี ลูกค้ารับไปและเดินออกจากร้านไปทันที แม้เขาจะไม่ขอบคุณ แต่คุณก็แก้ปัญหาเฉพาะหน้าได้สำเร็จ",
      is_final: true,
    },
    deescalate_remake_end: {
      ai_text:
        "แม้ลูกค้าจะยังดูหงุดหงิด แต่เขาก็ยอมรอ คุณรีบทำกาแฟแก้วใหม่ให้และกล่าวขอโทษอีกครั้ง เขารับไปและเดินออกจากร้านไปเงียบๆ คุณสามารถลดความรุนแรงของสถานการณ์ลงได้",
      is_final: true,
    },
    get_manager_end: {
      ai_text:
        "ผู้จัดการเข้ามาคุยกับลูกค้าและสถานการณ์ก็จบลงด้วยการที่ผู้จัดการต้องขอโทษและมอบบัตรกำนัลให้ลูกค้าไป แม้ปัญหาจะคลี่คลาย แต่คุณก็ไม่ได้เรียนรู้วิธีจัดการลูกค้าด้วยตัวเองในครั้งนี้",
      is_final: true,
    },
    offer_extra_shot_end: {
      ai_text:
        "ลูกค้าดูพอใจกับข้อเสนอของคุณ 'เอางั้นก็ได้ ลองดู' หลังจากได้กาแฟแก้วใหม่ที่เพิ่มช็อตไป เขาลองชิมแล้วพยักหน้า 'อืม แบบนี้ค่อยโอเคหน่อย' คุณไม่เพียงแก้ปัญหาได้ แต่ยังสร้างความประทับใจให้ลูกค้าได้อีกด้วย!",
      is_final: true,
    },
  },
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
  const [progress, setProgress] = useState(0);
  const [questEnded, setQuestEnded] = useState(false);
  const [questContent, setQuestContent] = useState<QuestContent | null>(null);
  const [currentNode, setCurrentNode] = useState<QuestNode | null>(null);
  const [pathSkills, setPathSkills] = useState<string[]>([]);

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

              // *** หมายเหตุ: โค้ดส่วนนี้เป็นการจำลองเนื้อเรื่องแบบมีลำดับขั้นสำหรับเควสต์ตัวอย่าง ***
              // ในระบบจริง, questData.content ควรมีโครงสร้างตามประเภท QuestContent อยู่แล้ว
              const content: QuestContent | null =
                questId === DEMO_STORY_QUEST_ID
                  ? storyContent
                  : (questData as any).content?.nodes
                    ? ((questData as any).content as QuestContent)
                    : null;

              if (content && content.nodes && content.start_node_id) {
                setQuestContent(content);
                const startNode = content.nodes[content.start_node_id];
                if (startNode) {
                  setCurrentNode(startNode);
                  setMessages([
                    { id: 1, sender: "ai", text: startNode.ai_text },
                  ]);
                  setProgress(10);
                } else {
                  throw new Error("Start node not found in quest content.");
                }
              } else {
                throw new Error(
                  "Quest content is not in the expected story format.",
                );
              }
            } else {
              console.error("Quest not found");
              navigate("/quests", { replace: true });
            }
          } catch (error) {
            console.error("Error initializing quest:", error);
          } finally {
            setLoading(false);
          }
        } else if (!user) {
          navigate("/login", { replace: true });
        } else {
          navigate("/quests", { replace: true });
        }
      });
      return () => unsubscribe();
    };

    initQuest();
  }, [questId, navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChoiceSelect = async (choice: QuestChoice) => {
    if (!quest || questEnded || !questContent || !currentNode) return;

    // 1. ปิดการแสดงตัวเลือกทันที และบันทึก Skill ที่เลือก
    setCurrentNode(null);
    setPathSkills((prev) => [...prev, choice.skillId]);

    // 2. แสดงข้อความของผู้ใช้
    const newUserMsg: Message = {
      id: Date.now(),
      sender: "user",
      text: choice.text,
    };
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);

    // 3. หน่วงเวลาเล็กน้อย เหมือน AI กำลังคิด
    setTimeout(async () => {
      const nextNode = questContent.nodes[choice.next_node_id];
      if (!nextNode) {
        console.error("Next node not found:", choice.next_node_id);
        setQuestEnded(true);
        return;
      }

      // 4. แสดงข้อความตอบกลับของ AI
      const newAiMsg: Message = {
        id: Date.now() + 1,
        sender: "ai",
        text: nextNode.ai_text,
      };
      const finalMessages = [...updatedMessages, newAiMsg];
      setMessages(finalMessages);

      // 5. ตรวจสอบว่าเป็นโหนดสุดท้ายหรือไม่
      if (nextNode.is_final) {
        setQuestEnded(true);
        setProgress(100);
        if (userQuestId) {
          await updateQuestProgress(userQuestId, 100, "completed");
        }
        // 6. จบเควสต์และนำทางไปหน้าสรุปผล
        setTimeout(
          () =>
            navigate("/complete", {
              state: {
                questId,
                userQuestId,
                chatHistory: finalMessages,
                skillsRewarded: [...pathSkills, choice.skillId],
              },
            }),
          2000,
        );
      } else {
        setProgress((prev) => Math.min(prev + 20, 90));
        setCurrentNode(nextNode); // แสดงตัวเลือกชุดถัดไป
      }
    }, 1200);
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
        {currentNode && currentNode.choices && !questEnded && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex max-w-[80%] flex-row">
              <div className="mr-3 mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100">
                <Bot size={16} className="text-indigo-600" />
              </div>
              <div className="space-y-2">
                <div className="rounded-2xl rounded-tl-none border border-gray-100 bg-white p-4 text-gray-800 shadow-sm">
                  โปรดเลือกการตัดสินใจของคุณ:
                </div>
                <div className="mt-2 flex w-full flex-col gap-2">
                  {currentNode.choices.map((choice, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleChoiceSelect(choice)}
                      className="text-left rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm text-blue-700 shadow-sm transition-colors hover:border-blue-500 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={questEnded}
                    >
                      {choice.label && (
                        <span className="mr-2 font-bold">{choice.label}:</span>
                      )}{" "}
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
