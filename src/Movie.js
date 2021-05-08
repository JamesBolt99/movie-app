import "./Movie.css";
import React, { Component } from "react";
import ReactPlayer from "react-player";
import like from "./Img/like.png";
import dislike from "./Img/dislike.png";
import { Link } from "react-router-dom";
import {
  SwipeableList,
  SwipeableListItem,
} from "@sandstreamdev/react-swipeable-list";
import Like from "./Like";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Movie: {},
      Trailer: [],
      Ratings: [],
      Cast: [],
      Pics: [],
      Like: [],
      imdbID: [],
      removeId: [],
      Genre: [
        { id: 28, name: "Action" },
        { id: 12, name: "Adventure" },
        { id: 16, name: "Animation" },
        { id: 35, name: "Comedy" },
        { id: 80, name: "Crime" },
        { id: 99, name: "Documentary" },
        { id: 18, name: "Drama" },
        { id: 10751, name: "Family" },
        { id: 14, name: "Fantasy" },
        { id: 36, name: "History" },
        { id: 27, name: "Horror" },
        { id: 10402, name: "Music" },
        { id: 9648, name: "Mystery" },
        { id: 10749, name: "Romance" },
        { id: 878, name: "Science Fiction" },
        { id: 10770, name: "TV Movie" },
        { id: 53, name: "Thriller" },
        { id: 10752, name: "War" },
        { id: 37, name: "Western" },
      ],
      GenreName: [],
    };
  }
  GetRand(min, max) {
    return Math.floor(Math.random() * Math.floor(max) + min);
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
  async componentDidMount() {
    const savedStateFromLocalStorage = localStorage.getItem("Like");
    if (savedStateFromLocalStorage) {
      this.setState({
        Like: JSON.parse(savedStateFromLocalStorage),
      });
    }
    const savedMoviesFromLocalStorage = localStorage.getItem("RemovedMovie");
    if (savedMoviesFromLocalStorage) {
      this.setState({
        removeId: JSON.parse(savedMoviesFromLocalStorage),
      });
    }
    this.updateListing();
  }

  async updateListing() {
    const randomUrl =
      "https://api.themoviedb.org/3/movie/popular?api_key=c34103da5fd71089818f7dce45ac6a4f&language=en-GB&page=" +
      this.GetRand(1, 4);
    const responseRand = await fetch(randomUrl);
    const randomdata = await responseRand.json();
    console.log(randomdata);
    this.setState({ Movie: randomdata.results[this.GetRand(0, 20)] });
    console.log(this.state.Movie);
    if (
      this.state.removeId.includes(this.state.Movie.id) ||
      this.state.Movie === null
    ) {
      this.updateListing();
    } else {
      this.setState({
        Cast: [],
        Trailer: [],
        GenreName: [],
      });
      this.TrailerAPI();
      this.CastAPI();
      this.GenreAPI();
    }
  }
  async TrailerAPI() {
    const key = "c34103da5fd71089818f7dce45ac6a4f";
    const url =
      "https://api.themoviedb.org/3/movie/" +
      this.state.Movie.id +
      "/videos?api_key=" +
      key +
      "&language=en-GB";
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    if (data.results !== undefined) {
      for (var i = 0; i < data.results.length; i++) {
        const newTrailer =
          "https://www.youtube.com/watch?v=" + data.results[i].key;
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
  async GenreAPI() {
    for (let i = 0; i < this.state.Movie.genre_ids.length; i++) {
      const Genre = this.state.Genre.findIndex(
        (element) => element.id === this.state.Movie.genre_ids[i]
      );
      console.log(Genre);
      this.setState({
        GenreName: [...this.state.GenreName, this.state.Genre[Genre].name],
      });
      // const Logo = this.state.Provider.findIndex(
      //   (element) => element.title === StreamString[1]
      // );
      // console.log(Logo);
      // this.setState({
      //   StreamName: [...this.state.StreamName, StreamString[1]],
      //   StreamLogoId: [...this.state.StreamLogoId, Logo],
      // });
      // console.log(this.state.StreamName);
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
    const newRemove = Movie.id;
    this.setState({ removeId: [...this.state.removeId, newRemove] });
    this.updateListing();
  }
  GetImage(Location) {
    return "https://image.tmdb.org/t/p/w500" + Location;
  }

  render() {
    return (
      <SwipeableList>
        <SwipeableListItem
          swipeRight={{
            content: (
              <div>
                <img className="SwipeImageR" src={like} />
              </div>
            ),
            action: () => this.likeMovie(),
          }}
          swipeLeft={{
            content: (
              <div>
                <img className="SwipeImageL" src={dislike} />
              </div>
            ),
            action: () => this.removeMovie(),
          }}
          onSwipeEnd={() => this.likeMovie}
        >
          <div className="App">
            <div className="grid-container">
              {/* <div className="Search">Search</div> */}
              <div className="Video">
                <ReactPlayer
                  url={this.state.Trailer[0]}
                  width="90vw"
                  height="51vw"
                  playing={true}
                />
              </div>
              <div className="Title">
                <Link to={"/Info/" + this.state.Movie.id} className="LinkDecor">
                  {this.state.Movie.title}
                </Link>
              </div>
              <div className="Rating"></div>
              <div className="Genre">
                {this.state.GenreName.map((item) => {
                  return <div>{item}</div>;
                })}
              </div>
              <div className="Cast">
                {this.state.Cast.map((item) => {
                  return (
                    <div>
                      <div className="Actor">{item.name}</div>
                      {item.profile_path ? (
                        <img
                          className="Pic1"
                          src={this.GetImage(item.profile_path)}
                        />
                      ) : (
                        "No Image"
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="Rate">
                <button className="Like" onClick={() => this.likeMovie()}>
                  <img className="LikeImg" src={like} />
                </button>
                <button className="Dislike" onClick={() => this.removeMovie()}>
                  <img className="LikeImg" src={dislike} />
                </button>
              </div>
            </div>
          </div>
        </SwipeableListItem>
      </SwipeableList>
    );
  }
}
export default Home;
