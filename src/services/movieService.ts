// тут має бути функц fetchMovies
import axios from "axios";
const API_KEY = import.meta.env.VITE_TMDB_TOKEN; 
import type { Movie } from "../types/movie";

interface FetchMoviesResponse {
  results: Movie[];
 }


export default async function fetchMovies (searchValue: string)  {
     const res = await axios.get<FetchMoviesResponse>('https://api.themoviedb.org/3/search/movie', {
      params: {
        query: searchValue,
      }, headers: {
        Authorization: `Bearer ${API_KEY}`,
         
      }
    });
     

    return res.data.results;
  }

