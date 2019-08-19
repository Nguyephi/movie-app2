import React from 'react'
import { DropdownButton, Dropdown, Button } from 'react-bootstrap'
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";

export default function RightSideFilter(props) {
    const {
        state,
        state: { movies,
            searchedMovies,
            allSearchedMovies,
            genres,
            category,
            searchTerm,
            genreName,
            years,
            ratings,
            discover },
        setState,
        getGenres,
        mapGenres,
        test
    } = props

    return (
        <>
            <Button onClick={() => test()}>Test</Button>
            <div className='pb-3 text-center'>filter by genre:</div>
            <DropdownButton
                className='genres'
                onClick={() => getGenres()}
                variant="outline-secondary"
                title={genreName || "Genres"}
            >
                {mapGenres()}
            </DropdownButton>
            {discover !== '' &&
                <>
                    <div className='pb-3 text-center mt-4'>filter by year:</div>
                    <InputRange
                        maxValue={2019}
                        minValue={1874}
                        value={years}
                        onChange={year => setState({ ...state, years: year })}
                    />
                    <div className='pb-3 text-center mt-2'>filter by rating:</div>
                    <InputRange
                        maxValue={10}
                        minValue={0}
                        value={ratings}
                        onChange={rating => setState({ ...state, ratings: rating })}
                    />
                </>}
        </>
    )
}