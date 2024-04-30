import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { WebView } from "react-native-webview";
import { BORDERRADIUS, COLORS, FONTSIZE, SPACING } from "../../theme/theme";
import AppHeader from "../../components/AppHeader";
import CategoryHeader from "../../components/CategoryHeader";

import AllMovies from "../../data/AllMovies.json";
import NowPlayingMoviesData from "../../data/NowPlayingMovies.json";
import { AntDesign } from "@expo/vector-icons";

import { baseImageURL } from "../../api/ApiCalls";
import MovieCard from "../../components/MovieCard";

// for the responsive UI
const { width, height } = Dimensions.get("window");

const getAllMovies = async () => {
  try {
    // console.log('Fetching Telugu Movies...');
    //  TelguMovies;  // Assuming TelguMovies is in the expected format
    // console.log('Fetched Telugu Movies:', teluguMovies);
    return AllMovies;
  } catch (error) {
    console.error(`Error while getting AllMovies: ${error}`);
    throw error;
  }
};

const getNowPlaying = async () => {
  try {
    return NowPlayingMoviesData;
  } catch (error) {
    console.error(`Error while getting NowPlaying: ${error}`);
    throw error;
  }
};

export default function WatchMovie({ navigation, route }: any) {
  const [allMovies, setAllMovies] = useState<any>(undefined);

  const [nowPlaying, setNowPlaying] = useState<any>(undefined);

  const movieName = route.params.movieName;

  // console.log(route.params);

  const selectedMovie = allMovies?.results?.find(
    (movie: any) => movie.title === movieName
  );

  // storing youtube trailer link of the movie into the variable
  const ytLink = selectedMovie?.trailerLink;

  // console.log(ytLink);

  const movieDetails = route.params.movieData;

  // console.log(movieDetails);

  // for formatting the Date format coming from the json data
  const formatDate = (inputDate: any) => {
    const dateParts = inputDate.split("-");
    const day = dateParts[2];
    const month = dateParts[1];
    const year = dateParts[0];
    return `${day} / ${month} / ${year}`;
  };

  const formattedReleaseDate = movieDetails?.release_date
    ? formatDate(movieDetails.release_date)
    : "";

  // function to navigate to MovieDetails Page in the app
  const navigateToMovieDetails = (movieId: number) => {
    navigation.navigate("MovieDetails", { movieid: movieId });
  };

  useEffect(() => {
    getAllMovies()
      .then((allMovie) => {
        setAllMovies(allMovie);
      })
      .catch((err) => {
        console.error(
          `Error while fetching the data inside of the AllMovies in useEffect`
        );
      });
  }, []);

  if (allMovies == undefined && allMovies == null) {
    return (
      <ScrollView
        style={styles.container}
        bounces={false}
        // contentContainerStyle={styles.scrollViewContainer}
      >
        <View style={styles.activityLoaderContainer}>
          <ActivityIndicator size={"large"} color={COLORS.Orange} />
        </View>
        <StatusBar hidden />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.appHeaderContainer}>
        <AppHeader
          name="close"
          header={`${movieName}`}
          action={() => navigation.goBack()}
        />
      </View>
      <View style={{ marginTop: "5%" }}>
        <YoutubePlayer height={300} play={false} videoId={ytLink} />
      </View>
      {/* Rating and Release Date */}
      <View style={styles.rateContainer}>
        <AntDesign name="like1" size={24} color="yellow" />
        <Text style={styles.runtimeText}>
          {movieDetails?.popularity
            ? movieDetails.popularity.toFixed(1)
            : "N/A"}
          {"k likes"}
          {/* ({movieData?.vote_count ? movieData.vote_count : "N/A"}) */}
        </Text>
        {/* <Text style = {styles.runtimeText}>{movieData?.release_date.substring(8,10)}{' '}{new Date(movieData?.release_date).toLocaleString('default' , {month : 'long' , })}{' '}{movieData?.release_date.substring(0,4)}</Text> */}
        <AntDesign name="calendar" size={24} color="gray" />
        <Text style={styles.runtimeText}>{formattedReleaseDate}</Text>
      </View>

      {/* View for the Movie Name */}
      <View>
        {/* Genre  */}
        <View style={styles.genreContainer}>
          {movieDetails?.genres.map((item: any) => {
            return (
              <View style={styles.genreBox} key={item.id}>
                <Text style={styles.genreText}>{item.name}</Text>
              </View>
            );
          })}
        </View>
        <Text style={styles.movieTitle}>{movieDetails?.original_title}</Text>
        <Text style={styles.tagLine}>{movieDetails?.tagline}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.movieDescription}>{movieDetails?.overview}</Text>
      </View>

      <StatusBar style="dark" hidden />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    flex: 1,
  },
  appHeaderContainer: {
    marginHorizontal: SPACING.space_24,
    marginTop: SPACING.space_10,
  },
  containerGap36: {
    gap: SPACING.space_36,
  },
  activityLoaderContainer: {
    flex: 1,
    alignSelf: "center", //AA2829
    justifyContent: "center",
  },
  rateContainer: {
    flexDirection: "row",
    gap: SPACING.space_10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: SPACING.space_12,
  },
  runtimeText: {
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
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
  movieTitle: {
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
    marginHorizontal: SPACING.space_36,
    marginVertical: SPACING.space_10,
    textAlign: "center",
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
  movieDescription: {
    marginVertical: SPACING.space_12,
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
  },
  containerGap24: {
    gap: SPACING.space_24,
  },
});
