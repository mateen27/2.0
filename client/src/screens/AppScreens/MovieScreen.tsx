import { StyleSheet, Text, View, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { Video, ResizeMode } from "expo-av";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { secretKey } from "../../private/secret";
import JWT from "expo-jwt";
import socketIOClient from "socket.io-client";

interface Movie {
  link: string;
  name: string;
}

interface VideoStatus {
  positionMillis: number;
  // Other video status properties as needed
}

const { width, height } = Dimensions.get("window");

const MovieScreen = ({ route }: any) => {
  
  const { roomID } = route.params;
  

  // state 
  const [movielink, setMovieLink] = useState("");
  const [moviename, setMovieName] = useState("");
  const [movieiD, setMovieID] = useState("");
  const [userId, setUserID] = useState("");
  const [host, setIsHost] = useState(false);
  const [ roomId, setRoomId ] = useState(null);

  // movie player controller
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const [isPaused, setIsPaused] = useState(false);

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

  useEffect(() => {
    fetchUserID();
    // setUserID(roomId)
  }, []);

  // Fetch room details when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
        // Function to fetch room details from the server
  const fetchRoomDetails = async () => {
    try {
      const response = await axios.get(
        `http://192.168.29.181:3001/api/user/get-room-details/${roomID}`
      );

      console.log("log inside the movie screen", response.data);

      const { movieLink, movieName, movieID } = response.data.movieDetails[0];

      // accessing the userID of the in room host
      const { _id } = response.data.userIds;
      // console.log('log of the hostID', _id)
      // console.log('isEqual to the hostID', userId === _id);

      if (userId === _id) {
        setIsHost(true);
      }

      setMovieLink(movieLink);
      setMovieName(movieName);
      setMovieID(movieID);
    } catch (error) {
      console.log("error fetching the room Details", error);
    }
  };
      fetchRoomDetails();
    }, [roomID])
  );


  const socket = socketIOClient('http://192.168.29.181:3001');

  // Pause the video
  const pauseVideo = () => {
    socket.emit('pauseVideo');
  };

  // Resume the video
  const resumeVideo = () => {
    socket.emit('resumeVideo');
  };

  useEffect(() => {
    // Listen for messages from the server to pause or resume the video
    socket.on('pauseVideo', () => {
      setIsPaused(true);
    });

    socket.on('resumeVideo', () => {
      setIsPaused(false);
    });

    return () => {
      // Clean up event listeners when component unmounts
      socket.disconnect();
    };
  }, []);



  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      {movielink ? (
        <>
          <Video
            ref={video}
            source={{ uri: movielink }}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping
            style={styles.video}
            onPlaybackStatusUpdate={(status) => setStatus(() => status)}
            shouldPlay={!isPaused}
          />

          
      {host && (
        <View style={styles.buttonContainer}>
          <Button
            title="Pause Video"
            onPress={pauseVideo}
            disabled={isPaused}
          />
          <Button
            title="Resume Video"
            onPress={resumeVideo}
            disabled={!isPaused}
          />
        </View>
      )}
        </>
      ) : (
        <Text
          style={{
            color: "#fff",
            marginTop: 20,
            fontSize: 22,
            fontWeight: "600",
          }}
        >
          Loading...
        </Text>
      )}
      <Text
        style={{
          color: "#fff",
          marginTop: 50,
          fontWeight: "600",
          fontSize: 22,
          textAlign: "center",
        }}
      >
        {moviename}
      </Text>
    </View>
  );
};

export default MovieScreen;

const styles = StyleSheet.create({
  video: {
    // alignSelf: "center",
    width: "100%",
    height: "41%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
});

// fetch the current user ID from he Async Storqage and then check it from the room Host User ID
// if yes then set the currentUser as the Host and make the button visible
// else dont set the currentUser as the Host and dont make the button visible
