import React, { Component } from "react";
import "./MovieDetails.css";
import Moment from "moment";
import ReactPlayer from "react-player";

class MovieDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      MovieId: window.location.pathname.replace("/Info/", ""),
      Movie: [],
      Genres: [],
      Trailer: [],
      Cast: [],
    };
    this.GetImage = this.GetImage.bind(this);
  }
  componentDidMount() {
    this.MovieApi();
  }
  async MovieApi() {
    const key = "c34103da5fd71089818f7dce45ac6a4f";
    const url =
      "https://api.themoviedb.org/3/movie/" +
      this.state.MovieId +
      "?api_key=" +
      key +
      "&language=en-US";
    console.log(url);
    const response = await fetch(url);
    const data = await response.json();
    this.setState({
      Movie: data,
      Genres: data.genres,
    });
    this.TrailerAPI();
    this.CastAPI();

    // this.state.Actors.map((e, i) => {
    //   this.ActorsAPI(i, e);
    // });
  }
  async TrailerAPI() {
    const key = "c34103da5fd71089818f7dce45ac6a4f";
    const url =
      "https://api.themoviedb.org/3/movie/" +
      this.state.Movie.imdb_id +
      "/videos?api_key=" +
      key +
      "&language=en-US";
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    if (data.results !== undefined) {
      for (var i = 0; i < data.results.length; i++) {
        const newTrailer = {
          url: "https://www.youtube.com/watch?v=" + data.results[i].key,
          name: data.results[i].name,
        };
        this.setState({ Trailer: [...this.state.Trailer, newTrailer] });
      }
    }
    console.log(this.state.Trailer);
  }
  async CastAPI() {
    for (var i = 0; i < 8; i++) {
      const key = "c34103da5fd71089818f7dce45ac6a4f";
      const url =
        "https://api.themoviedb.org/3/movie/" +
        this.state.MovieId +
        "/credits?api_key=" +
        key +
        "&language=en-US";
      console.log(url);
      const response = await fetch(url);
      const data = await response.json();
      const newCast = data.cast[i];
      console.log(data);
      this.setState({ Cast: [...this.state.Cast, newCast] });
    }
  }
  GetImage(Location) {
    return "https://image.tmdb.org/t/p/w500" + Location;
  }
  //   async ActorsAPI(i, Actor) {
  //     const url =
  //       "http://api.tvmaze.com/search/people?q=" +
  //       encodeURI(this.state.Actors[i]);
  //     const response = await fetch(url);
  //     const data = await response.json();
  //     if (data[0] !== undefined && data[0].person.image !== null) {
  //       const newPics = {
  //         Actors: Actor,
  //         image: data[0].person.image.original,
  //       };
  //       this.setState({ Pics: [...this.state.Pics, newPics] });
  //     }
  //   }

  render() {
    return (
      <div>
        <img
          className="BackDrop"
          src={this.GetImage(this.state.Movie.backdrop_path)}
        />

        <div className="grid-containerD">
          <div className="TopD">
            <div className="TitleD">{this.state.Movie.title}</div>
            <div className="ReleaseD">
              {Moment(this.state.Movie.release_date).format("d-MMM-yy")}
            </div>
            <div className="PosterD">
              <img
                className="Poster"
                src={this.GetImage(this.state.Movie.poster_path)}
              />
            </div>
            <div className="GenreD">
              {this.state.Genres.map((item) => {
                return <div>{item.name}</div>;
              })}
            </div>
          </div>
          <div className="DescD">{this.state.Movie.overview}</div>
          <div className="CastD">
            {this.state.Cast.map((item, i) => {
              return (
                <div>
                  <div className="ActorD">{item.name}</div>
                  <div className="CharacterD">{item.character}</div>
                  {item.profile_path ? (
                    <img
                      className="ActorPicD"
                      src={this.GetImage(item.profile_path)}
                    />
                  ) : (
                    "No Image"
                  )}
                </div>
              );
            })}
          </div>
          <div className="VidsD">
            {this.state.Trailer.map((item, i) => {
              return (
                <div>
                  {item.name}
                  <ReactPlayer
                    className="Vid"
                    url={this.state.Trailer[i].url}
                    width="90vw"
                    height="51vw"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
export default MovieDetails;
