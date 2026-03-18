export type Role = "student" | "coach" | "parent" | "studio";

export interface User {
  id?: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  level?: number;
  xp?: number;
  skills?: Record<string, number>; // e.g., { "critical_thinking": 10, "coding": 5 }
  parentId?: string; // For student to link to parent
  coachId?: string; // For student to link to coach
}

export interface Quest {
  id?: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard" | "Epic";
  xpReward: number;
  skillsRewarded: string[];
  creatorId: string;
  status: "draft" | "published" | "archived";
  type: "solo" | "co-op";
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  estimatedMinutes?: number;
  plays?: number;
}

export interface UserQuest {
  id?: string;
  userId: string;
  questId: string;
  status: "active" | "completed" | "failed";
  progress: number; // 0 to 100
  startedAt: string;
  completedAt?: string;
}

export interface AnonymousPost {
  id?: string;
  content: string;
  authorId?: string; // Can be null or hashed for true anonymity
  createdAt: string;
  likes: number;
  tags: string[];
}

export interface PortfolioItem {
  id?: string;
  userId: string;
  title: string;
  description: string;
  questId?: string;
  imageUrl?: string;
  link?: string;
  createdAt: string;
}

export interface Skill {
  id?: string;
  name: string;
  category: string;
  description: string;
  icon?: string;
}
