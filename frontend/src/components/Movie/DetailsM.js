import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "../../shared/HomeHeader";
import './CSS/AllMovies.css';
import 'jspdf-autotable';

export default function DetailsM() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);

  alert(movieId)

  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        const response = await axios.get(`/movie/getOne/` + movieId); // Replace with your API endpoint
        setMovie(response.data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    }

    fetchMovieDetails();
  }, [movieId]);

  return (
    <div>
      <Header />
      {movie ? (
        <div>
          <div className="contD">
            <a href="/showtime">
              <button className="button8">Buy Tickets</button>
            </a>
          </div>
          <div className="contn3">
            <h2 className="hh2">Movie Trailer</h2>
          </div>
          <iframe
            className="video"
            width="60%"
            height="500px"
            src={movie.releaseDate} // Use the actual video URL from the movie details
            frameBorder="0"
            allowFullScreen
            title="Movie Trailer"
          ></iframe>

          <iframe className="video" width="60%" height="500px" src="https://www.youtube.com/embed/TnyWMhSqyjY" frameborder="0" allowfullscreen></iframe>

        </div>
      ) : (
        <p>Loading movie details...</p>
      )}
    </div>
  );
}