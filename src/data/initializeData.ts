/**
 * Seed script to initialize 5 sample quests in Firestore
 * Run this from the console when authenticated
 *
 * Usage in browser console:
 * import { seedQuests } from './data/seedQuests.ts'
 * OR run this in a Node.js environment with Firebase Admin SDK
 */

import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { sampleQuests } from "./seedQuests";

export async function initializeSampleQuests() {
  try {
    console.log("🌱 Starting to seed 5 sample quests...");

    // Check if quests already exist
    const questsRef = collection(db, "quests");
    const q = query(questsRef, where("creatorId", "==", "seed-creator"));
    const existingQuests = await getDocs(q);

    if (existingQuests.size > 0) {
      console.log(
        `✅ Sample quests already exist (${existingQuests.size} quests found). Skipping seed.`,
      );
      return;
    }

    // Add each sample quest
    let successCount = 0;
    for (const questData of sampleQuests) {
      try {
        const docRef = await addDoc(questsRef, {
          ...questData,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(
          `✅ Created quest: "${questData.title}" (ID: ${docRef.id})`,
        );
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to create quest "${questData.title}":`, error);
      }
    }

    console.log(
      `\n🎉 Successfully seeded ${successCount}/${sampleQuests.length} quests!`,
    );
    return successCount;
  } catch (error) {
    console.error("❌ Error seeding quests:", error);
    throw error;
  }
}

// For browser console: you can call this directly
// For Node.js: export the function
export default initializeSampleQuests;
