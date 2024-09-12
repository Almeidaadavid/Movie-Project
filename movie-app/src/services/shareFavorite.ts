import { MovieDetailDTO } from "../types/movieTypes";
import api from "./api";

export const ShareFavoritesToken = async () => {
    const response = await api.post('favorite-movies/generate-favorites-token');
    return response.data;
};


export const GetFavoritesWithToken = async(token: string | undefined): Promise<MovieDetailDTO[]> => {
    const response = await api.get(`favorite-movies/shared-favorites/${token}`);
    return response.data;
}