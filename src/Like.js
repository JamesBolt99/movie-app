import React, { Component } from "react";
import { Link, Route } from "react-router-dom";
import "./Like.css";

class Like extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Like: [],
      isOldestFirst: true,
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.GetImage = this.GetImage.bind(this);
  }
  componentDidUpdate(prevProps, prevState) {
    const prevStateString = JSON.stringify(prevState.Like);
    const updatedStateString = JSON.stringify(this.state.Like);

    if (prevStateString !== updatedStateString) {
      console.log("Save this:", updatedStateString);
      localStorage.setItem("Like", updatedStateString);
    }
  }
  componentDidMount() {
    const savedStateFromLocalStorage = localStorage.getItem("Like");

    if (savedStateFromLocalStorage) {
      this.setState({
        Like: JSON.parse(savedStateFromLocalStorage),
      });
    }
  }
  handleDelete(i) {
    const index = parseInt(i, 10); // access button's custom attribute

    console.log("deleting: " + index);

    const newLikedState = [...this.state.Like];
    newLikedState.splice(index, 1);

    this.setState({
      Like: newLikedState,
    });
  }
  handleDetails(i) {
    const { Like } = this.state;
    <Route path={"/" + Like[i].id} />;
  }
  GetImage(Location) {
    return "https://image.tmdb.org/t/p/w500" + Location;
  }
  // sortByDate() {
  //   if (this.state.isOldestFirst) {
  //     newLikeList.sort((a, b) => a.DateTime < b.DateTime);
  //   } else {
  //     newLikeList.sort((a, b) => a.DateTime > b.DateTime);
  //   }
  // }

  render() {
    return (
      <div className="App">
        {this.state.Like ? (
          <div>
            {this.state.Like.map((item, i) => {
              return (
                <div>
                  <div class="grid-containerLike">
                    <Link
                      to={"/Info/" + item.id}
                      class="Movie"
                      onClick={() => this.handleDetails(i)}
                    >
                      <div class="TitleL">{item.Name}</div>
                      <div class="DescL">{item.Desc}</div>
                      <img
                        class="PosterL"
                        src={this.GetImage(item.Image)}
                        alt="Poster"
                      />
                    </Link>
                    <button
                      className="Del"
                      onClick={() => this.handleDelete(i)}
                    >
                      X
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          "No Liked Movies"
        )}
      </div>
    );
  }
}
export default Like;
