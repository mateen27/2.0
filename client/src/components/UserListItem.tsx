// UserListItem component
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { COLORS } from "../theme/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { ChatState } from "../context/ChatProvider";

const UserListItem = ({ user, handleFunction }: any) => {
  const { setSelectedChat, selectedChat, chats, setChats } = ChatState();

  // console.log('daatttatataa', handleFunction);

  const createChat = async () => {
    try {
      // Assuming user.id contains the user's ID to start a chat with
      const userId = user._id;
      // console.log(userId , '' , user.name);
      

      if (!userId) {
        console.error('User ID is missing.');
        return; // Exit function if the user ID is missing
      }

      // Make an API call to check or create a chat
      const storedToken = await AsyncStorage.getItem("authToken");
      console.log('storedToken',storedToken);
      

      if (storedToken) {
        const config = {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
        };

        // Making the API call to check or create a chat
        const response = await axios.post(
          'http://192.168.29.181:8080/api/user/',
          { userId },
          config
        );

        // Handle the response accordingly - e.g., you can log the chat data
        console.log('Chat Data:', response.data);
        // Further actions based on the response, such as opening the chat window, etc.
      }
    } catch (error) {
      console.error('Error creating or fetching chat:', error);
      // Handle error scenarios here
    }
  };

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity style={styles.card} onPress={createChat}>
        <View style={styles.profileContainer}>
          <Image source={{ uri: user.pic }} style={styles.profileImage} />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.username}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    // margin : 5 ,
    // flex : 1 ,
    borderBottomWidth: 1,
    paddingBottom: 10,
    backgroundColor: "#333",
    width: 500,
    height: 100,
  },
  profileContainer: {
    paddingRight: 10,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.White,
  },
  email: {
    fontSize: 14,
    color: COLORS.WhiteRGBA50,
  },
  mainContainer: {
    // marginTop : '20%' ,
    // flexDirection : 'row'
    // position : 'absolute' ,
    // marginVertical : '10%'
  },
});

export default UserListItem;
