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
                  <h1 className="Title">Search</h1>
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
        </Router>
      </section>
    </div>
  );
}

export default App;
