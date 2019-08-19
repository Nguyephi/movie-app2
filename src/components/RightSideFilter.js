import React from 'react'
import { DropdownButton } from 'react-bootstrap'
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
            discover },
        getGenres,
        mapGenres
    } = props

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
            {discover !== '' && searchTerm.length == 0 &&
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
                </>}
        </>
    )
}