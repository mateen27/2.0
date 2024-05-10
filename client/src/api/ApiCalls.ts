export const API_KEY: string = '80e31e40521ab1451de8ed133fc75446'

export const AllMovies: string = 'http://localhost:3001/api/user/all-movies/'

export const baseImageURL = (size: string , path: string) => {
    return `https://image.tmdb.org/t/p/${size}${path}`
}

export const nowPlayingMovies: string = `
http://localhost:3001/api/user/now-playing-movies/`;

export const popularMovies: string = `
http://localhost:3001/api/user/popular-movies`

export const topRatedMovies: string = `
http://localhost:3001/api/user/topRated-movies`

export const searchMovies = (keyword: string) => {
    return `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${keyword}`
}

export const movieDetails = (id: number) => {
    return `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
}

// export const movieCastDetails = (id: number) => {
//     return `
//     https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`
// }

export const topRatedTVShows: string = `
https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}`

export const popularTVShows: string = `
https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}`

export const onAirTVShows: string = `
https://api.themoviedb.org/3/tv/on_the_air?api_key?=${API_KEY}`

export const TVShowDetails = (id: number) => {`
https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`
}

export const searchTVShow = (keyword: string) => {
    return `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${keyword}`
}