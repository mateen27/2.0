import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import JWT from "expo-jwt";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { secretKey } from "../../private/secret";
import { useFocusEffect } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
import { Image } from "react-native";

const User = () => {
  // state management
  const [userID, setUserID] = useState("");
  const [userFollowing, setUserFollowing] = useState(null);
  const [userFollowers, setUserFollowers] = useState(null);
  const [userPosts, setUserPosts] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Image", value: "image" },
    { label: "Reel", value: "reel" },
    { label: "Post", value: "post" },
  ]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
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
    fetchUserID();
  }, [userID]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const followingResponse = await axios.get(
            `http://192.168.29.181:3001/api/user/followings/${userID}`
          );
          console.log("followinf", followingResponse.data[1].name);
          setUserName(followingResponse.data[1].name);
          setUserEmail(followingResponse.data[1].email);

          setUserFollowing(followingResponse.data.length);

          const followersResponse = await axios.get(
            `http://192.168.29.181:3001/api/user/followers/${userID}`
          );
          setUserFollowers(followersResponse.data.length);

          const postsResponse = await axios.get(
            `http://192.168.29.181:3001/api/user/userPosts/${userID}`
          );
          // console.log('posts', postsResponse.data.post.length)
          if (postsResponse.data.post.length > 0) {
            // setUserName(postsResponse.data.post[0].userID.name);
            // setUserEmail(postsResponse.data.post[0].userID.email);
          }

          setUserPosts(postsResponse.data.post.length);
        } catch (error) {
          console.log("error fetching data", error);
        }
      };
              fetchData()

    }, [userID]) // Include dependencies if needed
  );

  useFocusEffect(
    useCallback(() => {
      if (value) {
        // Fetch posts from the API based on the selected post type
        const fetchPosts = async () => {
          try {
            const response = await axios.get(`http://192.168.29.181:3001/api/user/userPosts/${userID}`);
            console.log('response of the posts ', response.data.post);
            
            setPosts(response.data.post);
          } catch (error) {
            console.error('Error fetching posts:', error);
          }
        };
  
        fetchPosts();
      }
    }, [userID, value])
  );
  

  console.log('value', value);
  

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Profile Image */}
        <View style={styles.profileImage}></View>

        {/* Spacer */}
        <View style={styles.spacer}></View>
        {/* User Stats */}
        <View style={styles.stats}>
          <Text style={styles.statText}>{userPosts}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>

        <View style={styles.stats}>
          <Text style={styles.statText}>{userFollowers}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>

        <View style={styles.stats}>
          <Text style={styles.statText}>{userFollowing}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={{ color: "#fff", fontSize: 14, fontWeight: "500" }}>
          {userName}
        </Text>
        <Text
          style={{
            color: "grey",
            fontSize: 12,
            fontWeight: "500",
            marginTop: 2,
          }}
        >
          {userEmail}
        </Text>
      </View>

      {/* Spacer */}
      {/* creating the seperation */}
      <View
        style={{ borderColor: "#333", borderWidth: 1, marginTop: "10%" }}
      />

<DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          theme="DARK"
          placeholder={"Choose a Post type..."}
          style = {{ width: '90%', marginHorizontal: 10, marginTop: 20 }}
        />


<ScrollView contentContainerStyle={styles.scrollContainer}>
      {posts.map((post, index) => {
        console.log('post inside the map', post.contentUrl);
        
        if (post.type === 'image') {
          // Render image posts in square boxes with a maximum of 3 in a row
          return (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri: post.contentUrl }} style={styles.image} />
            </View>
          );
        } else {
          // Render text posts one below another
          return (
            <View key={index} style={styles.textContainer}>
              <Text style={styles.text}>{post.contentDescription}</Text>
            </View>
          );
        }
      })}
    </ScrollView>
    </View>
  );
};

export default User;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    // alignItems: 'center',
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2, // Adjust this value to reduce the vertical gap
  },
  profileImage: {
    backgroundColor: "white",
    width: 80,
    height: 80,
    borderRadius: 40,
    margin: 20, // Adjust this value to reduce the gap between the profile image and stats
    marginRight: 10,
    marginLeft: 15,
  },
  stats: {
    alignItems: "center",
    // justifyContent: 'space-between',
    marginRight: 20, // Adjust this value to reduce the gap between each stats
    marginLeft: 28,
  },
  statText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    color: "grey",
    fontSize: 14,
  },
  spacer: {
    // flex: 1, // Fill remaining space
  },
  detailsContainer: {
    position: "absolute",
    left: 10,
    top: 115,
  },
  scrollContainer: {
    flexDirection: 'row',
    // flexWrap: 'wrap',
    // justifyContent: 'center',
    marginTop: 10,
    marginLeft: 10,
    marginHorizontal: 10,
    marginRight: 10
  },
  imageContainer: {
    width: '30%', // Adjust the width to fit 3 images in a row
    aspectRatio: 1, // Maintain aspect ratio for square boxes
    margin: 5,
    backgroundColor: 'lightgray',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    width: '100%',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  text: {
    fontSize: 16,
  },
});
