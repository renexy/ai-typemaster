import {
  Typography,
  IconButton,
  Paper,
  TextField,
  Card,
  CardContent,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useTypingTest } from "./typeTest.hooks";
import { useUpProvider } from "../../services/providers/UPProvider";
import NFTWon from "../nftWon";

export const TypeTest = ({
  difficulty,
  setDifficulty,
  text,
  triggerLeaderboard,
}: {
  difficulty: "easy" | "medium" | "hard" | "";
  setDifficulty: (difficulty: "easy" | "medium" | "hard" | "") => void;
  text: string;
  triggerLeaderboard: () => void;
}) => {
  const {
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
  } = useTypingTest(text, difficulty, triggerLeaderboard);
  const { accounts } = useUpProvider();

  if (loadingScores) {
    return (
      <div className="bg-white bg-opacity-95 shadow-lg p-8 rounded-xl h-[600px] w-[500px] relative flex flex-col items-center justify-center animate-fadeInSlideUp">
        <CircularProgress color="secondary" />
        <p className="mt-4 text-[#4F5882]">Loading high scores....</p>
      </div>
    );
  }

  if (wonNFT) {
    return (
      <div className="bg-white bg-opacity-95 shadow-lg p-8 rounded-xl h-[600px] w-[500px] relative flex flex-col items-center justify-center animate-fadeInSlideUp">
        <NFTWon difficulty={difficulty}/>
      </div>
    );
  }

  return (
    <div className="bg-white bg-opacity-95 shadow-lg p-8 rounded-xl h-[auto] w-[500px] relative flex flex-col animate-fadeInSlideUp">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <IconButton
            color="secondary"
            size="small"
            onClick={() => setDifficulty("")}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" sx={{ color: "#4F5882", fontWeight: 600 }}>
            TypeMaster
          </Typography>
        </div>
        <div className="flex items-center gap-2">
          <Box
            sx={{
              backgroundColor:
                difficulty === "easy"
                  ? "#4caf5020"
                  : difficulty === "medium"
                  ? "#ff980020"
                  : "#f4433620",
              color:
                difficulty === "easy"
                  ? "#4caf50"
                  : difficulty === "medium"
                  ? "#ff9800"
                  : "#f44336",
              px: 2,
              py: 0.5,
              borderRadius: "1rem",
              fontSize: "0.875rem",
              textTransform: "capitalize",
            }}
          >
            {difficulty}
          </Box>
          <IconButton color="secondary" size="small" onClick={resetTest}>
            <RestartAltIcon />
          </IconButton>
        </div>
      </div>

      <Paper elevation={0} className="bg-gray-50 rounded-lg mb-8">
        <Typography
          variant="body1"
          className="leading-relaxed whitespace-pre-wrap"
          sx={{
            color: "#4F5882",
            opacity: 0.9,
            fontFamily: "monospace",
            userSelect: "none",
            WebkitUserSelect: "none",
            MozUserSelect: "none",
            msUserSelect: "none",
            cursor: "default",
          }}
        >
          {text}
        </Typography>
      </Paper>

      <TextField
        fullWidth
        variant="outlined"
        color="secondary"
        placeholder="Start typing here..."
        className="mb-8"
        multiline
        rows={3}
        disabled={inputDisabled}
        value={typed}
        onChange={(e) => handleTyping(e.target.value)}
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "white",
          },
        }}
      />

      <div className="flex justify-between my-10">
        <Card className="flex-1 mx-2 first:ml-0 last:mr-0 bg-gray-50">
          <CardContent className="text-center p-3 !pb-3">
            <Typography variant="h6" sx={{ color: "#4F5882" }}>
              {wpm}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#4F5882", opacity: 0.7 }}
            >
              WPM
            </Typography>
          </CardContent>
        </Card>
        <Card className="flex-1 mx-2 bg-gray-50">
          <CardContent className="text-center p-3 !pb-3">
            <Typography variant="h6" sx={{ color: "#4F5882" }}>
              {accuracy}%
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#4F5882", opacity: 0.7 }}
            >
              Accuracy
            </Typography>
          </CardContent>
        </Card>
        <Card
          className="flex-1 mx-2 bg-gray-50"
          sx={{
            backgroundColor: isCompleted ? "#e8f5e9" : "inherit",
          }}
        >
          <CardContent className="text-center p-3 !pb-3">
            <Typography variant="h6" sx={{ color: "#4F5882" }}>
              {timer.toFixed(1)}s
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#4F5882", opacity: 0.7 }}
            >
              Time
            </Typography>
          </CardContent>
        </Card>
      </div>

      <div className="flex w-full flex-col gap-[12px]">
        <Button
          variant="contained"
          color="secondary"
          className="mt-auto"
          fullWidth
          onClick={resetTest}
        >
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            Reset
          </Typography>
        </Button>
        {(!accounts || accounts.length < 1) && isCompleted && (
          <Typography
            variant="h5"
            color="secondary"
            sx={{ fontWeight: 600, textAlign: "center" }}
          >
            Connect wallet to submit!
          </Typography>
        )}
        {accounts && accounts.length > 0 && isCompleted && (
          <Button
            variant="contained"
            color="secondary"
            className="mt-auto"
            fullWidth
            onClick={checkHighscores}
          >
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              Check & Submit high score!
            </Typography>
          </Button>
        )}
      </div>
    </div>
  );
};
