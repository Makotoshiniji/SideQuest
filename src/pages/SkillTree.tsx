import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Lock, CheckCircle, ArrowRight } from 'lucide-react';

// Mock data for skill tree
const skillNodes = [
  { id: 's1', title: 'ช่างสังเกต', type: 'core', status: 'completed', x: 50, y: 50, desc: 'พื้นฐานการรับรู้รายละเอียดรอบตัว' },
  { id: 's2', title: 'การวิเคราะห์ข้อมูล', type: 'advanced', status: 'unlocked', x: 150, y: 100, desc: 'นำข้อมูลที่สังเกตได้มาจัดระบบ', req: 'ทำเควสต์ "นักสืบข้อมูล" ให้ได้ระดับ B ขึ้นไป' },
  { id: 's3', title: 'การสื่อสารเบื้องต้น', type: 'core', status: 'completed', x: 50, y: 200, desc: 'การถ่ายทอดความคิดให้ผู้อื่นเข้าใจ' },
  { id: 's4', title: 'การนำเสนอ', type: 'advanced', status: 'locked', x: 150, y: 250, desc: 'การพูดต่อหน้าชุมชนอย่างมั่นใจ', req: 'ทำเควสต์ "นักเล่าเรื่อง" ให้สำเร็จ' },
  { id: 's5', title: 'Data Storytelling', type: 'master', status: 'locked', x: 300, y: 175, desc: 'เล่าเรื่องด้วยข้อมูลให้น่าสนใจ', req: 'ปลดล็อก "การวิเคราะห์ข้อมูล" และ "การนำเสนอ"' },
];

const connections = [
  { from: 's1', to: 's2' },
  { from: 's3', to: 's4' },
  { from: 's2', to: 's5' },
  { from: 's4', to: 's5' },
];

export default function SkillTree() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <div className="p-8 space-y-8 font-['Kanit'] h-full flex flex-col">
      <header className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 font-['Fredoka']">เส้นทางทักษะ (Skill Tree) 🌳</h1>
          <p className="text-gray-500 mt-1">ดูการเติบโตและวางแผนปลดล็อกทักษะใหม่ๆ</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Level 5 Explorer</p>
          <div className="w-48 h-3 bg-gray-100 rounded-full mt-2 overflow-hidden relative">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 w-[60%] rounded-full"></div>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md">2,400 / 4,000 EXP</span>
          </div>
        </div>
      </header>

      <div className="flex-1 bg-gray-900 rounded-3xl overflow-hidden relative border-4 border-gray-800 shadow-2xl">
        {/* Grid Background */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(#374151 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}></div>

        {/* Connections (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {connections.map((conn, idx) => {
            const fromNode = skillNodes.find(n => n.id === conn.from);
            const toNode = skillNodes.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;
            
            const isActive = fromNode.status === 'completed' && toNode.status !== 'locked';
            
            return (
              <line 
                key={idx}
                x1={fromNode.x + 24} 
                y1={fromNode.y + 24} 
                x2={toNode.x + 24} 
                y2={toNode.y + 24} 
                stroke={isActive ? '#3B82F6' : '#4B5563'} 
                strokeWidth="3"
                strokeDasharray={isActive ? 'none' : '5,5'}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {skillNodes.map((node) => {
          let bgColor = 'bg-gray-700';
          let borderColor = 'border-gray-600';
          let icon = <Lock size={20} className="text-gray-400" />;
          
          if (node.status === 'completed') {
            bgColor = 'bg-blue-600';
            borderColor = 'border-blue-400';
            icon = <CheckCircle size={20} className="text-white" />;
          } else if (node.status === 'unlocked') {
            bgColor = 'bg-indigo-600';
            borderColor = 'border-indigo-400';
            icon = <Star size={20} className="text-white" />;
          }

          return (
            <div 
              key={node.id}
              className="absolute"
              style={{ left: node.x, top: node.y }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className={`w-12 h-12 rounded-full ${bgColor} border-4 ${borderColor} flex items-center justify-center shadow-lg cursor-pointer z-10 relative`}
              >
                {icon}
              </motion.div>
              
              <div className="absolute top-14 left-1/2 -translate-x-1/2 text-center w-32">
                <p className="text-xs font-bold text-white bg-gray-800/80 px-2 py-1 rounded-md backdrop-blur-sm shadow-sm">
                  {node.title}
                </p>
              </div>

              {/* Tooltip */}
              {hoveredNode === node.id && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 bg-white p-3 rounded-xl shadow-xl z-20 border border-gray-100 pointer-events-none">
                  <h4 className="font-bold text-gray-800 text-sm mb-1">{node.title}</h4>
                  <p className="text-xs text-gray-600 mb-2">{node.desc}</p>
                  {node.status === 'locked' && (
                    <div className="bg-rose-50 p-2 rounded-lg border border-rose-100">
                      <p className="text-[10px] font-bold text-rose-600 uppercase mb-1">เงื่อนไขปลดล็อก:</p>
                      <p className="text-xs text-rose-700">{node.req}</p>
                    </div>
                  )}
                  {node.status === 'unlocked' && (
                    <div className="bg-indigo-50 p-2 rounded-lg border border-indigo-100">
                      <p className="text-[10px] font-bold text-indigo-600 uppercase mb-1">เควสต์แนะนำ:</p>
                      <p className="text-xs text-indigo-700 flex items-center">{node.req} <ArrowRight size={12} className="ml-1"/></p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
