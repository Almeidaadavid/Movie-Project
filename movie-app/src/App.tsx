import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SearchResults from './pages/SearchResult';
import Login from './pages/Login'
import FavoriteMovies from './pages/FavoriteMovies';
import Register from './pages/Register'
import Header from "./components/Header";
import { FavoritesProvider } from "./context/FavoriteContext";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/App.css';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Router>
          <div className="app-container">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/favorites" element={<FavoriteMovies />} />
              </Routes>
            </main>
            <ToastContainer />
          </div>
        </Router>
      </FavoritesProvider>
    </AuthProvider>
  );
};

export default App;