import React, { Component } from "react";
import "./MovieDetails.css";
import Moment from "moment";
import ReactPlayer from "react-player";
import { Link } from "react-router-dom";
import like from "./Img/like.png";
import Netflix from "./Img/Prov/netflix.jpg";
import Disney from "./Img/Prov/disney.png";
import Prime from "./Img/Prov/prime.png";

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
          title: "netflix",
          icon: <img src={Netflix} className="StreamIcon" alt="Icon" />,
          cName: "Provider",
        },
        {
          title: "disney",
          icon: <img src={Disney} className="StreamIcon" alt="Icon" />,
        },
        {
          title: "prime",
          icon: <img src={Prime} className="StreamIcon" alt="Icon" />,
        },
      ],
      Like: JSON.parse(localStorage.getItem("Like")),
      removeId: JSON.parse(localStorage.getItem("RemovedMovie")),
      Liked: "",
    };
    this.GetImage = this.GetImage.bind(this);
  }
  componentDidMount() {
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
    const key = "c34103da5fd71089818f7dce45ac6a4f";
    const url =
      "https://api.themoviedb.org/3/movie/" +
      this.state.Movie.id +
      "/credits?api_key=" +
      key +
      "&language=en-GB";
    console.log(url);
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    var castAmount = 8;
    if (data.cast.length <= 8) {
      castAmount = data.cast.length;
    }
    for (var i = 0; i < castAmount; i++) {
      const newCast = data.cast[i];
      this.setState({ Cast: [...this.state.Cast, newCast] });
    }
    console.log(this.state.Cast);
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
    if (this.state.Streaming !== undefined) {
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
      "&country=GB&tmdb_id=movie%2F" +
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

  removeMovie(bool) {
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
    const existedItem = this.state.Like.some(
      (liked) => JSON.stringify(liked.id) === ID
    );
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
          alt="BackDrop"
        />

        <div className="grid-containerD">
          <div className="TopD">
            <div className="TitleD">{this.state.Movie.title}</div>
            <div className="ReleaseD">
              {Moment(this.state.Movie.release_date).format("D-MMM-yy")}
            </div>
            <div className="PosterD">
              <img
                className="Poster"
                src={this.GetImage(this.state.Movie.poster_path)}
                alt="Poster"
              />
            </div>
            <div className="GenreD">
              {this.state.Genres.map((item) => {
                return <div>{item.name}</div>;
              })}
            </div>
          </div>
          <div className="Streaming">
            {this.state.StreamName !== undefined
              ? this.state.StreamName.map((item, i) => {
                  return (
                    <a className="StreamingLink" href={this.state.StreamLink}>
                      {this.state.Provider.find((i) => i.title === item)
                        ? this.state.Provider.find((i) => i.title === item)
                            .icon !== undefined
                          ? this.state.Provider.find((i) => i.title === item)
                              .icon
                          : item
                        : item}
                    </a>
                  );
                })
              : ""}
          </div>
          <div className="DescD">{this.state.Movie.overview}</div>
          {!this.state.Liked ? (
            <div className="LikeDets">
              <div className="LikeIcon">
                <button className="LikeIcon" onClick={() => this.likeMovie()}>
                  <img className="LikeIconD" src={like} alt="LikeIcon" />
                </button>
              </div>
              <div className="Similar">
                <Link
                  to={"/Similar/" + this.state.Movie.id}
                  className="SimilarLink"
                >
                  Similar Movies
                </Link>
              </div>
            </div>
          ) : (
            <div className="LikeDets">
              <div className="SimilarLike">
                <Link
                  to={"/Similar/" + this.state.Movie.id}
                  className="SimilarLink"
                >
                  Similar Movies
                </Link>
              </div>
            </div>
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
                      alt="ActorPic"
                    />
                  ) : (
                    "No Image"
                  )}
                </Link>
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
