import { Users, TrendingUp, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
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
import { getUserProfile } from "../services/db";
import { User } from "../types/db";
import React from "react";

// Mock students data - in production, this would come from database
const mockStudents: (User & {
  questsCompleted: number;
  lastActivityDate: string;
})[] = [
  {
    id: "1",
    name: "สมชาย ใจดี",
    email: "somchai@school.com",
    role: "student",
    level: 5,
    xp: 4500,
    skills: {
      creative: 65,
      critical: 72,
      communication: 58,
      collaboration: 70,
    },
    createdAt: new Date().toISOString(),
    questsCompleted: 12,
    lastActivityDate: "2025-03-14",
  },
  {
    id: "2",
    name: "สมหญิง รักเรียน",
    email: "somying@school.com",
    role: "student",
    level: 4,
    xp: 3200,
    skills: {
      creative: 58,
      critical: 65,
      communication: 72,
      collaboration: 60,
    },
    createdAt: new Date().toISOString(),
    questsCompleted: 8,
    lastActivityDate: "2025-03-15",
  },
  {
    id: "3",
    name: "มานี มีนา",
    email: "mani@school.com",
    role: "student",
    level: 2,
    xp: 1500,
    skills: {
      creative: 45,
      critical: 52,
      communication: 48,
      collaboration: 50,
    },
    createdAt: new Date().toISOString(),
    questsCompleted: 2,
    lastActivityDate: "2025-03-10",
  },
  {
    id: "4",
    name: "ปิติ ปิติ",
    email: "piti@school.com",
    role: "student",
    level: 6,
    xp: 5800,
    skills: {
      creative: 78,
      critical: 80,
      communication: 75,
      collaboration: 82,
    },
    createdAt: new Date().toISOString(),
    questsCompleted: 15,
    lastActivityDate: "2025-03-15",
  },
];

export default function CoachDashboard() {
  const [teacher, setTeacher] = React.useState<User | null>(null);
  const [students, setStudents] = React.useState(mockStudents);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile = await getUserProfile(firebaseUser.uid);
          setTeacher(profile);
        } catch (error) {
          console.error("Error fetching teacher profile:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getRadarData = (skills: Record<string, number> | undefined) => {
    return [
      { subject: "Creativity", A: skills?.creative || 20, fullMark: 100 },
      {
        subject: "Critical Thinking",
        A: skills?.critical || 20,
        fullMark: 100,
      },
      {
        subject: "Communication",
        A: skills?.communication || 20,
        fullMark: 100,
      },
      {
        subject: "Collaboration",
        A: skills?.collaboration || 20,
        fullMark: 100,
      },
    ];
  };

  const getTeacherInitials = (name: string | undefined) => {
    if (!name) return "TC";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Kanit']">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Users className="text-indigo-600" size={32} />
            <div>
              <h1 className="text-3xl font-bold text-gray-800 font-['Fredoka']">
                แดชบอร์ดครู
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                ดูข้อมูล Skill Radar ของนักเรียนในชั้นเรียน
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800">
                {teacher?.name || "ครู"}
              </p>
              <p className="text-xs text-gray-500">แนะแนว</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-lg shadow-inner">
              {getTeacherInitials(teacher?.name)}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Toolbar */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex-1 mr-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="ค้นหานักเรียน..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
          <Link
            to="/builder"
            className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold transition-colors shadow-sm"
          >
            <Plus size={20} className="mr-2" />
            สร้างเควสต์
          </Link>
        </div>

        {/* Students Grid */}
        {filteredStudents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Student Header */}
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .substring(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">
                          {student.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Level {student.level}
                        </p>
                      </div>
                    </div>
                    <TrendingUp className="text-green-500" size={20} />
                  </div>
                </div>

                {/* Skill Radar */}
                <div className="p-6">
                  <h4 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">
                    Skill Radar
                  </h4>
                  <div
                    className="h-80 -mx-2"
                    style={{
                      minHeight: "320px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart
                        cx="50%"
                        cy="50%"
                        outerRadius="60%"
                        data={getRadarData(student.skills)}
                      >
                        <PolarGrid stroke="#E5E7EB" />
                        <PolarAngleAxis
                          dataKey="subject"
                          tick={{
                            fill: "#6B7280",
                            fontSize: 10,
                            fontFamily: "Kanit",
                          }}
                        />
                        <PolarRadiusAxis
                          angle={90}
                          domain={[0, 100]}
                          tick={false}
                          axisLine={false}
                        />
                        <Radar
                          name="Skills"
                          dataKey="A"
                          stroke="#4F46E5"
                          fill="#4F46E5"
                          fillOpacity={0.3}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Stats */}
                <div className="bg-gray-50 p-4 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        เควสต์ที่สำเร็จ
                      </p>
                      <p className="text-lg font-bold text-gray-800">
                        {student.questsCompleted}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">XP</p>
                      <p className="text-lg font-bold text-gray-800">
                        {student.xp}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Last active: {student.lastActivityDate}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">ไม่พบนักเรียน</p>
            <p className="text-gray-400 text-sm">ลองค้นหาด้วยชื่ออื่น</p>
          </div>
        )}
      </main>
    </div>
  );
}
