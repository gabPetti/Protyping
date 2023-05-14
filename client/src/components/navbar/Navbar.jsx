import "./navbar.sass";
import TypeIt from "typeit-react";


export default function Navbar() {
  return (
    <header className="navbarContainer">
      <div className="navbarTop">
        <TypeIt className="logo">Protyping</TypeIt>
      </div>
      <nav className="navbarBottom">
        <ul>
          <li><a href="">Casual</a></li>
          <li><a href="">Ranked</a></li>
          <li><a href="">Leaderboards</a></li>
          <li><a href="">Profile</a></li>
        </ul>
      </nav>
    </header>
  );
}
