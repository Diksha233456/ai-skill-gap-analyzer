import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ResumeUpload from "./pages/ResumeUpload";
import CodingStats from "./pages/CodingStats";
import Analysis from "./pages/Analysis";
import TechExplorer from "./pages/TechExplorer";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/resume" element={<ResumeUpload />} />
        <Route path="/coding" element={<CodingStats />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/explore" element={<TechExplorer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;