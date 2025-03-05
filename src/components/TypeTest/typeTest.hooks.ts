/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { useUpProvider } from "../../services/providers/UPProvider";
import {
  getDifficultyHighscores,
  saveHighScore,
} from "../../services/firebase/firebase";
import { claimTokenForProfile } from "../../services/web3/Interactions";

interface UseTypingTestReturn {
  typed: string;
  wpm: number;
  accuracy: number;
  timer: number;
  isCompleted: boolean;
  handleTyping: (value: string) => void;
  resetTest: () => void;
  inputDisabled: boolean;
  checkHighscores: () => void;
  triggerLeaderboard?: () => void;
  loadingScores: boolean;
  wonNFT: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useTypingTest = (
  targetText: string,
  difficulty: "easy" | "medium" | "hard" | "",
  triggerLeaderboard: any
): UseTypingTestReturn => {
  const { accounts, client, chainId } = useUpProvider();
  const [typed, setTyped] = useState("");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timer, setTimer] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [wpm, setWPM] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);
  const [loadingScores, setLoadingScores] = useState<boolean>(false);
  const [wonNFT, setWonNFT] = useState<boolean>(false);

  // Helper function to normalize text
  const normalizeText = (text: string) => {
    return text
      .trim()
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .replace(/[\r\n]+/g, " "); // Replace line breaks with space
  };

  const calculateMetrics = useCallback(
    (currentTyped: string) => {
      if (!startTime) return;

      const timeElapsed = (Date.now() - startTime) / 1000 / 60;
      const words = currentTyped.length / 5;
      const currentWPM = Math.round(words / timeElapsed);
      setWPM(currentWPM);

      const normalizedTyped = normalizeText(currentTyped);
      const normalizedTarget = normalizeText(targetText).slice(
        0,
        normalizedTyped.length
      );

      let correct = 0;
      for (let i = 0; i < normalizedTyped.length; i++) {
        if (normalizedTyped[i] === normalizedTarget[i]) correct++;
      }
      const currentAccuracy = Math.round(
        (correct / normalizedTyped.length) * 100
      );
      setAccuracy(currentAccuracy);
    },
    [startTime, targetText]
  );

  const handleTyping = useCallback(
    (value: string) => {
      if (!startTime && value.length > 0) {
        setStartTime(Date.now());
      }

      setTyped(value);
      calculateMetrics(value);

      // Compare normalized versions of both texts
      const normalizedTyped = normalizeText(value);
      const normalizedTarget = normalizeText(targetText);

      if (wpm === 0 || wpm > 160) {
        window.location.reload();
        return;
      }

      if (normalizedTyped === normalizedTarget) {
        setIsCompleted(true);
        setInputDisabled(true);
      }
    },
    [startTime, calculateMetrics, targetText]
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let counter = 0; // Internal counter to track time

    if (startTime && !isCompleted) {
      interval = setInterval(() => {
        counter += 0.1; // Increment by 0.1 seconds
        setTimer(Number(counter.toFixed(1))); // Set with 1 decimal place
      }, 100); // Update every 100ms
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [startTime, isCompleted]);

  const checkHighscores = async () => {
    try {
      setLoadingScores(true);
      const highScore = +(Math.pow(wpm, 2) * Math.log(timer + 1)).toFixed(0);

      const res = (await getDifficultyHighscores(difficulty)) as any;
      const isWinner = res.length < 1 || highScore > res[0].highScore;
      const result = await saveHighScore(
        { wpm: wpm, highScore: highScore, time: timer, difficulty: difficulty },
        accounts[0]
      );
      if (result.code === "UPDATED") {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }

      if (isWinner) {
        // call for sign transaction
        await claimTokenForProfile(difficulty === 'easy' ? 0 : difficulty === 'medium' ?  1 : 2, highScore, client, accounts[0], chainId);
        setWonNFT(true);
      } else {
        triggerLeaderboard();
      }

      setLoadingScores(false);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to save score");
    }
  };

  const resetTest = useCallback(() => {
    setTyped("");
    setStartTime(null);
    setTimer(0);
    setIsCompleted(false);
    setWPM(0);
    setAccuracy(100);
    setInputDisabled(false);
  }, []);

  return {
    typed,
    wpm,
    accuracy,
    timer,
    isCompleted,
    handleTyping,
    resetTest,
    inputDisabled,
    checkHighscores,
    loadingScores,
    wonNFT,
  };
};
