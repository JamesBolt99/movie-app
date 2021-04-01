import React, { Component } from "react";
import { Link, Route } from "react-router-dom";
import "./Like.css";

class Like extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Like: [],
    };
    this.handleDelete = this.handleDelete.bind(this);
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
  render() {
    return (
      <div className="App">
        {this.state.Like
          ? this.state.Like.map((item, i) => {
              return (
                <div>
                  <div class="grid-containerLike">
                    <Link
                      to={"/Info/" + item.id}
                      class="Movie"
                      onClick={() => this.handleDetails(i)}
                    >
                      <div class="TitleL">{item.Name}</div>
                      <div class="GenreL">{item.Genre}</div>
                      <div class="DescL">{item.Desc}</div>
                      <img class="PosterL" src={item.Image} />
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
            })
          : console.log("No Liked Movies")}
      </div>
    );
  }
}
export default Like;
