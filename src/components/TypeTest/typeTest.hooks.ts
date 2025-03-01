/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react';

interface UseTypingTestReturn {
  typed: string;
  wpm: number;
  accuracy: number;
  timer: number;
  isCompleted: boolean;
  handleTyping: (value: string) => void;
  resetTest: () => void;
}

export const useTypingTest = (targetText: string): UseTypingTestReturn => {
  const [typed, setTyped] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timer, setTimer] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [wpm, setWPM] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  // Helper function to normalize text
  const normalizeText = (text: string) => {
    return text
      .trim()
      .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
      .replace(/[\r\n]+/g, ' '); // Replace line breaks with space
  };

  const calculateMetrics = useCallback((currentTyped: string) => {
    if (!startTime) return;

    const timeElapsed = (Date.now() - startTime) / 1000 / 60;
    const words = currentTyped.length / 5;
    const currentWPM = Math.round(words / timeElapsed);
    setWPM(currentWPM);

    const normalizedTyped = normalizeText(currentTyped);
    const normalizedTarget = normalizeText(targetText).slice(0, normalizedTyped.length);

    let correct = 0;
    for (let i = 0; i < normalizedTyped.length; i++) {
      if (normalizedTyped[i] === normalizedTarget[i]) correct++;
    }
    const currentAccuracy = Math.round((correct / normalizedTyped.length) * 100);
    setAccuracy(currentAccuracy);
  }, [startTime, targetText]);

  const handleTyping = useCallback((value: string) => {
    if (!startTime && value.length > 0) {
      setStartTime(Date.now());
    }
    
    setTyped(value);
    calculateMetrics(value);

    // Compare normalized versions of both texts
    const normalizedTyped = normalizeText(value);
    const normalizedTarget = normalizeText(targetText);
    
    if (normalizedTyped === normalizedTarget) {
      setIsCompleted(true);
    }
  }, [startTime, calculateMetrics, targetText]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (startTime && !isCompleted) {
      interval = setInterval(() => {
        setTimer(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [startTime, isCompleted]);

  const resetTest = useCallback(() => {
    setTyped('');
    setStartTime(null);
    setTimer(0);
    setIsCompleted(false);
    setWPM(0);
    setAccuracy(100);
  }, []);

  return {
    typed,
    wpm,
    accuracy,
    timer,
    isCompleted,
    handleTyping,
    resetTest
  };
};