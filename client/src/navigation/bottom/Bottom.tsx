import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import Notification from "../../screens/SocialMedia/Notification"; // Import your Notification component here
import Home from "../../screens/SocialMedia/Home";
import FriendRequests from "../../screens/SocialMedia/FriendRequests";
import SearchUsers from "../../screens/SocialMedia/SearchUsers";
import User from "../../screens/SocialMedia/User";
import { Pressable, View } from "react-native";
import AddPost from "../../screens/SocialMedia/AddPost";
import AsyncStorage from "@react-native-async-storage/async-storage";
import JWT from "expo-jwt";
import { secretKey } from "../../private/secret";
import axios from "axios";

const Tab = createBottomTabNavigator();

const Bottom = () => {
  const navigation = useNavigation();

  const [userID, setUserID] = useState("");
  const [userName, setUserName] = useState("");

  const fetchUserID = async () => {
    try {
      const userID: any = await AsyncStorage.getItem("userID");
      // decoding the userID
      const decodedID: any = JWT.decode(userID, secretKey);
      console.log("decodedID of the user", decodedID.userID);

      // setting the user ID to the state
      setUserID(decodedID.userID);
    } catch (error) {
      console.log("error fetching the UserID from the Async Storage", error);
    }
  };

  const fetchByID = async () => {
    try {
      const response = await axios.get(
        `http://192.168.29.181:3001/api/user/userByID/${userID}`
      );
      console.log("response of the api", response.data?.user?.name);
      setUserName(response.data?.user?.name);
    } catch (error) {
      console.log("error fetching the user deatils by the id", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchUserID();
    fetchByID();
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Notification") {
              iconName = focused ? "notifications" : "notifications-outline";
            }
            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            }
            if (route.name === "Friends") {
              iconName = focused ? "people" : "people-outline";
            }
            if (route.name === "Search") {
              iconName = focused ? "search" : "search-outline";
            }
            if (route.name === "User") {
              iconName = focused ? "person-circle" : "person-circle-outline";
            }
            if (route.name === "AddPost") {
              iconName = focused ? "add-circle" : "add-circle-outline";
            }

            // You can return any component here like an image or a custom icon
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "tomato",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            backgroundColor: "black",
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            headerTitle: "ShowStarter",
            headerTitleAlign: "center",
            headerTintColor: "#fff",
            headerStyle: {
              backgroundColor: "#000",
            },
            headerLeft: () => (
              <Ionicons
                name="arrow-back"
                size={26}
                color="white"
                style={{ padding: 10 }}
                onPress={() => {
                  // Handle navigation or any other action
                  navigation.goBack();
                }}
              />
            ),
            headerRight: () => (
              <View style={{ flexDirection: "row", gap: 12, padding: 10 }}>
                  <Ionicons
                    name="person-add-outline"
                    size={23}
                    color="white"
                    style={{ marginRight: 10 }}
                    onPress={() => {
                      // Handle friend request action
                      navigation.navigate('People')
                    }}
                  />
                <Ionicons
                  name="chatbox-ellipses-outline" //<Ionicons name="chatbox-ellipses-outline" size={24} color="black" />
                  size={24}
                  color="white"
                  style={{ marginLeft: "auto", marginRight: "auto" }}
                  onPress={() => {
                    // Handle navigation or any other action
                    console.log("hello");
                  }}
                />
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchUsers}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="AddPost"
          component={AddPost}
          options={{
            headerTitle: "New Post",
            // headerTitleAlign: "center",
            headerTintColor: "#fff",
            headerStyle: {
              backgroundColor: "#000",
            },
            headerLeft: () => (
              <Ionicons
                name="arrow-back"
                size={26}
                color="white"
                style={{
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  // Handle navigation or any other action
                  navigation.goBack();
                }}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Notification"
          component={Notification}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="User"
          component={User}
          options={{
            headerTitle: userName,
            headerTintColor: "#f1f1f1",
            headerStyle: {
              backgroundColor: "#000",
            },
            headerLeft: () => (
              <Ionicons
                name="arrow-back"
                size={26}
                color="white"
                style={{ padding: 10 }}
                onPress={() => {
                  // Handle navigation or any other action
                  navigation.goBack();
                }}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default Bottom;
