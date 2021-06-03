import "./Movie.css";
import React, { Component } from "react";
import { Link, Route } from "react-router-dom";
import Like from "./Img/like.png";

class Remove extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Movie: [],
      Like: JSON.parse(localStorage.getItem("Like")),
      LikeId: [],
      imdbID: [],
      removeId: JSON.parse(localStorage.getItem("RemovedMovie")),
      PrevId: [],
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
      Disliked: [],
      UpdateBool: false,
    };
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
    if (this.state.removeId) {
      for (let i = 0; i < this.state.removeId.length; i++) {
        const removed = this.state.removeId[i];

        // console.log(this.state.removeId[i].includes(this.state.Like.id));
        if (!this.IsLiked(removed)) {
          const randomUrl =
            "https://api.themoviedb.org/3/movie/" +
            removed +
            "?api_key=c34103da5fd71089818f7dce45ac6a4f&language=en-GB";
          const responseRand = await fetch(randomUrl);
          const removeData = await responseRand.json();

          this.setState({ Movie: [...this.state.Movie, removeData] });

          this.setState({
            GenreName: [],
          });
        }
      }
      console.log(this.state.Movie);
    }
    // this.Genre();
  }

  async Genre() {
    for (let i = 0; i < this.state.Movie.genre_ids.length; i++) {
      const Genre = this.state.Genre.findIndex(
        (element) => element.id === this.state.Movie.genre_ids[i]
      );
      console.log(Genre);
      this.setState({
        GenreName: [...this.state.GenreName, this.state.Genre[Genre].name],
      });
    }
  }
  likeMovie(i) {
    const { Like } = this.state;
    const newLike = {
      id: this.state.Movie[i].id,
      Name: this.state.Movie[i].title,
      Desc: this.state.Movie[i].overview,
      Image: this.state.Movie[i].poster_path,
    };
    const newLikeId = this.state.Movie[i].id;
    this.setState({ PrevId: [...this.state.PrevId, newLikeId] });
    const existedItem = Like.find((liked) => liked.id === newLike.id);
    if (existedItem) {
      console.log(newLike.id + ": Duplicate");
    } else {
      this.setState({
        Like: [...this.state.Like, newLike],
      });
      console.log("not Duplicate");

      const index = parseInt(i, 10); // access button's custom attribute

      console.log("deleting: " + index);

      const newRemovedState = [...this.state.Movie];
      newRemovedState.splice(index, 1);

      this.setState({
        Movie: newRemovedState,
      });
    }

    // this.updateListing();
  }
  // AddMovie(e) {
  //   var removeData = [...this.state.removeId]; // make a separate copy of the array
  //   var index = removeData.indexOf(e.target.value);
  //   if (index !== -1) {
  //     removeData.splice(index, 1);
  //     this.setState({ removeId: removeData });
  //   }
  // }
  IsLiked(i) {
    return this.state.Like.some((item) => i === item.id);
  }
  handleDetails(i) {
    const { Like } = this.state;
    <Route path={"/" + Like[i].id} />;
  }
  GetImage(Location) {
    return "https://image.tmdb.org/t/p/w500" + Location;
  }

  render() {
    return (
      <div className="App">
        {this.state.Movie
          ? this.state.Movie.map((item, i) => {
              return (
                <div>
                  <div class="grid-containerLike">
                    <Link
                      to={"/Info/" + item.id}
                      class="Movie"
                      onClick={() => this.handleDetails(i)}
                    >
                      <div class="TitleL">{item.title}</div>
                      <div class="DescL">{item.overview}</div>
                      <img
                        class="PosterL"
                        src={this.GetImage(item.poster_path)}
                        alt="Poster"
                      />
                    </Link>
                    <button className="Del" onClick={() => this.likeMovie(i)}>
                      <img src={Like} style={{ width: "5vw" }} alt="DelBtn" />
                    </button>
                  </div>
                </div>
              );
            })
          : console.log("No Liked Movies")}
      </div>
    );
  }
}
export default Remove;
