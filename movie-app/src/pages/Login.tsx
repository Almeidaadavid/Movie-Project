import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import { performLogin } from '../services/loginService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import {useFavorites} from '../context/FavoriteContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const {loadFavorites} = useFavorites();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    try {
      let success = await performLogin(username, password, setUser, loadFavorites);
      if (!success) {
        return;
      }
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <section className="form">
        <form onSubmit={handleSubmit} className="login-form">
          <h1>Login</h1>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Digite seu username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="button" disabled={isLoading}>
            {isLoading ? 'Carregando...' : 'Login'}
          </button>
        </form>
      </section>
    </div>
  );
};

export default Login;