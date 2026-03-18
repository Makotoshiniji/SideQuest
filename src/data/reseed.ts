import { collection, query, where, getDocs, deleteDoc, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { sampleQuests } from "./seedQuests";

export async function reseedSampleQuests() {
  try {
    console.log(" MIGRATION SCRIPT STARTED ".padStart(40, "=").padEnd(80, "="));
    console.log("🔥 1. Deleting old sample quests...");
    const questsRef = collection(db, "quests");
    const q = query(questsRef, where("creatorId", "==", "seed-creator"));
    const existingQuests = await getDocs(q);

    if (existingQuests.size > 0) {
      console.log(`Found ${existingQuests.size} old quests to delete.`);
      for (const doc of existingQuests.docs) {
        console.log(`  - Deleting quest with ID: ${doc.id} and title: "${doc.data().title}"`);
        await deleteDoc(doc.ref);
      }
      console.log("✅ Successfully deleted old sample quests.");
    } else {
      console.log("👍 No old sample quests with creatorId 'seed-creator' found.");
    }

    console.log("
🌱 2. Seeding new sample quests...");
    let successCount = 0;
    for (const questData of sampleQuests) {
      try {
        const docRef = await addDoc(questsRef, {
          ...questData,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`  - Created quest: "${questData.title}" (ID: ${docRef.id})`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to create quest "${questData.title}":`, error);
      }
    }
    console.log(`✅ Successfully seeded ${successCount}/${sampleQuests.length} new quests.`);
    console.log(" MIGRATION SCRIPT FINISHED ".padStart(40, "=").padEnd(80, "="));
    
  } catch (error) {
    console.error("❌ An error occurred during the migration process:", error);
    throw error;
  }
}
