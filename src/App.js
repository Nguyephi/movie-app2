import React, { useState, useEffect } from 'react';
import { Card, Dropdown, NavDropdown, Modal } from 'react-bootstrap'
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
  const [state, setState] = useState(
    {
      movies: [],
      allMovies: [],
      search: '',
      searchTerm: '',
      genre: '',
      genreName: '',
      genres: [],
      sortBy: 'popularity.desc',
      activeCategory: '',
      searchedMovies: [],
      allSearchedMovies: [],
      years: { min: 1874, max: 2019 },
      ratings: { min: 0, max: 10 },
      discover: '/discover',
      category: '',
      modal: false,
      trailerId: '',
      trailerTitle: '',
      testing: false
    })

  // const {
  //   movies,
  //   searchTerm,
  //   genre,
  //   genreName,
  //   genres,
  //   sortBy,
  //   activeCategory,
  //   searchedMovies,
  //   allSearchedMovies,
  //   years,
  //   ratings,
  //   discover,
  //   category,
  //   modal,
  //   trailerId,
  //   trailerTitle,
  //   testing
  // } = state



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
  console.log('globalll', state.genreName);
  console.log('globalll', state.category);
  const getMovies = async () => {
    console.log('locallllll', state.genreName);
    console.log('locallllll', state.category);
    const res = await fetch(`https://api.themoviedb.org/3${state.discover}/movie${state.category}?api_key=${API_KEY}&language=en-US&page=1&sort_by=${state.sortBy}&primary_release_date.gte=${state.years.min}-1-1&primary_release_date.lte=${state.years.max}-12-31&vote_average.gte=${state.ratings.min}&vote_average.lte=${
      state.ratings.max
      }&with_genres=${state.genre}`)
    const jsonData = await res.json()
    setState({
      ...state,
      movies: jsonData.results,
      allMovies: jsonData.results
    })
  }

  // console.log('222', state.genreName);

  const currentMovies = () => {
    if (state.searchedMovies.length === 20) {
      return state.searchedMovies
    } else if (state.searchTerm) {
      return state.allSearchedMovies
    } else {
      return state.movies
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
        setState({
          ...state,
          genreName: genre.name,
          searchedMovie: filterByGenres
        })
      }
    }
    else {
      setState({
        ...state,
        genre: genre.id,
        genreName: genre.name,
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
  }, [state.category, state.searchedMovies, state.genre, state.years, state.ratings, state.sortBy, state.testing])

  const searchMovie = async (query) => {
    if (query) {
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&page=1`);
      const jsonData = await response.json();
      if (jsonData.total_results === 0) {
        alert('No movies with this title.')
      } else {
        let filtered = state.movies.filter(
          movie =>
            movie.title.toLowerCase().includes(query.toLowerCase())
        )
        let result = jsonData.results || filtered;
        setState({
          ...state,
          searchedMovies: result,
          // allSearchedMovies: result,
          activeCategory: '',
          category: '',
          search: '',
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
    setState({ ...state, genres: jsonData.genres })
  }

  const getTrailerKey = async movieId => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`
      );
      const jsonData = await response.json();
      setState({
        ...state,
        modal: true,
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
      setState({ ...state, modal: false })
    }
  };

  const test = () => {
    setState({ ...state, testing: !state.testing })
  }

  return (
    <div className="container p-0 movieApp" >
      <NavBar
        {...{
          state,
          setState,
          parseCategory,
          searchMovie,
          test
        }}
      />
      <div className='d-flex mt-2 pl-4'>
        {state.searchTerm || state.category ? <div>Search: {state.searchTerm || parseCategory()}</div> : <div>All Movies</div>}
        {state.genreName && <div className='pl-1'>> {state.genreName}</div>}
        {state.activeCategory && <div className='pl-1'>> {state.activeCategory}</div>}
        <div className='pl-1'>({state.searchedMovies.length || 20})</div>
      </div>
      <div className='row mt-2 pl-4 pr-4'>
        <div className='col-lg-9'>
          <Card>
            <Movies
              {...{
                state,
                toggle
              }}
            />
          </Card>
        </div>
        <div className='col-lg-3'>
          <RightSideFilter
            {...{
              state,
              setState,
              getGenres,
              handleGenre,
              mapGenres,
              test
            }}
          />
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
        </div>

      </div >
    </div>
  );
}

export default App;
