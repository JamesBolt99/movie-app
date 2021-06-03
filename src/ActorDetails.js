import React, { Component } from "react";
import "./ActorDetails.css";
import { Link } from "react-router-dom";

class ActorDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ActorId: window.location.pathname.replace("/People/", ""),
      Films: [],
      Details: null,
      Image: [],
    };
    this.GetImage = this.GetImage.bind(this);
  }
  componentDidMount() {
    this.ActorAPI();
  }
  async ActorAPI() {
    const key = "c34103da5fd71089818f7dce45ac6a4f";
    const url =
      "https://api.themoviedb.org/3/person/" +
      this.state.ActorId +
      "/movie_credits?api_key=" +
      key +
      "&language=en-US";
    console.log(url);
    const response = await fetch(url);
    const data = await response.json();
    this.setState({
      Films: data.cast,
    });
    this.DetailsApi();
  }
  async DetailsApi() {
    const key = "c34103da5fd71089818f7dce45ac6a4f";
    const url =
      "https://api.themoviedb.org/3/person/" +
      this.state.ActorId +
      "?api_key=" +
      key +
      "&language=en-US";
    console.log(url);
    const response = await fetch(url);
    const data = await response.json();
    this.setState({
      Details: data.biography,
      Image: data.profile_path,
      Name: data.name,
    });
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
        <div class="grid-containerActor">
          <div class="Pic">
            <img
              className="ActorImg"
              src={this.GetImage(this.state.Image)}
              alt="ActorImage"
            />
          </div>
          <div class="ActorName">{this.state.Name}</div>
          <div class="Bio">
            {this.state.Details}
            <h2>Known For</h2>
          </div>
        </div>

        <div className="grid-containerActorFilms">
          {this.state.Films.map((item, i) => {
            return (
              <Link className="LinkDecor" to={"/Info/" + item.id}>
                <div className="Film">{item.title}</div>
                <div className="Character">{item.character}</div>
                <div className="Pic">
                  <img
                    className="MoviePoster"
                    src={this.GetImage(item.poster_path)}
                    alt="MoviePoster"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }
}
export default ActorDetails;
