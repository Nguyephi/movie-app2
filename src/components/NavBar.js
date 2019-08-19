import React from 'react'
import { Navbar, Nav, Form, FormControl, Button, NavDropdown, Dropdown } from 'react-bootstrap'
const navbarLogo = require('../navbarLogo.png');

export default function NavBar(props) {
    const {
        dispatch,
        state: {
            movies,
            activeCategory,
            category,
            searchTerm,
            discover,
            search,
            searchedMovies,
        },
        searchMovie,
        parseCategory,
    } = props

    const onSearch = (e) => {
        e.preventDefault()
        searchMovie(search)
        dispatch({ type: 'search', discover: '/discover' })
    }

    const handleCategories = () => {
        function handleCategory(pickedCategory) {
            dispatch({
                type: 'handleCategory',
                category: `/${pickedCategory}`,
            })
        }
        return (
            <>
                < NavDropdown.Item onClick={() => handleCategory('now_playing')}>Now Playing</NavDropdown.Item >
                {/* < NavDropdown.Item onClick={() => handleCategory('latest')}>Latest</NavDropdown.Item > */}
                < NavDropdown.Item onClick={() => handleCategory('top_rated')}>Top Rated</NavDropdown.Item >
                < NavDropdown.Item onClick={() => handleCategory('upcoming')}>Upcoming</NavDropdown.Item >
                < NavDropdown.Item onClick={() => handleCategory('popular')}>Popular</NavDropdown.Item >
            </>
        )
    }

    function sortLeastPopularMovie(categoryName) {
        if (searchTerm.length > 0) {
            const sortedMovies = searchedMovies.sort((a, b) => a.popularity - b.popularity)
            const movieArr = [].concat(sortedMovies)
            dispatch({
                type: 'sort',
                condition: 'one',
                activeCategory: categoryName,
                searchedMovies: movieArr
            })
        }
        else if (category) {
            dispatch({
                type: 'sort',
                condition: 'one',
                activeCategory: categoryName,
                searchedMovies: movies.sort((a, b) => a.popularity - b.popularity)
            })
        } else {
            dispatch({ type: 'sort', condition: 'two', sortBy: 'popularity.asc', activeCategory: categoryName })
        }
    }

    function sortMostPopularMovie(categoryName) {
        if (searchTerm.length > 0) {
            const sortedMovies = searchedMovies.sort((a, b) => b.popularity - a.popularity)
            const movieArr = [].concat(sortedMovies)
            dispatch({
                type: 'sort',
                condition: 'one',
                activeCategory: categoryName,
                searchedMovies: movieArr
            })
        } else if (category) {
            dispatch({
                type: 'sort',
                condition: 'one',
                activeCategory: categoryName,
                searchedMovies: movies.sort((a, b) => b.popularity - a.popularity)
            })
        } else {
            dispatch({ type: 'sort', condition: 'two', sortBy: 'popularity.desc', activeCategory: categoryName })
        }
    }

    function sortLowestRatedMovie(categoryName) {
        if (searchTerm.length > 0) {
            const sortedMovies = searchedMovies.sort((a, b) => a.vote_average - b.vote_average)
            const movieArr = [].concat(sortedMovies)
            dispatch({
                type: 'sort',
                condition: 'one',
                activeCategory: categoryName,
                searchedMovies: movieArr
            })
        } else if (category) {
            dispatch({
                type: 'sort',
                condition: 'one',
                activeCategory: categoryName,
                searchedMovies: movies.sort((a, b) => a.vote_average - b.vote_average)
            })
        } else {
            dispatch({ type: 'sort', condition: 'two', sortBy: 'vote_average.asc', activeCategory: categoryName })
        }
    }

    function sortHighestRatedMovie(categoryName) {
        if (searchTerm.length > 0) {
            const sortedMovies = searchedMovies.sort((a, b) => b.vote_average - a.vote_average)
            const movieArr = [].concat(sortedMovies)
            dispatch({
                type: 'sort',
                condition: 'one',
                activeCategory: categoryName,
                searchedMovies: movieArr
            })
        } else if (category) {
            dispatch({
                type: 'sort',
                condition: 'one',
                activeCategory: categoryName,
                searchedMovies: movies.sort((a, b) => b.vote_average - a.vote_average)
            })
        } else {
            dispatch({ type: 'sort', condition: 'two', sortBy: 'vote_average.desc', activeCategory: categoryName })
        }
    }

    function sorting() {
        if (discover === '' || searchTerm.length > 0) {
            return (
                <>
                    < Dropdown.Item onClick={() => sortMostPopularMovie('Most Popular')}>Most Popular</Dropdown.Item >
                    < Dropdown.Item onClick={() => sortLeastPopularMovie('Least Popular')}>Least Popular</Dropdown.Item >
                    < Dropdown.Item onClick={() => sortHighestRatedMovie('Highest Rated')}>Highest Rated</Dropdown.Item >
                    < Dropdown.Item onClick={() => sortLowestRatedMovie('Lowest Rated')}>Lowest Rated</Dropdown.Item >
                </>
            )
        } else {
            return (
                <>
                    < Dropdown.Item onClick={() => sortMostPopularMovie('Most Popular')}>Most Popular</Dropdown.Item >
                    < Dropdown.Item onClick={() => sortLeastPopularMovie('Least Popular')}>Least Popular</Dropdown.Item >
                    < Dropdown.Item onClick={() => sortHighestRatedMovie('Highest Rated')}>Highest Rated</Dropdown.Item >
                    < Dropdown.Item onClick={() => sortLowestRatedMovie('Lowest Rated')}>Lowest Rated</Dropdown.Item >
                </>
            )
        }
    }

    return (
        <div>
            <Navbar collapseOnSelect expand="lg" bg="light">

                <Navbar.Brand href="/">
                    <img
                        src={navbarLogo}
                        width="30"
                        height="30"
                        className="d-inline-block align-top mr-2"
                        alt="React Bootstrap logo"
                    />
                    {"Phil's Movies"}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="ml-auto">
                        <NavDropdown
                            id="collasible-nav-dropdown"
                            className='pr-2'
                            title={parseCategory() || "Categories"}
                        >
                            {handleCategories()}
                        </NavDropdown>
                        <NavDropdown
                            className='sortBy pr-2'
                            title={activeCategory || "Sort by"}
                        >
                            {sorting()}
                        </NavDropdown>
                    </Nav>
                    <Form inline>
                        <FormControl value={search} onChange={(e) => dispatch({ type: 'searchInput', search: e.target.value })} type="text" placeholder="Search Movie Library" className="mr-sm-2" />
                        <Button type="submit" onClick={(e) => onSearch(e)}>Submit</Button>
                    </Form>
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}