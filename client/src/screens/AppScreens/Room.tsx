import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  FlatList,
  Alert,
  Clipboard,
  Button,
  ScrollView,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import JWT from "expo-jwt";
import { secretKey } from "../../private/secret";
import { responsiveScreenWidth } from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";

const Room = () => {
  const [search, setSearch] = useState("");
  const [clicked, setClicked] = useState(false);
  const [movies, setMovies] = useState([]);
  const [data, setData] = useState(movies);
  const [selectedMovies, setSelectedMovies] = useState(null);
  const [value, setValue] = useState(null);
  const [label, setLabel] = useState(null);
  const [link, setLink] = useState(null);
  const [userID, setUserID] = useState(null);
  const [ roomID, setRoomID ] = useState(null);
  const searchRef = useRef();

  const onSearch = (search: any) => {
    if (search !== "") {
      let tempData = data.filter((item) => {
        return (
          item.original_title.toLowerCase().indexOf(search.toLowerCase()) > -1
        );
      });
      setData(tempData);
    } else {
      setData(movies);
    }
  };

  const navigation = useNavigation();

  // function to fetch the userID
  const fetchUserID = async () => {
    try {
      const userID: any = await AsyncStorage.getItem("userID");
      // decoding the userID
      const decodedID: any = JWT.decode(userID, secretKey);
      // console.log('decodedID of the user', decodedID.userID);

      // setting the user ID to the state
      setUserID(decodedID.userID);
    } catch (error) {
      console.log("error fetching the UserID from the Async Storage", error);
    }
  };

  useEffect(() => {
    fetchUserID();
  }, []);

  // Function to fetch movies
  const fetchMovies = async () => {
    try {
      // Make a GET request to fetch all movies from the backend
      const response = await axios.get(
        "http://192.168.29.181:3001/api/user/all-movies/"
      );
      // Set the fetched movies in the state
      setMovies(response.data.results);
      setData(response.data.results);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleMovieSelection = (item: any) => {
    console.log('item', item.movieLink);

    setValue(item.value); // Assuming 'value' is used for ID
    setLabel(item.label); // Movie name
    setLink(item.firebase_link); // Movie link
    setSelectedMovies({
      name: item.label,
      id: item.value,
      link: item.movieLink,
    }); // Store all three in an object
    setClicked(false);
  };

  // console.log('value', selectedMovies);

  // function for creating a room
  const createRoomHandler = async () => {
    try {
      // console.log('user Movie Selection', selectedMovies);
      if (selectedMovies === undefined || selectedMovies === null) {
        console.log("null");
        Alert.alert("Please select a movie first to continue");
        return;
      }

      const postData = {
        movieID: selectedMovies.id,
        movieName: selectedMovies.name,
        movieLink: selectedMovies.link,
      };

      // console.log('data', data);

      const response = await axios.post(
        `http://192.168.29.181:3001/api/user/create-rooms/${userID}`,
        postData
      );

      if (response.status === 200 || response.status === 201) {
        Alert.alert("Room created successfully");
        navigation.navigate('UserNavigation', {roomID: response.data.room.roomID});
        setRoomID(null);
        // return;
      } else {
        console.log(response.data);
        Alert.alert("Error creating the room");
        return;
      }
    } catch (error) {
      console.log("Error creating the room for the user", error);
      throw new Error("Error creating the room");
    }
  };

  const joinRoomHandler = async (roomID: string) => {
    try {
      if (!roomID) {
        Alert.alert("Please enter a Room ID");
        return;
      }
  
      const postData = {
        roomID,
      };
  
      console.log('room ID inside of the Room Component', roomID);
  
      const response = await axios.post(`http://192.168.29.181:3001/api/user/join-rooms/${userID}`, postData);
  
      console.log('response inside the Room in joining', response.data);
  
      if (response.data && response.data.movieDetails) {
        console.log('response movie details', response.data.movieDetails);
        console.log('room ID above navigation', roomID);
        
        navigation.navigate('UserNavigation', { roomID });

        setRoomID(null);
      } else {
        console.log(response);
        Alert.alert("Error joining the room");
      }
    } catch (error) {
      console.log('error joining the room', error);
      Alert.alert("Error joining the room");
    }
  }
  


  // console.log('rooomID', roomID);
  
  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <View
        style={{
          padding: 10,
          justifyContent: "center",
          marginVertical: 40,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontWeight: "600",
            color: "#ffff",
            marginLeft: 22,
            fontSize: 17,
            marginBottom: 10,
          }}
        >
          Select the Movie to Create Room
        </Text>
        <TouchableOpacity
          style={{
            width: "90%",
            height: 50,
            borderRadius: 10,
            borderWidth: 0.5,
            alignSelf: "center",
            // marginTop: 100,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingLeft: 15,
            paddingRight: 15,
            backgroundColor: "#333",
          }}
          onPress={() => {
            setClicked(!clicked);
          }}
        >
          <Text style={{ fontWeight: "600", color: "#f2f2f2" }}>
            {label || "Select Movies"}
          </Text>
          {clicked ? (
            <Image
              source={require("../../../images/upload.png")}
              style={{ width: 20, height: 20 }}
            />
          ) : (
            <Image
              source={require("../../../images/dropdown.png")}
              style={{ width: 20, height: 20 }}
            />
          )}
        </TouchableOpacity>
        {clicked ? (
          <View
            style={{
              elevation: 5,
              marginTop: 20,
              height: 300,
              alignSelf: "center",
              width: "90%",
              backgroundColor: "#333",
              borderRadius: 10,
            }}
          >
            <TextInput
              placeholder="Search.."
              placeholderTextColor={"#f2f2f2"}
              value={search}
              ref={searchRef}
              onChangeText={(txt) => {
                onSearch(txt);
                setSearch(txt);
              }}
              style={{
                width: "90%",
                height: 50,
                alignSelf: "center",
                borderWidth: 0.2,
                borderColor: "#8e8e8e",
                borderRadius: 7,
                marginTop: 20,
                paddingLeft: 20,
                color: "#fff",
              }}
            />

            <FlatList
              data={data}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    style={{
                      width: "85%",
                      alignSelf: "center",
                      height: 50,
                      justifyContent: "center",
                      borderBottomWidth: 0.5,
                      borderColor: "#8e8e8e",
                    }}
                    onPress={() => {
                      handleMovieSelection({
                        value: item.id,
                        label: item.original_title,
                        movieLink: item.firebase_link,
                      });
                      onSearch("");
                      setSearch("");
                    }}
                  >
                    <Text style={{ fontWeight: "600", color: "#f1f1f1" }}>
                      {item.original_title}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        ) : null}
      </View>

      {/* <Text style={{ fontWeight: '600', color : '#fff' }}>
  {selectedMovies ? `${selectedMovies.name} (ID: ${selectedMovies.id})` : 'Select Movies'}
</Text> */}

      <TouchableOpacity
        onPress={() => createRoomHandler()}
        style={{ alignItems: "center" }}
      >
        <Text style={[styles.loginButton]}>Create Room</Text>
      </TouchableOpacity>

      <View style={{ alignItems: "center", margin: 15 }}>
        <Text
          style={{
            fontWeight: "600",
            color: "#ffff",
            marginLeft: 22,
            fontSize: 17,
            marginBottom: 10,
            marginTop: 100,
          }}
        >
          Enter the Room ID to JOIN
        </Text>
        <TextInput
            value={roomID}
            onChangeText={(text) => setRoomID(text)}
          placeholder="Enter Room ID"
          placeholderTextColor={"#f2f2f2"}
          style={{
            width: "90%",
            height: 50,
            borderRadius: 10,
            borderWidth: 0.5,
            alignSelf: "center",
            // marginTop: 100,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingLeft: 15,
            paddingRight: 15,
            backgroundColor: "#333",
            color: "#ffffff",
          }}
        />
        <TouchableOpacity
          onPress={() => joinRoomHandler(roomID)}
          style={{ alignItems: "center" }}
        >
          <Text
            style={{
              color: "white",
              backgroundColor: "#333",
              padding: "4%",
              borderRadius: 30,
              width: responsiveScreenWidth(40),
              textAlign: "center",
              fontWeight: "700",
              marginTop: 50
            }}
          >
            Join Room
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Room;

const styles = StyleSheet.create({
  loginButton: {
    color: "white",
    backgroundColor: "#333",
    padding: "4%",
    borderRadius: 30,
    width: responsiveScreenWidth(40),
    textAlign: "center",
    fontWeight: "700",
  },
});
