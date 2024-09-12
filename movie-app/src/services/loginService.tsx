import { toast } from 'react-toastify';
import { login } from './auth';

export const performLogin = async (
  username: string,
  password: string,
  setUser: (user: string | null) => void,
  loadFavorites: () => Promise<void>,
  isNewAccount: boolean = false
) => {
  try {
    const { token } = await login({ username, password });
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', username);
    setUser(username);
    toast.success('Login realizado com sucesso!');

    if (!isNewAccount) {
      await loadFavorites();
    }

    return true;
  } catch (error) {
    toast.error('Erro ao realizar login. Verifique suas credenciais.');
    return false;
  }
};