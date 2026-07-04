import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "@/pages/Home";
import LevelDetail from "@/pages/LevelDetail";
import Game from "@/pages/Game";
import RoundResult from "@/pages/RoundResult";
import Settlement from "@/pages/Settlement";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/level" element={<LevelDetail />} />
        <Route path="/game" element={<Game />} />
        <Route path="/round-result" element={<RoundResult />} />
        <Route path="/settlement" element={<Settlement />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
