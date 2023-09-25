import "./HomeHeader.css";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <header class="site-header">
  <div class="site-identity">
  <div className="icon">
    <Link to="/">
  <img src="https://raw.githubusercontent.com/nxdun/BlaBla/main/2.png"
          alt="logo"
          className="header-img"/>
          </Link>
  </div> 
  </div> 
  <nav class="site-navigation">
    <ul class="nav">
      <li><a href="#">About</a></li> 
      <li><a href="#">News</a></li> 
      <li><a href="/admindash">Login</a></li> 
    </ul>
  </nav>
</header>
  );
};

export default Header;
