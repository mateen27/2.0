import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  FlatList,
  BackHandler
} from "react-native";

// importing json data
import UpcomingMoviesData from '../../data/UpcomingMovies.json';

import React, { useEffect, useState  } from "react";
import HeaderComponent from "../../components/HeaderComponent";
import { COLORS, SPACING } from "../../theme/theme";

// importing the images
import Menu from "../../images/menuu.png";

// importing API Calls
import {
  baseImageURL,
  API_KEY,
} from "../../api/ApiCalls";

import InputHeader from "../../components/InputHeader";
import CategoryHeader from "../../components/CategoryHeader";
import UpcomingMoviesCard from "../../components/UpcomingMoviesCard";

// for the responsive UI
const { width, height } = Dimensions.get("window");

// fetching the movies data
const getUpcomingMovies = async () => {
  try {
    return UpcomingMoviesData;
  } catch (err) {
    console.error(`Error while getting upcoming movies: ${err}`);
    throw err;  // Rethrow the error for further handling if needed
  }
};

const Home: React.FC<{ navigation: any , route: any }> = ({ navigation , route }) => {

  // will exit app from main page.!
  // useEffect(() => {
  //   const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
  //     // Close the app if the current route is the login screen
  //     if (navigation.currentRoute.name === 'Login') {
  //       BackHandler.exitApp();
  //     }

  //     // Allow the app to navigate back to the previous screen otherwise
  //     return true;
  //   });

  //   return () => {
  //     // Remove the event listener when the component unmounts
  //     BackHandler.removeEventListener('hardwareBackPress', backHandler);
  //   };
  // }, []);

  // state variables for the API
  // for the movies
  const [upcomingMovies, setUpcomingMovies] =
    useState<any>(undefined);

  useEffect(() => {
    const fetchUpcomingMovies = async () => {
      try {
        const nowPlayingMovies = await getUpcomingMovies();
        setUpcomingMovies([
          { id: "dummy1" },
          ...nowPlayingMovies.results,
          { id: "dummy2" },
        ]);
      } catch (error) {
        console.error(
          `Error while fetching the data inside of the upcoming function`
        );
      }
    };
    fetchUpcomingMovies();
  }, []);

  // console.log('popular Movies',nowPlayingTVShows);
  // console.log(telguMovies);

  // console.log(route.name);
  

  const searchMoviesFunction = () => {
    // will be navigating to the SeacrhMovie Page
    navigation.navigate("Search");
  };

  // conditionally render the activity Loader
  if (
    upcomingMovies == undefined &&
    upcomingMovies == null 
  ) {
    return (
      <ScrollView
        style={styles.container}
        bounces={false}
        contentContainerStyle={styles.scrollViewContainer}
      >
        {/* for the Search Field */}
        <View style={styles.inputHeaderContainer}>
          <InputHeader searchFunction={searchMoviesFunction} />
        </View>

        <View style={styles.activityLoaderContainer}>
          <ActivityIndicator size={"large"} color={COLORS.Orange} />
        </View>
        <StatusBar hidden />
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      bounces={false}
      contentContainerStyle={styles.scrollViewContainer}
    >
      {/* opening the drawer on Icon Click which is the HeaderComponent */}
      <HeaderComponent props={'Book Movies'} navigation={navigation} />
      {/* for the Search Field */}
      <View style={styles.inputHeaderContainer}>
        <InputHeader searchFunction={searchMoviesFunction} />
      </View>

      {/* Category Header */}
      <CategoryHeader title={"Pre-Book Movies"} />
      <FlatList
        data={upcomingMovies}
        keyExtractor={(item: any) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        snapToInterval={width * 0.7 + SPACING.space_36}
        decelerationRate={0}
        contentContainerStyle={styles.containerGap36}
        renderItem={({ item, index }) => {
          if (!item.original_title) {
            return (
              <View
                style={{
                  width: (width - (width * 0.7 + SPACING.space_36 * 2)) / 2,
                }}
              ></View>
            );
          }
          return (
            <UpcomingMoviesCard
              shoudlMarginatedAtEnd={true}
              cardFunction={() => {
                navigation.push("UpcomingMovieDetails", { movieid: item.id });
              }}
              cardWidth={width * 0.7}
              isFirst={index == 0 ? true : false}
              isLast={index == upcomingMovies?.length - 1 ? true : false}
              title={item.original_title}
              imagePath={baseImageURL("w780", item.poster_path)}
              genre={item.genre_ids.slice(1, 4)}
              popularity={item.popularity}
            />
          );
        }}
      />
      <StatusBar hidden />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    backgroundColor: COLORS.Black,
  },
  scrollViewContainer: {
    // flex: 1,
  },
  activityLoaderContainer: {
    flex: 1,
    alignSelf: "center", //AA2829
    justifyContent: "center",
  },
  inputHeaderContainer: {
    marginTop: SPACING.space_20,
    marginHorizontal: SPACING.space_36,
  },
  containerGap36: {
    gap: SPACING.space_36,
  },
});

export default Home;
