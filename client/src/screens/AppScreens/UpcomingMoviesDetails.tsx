import {
    ActivityIndicator,
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    View,
    FlatList,
    TouchableOpacity,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { BORDERRADIUS, COLORS, FONTSIZE, SPACING } from "../../theme/theme";
  import { Colors } from "react-native/Libraries/NewAppScreen";
  import { API_KEY, baseImageURL } from "../../api/ApiCalls";
  import AppHeader from "../../components/AppHeader";
  import { StatusBar } from "expo-status-bar";
  import { LinearGradient } from "expo-linear-gradient";
  import { Feather } from "@expo/vector-icons";
  import { AntDesign } from "@expo/vector-icons";
  import CategoryHeader from "../../components/CategoryHeader";
  import CastCard from "../../components/CastCard";
  
  import UpcomingMovies from '../../data/UpcomingMovies.json'
  
  // fetching the Data from the API
  const getMovieDetails = async (movieid: number) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieid}?api_key=${API_KEY}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(`Something went wrong with the getMovieDetails`);
    }
  };
  
  const getMovieCastDetails = async (movieid: number) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieid}/credits?api_key=${API_KEY}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(`Something went wrong with the getMovieCastDetails`);
    }
  };

  const getUpcomingMovie = async () => {
    try {
        return UpcomingMovies;
    } catch (error) {
        console.error(`Error while getting upcoming movies: ${error}`);
    throw error;  // Rethrow the error for further handling if needed
    }
  }
  
  const UpcomingMoviesDetails = ({ navigation, route }: any) => {
    // state variable for collecting the movieData
    const [movieData, setMovieData] = useState<any>(undefined);
  
    // state variables for the MOvie Cast
    const [movieCast, setMovieCast] = useState<any>(undefined);
  
    const [upcomingMovies, setUpcomingMovies] = useState<any>(undefined);
  
    useEffect(() => {
      (async () => {
        const tempMovieDetails = await getMovieDetails(route.params.movieid);
        setMovieData(tempMovieDetails);
      })();
  
      (async () => {
        const tempMovieCastDetails = await getMovieCastDetails(
          route.params.movieid
        );
        setMovieCast(tempMovieCastDetails.cast);
      })();
  
      getUpcomingMovie()
        .then((upcomingMovie) => {
          setUpcomingMovies(upcomingMovie);
        })
        .catch((err) => {
          console.error(
            `Error while fetching the data inside of the upcomingmovies in useEffect`
          );
        });
    }, []);
    // console.log(telguMovies)

    // console.log(movieData);
    


// for formatting the Date format coming from the json data
    const formatDate = (inputDate: any) => {
        const dateParts = inputDate.split('-');
        const day = dateParts[2];
        const month = dateParts[1];
        const year = dateParts[0];
        return `${day} / ${month} / ${year}`;
      };

    const formattedReleaseDate = movieData?.release_date
    ? formatDate(movieData.release_date)
    : '';
  
    // Lazy Loading
    if (
      movieData == undefined &&
      movieData == null &&
      movieCast == undefined &&
      movieCast == null &&
      upcomingMovies == undefined &&
      upcomingMovies == null
    ) {
      return (
        <ScrollView
          style={styles.container}
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.appHeaderContainer}>
            <AppHeader
              name="close"
              header={"Movie Details"}
              action={() => navigation.goBack()}
            />
          </View>
          <View style={styles.activityLoaderContainer}>
            <ActivityIndicator size={"large"} color={COLORS.Orange} />
          </View>
        </ScrollView>
      );
    }
  
    return (
      <ScrollView
        style={styles.container}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        <StatusBar />
  
        {/* BG Image */}
        <View>
          <ImageBackground
            style={styles.imageBG}
            source={{ uri: baseImageURL("w780", movieData?.backdrop_path) }}
          >
            <LinearGradient
              colors={[COLORS.BlackRGB10, COLORS.Black]}
              style={styles.linearGradient}
            >
              {/* Adding APP Header */}
              <View style={styles.appHeaderContainer}>
                <AppHeader
                  name="close"
                  header={"Movie Details"}
                  action={() => navigation.goBack()}
                />
              </View>
            </LinearGradient>
          </ImageBackground>
          {/* Blank Background */}
          <View style={styles.imageBG}>
            {/* bringing the Poster Image */}
            <Image
              style={styles.cardImage}
              source={{ uri: baseImageURL("w342", movieData?.poster_path) }}
            />
          </View>
  
          {/* View for the Timinings */}
          {/* <View style = {styles.runtimeContainer}>
                <Feather style = {{marginRight : SPACING.space_8}} name="clock" size={FONTSIZE.size_20} color='gray' />
                <Text style = {styles.runtimeText}>{Math.floor(movieData?.runtime / 60)}h{' '}{Math.floor(movieData?.runtime % 60)}m</Text>
              </View> */}
  
          {/* Rating and Release Date */}
          <View style={styles.rateContainer}>
            <AntDesign name="like1" size={24} color="yellow" />
            <Text style={styles.runtimeText}>
              {movieData?.popularity
                ? movieData.popularity.toFixed(1)
                : "N/A"}{"k likes"}
              {/* ({movieData?.vote_count ? movieData.vote_count : "N/A"}) */}
            </Text>
            {/* <Text style = {styles.runtimeText}>{movieData?.release_date.substring(8,10)}{' '}{new Date(movieData?.release_date).toLocaleString('default' , {month : 'long' , })}{' '}{movieData?.release_date.substring(0,4)}</Text> */}
            <AntDesign name="calendar" size={24} color="gray" />
            <Text style={styles.runtimeText}>
              {
                formattedReleaseDate
              }
            </Text>
          </View>
  
          {/* View for the Movie Name */}
          <View>
            {/* Genre  */}
            <View style={styles.genreContainer}>
              {movieData?.genres.map((item: any) => {
                return (
                  <View style={styles.genreBox} key={item.id}>
                    <Text style={styles.genreText}>{item.name}</Text>
                  </View>
                );
              })}
            </View>
            <Text style={styles.movieTitle}>{movieData?.original_title}</Text>
            <Text style={styles.tagLine}>{movieData?.tagline}</Text>
          </View>
  
          <View style={styles.infoContainer}>
            <Text style={styles.movieDescription}>{movieData?.overview}</Text>
          </View>
  
          {/* TOP CAST CATEGORY */}
          <View>
            <CategoryHeader title="Top Cast" />
            <FlatList
              data={movieCast}
              keyExtractor={(item: any) => item.id}
              horizontal
              contentContainerStyle={styles.containerGap24}
              renderItem={({ item, index }) => (
                <CastCard
                  shouldMarginatedAtEnd={true}
                  cardWidth={80}
                  isFirst={index == 0 ? true : false}
                  isLast={index == movieCast?.length - 1 ? true : false}
                  imagePath={baseImageURL("w185", item.profile_path)}
                  title={item.original_name}
                  subTitle={item.character}
                />
              )}
            />
  
            {/* Button */}
            <View style = {{flexDirection : 'row' , justifyContent : 'space-evenly'}}>
              <TouchableOpacity
                style={styles.buttonBG}
                onPress={() => {
                  const selectedMovie = upcomingMovies?.results?.find(
                    (movie: any) => movie.id === route.params.movieid
                  );
                  // console.log('Selected Movie:', selectedMovie);
                  const movieLink = selectedMovie?.movie_link;
                  const selectedMovieName = upcomingMovies?.results?.find(
                    (movie: any) => movie.id === route.params.movieid
                  );
                  // console.log('Selected Movie:', selectedMovie);
                  const movieName = selectedMovieName?.title;
                  // console.log(movieName);
                  
                  navigation.push("WatchTrailer", {
                    bgImage: baseImageURL("w780", movieData.backdrop_path),
                    posterImage: baseImageURL("original", movieData.poster_path),
                    movieLink: movieLink,
                    movieName : movieName , 
                    movieData : movieData
                  });
                }}
              >
                <Text style={styles.watchButtonText}>Watch Trailer</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.buttonBG}
                onPress={() => {
                  const selectedMovie = upcomingMovies?.results?.find(
                    (movie: any) => movie.id === route.params.movieid
                  );
                  // console.log('Selected Movie:', selectedMovie);
                  const movieLink = selectedMovie?.movie_link;
                  const selectedMovieName = upcomingMovies?.results?.find(
                    (movie: any) => movie.id === route.params.movieid
                  );
                  // console.log('Selected Movie:', selectedMovie);
                  const movieName = selectedMovieName?.title;
                  // console.log(movieName);
                  
                  navigation.push("BookMovie", {
                    bgImage: baseImageURL("w780", movieData.backdrop_path),
                    posterImage: baseImageURL("original", movieData.poster_path),
                    movieLink: movieLink,
                    movieName : movieName
                  });
                }}
              >
                <Text style={styles.watchButtonText}>Book Tickets</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };
  
  export default UpcomingMoviesDetails;
  
  const styles = StyleSheet.create({
    container: {
      display: "flex",
      flex: 1,
      backgroundColor: COLORS.Black,
      color: Colors.White,
    },
    textColor: {
      color: COLORS.White,
      textAlign: "center",
    },
    activityLoaderContainer: {
      flex: 1,
      alignSelf: "center", //AA2829
      justifyContent: "center",
    },
    appHeaderContainer: {
      marginHorizontal: SPACING.space_36,
      marginTop: SPACING.space_20 * 2,
    },
    imageBG: {
      width: "100%",
      aspectRatio: 3072 / 1727, //resolution of the image
    },
    linearGradient: {
      height: "100%",
    },
    cardImage: {
      width: "60%",
      aspectRatio: 200 / 300,
      position: "absolute",
      bottom: 0,
      alignSelf: "center",
    },
    runtimeContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: SPACING.space_15,
    },
    runtimeText: {
      fontSize: FONTSIZE.size_14,
      color: COLORS.White,
    },
    movieTitle: {
      fontSize: FONTSIZE.size_24,
      color: COLORS.White,
      marginHorizontal: SPACING.space_36,
      marginVertical: SPACING.space_10,
      textAlign: "center",
    },
    genreContainer: {
      flex: 1,
      flexDirection: "row",
      gap: SPACING.space_20,
      flexWrap: "wrap",
      justifyContent: "center",
    },
    genreBox: {
      borderColor: COLORS.WhiteRGBA50,
      borderWidth: 1,
      paddingHorizontal: SPACING.space_10,
      paddingVertical: SPACING.space_4,
      borderRadius: BORDERRADIUS.radius_25,
    },
    genreText: {
      fontSize: FONTSIZE.size_10,
      color: COLORS.WhiteRGBA75,
    },
    tagLine: {
      fontSize: FONTSIZE.size_14,
      fontStyle: "italic",
      color: COLORS.White,
      marginHorizontal: SPACING.space_36,
      marginVertical: SPACING.space_15,
      textAlign: "center",
    },
    infoContainer: {
      marginHorizontal: SPACING.space_24,
    },
    rateContainer: {
      flexDirection: "row",
      gap: SPACING.space_10,
      alignItems: "center",
      justifyContent: "center",
      marginVertical: SPACING.space_12,
    },
    movieDescription: {
      marginVertical: SPACING.space_12,
      fontSize: FONTSIZE.size_14,
      color: COLORS.White,
    },
    containerGap24: {
      gap: SPACING.space_24,
    },
    buttonBG: {
      alignItems: "center",
      marginVertical: SPACING.space_24,
    },
    watchButtonText: {
      borderRadius: BORDERRADIUS.radius_25 * 2,
      paddingHorizontal: SPACING.space_24,
      paddingVertical: SPACING.space_10,
      backgroundColor: COLORS.Orange,
      fontSize: FONTSIZE.size_14,
      color: COLORS.White,
    },
  });
  
  /*
  
  
  Certainly! Let's break down the expression movie.id === route.params.movieid step by step:
  
  movie is a parameter representing each individual element (in this case, a movie object) in the array we are iterating over.
  
  movie.id refers to the id property of the current movie object.
  
  route.params.movieid refers to the movieid passed as a parameter through React Navigation's route.params. This is typically a unique identifier for a specific movie.
  
  === is the strict equality operator in JavaScript, which checks if the id of the current movie (retrieved with movie.id) is exactly equal to the movieid passed via route.params.
  
  Putting it all together:
  
  movie.id === route.params.movieid is a comparison. It checks if the id of the current movie in the array is the same as the movieid passed from the route parameters.
  This comparison is used as a condition to filter the movies in the telguMovies.results array to find the movie whose id matches the movieid passed from the route parameters. The find method is often used for this purpose, returning the first element that satisfies the condition.
  
  */
  