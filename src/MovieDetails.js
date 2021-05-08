import React, { Component } from "react";
import "./MovieDetails.css";
import Moment from "moment";
import ReactPlayer from "react-player";
import { Link } from "react-router-dom";
import Netflix from "./Img/netflix.jpg";
import like from "./Img/like.png";

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
      StreamLink: [],
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
        {
          title: "disney",
          icon: <img src={Netflix} className="StreamIcon" />,
        },
      ],
      Like: JSON.parse(localStorage.getItem("Like")),
      removeId: JSON.parse(localStorage.getItem("RemovedMovie")),
      Liked: "",
    };
    this.GetImage = this.GetImage.bind(this);
  }
  async componentDidMount() {
    this.MovieApi();
    this.checkLike(this.state.MovieId);
  }
  componentDidUpdate(prevProps, prevState) {
    const prevStateString = JSON.stringify(prevState.Like);
    const updatedStateString = JSON.stringify(this.state.Like);

    if (prevStateString !== updatedStateString) {
      console.log("Save this:", updatedStateString);
      localStorage.setItem("Like", updatedStateString);
    }
    const prevStateStringMovie = JSON.stringify(prevState.removeId);
    const updatedStateStringMovie = JSON.stringify(this.state.removeId);

    if (prevStateStringMovie !== updatedStateStringMovie) {
      console.log("Save this:", updatedStateStringMovie);
      localStorage.setItem("RemovedMovie", updatedStateStringMovie);
    }
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
    if (this.state.streaming !== undefined) {
      if (this.state.Streaming.flatrate) {
        this.AvailabilityAPI();
        console.log("Stream Available");
        this.setState({ StreamAvailable: true });
      }
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
        StreamLink: [...this.state.StreamLink, StreamString[7]],
      });
      console.log(this.state.StreamName);
      console.log(this.state.StreamLink);
    }
  }
  likeMovie() {
    const { Like } = this.state;
    const newLike = {
      id: this.state.Movie.id,
      Name: this.state.Movie.title,
      Desc: this.state.Movie.overview,
      Image: this.state.Movie.poster_path,
    };
    const existedItem = Like.find((liked) => liked.id === newLike.id);
    if (existedItem) {
      console.log(newLike.id + ": Duplicate");
      this.removeMovie();
    } else {
      this.setState({
        Like: [...this.state.Like, newLike],
      });
      console.log("not Duplicate");
      this.removeMovie();
    }
  }
  removeMovie() {
    const { Movie } = this.state;
    const oldRemove = this.state.removeId;
    const newRemove = Movie.id;
    this.setState({
      removeId: [...oldRemove, newRemove],
      Liked: true,
    });
    // this.updateListing();
  }
  checkLike(ID) {
    const { Like } = this.state;
    const existedItem = Like.some((liked) => liked.id == ID);
    console.log(existedItem);
    this.setState({
      Liked: existedItem,
    });
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
          <div className="Streaming">
            {this.state.StreamName.map((item, i) => {
              return (
                <a className="StreamingLink" href={this.state.StreamLink}>
                  {item}
                </a>
              );
            })}
          </div>
          <div className="DescD">{this.state.Movie.overview}</div>
          {!this.state.Liked ? (
            <div className="LikeDets">
              <button className="" onClick={() => this.likeMovie()}>
                <img className="LikeImg" src={like} />
              </button>
            </div>
          ) : (
            ""
          )}
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
