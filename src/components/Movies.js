import React from 'react'
import { Card } from 'react-bootstrap'
import Moment from 'react-moment';



export default function Movies(props) {
    const { toggle, state: { movies, searchedMovies } } = props

    let currentMovies = () => {
        if (searchedMovies.length > 0) {
            return searchedMovies
        } else {
            return movies
        }
    }

    if (currentMovies().length > 0) {
        return (
            <Card>
                {currentMovies().map(({ title, overview, poster_path, id, vote_average, release_date }) => (
                    <Card
                        className='movieCard style-3'
                        key={id}
                        style={{
                            flexDirection: 'row',
                            height: '16rem',
                            border: 'none',
                            margin: 10,
                            overflow: 'auto'
                        }}>
                        <Card.Img
                            style={{ width: '10rem' }}
                            src={`https://image.tmdb.org/t/p/w500${poster_path}`} />
                        <Card.Body
                            style={{
                                height: '15rem',
                            }}>
                            <Card.Title
                                className='mb-1'
                                style={{
                                    fontWeight: 600,
                                    display: 'flex',
                                }}
                            >
                                <div className='pr-1'>{title}</div>
                                (<Moment format="YYYY">{release_date}</Moment>)
          </Card.Title>
                            <Card.Text className='mb-0'>Voted: {vote_average} out of 10</Card.Text>
                            <Card.Text style={{
                                overflowY: 'auto',
                                height: '8rem',
                                fontSize: 14
                            }}>
                                {overview}
                            </Card.Text>
                            <a onClick={() => toggle(id)}>Watch Trailer</a>
                        </Card.Body>
                    </Card>
                ))}
            </Card>
        )
    } else {
        return (
            <div className='text-center mt-5' style={{ height: '510px' }}>
                <h4>Sorry no movie found. It could be an error with the api. Search feature may still be available.</h4>
            </div>
        )
    }
}
