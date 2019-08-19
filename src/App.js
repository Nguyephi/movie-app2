import React, { useState, useEffect, useReducer } from 'react';
import { Pagination, Modal } from 'react-bootstrap'
import YouTube from "react-youtube";
import './App.css';

import NavBar from './components/NavBar'
import Movies from './components/Movies'
import RightSideFilter from './components/RightSideFilter'

const API_KEY = process.env.REACT_APP_MOVIE_API_KEY
const opts = {
  height: "420",
  width: "100%",
  playerVars: {
    autoplay: 1
  }
}

function App(props) {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'getMovies': return {
        ...state,
        movies: action.movies,
        totalPages: action.totalPages,
        pageNo: action.pageNo
      }
      case 'genreName': return {
        ...state,
        genreName: action.genreName,
        searchedMovies: action.searchedMovies
      }
      case 'getGenresAllMovies': return {
        ...state,
        genre: action.genre,
        genreName: action.genreName
      }
      case 'searchMovie': return {
        ...state,
        activeCategory: '',
        category: '',
        search: '',
        searchTerm: action.searchTerm,
        searchedMovies: action.searchedMovies,
        allSearchedMovies: action.allSearchedMovies,
        totalPages: action.totalPages
      }
      case 'getGenres': return {
        ...state, genres: action.genres
      }
      case 'modal': return {
        ...state,
        modal: true,
        trailerId: action.trailerId,
        trailerTitle: action.trailerTitle
      }
      case 'closeModal': return { ...state, modal: false }
      case 'search': return {
        ...state,
        discover: action.discover
      }
      case 'sort':
        switch (action.condition) {
          case 'one': return {
            ...state,
            activeCategory: action.activeCategory,
            searchedMovies: action.searchedMovies
          }
          case 'two': return {
            ...state,
            sortBy: action.sortBy,
            activeCategory: action.activeCategory
          }
        }
      case 'handleCategory': return {
        ...state,
        category: action.category,
        discover: '',
        genreName: '',
        search: '',
        searchTerm: '',
        activeCategory: '',
        searchedMovies: []
      }
      case 'searchInput': return {
        ...state,
        search: action.search
      }
      case 'years': return {
        ...state,
        years: action.years
      }
      case 'ratings': return {
        ...state,
        ratings: action.ratings
      }
      default: return state
    }
  }, {
      movies: [],
      searchedMovies: [],
      allSearchedMovies: [],
      search: '',
      searchTerm: '',
      genre: '',
      genreName: '',
      genres: [],
      sortBy: 'popularity.desc',
      activeCategory: '',
      discover: '/discover',
      category: '',
      modal: false,
      trailerId: '',
      trailerTitle: '',
      years: { min: 1874, max: 2019 },
      ratings: { min: 0, max: 10 },
      totalPages: '',
      pageNo: 1
    })

  function BreadCrumbs() {
    return (
      <>
        <div className='d-flex mt-2 pl-4'>
          {state.searchTerm || state.category ? <div>Search: {state.searchTerm || parseCategory()}</div> : <div>All Movies</div>}
          {state.genreName && <div className='pl-1'>> {state.genreName}</div>}
          {state.activeCategory && <div className='pl-1'>> {state.activeCategory}</div>}
          <div className='pl-1'>({state.searchedMovies.length || 20})</div>
        </div>
      </>
    )
  }

  function TrailerModal() {
    return (
      <Modal
        size="lg"
        show={state.modal}
        onHide={toggle}
      >
        <Modal.Header
          closeButton
        >
          {state.trailerTitle}
        </Modal.Header>
        <Modal.Body className="text-center">
          <YouTube
            videoId={state.trailerId}
            opts={opts}
          />
        </Modal.Body>
      </Modal>
    )
  }

  function MoviePagination() {
    console.log('object', state.totalPages);
    let pages = Array.from(Array(state.totalPages).keys())
    // pages = pages.shift()
    console.log(pages.shift())
    const pageMap = () => pages.map(page => {
      if (page <= state.pageNo + 3 && page >= state.pageNo - 3) {
        return (
          <Pagination.Item
            active={page === state.pageNo}
            onClick={() => getMovies(page)}
          >
            {page}
          </Pagination.Item>
        );
      }
    })
    return (
      // totalpages cant exceed 500 for all movies. need a conditional for searched and category movies
      <Pagination>
        <Pagination.First onClick={() => getMovies(1)} />
        <Pagination.Prev
          disabled={state.pageNo === 1}
          onClick={() => getMovies(state.pageNo - 1)}
        />
        {pageMap()}
        <Pagination.Next
          disabled={
            state.pageNo === Math.max(state.totalPages, 500)
          }
          onClick={() => getMovies(state.pageNo + 1)}
        />
        <Pagination.Last
          onClick={() =>
            getMovies(Math.max(state.totalPages, 500))
          }
        />
      </Pagination>
    )

  }

  const parseCategory = () => {
    if (state.category === '/now_playing' || state.category === '/top_rated') {
      let link = state.category
      link = link.slice(1)
      link = link.charAt(0).toUpperCase() + link.slice(1);
      link = link.replace('_', ' ')
      return link
    } else {
      let link = state.category
      link = link.slice(1)
      link = link.charAt(0).toUpperCase() + link.slice(1);
      return link
    }
  }

  const currentMovies = () => {
    if (state.searchedMovies.length === 20) {
      return state.searchedMovies
    } else if (state.searchTerm) {
      return state.allSearchedMovies
    } else {
      return state.movies
    }
  }

  const getMovies = async (page) => {
    const res = await fetch(`https://api.themoviedb.org/3${state.discover}/movie${state.category}?api_key=${API_KEY}&language=en-US&page=${page}&sort_by=${state.sortBy}&primary_release_date.gte=${state.years.min}-1-1&primary_release_date.lte=${state.years.max}-12-31&vote_average.gte=${state.ratings.min}&vote_average.lte=${
      state.ratings.max
      }&with_genres=${state.genre}`)
    const jsonData = await res.json()
    dispatch({
      type: 'getMovies',
      movies: jsonData.results,
      totalPages: jsonData.total_pages,
      pageNo: page
    })
  }

  useEffect(() => {
    getMovies(1)
  }, [state.category, state.searchedMovies, state.genre, state.years, state.ratings, state.sortBy])

  const searchMovie = async (query) => {
    if (query) {
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&page=1`);
      const jsonData = await response.json();
      console.log(jsonData)
      if (jsonData.total_results === 0) {
        alert('No movies with this title.')
      } else {
        let filtered = state.movies.filter(
          movie =>
            movie.title.toLowerCase().includes(query.toLowerCase())
        )
        let result = jsonData.results || filtered;
        dispatch({
          type: 'searchMovie',
          searchTerm: query,
          searchedMovies: result,
          allSearchedMovies: result,
          totalPages: jsonData.total_pages,
        })
      }
    } else {
      alert('Please enter a search term to search for movies')
    }
  }

  const getGenres = async () => {
    const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`)
    const jsonData = await res.json()
    dispatch({ type: 'getGenres', genres: jsonData.genres })
  }

  const getTrailerKey = async movieId => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
      );
      const jsonData = await response.json();
      dispatch({
        type: 'modal',
        trailerId: jsonData.results[0].key,
        trailerTitle: jsonData.results[0].name
      })
    } catch (TypeError) {
      alert("Trailer does not exist");
    }
  };

  const toggle = movieId => {
    if (!state.modal) {
      getTrailerKey(movieId);
    } else {
      dispatch({ type: 'closeModal' })
    }
  };

  return (
    <div className="container p-0 movieApp" >
      <NavBar
        {...{
          state,
          dispatch,
          parseCategory,
          searchMovie
        }}
      />
      <BreadCrumbs />
      <MoviePagination />
      <div className='row mt-2 pl-4 pr-4 movies'>
        <div className='col-lg-9'>
          <Movies
            {...{
              state,
              toggle
            }}
          />
        </div>
        <div className='col-lg-3'>
          <RightSideFilter
            {...{
              state,
              dispatch,
              getGenres,
              currentMovies
            }}
          />
        </div>
      </div >
      <TrailerModal />
    </div>
  );
}

export default App;
