import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import "./Home.css";
import Like from "./Like";
import Movie from "./Movie";
import Nav from "./Nav";
import MovieDetails from "./MovieDetails";
import ActorDetails from "./ActorDetails";
import Search from "./Search";
import NowPlaying from "./NowPlaying";
import Upcoming from "./Upcoming";
import Similar from "./Similar";
import Remove from "./Remove";

function App() {
  return (
    <div className="App">
      <section>
        <Router>
          <Link to="/Home"></Link>
          <Link to="/Like"></Link>
          <Link to="/Search"></Link>
          <Route
            exact
            path="/"
            render={() => {
              return <Redirect to="/Home" />;
            }}
          />
          <Route
            exact
            path="/Home"
            render={() => {
              return (
                <div>
                  <Nav PageTitle={"Movies"} />
                  <Movie />
                </div>
              );
            }}
          />
          <Route
            exact
            path="/Like"
            render={() => {
              return (
                <div>
                  <Nav PageTitle="Like" />
                  <Like />
                </div>
              );
            }}
          />
          <Route
            exact
            path="/Search"
            render={() => {
              return (
                <div>
                  <Nav PageTitle="Search" />
                  <Search />
                </div>
              );
            }}
          />
          <Route
            exact
            path="/Info/:MovieId"
            render={() => {
              return (
                <div>
                  <Nav PageTitle="Info" />
                  <MovieDetails />
                </div>
              );
            }}
          />
          <Route
            path="/People/:ActorId"
            render={() => {
              return (
                <div>
                  <Nav PageTitle="Actor" />
                  <ActorDetails />
                </div>
              );
            }}
          />
          <Route
            path="/NowPlaying"
            render={() => {
              return (
                <div>
                  <Nav PageTitle="Now Playing" />
                  <NowPlaying />
                </div>
              );
            }}
          />
          <Route
            path="/Upcoming"
            render={() => {
              return (
                <div>
                  <Nav PageTitle="Upcoming" />
                  <Upcoming />
                </div>
              );
            }}
          />
          <Route
            exact
            path="/Similar/:MovieId"
            render={() => {
              return (
                <div>
                  <Nav PageTitle="Similar" />
                  <Similar />
                </div>
              );
            }}
          />
          <Route
            exact
            path="/Disliked"
            render={() => {
              return (
                <div>
                  <Nav PageTitle="Disliked" />
                  <Remove />
                </div>
              );
            }}
          />
        </Router>
      </section>
    </div>
  );
}

export default App;
