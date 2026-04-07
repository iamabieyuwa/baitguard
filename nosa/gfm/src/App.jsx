import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import GetInvolved from "./pages/GetInvolved";
import "./styles/index.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/get-involved" element={<GetInvolved />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
