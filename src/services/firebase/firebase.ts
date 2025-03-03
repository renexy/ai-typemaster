import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const saveHighScore = async (
  score: {
    wpm: number;
    highScore: number;
    time: number;
    difficulty: string;
  },
  walletAddress: string
) => {
  try {
    const scoresRef = collection(db, "highscores");
    const q = query(scoresRef, where("walletAddress", "==", walletAddress));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const existingScore = querySnapshot.docs[0];
      if (score.highScore > existingScore.data().highScore) {
        await updateDoc(doc(db, "highscores", existingScore.id), {
          ...score,
          timestamp: new Date(),
        });
        return { message: "High score updated!", code: "UPDATED" };
      }
      return {
        message: `Your highest score is: ${existingScore.data().highScore}.`,
        code: "SCORE_LOWER",
      };
    }

    await addDoc(scoresRef, {
      ...score,
      walletAddress,
      timestamp: new Date(),
    });
    return { message: "Score updated!" };
  } catch (error) {
    console.error("Error saving score:", error);
    throw error;
  }
};
