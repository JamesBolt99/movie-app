import "./Search.css";
import React, { Component } from "react";
import { Link, Route } from "react-router-dom";

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Search: "",
      Movie: [],
      Person: [],
      SearchId: 0,
      SearchVal: [{ searchBy: "movie" }, { searchBy: "person" }],
      SearchIdSubmit: null,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDetails = this.handleDetails.bind(this);
    this.GetImage = this.GetImage.bind(this);
  }
  handleChange(e) {
    this.setState({ Search: e.target.value });
  }
  handleSubmit(e) {
    e.preventDefault();
    this.API();
  }
  async API() {
    const key = "c34103da5fd71089818f7dce45ac6a4f";
    const url =
      "https://api.themoviedb.org/3/search/" +
      this.state.SearchVal[this.state.SearchId].searchBy +
      "?api_key=" +
      key +
      "&language=en-gb&query=" +
      encodeURI(this.state.Search) +
      "&page=1&include_adult=false";
    console.log(url);
    const response = await fetch(url);
    const data = await response.json();
    if (this.state.SearchId === 0) {
      this.setState({
        Movie: data,
        SearchIdSubmit: 0,
        Person: [],
      });
      console.log(this.state.Movie);
    } else {
      this.setState({
        Person: data,
        SearchIdSubmit: 1,
        Movie: [],
      });
      console.log(this.state.Person);
    }
  }
  handleDetails(i, Id) {
    const { Movie, Person } = this.state;
    if (Id === 0) {
      <Route path={"/" + Movie.results[i].id} />;
    } else {
      <Route path={"/" + Person.results[i].id} />;
    }
  }
  GetImage(Location) {
    return "https://image.tmdb.org/t/p/w500" + Location;
  }
  GetSearch(Id) {
    this.setState({ SearchId: Id });
  }
  render() {
    return (
      <div>
        <div>
          <div className="MovieBtn">
            <button
              className={this.state.SearchId === 1 ? "SearchBtn" : "SearchBtnS"}
              onClick={() => this.GetSearch(0)}
            >
              Movie
            </button>
          </div>
          <div className="PeopleBtn">
            <button
              className={this.state.SearchId === 0 ? "SearchBtn" : "SearchBtnS"}
              onClick={() => this.GetSearch(1)}
            >
              People
            </button>
          </div>
          <form onSubmit={this.handleSubmit}>
            <input
              className="SearchBox"
              type="text"
              value={this.state.Search}
              name="Search"
              onChange={this.handleChange}
            />
            <input className="Submit" type="submit" value="Search" />
          </form>
        </div>
        <div>
          {this.state.SearchIdSubmit === 0 ? (
            <div>
              {this.state.Movie.results
                ? this.state.Movie.results.map((item, i) => {
                    return (
                      <div>
                        <div class="grid-containerSearch">
                          <Link
                            to={"/Info/" + item.id}
                            class="MovieS"
                            onClick={() =>
                              this.handleDetails(i, this.state.SearchIdSubmit)
                            }
                          >
                            <div class="TitleS">{item.title}</div>
                            <div class="DescS">{item.overview}</div>
                            <img
                              class="PosterS"
                              src={this.GetImage(item.poster_path)}
                              alt="Poster"
                            />
                          </Link>
                        </div>
                      </div>
                    );
                  })
                : ""}
            </div>
          ) : this.state.Person.results ? (
            this.state.Person.results.map((item, i) => {
              return (
                <div class="grid-containerPersonSearch">
                  <Link
                    to={"/People/" + item.id}
                    class="PersonS"
                    onClick={() =>
                      this.handleDetails(i, this.state.SearchIdSubmit)
                    }
                  >
                    <div class="TitleP">{item.name}</div>
                    <div class="KnownP">
                      {item.known_for.map((item, i) => {
                        return (
                          <div>
                            {item.original_title
                              ? item.original_title
                              : item.name}
                          </div>
                        );
                      })}
                    </div>
                    <img
                      class="PosterS"
                      src={this.GetImage(item.profile_path)}
                      alt="Actor"
                    />
                  </Link>
                </div>
              );
            })
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}
export default Search;
