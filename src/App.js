import React, { useState, useEffect, useReducer } from 'react';
import { Dropdown, NavDropdown, Modal } from 'react-bootstrap'
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
  const [movies, setMovies] = useState([])
  const [searchedMovies, setSearchedMovies] = useState([])
  const [allSearchedMovies, setAllSearchedMovies] = useState([])
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'genreName': return {
        ...state,
        genreName: action.genreName
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
        searchTerm: action.searchTerm
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
            activeCategory: action.activeCategory
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
    })

  function BreadCrumbs() {
    return (
      <>
        <div className='d-flex mt-2 pl-4'>
          {state.searchTerm || state.category ? <div>Search: {state.searchTerm || parseCategory()}</div> : <div>All Movies</div>}
          {state.genreName && <div className='pl-1'>> {state.genreName}</div>}
          {state.activeCategory && <div className='pl-1'>> {state.activeCategory}</div>}
          <div className='pl-1'>({searchedMovies.length || 20})</div>
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
  const getMovies = async () => {
    const res = await fetch(`https://api.themoviedb.org/3${state.discover}/movie${state.category}?api_key=${API_KEY}&language=en-US&page=1&sort_by=${state.sortBy}&primary_release_date.gte=${state.years.min}-1-1&primary_release_date.lte=${state.years.max}-12-31&vote_average.gte=${state.ratings.min}&vote_average.lte=${
      state.ratings.max
      }&with_genres=${state.genre}`)
    const jsonData = await res.json()
    setMovies(jsonData.results)
  }

  const currentMovies = () => {
    if (searchedMovies.length === 20) {
      return searchedMovies
    } else if (state.searchTerm) {
      return allSearchedMovies
    } else {
      return movies
    }
  }

  const handleGenre = (genre) => {
    if (state.category || state.searchTerm) {
      const filterByGenres = currentMovies().filter(movie => {
        if (movie.genre_ids.includes(genre.id)) {
          return movie
        }
      })
      if (filterByGenres.length === 0) {
        const capSearchTerm = state.searchTerm.charAt(0).toUpperCase() + state.searchTerm.slice(1)
        const lowerGenreName = genre.name.charAt(0).toLowerCase() + genre.name.slice(1)
        alert(`No ${lowerGenreName} genre in your search: ${capSearchTerm}`)
      }
      else {
        dispatch({
          type: 'genreName',
          genreName: genre.name
        })
        setSearchedMovies(filterByGenres)
      }
    }
    else {
      dispatch({
        type: 'getGenresAllMovies',
        genre: genre.id,
        genreName: genre.name
      })
    }
  }

  const mapGenres = () => {
    return state.genres.map(genre => {
      return (
        <>
          <Dropdown.Item onClick={() => handleGenre(genre)} key={genre.id}>{genre.name}</Dropdown.Item >
        </>
      )
    })
  }

  useEffect(() => {
    getMovies()
  }, [state.category, searchedMovies, state.genre, state.years, state.ratings, state.sortBy])

  const searchMovie = async (query) => {
    if (query) {
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&page=1`);
      const jsonData = await response.json();
      if (jsonData.total_results === 0) {
        alert('No movies with this title.')
      } else {
        let filtered = movies.filter(
          movie =>
            movie.title.toLowerCase().includes(query.toLowerCase())
        )
        let result = jsonData.results || filtered;
        setSearchedMovies(result)
        setAllSearchedMovies(result)
        dispatch({
          type: 'searchMovie',
          searchTerm: query
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
          movies,
          searchedMovies,
          setSearchedMovies,
          parseCategory,
          searchMovie
        }}
      />
      <BreadCrumbs />
      <div className='row mt-2 pl-4 pr-4 movies'>
        <div className='col-lg-9'>
          <Movies
            {...{
              movies,
              searchedMovies,
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
              mapGenres
            }}
          />
        </div>
      </div >
      <TrailerModal />
    </div>
  );
}

export default App;
