import React, { Component } from "react";
import "./MovieDetails.css";
import Moment from "moment";
import ReactPlayer from "react-player";
import { Link } from "react-router-dom";
import Netflix from "./Img/netflix.jpg";

class MovieDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      MovieId: window.location.pathname.replace("/Info/", ""),
      Movie: [],
      Genres: [],
      Trailer: [],
      Cast: [],
      StreamAvailable: false,
      Availability: [],
      StreamName: [],
      StreamLogoId: [],
      Provider: [
        {
          title: "hbo",
        },
        {
          title: "netflix",
          icon: <img src={Netflix} className="StreamIcon" />,
          cName: "Provider",
        },
        { title: "hulu" },
      ],
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
    this.StreamingAPI();

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
  async StreamingAPI() {
    const key = "c34103da5fd71089818f7dce45ac6a4f";
    const url =
      "https://api.themoviedb.org/3/movie/" +
      this.state.MovieId +
      "/watch/providers?api_key=" +
      key;
    const response = await fetch(url);
    const dataLogo = await response.json();
    console.log(dataLogo);
    this.setState({ Streaming: dataLogo.results.GB });
    if (this.state.Streaming.flatrate) {
      this.AvailabilityAPI();
      console.log("Stream Available");
      this.setState({ StreamAvailable: true });
    }
  }
  async AvailabilityAPI() {
    const key = "fba4379aabmsh64f5ae2494b6f75p149425jsn3c97e516d150";
    const url =
      "https://streaming-availability.p.rapidapi.com/get/basic?rapidapi-key=" +
      key +
      "&country=gb&tmdb_id=movie%2F" +
      this.state.MovieId;
    const response = await fetch(url);
    const data = await response.json();
    this.setState({ Availability: [data.streamingInfo] });
    // this.setState({
    //   Availability: [
    //     {
    //       netflix: {
    //         gb: {
    //           link: "https://www.netflix.com/title/81194641/",
    //           added: 1602031625,
    //           leaving: 0,
    //         },
    //       },
    //     },
    //   ],
    // });
    for (let i = 0; i < this.state.Availability.length; i++) {
      const StreamString = JSON.stringify(this.state.Availability[i]).split(
        '"'
      );

      console.log(StreamString);
      const Logo = this.state.Provider.findIndex(
        (element) => element.title === StreamString[1]
      );
      console.log(Logo);
      this.setState({
        StreamName: [...this.state.StreamName, StreamString[1]],
        StreamLogoId: [...this.state.StreamLogoId, Logo],
      });
      console.log(this.state.StreamName);
    }
  }

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
                <Link to={"/People/" + item.id} className="LinkDecor">
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
                </Link>
              );
            })}
          </div>
          {/* <div className="Streaming">
            {this.state.StreamAvailable
              ? this.state.Availability.map((item, i) => {
                  return (
                    <a
                      href={
                        this.state.Availability[i][this.state.StreamName[i]].gb
                          .link
                      }
                    >
                      <div className="StreamName">
                        {this.state.StreamName[i]}
                      </div>
                      <div className="StreamLogo">
                        {this.state.Provider[this.state.StreamLogoId].icon}
                      </div>
                    </a>
                  );
                })
              : "No"}
          </div> */}
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
