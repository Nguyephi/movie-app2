import React from 'react'
import { Navbar, Nav, Form, FormControl, Button, NavDropdown, Dropdown } from 'react-bootstrap'
// import { statement } from '@babel/template';
const navbarLogo = require('../navbarLogo.png');

export default function NavBar(props) {
    const {
        state,
        state: {
            activeCategory,
            category,
            movies,
            searchTerm,
            searchedMovies,
            discover,
            search,
            genreName
        },
        setState,
        parseCategory,
        searchMovie,
        test
    } = props

    const onSearch = (e) => {
        e.preventDefault()
        searchMovie(search)
        setState({ ...state, discover: '/discover' })
    }

    const handleCategories = () => {
        function handleCategory(pickedCategory) {
            setState({
                ...state,
                category: `/${pickedCategory}`,
                discover: '',
                genreName: '',
                search: '',
                searchTerm: '',
                activeCategory: '',
                searchedMovies: []
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
        // setState({ ...state, })
        if (searchTerm.length > 0) {
            const sortedMovies = searchedMovies.sort((a, b) => a.popularity - b.popularity)
            const movieArr = [].concat(sortedMovies)
            setState({ ...state, searchedMovies: movieArr, activeCategory: categoryName })
        }
        else if (category) {
            setState({ ...state, searchedMovies: movies.sort((a, b) => a.popularity - b.popularity), activeCategory: categoryName })
        } else {
            setState({ ...state, sortBy: 'popularity.asc', activeCategory: categoryName })
        }
    }

    function sortMostPopularMovie(categoryName) {
        // setState({ ...state, activeCategory: categoryName })
        if (searchTerm.length > 0) {
            const sortedMovies = searchedMovies.sort((a, b) => b.popularity - a.popularity)
            const movieArr = [].concat(sortedMovies)
            setState({ ...state, searchedMovies: movieArr, activeCategory: categoryName })
        } else if (category) {
            setState({ ...state, searchedMovies: movies.sort((a, b) => b.popularity - a.popularity), activeCategory: categoryName })
        } else {
            setState({ ...state, sortBy: 'popularity.desc', activeCategory: categoryName })
        }
    }

    function sortLowestRatedMovie(categoryName) {
        if (searchTerm.length > 0) {
            const sortedMovies = searchedMovies.sort((a, b) => a.vote_average - b.vote_average)
            const movieArr = [].concat(sortedMovies)
            setState({ ...state, searchedMovies: movieArr, activeCategory: categoryName })
        } else if (category) {
            setState({ ...state, searchedMovies: movies.sort((a, b) => a.vote_average - b.vote_average), activeCategory: categoryName })
        } else {
            setState({ ...state, sortBy: 'vote_average.asc', activeCategory: categoryName })
        }
    }

    function sortHighestRatedMovie(categoryName) {
        setState({ ...state, activeCategory: categoryName })
        if (searchTerm.length > 0) {
            const sortedMovies = searchedMovies.sort((a, b) => b.vote_average - a.vote_average)
            const movieArr = [].concat(sortedMovies)
            setState({ ...state, searchedMovies: movieArr, activeCategory: categoryName })
        } else if (category) {
            setState({ ...state, searchedMovies: movies.sort((a, b) => b.vote_average - a.vote_average), activeCategory: categoryName })
        } else {
            setState({ ...state, sortBy: 'vote_average.desc', activeCategory: categoryName })
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
                <Button onClick={() => test()}>Test</Button>
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
                        <FormControl value={search} onChange={(e) => setState({ ...state, search: e.target.value })} type="text" placeholder="Search Movie Library" className="mr-sm-2" />
                        <Button type="submit" onClick={(e) => onSearch(e)}>Submit</Button>
                    </Form>
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}