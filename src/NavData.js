import React from "react";
import Home from "./Img/home.png";
import Like from "./Img/like.png";
import Search from "./Img/loupe.png";

export const SidebarData = [
  {
    title: "Home",
    path: "/",
    icon: <img src={Home} className="Icon" />,
    cName: "nav-text",
  },
  {
    title: "Like",
    path: "/Like",
    icon: <img src={Like} className="Icon" />,
    cName: "nav-text",
  },
  {
    title: "Search",
    path: "/Search",
    icon: <img src={Search} className="Icon" />,
    cName: "nav-text",
  },
];
