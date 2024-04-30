export const API_KEY: string = '80e31e40521ab1451de8ed133fc75446'

export const baseImageURL = (size: string , path: string) => {
    return `https://image.tmdb.org/t/p/${size}${path}`
}

export const nowPlayingMovies: string = `
https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`;

export const popularMovies: string = `
https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`

export const topRatedMovies: string = `
https://api.themoviedb.org/3/movie/top_rated/?api_key=${API_KEY}`

export const searchMovies = (keyword: string) => {
    return `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${keyword}`
}

export const movieDetails = (id: number) => {
    return `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`
}

export const movieCastDetails = (id: number) => {
    return `
    https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`
}

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