import React from "react";
import Home from "./Img/home.png";
import Like from "./Img/like.png";
import Dislike from "./Img/dislike.png";
import Search from "./Img/loupe.png";
import Play from "./Img/play.png";
import Upcoming from "./Img/clapperboard.png";

export const SidebarData = [
  {
    title: "Home",
    path: "/",
    icon: <img src={Home} className="Icon" alt="Icon" />,
    cName: "nav-text",
  },
  {
    title: "Like",
    path: "/Like",
    icon: <img src={Like} className="Icon" alt="Icon" />,
    cName: "nav-text",
  },
  {
    title: "Disliked",
    path: "/Disliked",
    icon: <img src={Dislike} className="Icon" alt="Icon" />,
    cName: "nav-text",
  },
  {
    title: "Search",
    path: "/Search",
    icon: <img src={Search} className="Icon" alt="Icon" />,
    cName: "nav-text",
  },
  {
    title: "Now Playing",
    path: "/NowPlaying",
    icon: <img src={Play} className="Icon" alt="Icon" />,
    cName: "nav-text",
  },
  {
    title: "Upcoming",
    path: "/Upcoming",
    icon: <img src={Upcoming} className="Icon" alt="Icon" />,
    cName: "nav-text",
  },
];
