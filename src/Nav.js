import { Link } from "react-router-dom";
import "./Nav.css";
import Menu from "./Img/menu.png";
import Cancel from "./Img/cancel.png";
import { useState } from "react";
import { SidebarData } from "./NavData";

function Nav(props) {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);
  return (
    <>
      <div className="navbar">
        <Link to="#" className="menu-bars">
          <img
            className="BttnImg"
            src={Menu}
            onClick={showSidebar}
            alt="ButtonImage"
          />
        </Link>
        <h1 className="PageTitle">{props.PageTitle}</h1>
      </div>
      <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
        <ul className="nav-menu-items">
          <li className="navbar-toggle">
            <Link to="#" className="menu-bars">
              <img
                className="BttnImg"
                src={Cancel}
                onClick={showSidebar}
                alt="ButtonIcon"
              />
            </Link>
          </li>
          {SidebarData.map((item, i) => {
            return (
              <li key={i} className={item.cName}>
                <Link to={item.path}>
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}

export default Nav;
