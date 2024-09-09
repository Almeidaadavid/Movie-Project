import api from './api';

interface LoginDTO {
    username: string;
    password: string;
}
  
interface RegisterDTO {
    username: string;
    password: string;
    email: string;
}

export const login = async (data: LoginDTO) => {
    const response = await api.post('/auth/login', data);
    return response.data;
}

export const register = async (data: RegisterDTO) => {
    const response = await api.post('/auth/register', data);
    return response.data;
}
