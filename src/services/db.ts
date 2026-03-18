import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  query,
  where,
  updateDoc,
  serverTimestamp,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  User,
  Quest,
  UserQuest,
  AnonymousPost,
  PortfolioItem,
} from "../types/db";

// ==============================
// USERS
// ==============================

export const getUserProfile = async (userId: string): Promise<User | null> => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as User;
  }
  return null;
};

export const updateUserProfile = async (
  userId: string,
  data: Partial<User>,
) => {
  const docRef = doc(db, "users", userId);
  await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
};

// ==============================
// QUESTS
// ==============================

export const createQuest = async (
  questData: Omit<Quest, "id" | "createdAt" | "updatedAt">,
) => {
  const questsRef = collection(db, "quests");
  const docRef = await addDoc(questsRef, {
    ...questData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return docRef.id;
};

export const getPublishedQuests = async (): Promise<Quest[]> => {
  const questsRef = collection(db, "quests");
  const q = query(questsRef, where("status", "==", "published"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }) as Quest)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
};

export const getQuestById = async (questId: string): Promise<Quest | null> => {
  const docRef = doc(db, "quests", questId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Quest;
  }
  return null;
};

export const getQuestsByCreator = async (
  creatorId: string,
): Promise<Quest[]> => {
  const questsRef = collection(db, "quests");
  const q = query(questsRef, where("creatorId", "==", creatorId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }) as Quest)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
};

// ==============================
// USER QUESTS (PROGRESS)
// ==============================

export const startQuest = async (userId: string, questId: string) => {
  const userQuestsRef = collection(db, "user_quests");
  const docRef = await addDoc(userQuestsRef, {
    userId,
    questId,
    status: "active",
    progress: 0,
    startedAt: new Date().toISOString(),
  });
  return docRef.id;
};

export const updateQuestProgress = async (
  userQuestId: string,
  progress: number,
  status: "active" | "completed" | "failed" = "active",
) => {
  const docRef = doc(db, "user_quests", userQuestId);
  const updateData: any = { progress, status };
  if (status === "completed") {
    updateData.completedAt = new Date().toISOString();
  }
  await updateDoc(docRef, updateData);
};

export const getUserActiveQuests = async (
  userId: string,
): Promise<UserQuest[]> => {
  const userQuestsRef = collection(db, "user_quests");
  const q = query(
    userQuestsRef,
    where("userId", "==", userId),
    where("status", "==", "active"),
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as UserQuest,
  );
};

// ==============================
// ANONYMOUS POSTS
// ==============================

export const createAnonymousPost = async (
  content: string,
  tags: string[] = [],
) => {
  const postsRef = collection(db, "anonymous_posts");
  const docRef = await addDoc(postsRef, {
    content,
    tags,
    likes: 0,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
};

export const getRecentAnonymousPosts = async (
  maxLimit: number = 20,
): Promise<AnonymousPost[]> => {
  const postsRef = collection(db, "anonymous_posts");
  const q = query(postsRef, orderBy("createdAt", "desc"), limit(maxLimit));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as AnonymousPost,
  );
};

// ==============================
// PORTFOLIO
// ==============================

export const addPortfolioItem = async (
  item: Omit<PortfolioItem, "id" | "createdAt">,
) => {
  const portfolioRef = collection(db, "portfolios");
  const docRef = await addDoc(portfolioRef, {
    ...item,
    createdAt: new Date().toISOString(),
  });
  return docRef.id;
};

export const getUserPortfolio = async (
  userId: string,
): Promise<PortfolioItem[]> => {
  const portfolioRef = collection(db, "portfolios");
  const q = query(portfolioRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }) as PortfolioItem)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
};
