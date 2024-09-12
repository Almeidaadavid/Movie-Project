import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import {useFavorites} from '../context/FavoriteContext'
import '../styles/Header.css';

const Header: React.FC = () => {
  const [query, setQuery] = useState("");
  const { user, setUser } = useAuth();
  const { clearFavorites } = useFavorites();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    if (token && user) {
      setUser(user);
    } else {
      setUser(null);
    }
  }, [setUser]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearchSubmit = () => {
    if (query.trim() !== "") {
      navigate(`/search?query=${query}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    clearFavorites();
    setUser(null);
    navigate('/');
  };

  const ClearInput = () => {
    setQuery('');
  }

  return (
    <header className="header">
      <h1 className="header-title">Filmes APP</h1>
      <nav className="header-nav">
        <Link to="/" onClick={ClearInput} className="nav-link">Início</Link>
        <div className="search-container">
          <input 
            type="text" 
            className="search-input"
            placeholder="Busque pelos filmes..." 
            value={query}
            onChange={handleSearchChange}
          />
          <button className="search-submit" onClick={handleSearchSubmit}>
            <i className="material-icons">search</i>
          </button>
        </div>
        {user ? (
          <>
            <span className="nav-link">Olá, {user}</span>
            <Link to={"/favorites"} className="nav-link">Favoritos</Link>
            <Link to={"/"} onClick={handleLogout} className="nav-link">Sair</Link>
          </>
        ) : (
          <>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to={"/register"} className="nav-link">Cadastre-se</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;