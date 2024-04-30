import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../../screens/AppScreens/Home";
import About from "../../screens/AppScreens/About";
import Profile from "../../screens/AppScreens/Profile";
import TicketIcon from "../../../images/ticket.png";
import WatchIcon from "../../../images/watch.png";
import WatchIconn from "../../../images/watchh.png";
import { useNavigation } from "@react-navigation/native";

// icons import
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

// user
import { Feather } from "@expo/vector-icons";
// ticket
import { FontAwesome } from "@expo/vector-icons";
// stream & chat
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTSIZE, SPACING } from "../../theme/theme";
// for Video
import { Octicons } from "@expo/vector-icons";
import Search from "../../screens/AppScreens/Search";
import Ticket from "../../screens/AppScreens/Ticket";
import WatchMovies from "../../screens/AppScreens/WatchMovie";
import StreamMovies from "../../screens/AppScreens/StreamMovies";

const BottomNavigator: React.FC<{ routeNavigation: any }> = ({
  routeNavigation,
}) => {
  // console.log('Navigation in BottomNavigator:', routeNavigation);
  const Bottom = createBottomTabNavigator();

  const navigation = useNavigation();

  return (
    <Bottom.Navigator
      screenOptions={{
        // tabBarInactiveBackgroundColor: "black",
        // tabBarActiveBackgroundColor: "#FA650F",
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.Black,
          borderColor : COLORS.Black ,
          borderWidth: 0,
          height: SPACING.space_10 * 10,
        },
      }}
    >
      <Bottom.Screen
        name="Home"
        component={Home}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <View style={[styles.activeTabBackground, focused ? { backgroundColor: COLORS.Orange } : {}, { justifyContent: 'center', alignItems: 'center' }]}>
                <Octicons
                  name="video"
                  size={FONTSIZE.size_24}
                  color={COLORS.White}
                />
              </View>
            );
          },
        }}
      />
      <Bottom.Screen
        name="Search"
        component={Search}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <View style={[styles.activeTabBackground, focused ? { backgroundColor: COLORS.Orange } : {}, { justifyContent: 'center', alignItems: 'center' }]}>
                <AntDesign
                  name="search1"
                  size={FONTSIZE.size_24}
                  color={COLORS.White}
                />
              </View>
            );
          },
        }}
      />
      <Bottom.Screen
        name="Ticket"
        component={Ticket}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => {
            const imageSource = focused ? TicketIcon : TicketIcon;
            const tabBarIconStyle = focused ? styles.activeTabIconBackground : {};
            return (
              <View style={[tabBarIconStyle, { justifyContent: "center", alignItems: "center" }]}>
                <Image
                  source={imageSource}
                  style={{
                    resizeMode: "contain",
                    width: 28,
                    height: 28,
                  }}
                />
              </View>
            );
          },
        }}
      />

      <Bottom.Screen
        name="Watch"
        component={StreamMovies}
        options={{
          tabBarShowLabel: false,
          tabBarIcon: ({ focused, color, size }) => {
            const imageSource = focused ? WatchIcon : WatchIcon;
            const tabBarIconStyle = focused ? styles.activeTabIconBackground : {};
            return (
              <View style={[tabBarIconStyle, { justifyContent: "center", alignItems: "center" }]}>
                <Image
                  source={imageSource}
                  style={{
                    resizeMode: "contain",
                    width: 28,
                    height: 28,
                  }}
                />
              </View>
            );
          },
        }}
      />
    </Bottom.Navigator>
  );
};

export default BottomNavigator;

const styles = StyleSheet.create({
  activeTabBackground: {
    backgroundColor: COLORS.Black,
    padding: SPACING.space_18,
    borderRadius: SPACING.space_18 * 10,
  },
  activeTabIconBackground: {
    backgroundColor: COLORS.Orange,
    padding: SPACING.space_16,
    borderRadius: SPACING.space_18 * 20,
    color: COLORS.White,
  },
  ticketIcon: {
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
  },
});