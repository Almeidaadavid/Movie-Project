import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/Modal.css';
import { FaStar, FaDollarSign } from 'react-icons/fa';
import { BsCalendar2Date } from "react-icons/bs";

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
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>X</button>
        <h2>{movie.title}</h2>
        <img 
          src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`} 
          alt={movie.title} 
          className="modal-poster"
        />
        <p><BsCalendar2Date/> {movie.date}</p>
        <p><FaStar/> {movie.rating}</p>
        <p><FaDollarSign/><span>{movie.budget.toLocaleString()}</span></p>
        <p>{movie.description ? movie.description : 'Sem descrição disponível para o idioma.'}</p>
      </div>
    </div>,
    document.body
  );
};

export default MovieDetailModal;