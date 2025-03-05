import { Typography, Card, CardContent, Box } from "@mui/material";
import SpeedIcon from "@mui/icons-material/Speed";

interface BeginTestProps {
  onSelectDifficulty: (difficulty: "easy" | "medium" | "hard") => void;
  triggerLeaderboard: () => void;
}

export const BeginTest = ({ onSelectDifficulty, triggerLeaderboard }: BeginTestProps) => {
  const difficulties = [
    {
      level: "easy",
      description: "Simple words and short sentences",
      color: "#4caf50",
      words: "15-20 words",
    },
    {
      level: "medium",
      description: "Mixed vocabulary and punctuation",
      color: "#ff9800",
      words: "25-30 words",
    },
    {
      level: "hard",
      description: "Complex sentences and paragraphs",
      color: "#f44336",
      words: "35-40 words",
    },
  ];

  return (
    <div className="bg-white bg-opacity-95 shadow-lg p-6 rounded-xl h-[650px] w-[500px] relative flex flex-col animate-fadeInSlideUp">
      <div className="text-center mb-8">
        <SpeedIcon sx={{ fontSize: 40, color: "#4F5882", mb: 2 }} />
        <Typography
          variant="h4"
          sx={{ color: "#4F5882", fontWeight: 600, mb: 1 }}
        >
          AI TypeMaster
        </Typography>
        <Typography variant="body1" sx={{ color: "#4F5882", opacity: 0.8 }}>
          Test your typing speed and accuracy
        </Typography>
      </div>

      <div className="flex flex-col gap-4">
        <Typography
          variant="body2"
          className="text-center mt-6"
          sx={{ color: "#4F5882", opacity: 0.7 }}
        >
          Select a difficulty level to begin
        </Typography>
        <div className="flex flex-col gap-4 flex-1">
          {difficulties.map((diff) => (
            <Card
              key={diff.level}
              className="transition-transform hover:scale-102 cursor-pointer"
              onClick={() =>
                onSelectDifficulty(diff.level as "easy" | "medium" | "hard")
              }
              sx={{
                border: `1px solid ${diff.color}`,
                "&:hover": {
                  boxShadow: `0 0 10px ${diff.color}40`,
                },
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#4F5882",
                      textTransform: "capitalize",
                      fontWeight: 600,
                    }}
                  >
                    {diff.level}
                  </Typography>
                  <Box
                    sx={{
                      backgroundColor: `${diff.color}20`,
                      color: diff.color,
                      px: 2,
                      py: 0.5,
                      borderRadius: "1rem",
                      fontSize: "0.875rem",
                    }}
                  >
                    {diff.words}
                  </Box>
                </div>
                <Typography
                  variant="body2"
                  sx={{ color: "#4F5882", opacity: 0.8 }}
                >
                  {diff.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
        <Typography
          variant="h5"
          onClick={triggerLeaderboard}
          className="text-center mt-6"
          sx={{ color: "#4F5882", fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer' }}
        >
          <a>Or view leaderboard</a>
        </Typography>
      </div>
    </div>
  );
};
