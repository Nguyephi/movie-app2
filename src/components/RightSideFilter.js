import React from 'react'
import { DropdownButton, Dropdown } from 'react-bootstrap'
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";

export default function RightSideFilter(props) {
    const {
        dispatch,
        state: {
            searchTerm,
            genreName,
            years,
            ratings,
            discover,
            category,
            genres
        },
        getGenres,
        currentMovies
        // mapGenres
    } = props

    const handleGenre = (genre) => {
        if (category || searchTerm) {
            const filterByGenres = currentMovies().filter(movie => {
                if (movie.genre_ids.includes(genre.id)) {
                    return movie
                }
            })
            if (filterByGenres.length === 0) {
                const capSearchTerm = searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1)
                const lowerGenreName = genre.name.charAt(0).toLowerCase() + genre.name.slice(1)
                alert(`No ${lowerGenreName} genre in your search: ${capSearchTerm}`)
            }
            else {
                dispatch({
                    type: 'genreName',
                    genreName: genre.name,
                    searchedMovies: filterByGenres
                })
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
        return genres.map(genre => {
            return (
                <>
                    <Dropdown.Item onClick={() => handleGenre(genre)} key={genre.id}>{genre.name}</Dropdown.Item >
                </>
            )
        })
    }

    return (
        <>
            <div className='pb-3 text-center'>filter by genre:</div>
            <DropdownButton
                className='genres'
                onClick={() => getGenres()}
                variant="outline-secondary"
                title={genreName || "Genres"}
            >
                {mapGenres()}
            </DropdownButton>
            {/* {discover !== '' && searchTerm.length == 0 &&
                <>
                    <div className='pb-3 text-center mt-4'>filter by year:</div>
                    <InputRange
                        maxValue={2019}
                        minValue={1874}
                        value={years}
                        onChange={year => dispatch({ type: 'years', years: year })}
                    />
                    <div className='pb-3 text-center mt-2'>filter by rating:</div>
                    <InputRange
                        maxValue={10}
                        minValue={0}
                        value={ratings}
                        onChange={rating => dispatch({ type: 'ratings', ratings: rating })}
                    />
                </>} */}
        </>
    )
}