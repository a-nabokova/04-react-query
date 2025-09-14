import { useState, useEffect } from 'react';
import css from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import type { Movie } from '../../types/movie';
import fetchMovies from '../../services/movieService';
import MovieGrid from '../MovieGrid/MovieGrid';
import toast, { Toaster } from 'react-hot-toast';
import MovieModal from '../MovieModal/MovieModal';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';


 
function App() {

   
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
 const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['movies', searchValue, currentPage ],
    queryFn: () => fetchMovies(searchValue, currentPage ),
    enabled: searchValue !== "",
    placeholderData: keepPreviousData,
    });
  
   useEffect(() => {
    if (isSuccess && data?.results.length === 0) {
      toast.error('No movies found for your request.');
    }
  }, [isSuccess, data]);

  const totalPage = data?.total_pages || 0;

   const handleMovieSearch = async (searchValue: string) => {
    setSearchValue(searchValue)
    setCurrentPage(1)
  }

  const handleSelectedMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);  
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);  
  };

 
  return (
    <>
      <div className={css.app}>
        <SearchBar onSubmit={handleMovieSearch} />

         {isSuccess && data?.results.length > 0 && totalPage > 1 && (
    <ReactPaginate
      pageCount={totalPage}
      pageRangeDisplayed={5}
      marginPagesDisplayed={1}
      onPageChange={({ selected }) => setCurrentPage(selected + 1)}
      forcePage={currentPage - 1}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
    />
  )}

        {isLoading && <Loader />}
        {isError && <ErrorMessage />}
         {isSuccess && data?.results.length > 0 && (
    <MovieGrid movies={data.results} onSelect={handleSelectedMovie} />
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
