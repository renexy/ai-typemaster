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
} from "@mui/material";
import { getAllHighScores } from "../../services/firebase/firebase";

function Leaderboard() {
  const [tabValue, setTabValue] = useState(0);
  const [easyScores, setEasyScores] = useState([]);
  const [normalScores, setNormalScores] = useState([]);
  const [hardScores, setHardScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      const fetchedScores = await getAllHighScores();

      setEasyScores(
        fetchedScores
          .filter((score) => score.difficulty === "easy")
          .sort((a, b) => b.highScore - a.highScore)
      );
      setNormalScores(
        fetchedScores
          .filter((score) => score.difficulty === "medium")
          .sort((a, b) => b.highScore - a.highScore)
      );
      setHardScores(
        fetchedScores
          .filter((score) => score.difficulty === "hard")
          .sort((a, b) => b.highScore - a.highScore)
      );
    };

    fetchScores();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const renderTable = (scores) => (
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
                sx={{ color: "#4F5882", fontWeight: "bold"}}
              >
                Score
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody color="secondary">
          {scores.map((score, index) => (
            <TableRow key={score.walletAddress} color="secondary">
              <TableCell color="secondary">
                <Typography
                  variant="body1"
                  sx={{ color: "#4F5882" }}
                >
                  {index + 1}
                </Typography>
              </TableCell>
              <TableCell color="secondary">
                <Typography
                  variant="body1"
                  sx={{ color: "#4F5882" }}
                >
                  {score.walletAddress.substring(0, 3) + '...' + score.walletAddress.substring(score.walletAddress.length, score.walletAddres.length-3)}
                </Typography>
              </TableCell>
              <TableCell color="secondary">
                <Typography
                  variant="body1"
                  sx={{ color: "#4F5882" }}
                >
                  {score.highScore}
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
      <Tabs
        value={tabValue}
        color="secondary"
        onChange={handleTabChange}
        aria-label="difficulty tabs"
      >
        <Tab label="Easy" color="secondary" />
        <Tab label="Normal" color="secondary" />
        <Tab label="Hard" color="secondary" />
      </Tabs>

      {tabValue === 0 && renderTable(easyScores)}
      {tabValue === 1 && renderTable(normalScores)}
      {tabValue === 2 && renderTable(hardScores)}
    </>
  );
}

export default Leaderboard;
