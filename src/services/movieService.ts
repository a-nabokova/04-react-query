// тут має бути функц fetchMovies
import axios from "axios";
const API_KEY = import.meta.env.VITE_TMDB_TOKEN; 
import type { Movie } from "../types/movie";

interface FetchMoviesResponse {
  results: Movie[];
  page: number;
  total_pages: number;
 }


export default async function fetchMovies (searchValue: string, page: number)  {
     const res = await axios.get<FetchMoviesResponse>('https://api.themoviedb.org/3/search/movie', {
      params: {
         query: searchValue,
        page,
      }, headers: {
        Authorization: `Bearer ${API_KEY}`,
         
      }
    });
     

    return res.data;
  }

