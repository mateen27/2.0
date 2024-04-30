// root navigator

import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import HomeScreen from "../../screens/HomeScreen";
import SplashScreen from "../../screens/SplashScreen/SplashScreen";
import Notification from "../../screens/AppScreens/Notification";
import OnBoardingScreen from "../../screens/AppScreens/OnBoardingScreen";
import SignupUI from "../../screens/AppScreens/SignUp";
import BottomNavigator from "../bottom/BottomNavigator";
import Search from "../../screens/AppScreens/Search";
import Ticket from "../../screens/AppScreens/Ticket";
import WatchMovies from "../../screens/AppScreens/WatchMovies";
import MovieDetails from "../../screens/AppScreens/MovieDetails";
import WatchMovie from "../../screens/AppScreens/WatchMovie";
import StreamMovies from "../../screens/AppScreens/StreamMovies";
import UpcomingMoviesDetails from "../../screens/AppScreens/UpcomingMoviesDetails";
import WatchTrailer from "../../screens/AppScreens/WatchTrailer";
import BookTickets from "../../screens/AppScreens/BookTickets";
import WelcomeRoomScreen from "../../screens/AppScreens/WelcomeRoomScreen";
import LoginScreen from "../../screens/AppScreens/LoginScreen";
import Profile from "../../screens/AppScreens/Profile";
import About from "../../screens/AppScreens/About";
import SignUp from "../../screens/AppScreens/SignUp";

// stackNavigator
const Stack = createNativeStackNavigator();

const AppNavigator: React.FC<{}> = () => {
  // for passing navigation prop to the Component
  const navigation = useNavigation();

  // for displaying onBoarding State or not
  const [isAppFirstLaunched, setIsAppFirstLaunched] = useState(null);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OnBoarding"
        component={OnBoardingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notification"
        component={Notification}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Search"
        component={Search}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Stream"
        component={StreamMovies}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MovieDetails"
        component={MovieDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UpcomingMovieDetails"
        component={UpcomingMoviesDetails}
        options={{ headerShown: false }}
      />
      {/* Bottom Navigator */}
      <Stack.Screen name="Bottom">
        {() => <BottomNavigator navigation={navigation} />}
      </Stack.Screen>

      <Stack.Screen
        name="WatchTrailer"
        component={WatchMovie}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="WatchMovies"
        component={WatchMovies}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="BookMovie"
        component={BookTickets}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Ticket"
        component={Ticket}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="WelcomeRoomScreen"
        component={WelcomeRoomScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="About"
        component={About}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({});
