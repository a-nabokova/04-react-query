import { useState } from 'react';
import css from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import type { Movie } from '../../types/movie';
import fetchMovies from '../../services/movieService';
import MovieGrid from '../MovieGrid/MovieGrid';
import toast, { Toaster } from 'react-hot-toast';
import MovieModal from '../MovieModal/MovieModal';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';


 
function App() {

  const [movies, setMovies] = useState<Movie[]>([]); 
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);  
  };

  const handleSelectedMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);  
  };

  const handleMovieSearch = async (searchValue: string) => {
    setMovies([]);
    setError(false); 
     setIsLoading(true);
     try {
       const resMovies = await fetchMovies(searchValue); 
       if (resMovies.length === 0) {
          toast.error('No movies found for your request.');
           return;
        }
     
     setMovies(resMovies); 
 } catch  {
   setError(true);
     } finally {
       setIsLoading(false);
 }
  };
 
  return (
    <>
      <div className={css.app}>
        <SearchBar onSubmit={handleMovieSearch} />

        {isLoading && <Loader />}
        {error && !isLoading && <ErrorMessage />}
        {!isLoading && !error && (
        <MovieGrid movies={movies} onSelect={handleSelectedMovie} />
      )}
         
        {isModalOpen && selectedMovie && (
          <MovieModal movie={selectedMovie} onClose={closeModal} />
        )}
         <Toaster position="top-center" />
      </div>
    </>
  )
}

export default App
