import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  Button,
  TouchableOpacity,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { WebView } from "react-native-webview";
import { BORDERRADIUS, COLORS, FONTSIZE, SPACING } from "../../theme/theme";
import AppHeader from "../../components/AppHeader";
import SubMovieCards from "../../components/SubMovieCards";
import CategoryHeader from "../../components/CategoryHeader";
import { AntDesign } from "@expo/vector-icons";

import TelguMovies from "../../data/TelguMovies.json";
import TamilMovies from "../../data/TamilMovies.json";
import { baseImageURL } from "../../api/ApiCalls";
import InputHeader from "../../components/InputHeader";

import { useNavigation } from "@react-navigation/native";

import * as React from "react";
import { Video, ResizeMode } from "expo-av";
// import VideoPlayer from 'react-native-video-player';
import { LinearGradient } from "expo-linear-gradient";
import * as ScreenOrientation from "expo-screen-orientation";
import CastCard from "../../components/CastCard";

// for the responsive UI
const { width, height } = Dimensions.get("window");

export default function WatchMovie({ navigation, route }: any) {
  const movie_link = route.params.movieLink;
  const movie_name = route.params.movieName;
  const BgImage = route.params.bgImage;
  const movieDetails = route.params.movieDetails;

  // console.log(movieDetails);

  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  // console.log(route);

  const [orientationIsLandscape, setOrientation] = useState(false);

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

  useEffect(() => {
    // Lock the orientation when the component mounts
    async function lockOrientation() {
      try {
        await ScreenOrientation.lockAsync(
          orientationIsLandscape
            ? ScreenOrientation.OrientationLock.LANDSCAPE
            : ScreenOrientation.OrientationLock.PORTRAIT
        );
      } catch (error) {
        console.error("Error locking orientation:", error);
      }
    }

    lockOrientation();
  }, [orientationIsLandscape]);

  const toggleOrientation = () => {
    setOrientation(!orientationIsLandscape);
  };

  // function to navigate to MovieDetails Page in the app
  const navigateToMovieDetails = (movieId: number) => {
    navigation.navigate("MovieDetails", { movieid: movieId });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.appHeaderContainer}>
        <AppHeader
          name="close"
          header={` ${movie_name}`}
          action={() => navigation.goBack()}
        />
      </View>
      <View>
        <Video
          ref={video}
          style={styles.video}
          source={{
            uri: movie_link,
          }}
          useNativeControls //for the controllers which are coming below
          // resizeMode="contain"
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          volume={1.0}
          // width = {300}
          // showPoster = {true}
          // controls={true}
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />
        {/* <VideoPlayer
      video={{ uri: movie_link }}
      videoWidth={1600}
      videoHeight={900}
      autoplay={true}
      // style={styles.video}
    /> */}
        <TouchableOpacity
          style={{ alignItems: "flex-end" }}
          onPress={toggleOrientation}
        >
          <Text
            style={{
              color: COLORS.White,
              fontSize: FONTSIZE.size_18,
              width: 200,
              backgroundColor: COLORS.primary,
              textAlign: "center",
              padding: 10,
              borderRadius: 5,
            }}
          >
            Change Orientation
          </Text>
        </TouchableOpacity>

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

          {/* <CategoryHeader title="Top Cast" />
            <FlatList
              data={movieDetails}
              keyExtractor={(item: any) => item.id}
              horizontal
              contentContainerStyle={styles.containerGap24}
              renderItem={({ item, index }) => (
                <CastCard
                  shouldMarginatedAtEnd={true}
                  cardWidth={80}
                  isFirst={index == 0 ? true : false}
                  isLast={index == movieDetails?.length - 1 ? true : false}
                  imagePath={baseImageURL("w185", item.profile_path)}
                  title={item.original_name}
                  subTitle={item.character}
                />
              )}
            /> */}
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
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  containerGap36: {
    gap: SPACING.space_36,
  },
  activityLoaderContainer: {
    flex: 1,
    alignSelf: "center", //AA2829
    justifyContent: "center",
  },
  video: {
    alignSelf: "center",
    width: "100%",
    height: 300,
  },
  linearGradient: {
    height: "100%",
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

/*
In React Navigation, route is a prop that is automatically passed to screen components by the navigator. route contains information about the current route, including any parameters that were passed to it during navigation.

route.params is an object that holds the parameters passed to the screen when navigating to it. For example, when you navigate to a screen like this:

javascript
Copy code
navigation.navigate('ScreenName', { param1: 'value1', param2: 'value2' });
You can access param1 and param2 inside the ScreenName component using route.params. For instance:

javascript
Copy code
const { param1, param2 } = route.params;
console.log(param1); // Outputs: 'value1'
console.log(param2); // Outputs: 'value2'
In your case, when you navigate to the "WatchMovies" screen, you are passing props via navigation.push:

javascript
Copy code
navigation.push("WatchMovies", {
  bgImage: baseImageURL("w780", movieData.backdrop_path),
  posterImage: baseImageURL("original", movieData.poster_path),
  movieLink: movieLink,
  movieName: movieName
});
These props can be accessed in the "WatchMovies" screen using route.params as demonstrated earlier.

*/
