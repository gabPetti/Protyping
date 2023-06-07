import "./navbar.sass";
import { useNavigate } from "react-router-dom";
import TypeIt from "typeit-react";

export default function Navbar() {
  const navigate = useNavigate()

  function navigateToPage(location) {
    navigate(location);
  }

  return (
    <header className="navbarContainer">
      <div className="navbarTop">
        <div className="config">
          <button className="configButton"></button>
        </div>
        <TypeIt element={"h1"} className="logo">Protyping</TypeIt>
        <div className="profile">
          <button onClick={() => navigateToPage("/login")} className="profileButton">Sign In</button>
        </div>
      </div>
      <nav className="navbarBottom">
        <ul>
          <li><a href="" onClick={() => navigateToPage("/casual")}>Casual</a></li>
          <li><a href="" onClick={() => navigateToPage("/ranked")}>Ranked</a></li>
          <li><a href="" onClick={() => navigateToPage("/leaderboards")}>Leaderboards</a></li>
          <li><a href="" onClick={() => navigateToPage("/profile")}>Profile</a></li>
        </ul>
      </nav>
    </header>
  );
}
