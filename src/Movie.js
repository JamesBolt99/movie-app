import "./Movie.css";
import React, { Component } from "react";
import ReactPlayer from "react-player";
import like from "./Img/like.png";
import dislike from "./Img/dislike.png";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Movie: {},
      RandomMovie: {},
      Trailer: [],
      Ratings: [],
      Actors: [],
      Pics: [],
      Like: [],
      imdbID: [],
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
  }
  async componentDidMount() {
    this.updateListing();
    const savedStateFromLocalStorage = localStorage.getItem("Like");
    if (savedStateFromLocalStorage) {
      this.setState({
        Like: JSON.parse(savedStateFromLocalStorage),
      });
    }
  }

  async updateListing() {
    const randomUrl =
      "https://api.themoviedb.org/3/movie/popular?api_key=c34103da5fd71089818f7dce45ac6a4f&language=en-US&page=" +
      this.GetRand(1, 4);
    const responseRand = await fetch(randomUrl);
    const randomdata = await responseRand.json();
    console.log(randomdata);
    this.setState({ RandomMovie: randomdata.results[this.GetRand(0, 20)] });
    console.log(this.state.RandomMovie);
    this.setState({
      Pics: [],
      Trailer: [],
    });
    this.OMDbApi();
  }

  async OMDbApi() {
    const url =
      "http://www.omdbapi.com/?t=" +
      encodeURI(this.state.RandomMovie.title) +
      "&apikey=edc5e05e";
    console.log(url);
    const response = await fetch(url);
    const data = await response.json();
    this.setState({
      Movie: data,

      imdbID: data.imdbID,
    });
    if (data.Ratings !== undefined) {
      this.setState({ Ratings: data.Ratings });
    }
    console.log(this.state.Ratings);
    if (this.state.Movie.Actors !== undefined) {
      this.setState({ Actors: this.state.Movie.Actors.split(", ") });
      console.log("Actors: " + this.state.Actors[2]);
    }
    console.log(this.state.Movie);
    this.TrailerAPI();
    this.state.Actors.map((e, i) => {
      this.ActorsAPI(i, e);
    });
  }
  async TrailerAPI() {
    const key = "c34103da5fd71089818f7dce45ac6a4f";
    const url =
      "https://api.themoviedb.org/3/movie/" +
      this.state.Movie.imdbID +
      "/videos?api_key=" +
      key +
      "&language=en-US";
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
  async ActorsAPI(i, Actor) {
    const url =
      "http://api.tvmaze.com/search/people?q=" +
      encodeURI(this.state.Actors[i]);
    const response = await fetch(url);
    const data = await response.json();
    if (data[0] !== undefined && data[0].person.image !== null) {
      const newPics = {
        Actors: Actor,
        image: data[0].person.image.original,
      };
      this.setState({ Pics: [...this.state.Pics, newPics] });
    }
  }
  likeMove() {
    const { Like } = this.state;
    const newLike = {
      id: this.state.RandomMovie.id,
      Name: this.state.Movie.Title,
      Genre: this.state.Movie.Genre,
      Desc: this.state.Movie.Plot,
      Image: this.state.Movie.Poster,
    };
    const existedItem = Like.find((liked) => liked.id === newLike.id);
    if (existedItem) {
      console.log(newLike.id + ": Duplicate");
      this.updateListing();
    } else {
      this.setState({
        Like: [...this.state.Like, newLike],
      });
      console.log("not Duplicate");
      this.updateListing();
    }
  }

  render() {
    return (
      <div className="App">
        <div className="grid-container">
          <div className="Search">Search</div>
          <div className="Video">
            <ReactPlayer
              url={this.state.Trailer[0]}
              width="90vw"
              height="51vw"
              playing={true}
            />
          </div>
          <div className="Title">{this.state.Movie.Title}</div>
          <div className="Rating">
            {this.state.Ratings.map((item) => {
              return (
                <div>
                  {item.Source}: {item.Value}
                </div>
              );
            })}
          </div>
          <div className="Genre">{this.state.Movie.Genre}</div>
          <div className="Cast">
            {this.state.Pics.map((item) => {
              return (
                <div>
                  <div className="Actor">{item.Actors}</div>
                  <img className="Pic1" src={item.image} />
                </div>
              );
            })}
          </div>
          <div className="Rate">
            <button className="Like" onClick={() => this.likeMove()}>
              <img className="LikeImg" src={like} />
            </button>
            <button className="Dislike" onClick={() => this.updateListing()}>
              <img className="LikeImg" src={dislike} />
            </button>
          </div>
        </div>
      </div>
    );
  }
}
export default Home;
