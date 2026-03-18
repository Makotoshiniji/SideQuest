import React, { useState } from "react";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { createQuest } from "../services/db";

const SKILLS_4CS = [
  {
    id: "creative",
    label: "ความคิดสร้างสรรค์ (Creative Thinking)",
    label_short: "Creative",
  },
  {
    id: "critical",
    label: "การคิดวิเคราะห์ (Critical Thinking)",
    label_short: "Critical",
  },
  {
    id: "communication",
    label: "การสื่อสาร (Communication)",
    label_short: "Communication",
  },
  {
    id: "collaboration",
    label: "การร่วมมือ (Collaboration)",
    label_short: "Collaboration",
  },
];

export default function QuestBuilder() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  const [questData, setQuestData] = useState({
    title: "",
    description: "",
    estimatedMinutes: 30,
    xpReward: 500,
    choices: [
      { text: "", skillId: "communication" },
      { text: "", skillId: "creative" },
      { text: "", skillId: "critical" },
    ],
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestData({ ...questData, title: e.target.value });
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setQuestData({ ...questData, description: e.target.value });
  };

  const handleChoiceTextChange = (index: number, text: string) => {
    const newChoices = [...questData.choices];
    newChoices[index].text = text;
    setQuestData({ ...questData, choices: newChoices });
  };

  const handleChoiceSkillChange = (index: number, skillId: string) => {
    const newChoices = [...questData.choices];
    newChoices[index].skillId = skillId;
    setQuestData({ ...questData, choices: newChoices });
  };

  const handleSave = async () => {
    if (!auth.currentUser) {
      alert("กรุณาเข้าสู่ระบบก่อนบันทึกเควสต์");
      return;
    }

    if (!questData.title.trim()) {
      alert("กรุณาระบุชื่อเควสต์");
      return;
    }

    if (!questData.description.trim()) {
      alert("กรุณาระบุเนื้อเรื่องของเควสต์");
      return;
    }

    if (questData.choices.some((c) => !c.text.trim())) {
      alert("กรุณากรอกข้อมูลตัวเลือกทั้ง 3 ตัวเลือก");
      return;
    }

    setIsSaving(true);
    try {
      const skillsMapping =
        SKILLS_4CS.find((s) => s.id === questData.choices[0].skillId)?.id ||
        "communication";

      const newQuestData = {
        title: questData.title,
        description: questData.description,
        creatorId: auth.currentUser.uid,
        status: "draft" as const,
        difficulty: "Beginner" as any,
        estimatedMinutes: questData.estimatedMinutes,
        xpReward: questData.xpReward,
        skillsRewarded: questData.choices.map((c) => c.skillId),
        type: "solo" as const,
        content: {
          scenario: questData.description,
          choices: questData.choices.map((choice, idx) => ({
            label: String.fromCharCode(65 + idx), // A, B, C
            text: choice.text,
            skillId: choice.skillId,
          })),
        },
      };

      await createQuest(newQuestData);
      alert("บันทึกเควสต์สำเร็จ!");
      navigate("/coach");
    } catch (error) {
      console.error("Error saving quest:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกเควสต์");
    } finally {
      setIsSaving(false);
    }
  };

  const getSkillLabel = (skillId: string) => {
    return SKILLS_4CS.find((s) => s.id === skillId)?.label || skillId;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 font-['Kanit']">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-6 shadow-sm">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/coach")}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 font-['Fredoka']">
                สร้างเควสต์ใหม่
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                ฟอร์มยาย: กรอกข้อมูลสถานการณ์และตัวเลือก
              </p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <Loader2 size={18} className="mr-2 animate-spin" />
            ) : (
              <Save size={18} className="mr-2" />
            )}
            {isSaving ? "กำลังบันทึก..." : "บันทึกเควสต์"}
          </button>
        </div>
      </header>

      {/* Main Form */}
      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-8">
          {/* Basic Info Section */}
          <section className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800 mb-4">
                ข้อมูลพื้นฐาน
              </h2>
              <div className="space-y-4">
                {/* Quest Title */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    ชื่อเควสต์ *
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น: การจัดการความโกรธของลูกค้า"
                    value={questData.title}
                    onChange={handleTitleChange}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors"
                  />
                </div>

                {/* Quest Description */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    เนื้อเรื่อง / สถานการณ์ *
                  </label>
                  <textarea
                    placeholder="บรรยายสถานการณ์ที่นักเรียนต้องเผชิญหน้า..."
                    value={questData.description}
                    onChange={handleDescriptionChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors resize-none"
                  />
                </div>

                {/* Time and XP */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      เวลาโดยประมาณ (นาที)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="120"
                      value={questData.estimatedMinutes}
                      onChange={(e) =>
                        setQuestData({
                          ...questData,
                          estimatedMinutes: parseInt(e.target.value) || 30,
                        })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      XP Reward
                    </label>
                    <input
                      type="number"
                      min="100"
                      max="2000"
                      step="100"
                      value={questData.xpReward}
                      onChange={(e) =>
                        setQuestData({
                          ...questData,
                          xpReward: parseInt(e.target.value) || 500,
                        })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="border-t border-slate-200"></div>

          {/* Choices Section */}
          <section className="space-y-6">
            <h2 className="text-lg font-bold text-slate-800">
              ตัวเลือก (Choices)
            </h2>
            <p className="text-sm text-slate-500">
              กรอกข้อความตัวเลือก 3 ตัวเลือก (A, B, C) และเลือกทักษะ 4Cs
              ที่เกี่ยวข้อง
            </p>

            <div className="space-y-6">
              {questData.choices.map((choice, index) => (
                <div
                  key={index}
                  className="border border-slate-300 rounded-lg p-6 bg-slate-50"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <h3 className="font-bold text-slate-800">
                      ตัวเลือก {String.fromCharCode(65 + index)}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {/* Choice Text */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        ข้อความตัวเลือก *
                      </label>
                      <textarea
                        placeholder={`พิมพ์ข้อความสำหรับตัวเลือก ${String.fromCharCode(65 + index)}...`}
                        value={choice.text}
                        onChange={(e) =>
                          handleChoiceTextChange(index, e.target.value)
                        }
                        rows={3}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors resize-none"
                      />
                    </div>

                    {/* Skill Mapping */}
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        ทักษะ 4Cs ที่เกี่ยวข้อง
                      </label>
                      <select
                        value={choice.skillId}
                        onChange={(e) =>
                          handleChoiceSkillChange(index, e.target.value)
                        }
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-colors"
                      >
                        {SKILLS_4CS.map((skill) => (
                          <option key={skill.id} value={skill.id}>
                            {skill.label}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-slate-500 mt-2">
                        ตัวเลือกนี้สะท้อนทักษะ: {getSkillLabel(choice.skillId)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>💡 หมายเหตุ:</strong> เมื่อนักเรียนเลือกตัวเลือก
              ระบบจะบันทึกทักษะ 4Cs ที่พัฒนาและแสดงผลบนกราฟ Skill Radar ทันที
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
