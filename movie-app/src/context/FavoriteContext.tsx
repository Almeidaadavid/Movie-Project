import React, { createContext, useContext, useState, useEffect } from 'react';
import { addFavoriteMovie, removeFavoriteMovie, fetchFavoriteMovies } from '../services/movieService';
import axios from 'axios';
import { toast } from 'react-toastify';

interface FavoritesContextProps {
    favorites: number[];
    handleAddToFavorites: (movieId: number) => Promise<void>;
    loadFavorites: () => Promise<void>;
    clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextProps | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [favorites, setFavorites] = useState<number[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            loadFavorites();
        }
    }, []);

    const loadFavorites = async () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const data = await fetchFavoriteMovies();
                setFavorites(data);
                localStorage.setItem('favoriteMovies', JSON.stringify(data));
            } catch (error) {
                console.error('Erro ao carregar filmes favoritos:', error);
            }
        }
    };

    const handleAddToFavorites = async (movieId: number) => {
        const token = localStorage.getItem('authToken');
        try {
            if (!token) {
                toast.error('É necessário estar logado para adicionar um filme aos favoritos');
                return;
            }
            let updatedFavorites: number[];

            if (favorites.includes(movieId)) {
                await removeFavoriteMovie(movieId);
                updatedFavorites = favorites.filter((id) => id !== movieId);
                toast.success('Filme removido dos favoritos!');
            } else {
                await addFavoriteMovie(movieId);
                updatedFavorites = [...favorites, movieId];
                toast.success('Filme adicionado aos favoritos!');
            }

            setFavorites(updatedFavorites);
            localStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.data) {
                    toast.error(`Erro: ${error.response.data.message || 'Erro desconhecido'}`);
                } else {
                    toast.error('Erro de rede ou de configuração. Verifique sua conexão.');
                }
            } else {
                toast.error('Erro desconhecido. Por favor, tente novamente.');
            }
        }
    };

    const clearFavorites = () => {
        setFavorites([]);
        localStorage.removeItem('favoriteMovies');
    };

    return (
        <FavoritesContext.Provider value={{ favorites, handleAddToFavorites, loadFavorites, clearFavorites }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = (): FavoritesContextProps => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};