import {
    Image,
    StyleSheet,
    Text,
    View,
    Dimensions,
    Pressable,
  } from "react-native";
  import React, { useCallback, useState } from "react";
  
  const UserProfile = ({ item, userID }: any) => {
    // console.log("user id", userId);
    // console.log(item._id)
  
    // state management
    const [connectionSent, setConnectionSent] = useState(false);
  
    // send request to the person
    const sendConnectionRequest = useCallback(async (selectedUserId: any) => {
      try {
        const response = await fetch(
          `http://192.168.29.181:3001/api/user/friendRequests/${userID}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ selectedUserId }),
          }
        );
  
        if (response.ok) {
          setConnectionSent(true);
        }
      } catch (error) {
        console.log("error sending connection request to the person", error);
      }
    }, [userID]);
  
    // Array of LinkedIn bios
    const linkedinBios = [
      "Passionate about leveraging technology to solve real-world problems.",
      "Experienced professional with a proven track record of driving business growth.",
      "Dedicated to continuous learning and professional development.",
      "Results-oriented individual with a focus on delivering exceptional outcomes.",
      "Innovative thinker with a passion for driving positive change.",
      "Skilled communicator with a knack for building strong relationships.",
      "Strategic thinker with a focus on delivering results and exceeding expectations.",
      "Detail-oriented professional with a passion for problem-solving and continuous improvement.",
      "Creative thinker with a knack for developing unique solutions to complex challenges.",
      "Results-driven leader with a commitment to excellence and a passion for success.",
      "Dynamic communicator skilled in building relationships and driving collaboration.",
      "Innovative problem-solver with a strong background in data analysis and strategy development.",
      "Team player with a proven ability to thrive in fast-paced environments and deliver exceptional results.",
    ];
  
    // Function to randomly pick a LinkedIn bio from the array
    const getRandomBio = () => {
      // Generate a random index within the length of the array
      const randomIndex = Math.floor(Math.random() * linkedinBios.length);
      // Return the bio at the randomly selected index
      return linkedinBios[randomIndex];
    };
  
    const randomBio = getRandomBio();
    //   console.log(randomBio);
  
    // Generate an array of numbers from 1 to 100
    const numbers = Array.from({ length: 100 }, (_, index) => index + 1);
  
    // Function to randomly pick a number from the array
    const pickRandomNumber = () => {
      const randomIndex = Math.floor(Math.random() * numbers.length);
      return numbers[randomIndex];
    };
  
    const randomNumber = pickRandomNumber();
  
    return (
      <View style={styles.mainContainer}>
        {/* for holding image  */}
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Image style={styles.imageStyle} source={{ uri: item?.image }} />
        </View>
  
        {/* View for holding the Text i.e the name and bio of the user's */}
        <View style={styles.textContainer}>
          {/* name of the user */}
          <Text style={styles.nameStyle}>{item?.name}</Text>
          {/* bio of the user */}
          <Text numberOfLines={2} style={styles.bioTextStyle}>
            {randomBio}
          </Text>
          {/* number of connections of the user which are mutual */}
          <Text style={styles.mutualConnectionStyle}>
            {randomNumber} mutual connections
          </Text>
        </View>
  
        {/* Button for sending the connection Request */}
        <Pressable
          onPress={() => sendConnectionRequest(item._id)}
          style={[
            styles.connectButtonContainer,
            {
              borderColor:
                connectionSent || item?.connectionRequest?.includes(userID)
                  ? "grey"
                  : "#0072b1",
            },
          ]}
        >
          <Text
            style={[
              styles.connectTextStyle,
              {
                color:
                  connectionSent || item?.connectionRequest?.includes(userID)
                    ? "grey"
                    : "#0072b1",
              },
            ]}
          >
            {connectionSent || item?.connectionRequest?.includes(userID)
              ? "Pending"
              : "Connect"}
          </Text>
        </Pressable>
      </View>
    );
  };
  
  export default UserProfile;
  
  const styles = StyleSheet.create({
    mainContainer: {
      // flex: 1,
      borderRadius: 9,
      marginHorizontal: 16,
      borderColor: "#e0e0e0",
      borderWidth: 1,
      marginVertical: 10,
      justifyContent: "center",
      height: Dimensions.get("window").height / 3.5,
      width: (Dimensions.get("window").width - 70) / 2,
    },
    imageStyle: {
      width: 90,
      height: 90,
      borderRadius: 45,
      resizeMode: "cover",
    },
    nameStyle: {
      fontSize: 16,
      fontWeight: "600",
      textAlign: "center",
      color: '#f1f1f1'
    },
    textContainer: {
      marginTop: 10,
    },
    bioTextStyle: {
      textAlign: "center",
      marginTop: 2,
      marginLeft: 1,
      color: "grey",
      fontSize: 14,
    },
    mutualConnectionStyle: {
      textAlign: "center",
      marginTop: 10,
      color: "grey",
      fontSize: 14,
    },
    connectButtonContainer: {
      marginLeft: "auto",
      marginRight: "auto",
      borderWidth: 1,
      borderRadius: 25,
      marginTop: 7,
      paddingHorizontal: 15,
      paddingVertical: 4,
    },
    connectTextStyle: {
      fontWeight: "600",
      textAlign: "center",
    },
  });
  