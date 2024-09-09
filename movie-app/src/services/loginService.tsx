import { toast } from 'react-toastify';
import { login } from './auth'; 

export const performLogin = async (username: string, password: string, setUser: (user: string | null) => void) => {
  try {
    const { token } = await login({ username, password });
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', username);
    setUser(username);
    toast.success('Login realizado com sucesso!');
    return true;
  } catch (error) {
    toast.error('Erro ao realizar login. Verifique suas credenciais.');
    return false;
  }
};