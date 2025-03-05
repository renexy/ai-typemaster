/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
} from "@mui/material";
import { getAllHighScores } from "../../services/firebase/firebase";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useUpProvider } from "../../services/providers/UPProvider";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Leaderboard({ triggerLeaderboard }: any) {
  const [tabValue, setTabValue] = useState(0);
  const [easyScores, setEasyScores] = useState([]);
  const [normalScores, setNormalScores] = useState([]);
  const [hardScores, setHardScores] = useState([]);
  const { accounts } = useUpProvider();

  useEffect(() => {
    const fetchScores = async () => {
      const fetchedScores = await getAllHighScores() as any;

      setEasyScores(
        fetchedScores
          .filter((score: any) => score.difficulty === "easy")
          .sort((a: any, b: any) => b.highScore - a.highScore)
      );
      setNormalScores(
        fetchedScores
          .filter((score: any) => score.difficulty === "medium")
          .sort((a: any, b: any) => b.highScore - a.highScore)
      );
      setHardScores(
        fetchedScores
          .filter((score: any) => score.difficulty === "hard")
          .sort((a: any, b: any) => b.highScore - a.highScore)
      );
    };

    fetchScores();
  }, []);

  const handleTabChange = (event: any, newValue: any) => {
    setTabValue(newValue);
  };

  const renderTable = (scores: any) => (
    <TableContainer component={Paper} sx={{ width: "100%" }} color="secondary">
      <Table sx={{ width: "100%" }} color="secondary">
        <TableHead color="secondary">
          <TableRow color="secondary">
            <TableCell color="secondary">
              <Typography
                variant="button"
                sx={{ color: "#4F5882", fontWeight: "bold" }}
              >
                Rank
              </Typography>
            </TableCell>
            <TableCell color="secondary">
              <Typography
                variant="button"
                sx={{ color: "#4F5882", fontWeight: "bold" }}
              >
                Player
              </Typography>
            </TableCell>
            <TableCell color="secondary">
              <Typography
                variant="button"
                sx={{ color: "#4F5882", fontWeight: "bold" }}
              >
                Score
              </Typography>
            </TableCell>
            <TableCell color="secondary">
              <Typography
                variant="button"
                sx={{ color: "#4F5882", fontWeight: "bold" }}
              >
                WPM
              </Typography>
            </TableCell>
            <TableCell color="secondary">
              <Typography
                variant="button"
                sx={{ color: "#4F5882", fontWeight: "bold" }}
              >
                Time
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody color="secondary">
          {scores.map((score: any, index: number) => (
            <TableRow key={score.walletAddress} color="secondary">
              <TableCell color="secondary">
                <Typography variant="body1" sx={{ color: "#4F5882" }}>
                  {index + 1}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="body1"
                  color="secondary"
                  className={`cursor-pointer underline ${
                    accounts &&
                    accounts.length > 0 &&
                    accounts[0] === score.walletAddress &&
                    "text-[#F69799]"
                  }`}
                >
                  {score.walletAddress
                    ? `${score.walletAddress.substring(
                        0,
                        4
                      )}...${score.walletAddress.substring(
                        score.walletAddress.length - 3
                      )}`
                    : "no address"}
                </Typography>
              </TableCell>
              <TableCell color="secondary">
                <Typography variant="body1" sx={{ color: "#4F5882" }}>
                  {score.highScore}
                </Typography>
              </TableCell>
              <TableCell color="secondary">
                <Typography variant="body1" sx={{ color: "#4F5882" }}>
                  {score.wpm}
                </Typography>
              </TableCell>
              <TableCell color="secondary">
                <Typography variant="body1" sx={{ color: "#4F5882" }}>
                  {score.time}s
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <>
      <div className="flex items-start gap-2">
        <IconButton color="secondary" size="small" onClick={triggerLeaderboard}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ color: "#4F5882", fontWeight: 600 }}>
          Back
        </Typography>
      </div>
      <Tabs
        value={tabValue}
        color="secondary"
        onChange={handleTabChange}
        aria-label="difficulty tabs"
      >
        <Tab label="Easy" color="secondary" sx={{ color: "#4caf50" }} />
        <Tab label="Normal" color="secondary" sx={{ color: "#ff9800" }} />
        <Tab label="Hard" color="secondary" sx={{ color: "#f44336" }} />
      </Tabs>

      {tabValue === 0 && renderTable(easyScores)}
      {tabValue === 1 && renderTable(normalScores)}
      {tabValue === 2 && renderTable(hardScores)}
    </>
  );
}

export default Leaderboard;
