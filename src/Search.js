import "./Search.css";
import React, { Component } from "react";
import { Link, Route } from "react-router-dom";

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Search: "",
      Movie: [],
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
      "https://api.themoviedb.org/3/search/movie?api_key=" +
      key +
      "&language=en-gb&query=" +
      this.state.Search +
      "&page=1&include_adult=false";
    console.log(url);
    const response = await fetch(url);
    const data = await response.json();
    this.setState({
      Movie: data,
    });
    console.log(this.state.Movie);
  }
  handleDetails(i) {
    const { Movie } = this.state;
    <Route path={"/" + Movie.results[i].id} />;
  }
  GetImage(Location) {
    return "https://image.tmdb.org/t/p/w500" + Location;
  }
  render() {
    return (
      <div>
        <div>
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
          {this.state.Movie.results
            ? this.state.Movie.results.map((item, i) => {
                return (
                  <div>
                    <div class="grid-containerSearch">
                      <Link
                        to={"/Info/" + item.id}
                        class="MovieS"
                        onClick={() => this.handleDetails(i)}
                      >
                        <div class="TitleS">{item.title}</div>
                        <div class="DescS">{item.overview}</div>
                        <img
                          class="PosterS"
                          src={this.GetImage(item.poster_path)}
                        />
                      </Link>
                    </div>
                  </div>
                );
              })
            : console.log("No Liked Movies")}
        </div>
      </div>
    );
  }
}
export default Search;
