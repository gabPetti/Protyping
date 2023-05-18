import { BrowserRouter, Routes, Route } from "react-router-dom";
import Casual from "./pages/casual/Casual"
import "./App.css"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Casual />} />
          {/* <Route path="/login" element={<Login />} /> */}
          {/* <Route path="/register" element={<Register />} /> */}
          {/* <Route path="/leaderboards" element={<Leaderboards />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
