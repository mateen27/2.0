import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios';
import { AntDesign, Entypo, Feather, FontAwesome, FontAwesome5, SimpleLineIcons } from '@expo/vector-icons';

const Home = () => {

    const MAX_LINES = 2;
    // state management
    const [userPosts, setUserPosts] = useState([]);
    const [showFullText, setShowFullText] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
  
    // function to show the full text of the post
    const toggleShow = () => {
      setShowFullText(!showFullText);
    };

      // function for formatting the dates
  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const options = { month: "long", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }

    // function for liking the post
    const handleLikePost = async (postId) => {
        try {
        //   const response = await axios.post(
        //     `http://192.168.29.181:8080/user/like/${postId}/${userId}`
        //   );
    
        //   if (response.status === 200 || response.status === 201) {
        //     const updatePost = response.data.post;
        //     setIsLiked(updatePost.likes.some((like) => like.user === userId));
        //   }
        } catch (error) {
          console.log("error liking/unliking the post", error);
        }
      };

    // Memoize the fetchUsersPost function using useCallback
    const fetchUsersPost = useCallback(async () => {
        try {
            // Make a fetch request to your backend API endpoint
            const response = await axios.get('http://192.168.29.181:3001/api/user/posts');

            
            const data = response.data.post;
            console.log('data', data);
            
            setUserPosts(data); // Set the fetched data to the state
        } catch (error) {
            console.log('Error fetching users posts', error);
        }
    }, []);

    // Fetching the user's posts
    useEffect(() => {
        fetchUsersPost();
    }, [fetchUsersPost]);
  return (
    <ScrollView style = { styles.container }>
        {/* View for posts */}
        <View>
        {userPosts.map((item, index) => ( 
          <View key={index} style = {{ marginVertical: 5 }}>
            {/* View for the profile information like name , bio , profileImage , dateOfPost */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
                
              <Image
                style={{ width: 60, height: 60, borderRadius: 30, marginHorizontal: 15 }}
                source={{ uri: item.contentUrl }}
              />

              {/* description of the user */}
                <View>
                <Text style={{ fontSize: 15, fontWeight: "600", color: '#f1f1f1' }}>
                {item?.userID?.name}
                </Text>
                {/* <Text
                  numberOfLines={2}
                  style={{ width: 230, color: "grey", fontWeight: "400" }}
                >
                  {profileBio}
                </Text> */}

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ fontWeight: "300", color: "grey" }}>
                    {formatDate(item?.createdAt)} •{" "}
                  </Text>

                  <FontAwesome5 name="globe-americas" size={14} color="grey" />
                </View>
              </View>

              {/* for the icons */}
              <View
                style={{ flexDirection: "row",
                justifyContent: "flex-end", // Align items to the right side of the screen
                alignItems: "center", // Center items vertically
                position: "absolute", // Position the container absolutely
                right: 0, // Align to the right of the parent container
                padding: 10, // Add some padding for spacing 
                gap: 10
            }}
              >
                <Entypo name="dots-three-vertical" size={24} color="white" />
                <Feather name="x" size={24} color="white" />
              </View>
            </View>

            {/* View for the decription of the post */}
            <View style={styles.descriptionStyles}>
              <Text style = {{ color: 'white'}} numberOfLines={showFullText ? undefined : MAX_LINES}>
                {item?.contentDescription}
              </Text>
              {!showFullText && (
                <Pressable onPress={toggleShow}>
                  <Text style={{ color: "grey" }}>See More...</Text>
                </Pressable>
              )}
            </View>

            {/* post image */}
            <Image
              style={{ width: "100%", height: 240, resizeMode: 'contain' }}
              source={{ uri: item?.contentUrl }}
            />

            {/* for likes */}
            {item?.likes?.length > 0 && (
              <View
                style={{
                  padding: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <SimpleLineIcons name="like" size={16} color="#0072b1" />
                <Text style={{ color: "grey" }}>{item?.likes?.length}</Text>
              </View>
            )}

            {/* border after image */}
            {/* <View
              style={{ borderColor: "#e0e0e0", borderWidth: 2, height: 2 }}
            /> */}

            {/* for the like comment icons */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
                marginVertical: 10,
              }}
            >
              <Pressable onPress={() => handleLikePost(item?._id)}>
                <AntDesign
                  style={{ textAlign: "center" }}
                  name="like2"
                  size={20}
                  color={isLiked ? "#0072b1" : "grey"}
                />
                <Text
                  style={{
                    textAlign: "center",
                    color: isLiked ? "#0072b1" : "grey",
                    fontSize: 12,
                    marginTop: 2,
                  }}
                >
                  Like
                </Text>
              </Pressable>
              <Pressable>
                <FontAwesome
                  name="comment-o"
                  size={20}
                  color="gray"
                  style={{ textAlign: "center" }}
                />
                <Text
                  style={{
                    textAlign: "center",
                    marginTop: 2,
                    fontSize: 12,
                    color: "gray",
                  }}
                >
                  Comment
                </Text>
              </Pressable>
              <Pressable>
                <Feather
                  style={{ textAlign: "center" }}
                  name="share"
                  size={20}
                  color="grey"
                />
                <Text
                  style={{
                    marginTop: 2,
                    fontSize: 12,
                    textAlign: "center",
                    color: "gray",
                  }}
                >
                  repost
                </Text>
              </Pressable>
              <Pressable>
                <Feather
                  style={{ textAlign: "center" }}
                  name="send"
                  size={20}
                  color="gray"
                />
                <Text style={{ marginTop: 2, fontSize: 12, color: "gray" }}>
                  Send
                </Text>
              </Pressable>
            </View>

            {/* <View
              style={{ borderColor: "#e0e0e0", borderWidth: .2, height: 0 }}
            /> */}
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000', 
    },
    imageStyle: {
        width: 30,
        height: 30,
        borderRadius: 15,
      },
      descriptionStyles: {
        marginTop: 10,
        marginHorizontal: 15,
        marginBottom: 12,
      },
})