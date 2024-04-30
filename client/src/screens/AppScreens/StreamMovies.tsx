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
  } from "react-native";
  
  // importing json data
  import NowPlayingMovies from '../../data/NowPlayingMovies.json';
  import PopularMoviesData from '../../data/PopularMovies.json';
  import TopRatedMovies from '../../data/TopRatedMovies.json';
  import TelguMoviesData from '../../data/TelguMovies.json';
  import TamilMoviesData from '../../data/TamilMovies.json';
  import BollywoodMovies from '../../data/BollywoodMovies.json';
  
  import React, { useEffect, useState } from "react";
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
  import SubMovieCards from "../../components/SubMovieCards";
  import MovieCard from "../../components/MovieCard";
  import TVShowCard from "../../components/TVShowCard";
  
  // for the responsive UI
  const { width, height } = Dimensions.get("window");
  
  // fetching the movies data
  const getNowPlayingMovies = async () => {
    try {
      return NowPlayingMovies;
    } catch (err) {
      console.error(`Error while getting now playing movies: ${err}`);
      throw err;  // Rethrow the error for further handling if needed
    }
  };
  
  const getPopularMovies = async () => {
    try {
      return PopularMoviesData;  // Return the imported JSON data directly
    } catch (error) {
      console.error(`Error while getting popular movies: ${error}`);
      throw error;  // Rethrow the error for further handling if needed
    }
  };
  
  const getTopRatedMovies = async () => {
    try {
      return TopRatedMovies;  // Return the imported JSON data directly
    } catch (error) {
      console.error(`Error while getting top rated movies: ${error}`);
      throw error;  // Rethrow the error for further handling if needed
    }
  };
  
  // fetching TV Shows
  const getTelguMovies = async () => {
    try {
      // console.log('data' , data)
      return TelguMoviesData;
    } catch (error) {
      console.error(`Error while getting telgu movies: ${error}`);
      throw error;  // Rethrow the error for further handling if needed
    }
  };
  
  const getTamilMovies = async () => {
    try {
      return TamilMoviesData;
    } catch (error) {
      console.log(`Error while getting tamil movies: ${error}`);
      throw error;  // Rethrow the error for further handling if needed
    }
  };

  const getBollywoodMovies = async () => {
    try {
      return BollywoodMovies;
    } catch (err) {
      console.error(`Error while getting Bollywood Movies: ${err}`);
      throw err;  // Rethrow the error for further handling if needed
    }
  };
  
  const StreamMovies: React.FC<{ navigation: any }> = ({ navigation }) => {
    // state variables for the API
  
    // for the movies
    const [nowPlayingMoviesList, setNowPlayingMoviesList] =
      useState<any>(undefined);
  
    const [popularMoviesList, setPopularMoviesList] = useState<any>(undefined);
  
    const [topRatedMoviesList, setTopRatedMoviesList] = useState<any>(undefined);
  
    const [telguMovies, setTelguMovies] = useState<any>(undefined);
  
    const [tamilMovies, setTamilMovies] = useState<any>(undefined);

    const [bollywoodMovies, setBollywoodMovies] = useState<any>(undefined);

    const [nowPlayingBollywoodMovies, setNowPlayingBollywoodMovies] =
    useState<any>(undefined);
  
    useEffect(() => {
      const fetchNowPlaying = async () => {
        try {
          const nowPlayingMovies = await getNowPlayingMovies();
          setNowPlayingMoviesList([
            { id: "dummy1" },
            ...nowPlayingMovies.results,
            { id: "dummy2" },
          ]);
        } catch (error) {
          console.error(
            `Error while fetching the data inside of the fetchNowPlaying function`
          );
        }
      };
      fetchNowPlaying();
  
      // popular Movies
      getPopularMovies()
        .then((popularMoviesData) => {
          setPopularMoviesList(popularMoviesData.results);
        })
        .catch((error) => {
          console.error(
            `Error while fetching the data inside of the in executing getPopularMovies function`
          );
        });
  
      // top rated Movies
      getTopRatedMovies()
        .then((topRated) => {
          setTopRatedMoviesList(topRated.results);
        })
        .catch((err) => {
          console.error(
            `Error while fetching the data inside of the getTopRatedMovies Movies`
          );
        });
  
      // on Air TV Shows
      getTelguMovies()
        .then((telguMovies) => {
          setTelguMovies(telguMovies.results);
        })
        .catch((err) => {
          console.error(
            `Error while fetching the data inside of the telgu movies in useEffect`
          );
        });
  
      getTamilMovies()
        .then((tamil) => {
          setTamilMovies(tamil.results);
        })
        .catch((err) => {
          console.error(
            `Error while fetching the data inside of the tamil Movies`
          );
        });

        const fetchBollywoodMovies = async () => {
          try {
            const BollywoodMovies = await getBollywoodMovies();
            setNowPlayingBollywoodMovies([
              { id: "dummy1" },
              ...BollywoodMovies.results,
              { id: "dummy2" },
            ]);
          } catch (error) {
            console.error(
              `Error while fetching the data inside of the Bollywood Movies function`
            );
          }
        };
        fetchBollywoodMovies();
    }, []);
  
    // console.log('popular Movies',nowPlayingTVShows);
    // console.log(telguMovies);
    
  
    const searchMoviesFunction = () => {
      // will be navigating to the SeacrhMovie Page
      navigation.navigate("Search");
    };
  
    // conditionally render the activity Loader
    if (
      nowPlayingMoviesList == undefined &&
      nowPlayingMoviesList == null &&
      popularMoviesList == undefined &&
      popularMoviesList == null &&
      topRatedMoviesList == undefined &&
      topRatedMoviesList == null &&
      telguMovies == undefined &&
      telguMovies == null &&
      tamilMovies == undefined &&
      tamilMovies == null &&
      bollywoodMovies == null && 
      bollywoodMovies == undefined &&
      nowPlayingBollywoodMovies == null &&
      nowPlayingBollywoodMovies == undefined
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
        <HeaderComponent props={'Stream'} navigation={navigation} />
        {/* for the Search Field */}
        <View style={styles.inputHeaderContainer}>
          <InputHeader searchFunction={searchMoviesFunction} />
        </View>
  
        {/* Category Header */}
        <CategoryHeader title={"Now Playing"} />
        <FlatList
          data={nowPlayingMoviesList}
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
              <MovieCard
                shoudlMarginatedAtEnd={true}
                cardFunction={() => {
                  navigation.push("MovieDetails", { movieid: item.id });
                }}
                cardWidth={width * 0.7}
                isFirst={index == 0 ? true : false}
                isLast={index == nowPlayingMoviesList?.length - 1 ? true : false}
                title={item.original_title}
                imagePath={baseImageURL("w780", item.poster_path)}
                genre={item.genre_ids.slice(1, 4)}
                vote_average={item.vote_average}
                vote_count={item.vote_count}
              />
            );
          }}
        />
  
        <CategoryHeader title={"Popular Movies"} />
        <FlatList
          data={popularMoviesList}
          keyExtractor={(item: any) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={styles.containerGap36}
          renderItem={({ item, index }) => (
            <SubMovieCards
              shoudlMarginatedAtEnd={true}
              cardFunction={() => {
                navigation.push("MovieDetails", { movieid: item.id });
              }}
              cardWidth={width / 3}
              isFirst={index == 0 ? true : false}
              isLast={index == popularMoviesList?.length - 1 ? true : false}
              title={item.original_title}
              imagePath={baseImageURL("w780", item.poster_path)}
            />
          )}
        />
  
        <CategoryHeader title={"Top Rated Movies"} />
        {/* importing FlatList for displaying Sub Cards */}
        <FlatList
          data={topRatedMoviesList}
          keyExtractor={(item: any) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={styles.containerGap36}
          renderItem={({ item, index }) => (
            <SubMovieCards
              shoudlMarginatedAtEnd={true}
              cardFunction={() => {
                navigation.push("MovieDetails", { movieid: item.id });
              }}
              cardWidth={width / 3}
              isFirst={index == 0 ? true : false}
              isLast={index == topRatedMoviesList?.length - 1 ? true : false}
              title={item.original_title}
              imagePath={baseImageURL("w780", item.poster_path)}
            />
          )}
        />
  
        {/* Category Header for the TV Shows */}
        <CategoryHeader title={"Telgu Movies"} />
        <FlatList
          data={telguMovies} // Use results array
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          snapToInterval={width * 0.7 + SPACING.space_36}
          decelerationRate={0}
          contentContainerStyle={styles.containerGap36}
          renderItem={({ item, index }) => (
            <MovieCard
              shoudlMarginatedAtEnd={true}
              cardFunction={() => {
                navigation.push("MovieDetails", { movieid: item.id });
              }}
              cardWidth={width * 0.7}
              isFirst={index === 0}
              isLast={index === telguMovies.length - 1}
              title={item.title} // Use "name" instead of "title"
              imagePath={`https://image.tmdb.org/t/p/w780${item.poster_path}`} // Construct the image path with the base URL
              genre={item.genre_ids}
              vote_average={item.vote_average}
              vote_count={item.vote_count}
            />
          )}
        />
  
        <CategoryHeader title={"Tamil Movies"} />
        <FlatList
          data={tamilMovies}
          keyExtractor={(item: any) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={styles.containerGap36}
          renderItem={({ item, index }) => (
            <SubMovieCards
              shoudlMarginatedAtEnd={true}
              cardFunction={() => {
                navigation.push("MovieDetails", { movieid: item.id });
              }}
              cardWidth={width / 3}
              isFirst={index == 0 ? true : false}
              isLast={index == tamilMovies?.length - 1 ? true : false}
              title={item.title}
              imagePath={baseImageURL("w780", item.poster_path)}
            />
          )}
        />

<CategoryHeader title={"Bollywood Pick's"} />
        <FlatList
          data={nowPlayingBollywoodMovies}
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
              <MovieCard
                shoudlMarginatedAtEnd={true}
                cardFunction={() => {
                  navigation.push("MovieDetails", { movieid: item.id });
                }}
                cardWidth={width * 0.7}
                isFirst={index == 0 ? true : false}
                isLast={index == nowPlayingBollywoodMovies?.length - 1 ? true : false}
                title={item.original_title}
                imagePath={baseImageURL("w780", item.poster_path)}
                genre={item.genre_ids.slice(1, 4)}
                vote_average={item.vote_average}
                vote_count={item.vote_count}
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
  
  export default StreamMovies;
  