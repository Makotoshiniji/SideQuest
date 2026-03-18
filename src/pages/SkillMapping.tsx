import { useState, useEffect } from 'react';
import { GitMerge, Plus, Search, Filter, Save, BrainCircuit, Tag, MessageSquareText, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const skillsList = [
  { id: 'sk1', name: 'Critical Thinking', category: 'Cognitive', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { id: 'sk2', name: 'Communication', category: 'Interpersonal', color: 'bg-purple-100 text-purple-700 border-purple-200' },
  { id: 'sk3', name: 'Creativity', category: 'Cognitive', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { id: 'sk4', name: 'Collaboration', category: 'Interpersonal', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { id: 'sk5', name: 'Problem Solving', category: 'Cognitive', color: 'bg-rose-100 text-rose-700 border-rose-200' },
];

const initialChoices = [
  { id: 'c1', text: 'ขอโทษลูกค้าและเสนอเงินคืนเต็มจำนวน', node: 'ทางเลือก A', tags: [{ skillId: 'sk2', value: +1 }, { skillId: 'sk5', value: -1 }] },
  { id: 'c2', text: 'สอบถามรายละเอียดเพิ่มเติมเพื่อหาสาเหตุที่แท้จริง', node: 'ทางเลือก B', tags: [{ skillId: 'sk1', value: +2 }, { skillId: 'sk2', value: +1 }] },
  { id: 'c3', text: 'ปฏิเสธความรับผิดชอบเนื่องจากเลยระยะเวลารับประกัน', node: 'ทางเลือก C', tags: [{ skillId: 'sk2', value: -2 }, { skillId: 'sk4', value: -1 }] },
];

export default function SkillMapping() {
  const [choices, setChoices] = useState(initialChoices);
  const [activeChoice, setActiveChoice] = useState(choices[0]);
  const [aiPrompt, setAiPrompt] = useState('วิเคราะห์การตัดสินใจของนักเรียน โดยเน้นไปที่ทักษะการสื่อสารและการแก้ปัญหา หากนักเรียนเลือกทางเลือกที่ประนีประนอม ให้ชื่นชม แต่หากเลือกทางเลือกที่แข็งกร้าว ให้แนะนำวิธีที่นุ่มนวลกว่า');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved mapping data (using a hardcoded ID for demo purposes)
  const mappingDocId = 'demo-mapping-1';

  useEffect(() => {
    const loadMapping = async () => {
      try {
        const docRef = doc(db, 'skill_mappings', mappingDocId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.choices) setChoices(data.choices);
          if (data.aiPrompt) setAiPrompt(data.aiPrompt);
          if (data.choices && data.choices.length > 0) {
            setActiveChoice(data.choices[0]);
          }
        }
      } catch (error) {
        console.error("Error loading skill mapping:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMapping();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const docRef = doc(db, 'skill_mappings', mappingDocId);
      await setDoc(docRef, {
        choices,
        aiPrompt,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      alert('บันทึกการตั้งค่าสำเร็จ!');
    } catch (error) {
      console.error("Error saving skill mapping:", error);
      alert('เกิดข้อผิดพลาดในการบันทึก');
    } finally {
      setIsSaving(false);
    }
  };

  const updateTagValue = (choiceId: string, skillId: string, delta: number) => {
    const updatedChoices = choices.map(c => {
      if (c.id === choiceId) {
        return {
          ...c,
          tags: c.tags.map(t => t.skillId === skillId ? { ...t, value: t.value + delta } : t)
        };
      }
      return c;
    });
    setChoices(updatedChoices);
    if (activeChoice.id === choiceId) {
      setActiveChoice(updatedChoices.find(c => c.id === choiceId) || activeChoice);
    }
  };

  const removeTag = (choiceId: string, skillId: string) => {
    const updatedChoices = choices.map(c => {
      if (c.id === choiceId) {
        return {
          ...c,
          tags: c.tags.filter(t => t.skillId !== skillId)
        };
      }
      return c;
    });
    setChoices(updatedChoices);
    if (activeChoice.id === choiceId) {
      setActiveChoice(updatedChoices.find(c => c.id === choiceId) || activeChoice);
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-['Kanit'] h-full flex flex-col">
      <header className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-200 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 font-['Fredoka'] flex items-center">
            <GitMerge className="mr-3 text-indigo-600" size={32} /> กำหนดทักษะ & AI (Skill Mapping) 🧠
          </h1>
          <p className="text-slate-500 mt-1">เชื่อมโยงตัวเลือกในเกมเข้ากับทักษะ 4Cs และตั้งค่า AI Reflection</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-md shadow-indigo-500/20 transition-all hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {isSaving ? <Loader2 size={20} className="mr-2 animate-spin" /> : <Save size={20} className="mr-2" />}
          {isSaving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
        </button>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden">
        {/* Left Column: Choices List */}
        <div className="lg:col-span-1 bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-700 flex items-center">
              <MessageSquareText size={18} className="mr-2 text-slate-400" /> ตัวเลือกทั้งหมด (Choices)
            </h3>
            <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">{choices.length}</span>
          </div>
          
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="ค้นหาตัวเลือก..." 
                className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {choices.map(choice => (
              <div 
                key={choice.id}
                onClick={() => setActiveChoice(choice)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  activeChoice.id === choice.id 
                    ? 'bg-indigo-50 border-indigo-300 shadow-sm' 
                    : 'bg-white border-slate-200 hover:border-indigo-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{choice.node}</span>
                  <div className="flex space-x-1">
                    {choice.tags.map((tag, idx) => {
                      const skill = skillsList.find(s => s.id === tag.skillId);
                      return skill ? (
                        <div key={idx} className={`w-2 h-2 rounded-full ${skill.color.split(' ')[0]}`} title={skill.name}></div>
                      ) : null;
                    })}
                  </div>
                </div>
                <p className="text-sm text-slate-800 font-medium line-clamp-2">{choice.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Mapping & AI */}
        <div className="lg:col-span-2 space-y-6 overflow-y-auto pr-2">
          
          {/* Tagging Section */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center">
                <Tag className="mr-2 text-indigo-500" /> ผูกค่าทักษะ (Skill Tagging)
              </h3>
              <span className="text-sm text-slate-500">สำหรับ: <strong className="text-indigo-600">{activeChoice.node}</strong></span>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6">
              <p className="text-slate-700 font-medium italic">"{activeChoice.text}"</p>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wider">ทักษะที่ผูกไว้</h4>
              
              {activeChoice.tags.map((tag, idx) => {
                const skill = skillsList.find(s => s.id === tag.skillId);
                if (!skill) return null;
                
                return (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${skill.color}`}>
                        {skill.name}
                      </span>
                      <span className="text-xs text-slate-500">{skill.category}</span>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center bg-slate-100 rounded-lg p-1">
                        <button 
                          onClick={() => updateTagValue(activeChoice.id, tag.skillId, -1)}
                          className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-white rounded-md font-bold transition-colors"
                        >-</button>
                        <span className={`w-8 text-center font-bold ${tag.value > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {tag.value > 0 ? `+${tag.value}` : tag.value}
                        </span>
                        <button 
                          onClick={() => updateTagValue(activeChoice.id, tag.skillId, 1)}
                          className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-white rounded-md font-bold transition-colors"
                        >+</button>
                      </div>
                      <button 
                        onClick={() => removeTag(activeChoice.id, tag.skillId)}
                        className="text-slate-400 hover:text-rose-500 transition-colors"
                      >✕</button>
                    </div>
                  </div>
                );
              })}
              
              <button className="w-full py-4 border-2 border-dashed border-slate-300 text-slate-500 rounded-xl font-bold hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600 transition-colors flex items-center justify-center">
                <Plus size={18} className="mr-2" /> เพิ่มทักษะใหม่
              </button>
            </div>
          </section>

          {/* AI Prompt Section */}
          <section className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center">
                <BrainCircuit className="mr-2 text-purple-500" /> AI Reflection Prompt
              </h3>
              <button className="text-sm text-purple-600 font-bold hover:underline">
                ดูตัวอย่างผลลัพธ์
              </button>
            </div>
            
            <p className="text-sm text-slate-600 mb-4">
              เขียนคำสั่ง (Prompt) เพื่อให้ AI นำไปประมวลผลและสร้างคำแนะนำส่วนตัวให้นักเรียนเมื่อจบเควสต์นี้
            </p>
            
            <div className="relative">
              <textarea 
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="w-full p-4 bg-purple-50/50 border border-purple-100 rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none text-slate-700 min-h-[160px] resize-y leading-relaxed"
                placeholder="พิมพ์คำสั่งสำหรับ AI ที่นี่..."
              ></textarea>
              <div className="absolute bottom-4 right-4 text-xs font-bold text-purple-400">
                {aiPrompt.length} ตัวอักษร
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2 py-1">ตัวแปรที่ใช้ได้:</span>
              <button className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md hover:bg-slate-200 transition-colors">{`{{student_name}}`}</button>
              <button className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md hover:bg-slate-200 transition-colors">{`{{top_skill}}`}</button>
              <button className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md hover:bg-slate-200 transition-colors">{`{{weak_skill}}`}</button>
              <button className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md hover:bg-slate-200 transition-colors">{`{{choices_made}}`}</button>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
