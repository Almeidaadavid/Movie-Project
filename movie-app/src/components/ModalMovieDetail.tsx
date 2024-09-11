import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/Modal.css';
import { FaStar, FaDollarSign } from 'react-icons/fa';
import { BsCalendar2Date } from "react-icons/bs";
import { IMAGE_BASE_URL, PLACEHOLDER_IMAGE_URL } from '../config'

interface MovieDetailModalProps {
  movie: {
    title: string;
    description: string;
    date: string;
    posterPath: string;
    rating: number;
    budget: number;
  } | null;
  onClose: () => void;
}

const MovieDetailModal: React.FC<MovieDetailModalProps> = ({ movie, onClose }) => {
  if (!movie) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay" >
      <div className="modal-content">
        <div className="modal-left">
          <img 
            src={movie.posterPath ? `${IMAGE_BASE_URL}${movie.posterPath}` : PLACEHOLDER_IMAGE_URL} 
            alt={movie.title} 
            className="modal-poster"
          />
        </div>

        <div className="modal-right">
          <h2>{movie.title} <span><button className="modal-close" onClick={onClose}>X</button></span></h2>
          <div className="modal-info">
            <p><FaStar /> {movie.rating}</p>
            <p><BsCalendar2Date /> {new Date(movie.date).toLocaleDateString()}</p>
            <p><FaDollarSign /> {movie.budget.toLocaleString()}</p>
          </div>
          <p className="modal-description">
            {movie.description ? movie.description : 'Sem descrição disponível para o idioma.'}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MovieDetailModal;
