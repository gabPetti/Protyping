import "./navbar.sass";

export default function Navbar() {
  return (
    <header className="navbarContainer">
      <div className="navbarTop">
        <h1 className="logo">Protyping</h1>
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
