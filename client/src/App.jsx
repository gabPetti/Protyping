import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import Casual from "./pages/casual/Casual"
import Login from "./pages/login/Login"
import Register from "./pages/register/Register"
import Navbar from "./components/navbar/Navbar"
import "./App.css"

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition key={location.key} timeout={500} classNames="fade">
        <Routes>
          <Route exact path="/casual" element={<Casual />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/leaderboards" element={<Leaderboards />} /> */}
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
};

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <AnimatedRoutes />
      </Router>
    </div>
  )
}

export default App
