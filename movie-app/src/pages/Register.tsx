import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/auth';
import '../styles/Login.css';
import { toast } from 'react-toastify';
import { performLogin } from '../services/loginService';
import { useAuth } from '../context/AuthContext';


const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();
  
  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
        toast.error('Email inválido');
        return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);

    try {
      const response = await register({ username, password, email });
      if (response.success) {
        toast.success('Cadastro realizado com sucesso!');
        let success = await performLogin(username, password, setUser);
        if (!success) {
            return;
        }
        navigate("/");
      }
    } catch (error) {
      toast.error('Erro ao realizar Cadastro. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <section className="form">
        <form onSubmit={handleSubmit} className="login-form">
          <h1>Cadastro de usuário</h1>
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
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              id='email'
              placeholder='Digite seu email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required />
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

export default Register;