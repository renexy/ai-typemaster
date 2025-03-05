import { useState, useEffect } from "react";
import { generateTypingText } from "./services/gemini.service";
import { CircularProgress } from "@mui/material";
import { useUpProvider } from "./services/providers/UPProvider";
import { BeginTest } from "./components/BeginTest/beginTest";
import { TypeTest } from "./components/TypeTest/typeTest";
import Leaderboard from "./components/LeaderBoard.tsx/leaderBoard";

function App() {
  const { contextAccounts } = useUpProvider();
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "">(
    ""
  );
  const [ready, setReady] = useState<boolean>(false);
  const [typingText, setTypingText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);

  useEffect(() => {
    if (contextAccounts && contextAccounts.length > 0) setReady(true);
  }, [contextAccounts]);

  useEffect(() => {
    if (difficulty === "") return;
    const fetchText = async () => {
      if (difficulty) {
        setLoading(true);
        try {
          const text = await generateTypingText({ difficulty });
          setTypingText(text);
        } catch (error) {
          console.error("Error fetching text:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchText();
  }, [difficulty]);

  if (!ready) {
    return (
      <div className="bg-white bg-opacity-95 shadow-lg p-8 rounded-xl h-[600px] w-[500px] relative flex flex-col items-center justify-center">
        <CircularProgress color="secondary" />
        <p className="mt-4 text-[#4F5882]">Loading app</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white bg-opacity-95 shadow-lg p-8 rounded-xl h-[600px] w-[500px] relative flex flex-col items-center justify-center">
        <CircularProgress color="secondary" />
        <p className="mt-4 text-[#4F5882]">Generating your typing test...</p>
      </div>
    );
  }

  if (showLeaderboard) {
    return (
      <div className="bg-white bg-opacity-95 shadow-lg p-6 gap-8 rounded-xl h-[600px] w-[600px] relative flex flex-col animate-fadeInSlideUp">
        <Leaderboard triggerLeaderboard={() => setShowLeaderboard(false)} />
      </div>
    );
  }

  if (!difficulty && ready) {
    return (
      <BeginTest
        onSelectDifficulty={setDifficulty}
        triggerLeaderboard={() => setShowLeaderboard(true)}
      />
    );
  }

  return (
    <TypeTest
      difficulty={difficulty}
      setDifficulty={setDifficulty}
      text={typingText}
      triggerLeaderboard={() => setShowLeaderboard(true)}
    />
  );
}

export default App;
