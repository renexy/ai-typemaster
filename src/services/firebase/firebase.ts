/* eslint-disable @typescript-eslint/no-explicit-any */
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
      const scores = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const existingScore = scores.find(
        (s: any) => s.difficulty === score.difficulty
      ) as any;

      if (existingScore) {
        if (score.highScore > existingScore.highScore) {
          await updateDoc(doc(db, "highscores", existingScore.id), {
            ...score,
            timestamp: new Date(),
          });
          return { message: "High score updated!", code: "UPDATED" };
        } else {
          return {
            message: `Your highest score is: ${
              existingScore.highScore
            }.`,
            code: "SCORE_LOWER",
          };
        }
      }
    }

    await addDoc(scoresRef, {
      ...score,
      walletAddress,
      timestamp: new Date(),
    });
    return { message: "Score updated!", code: "UPDATED" };
  } catch (error) {
    console.error("Error saving score:", error);
    throw error;
  }
};

export const getAllHighScores = async () => {
  try {
    const scoresRef = collection(db, "highscores");
    const querySnapshot = await getDocs(scoresRef);

    if (!querySnapshot.empty) {
      const highScores = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return highScores; // Return an array of high score objects
    }
    return []; // Return an empty array if no scores are found
  } catch (error) {
    console.error("Error retrieving high scores:", error);
    throw error;
  }
};

export const getDifficultyHighscores = async (
  difficulty: "easy" | "medium" | "hard" | ""
) => {
  try {
    const scoresRef = collection(db, "highscores");
    const querySnapshot = await getDocs(scoresRef);

    if (!querySnapshot.empty) {
      const highScores = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const filteredResults = highScores
        .filter((h: any) => h.difficulty === difficulty)
        .sort((a: any, b: any) => b.highScore - a.highScore);
      return filteredResults; // Return an array of high score objects
    }
    return []; // Return an empty array if no scores are found
  } catch (error) {
    console.error("Error retrieving high scores:", error);
    throw error;
  }
};
