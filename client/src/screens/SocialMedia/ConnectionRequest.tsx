import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
// icons import
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import JWT from "expo-jwt";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { secretKey } from "../../private/secret";

const ConnectionRequest = ({
  item,
  connectionRequest,
  setConnectionRequest,
  userId,
}) => {

  console.log('userId', typeof userId);
  console.log('item', item);

  //   function to accept the connection requests
  const acceptConnection = async (requestId: any) => {
    try {
      const connection = await fetch(
        `http://192.168.29.181:3001/api/user/friend-request/accept/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            recepientID: requestId, // Using userId as the recipient ID
          }),
        }
      );

      if (connection.ok) {
        setConnectionRequest(
          connectionRequest.filter((request: any) => request._id !== requestId)
        );
      }
    } catch (error) {
      console.log("error accepting connection request", error);
    }
  };

  return (
    <View style={styles.requestContainer}>
      {/* for holding the image  , name */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
        <Image style={styles.imageStyle} source={{ uri: item?.image }} />

        <Text style={styles.textStyle}>
          {item?.name} is Inviting you to Connect
        </Text>

        <View style={styles.iconContainer}>
          {/* icon for cross or rejecting friend request*/}
          <Pressable
            style={styles.iconStyle}
          >
            <Feather name="x" size={22} color="black" />
          </Pressable>

          {/* icon for accepting friend Requests */}
          <Pressable onPress={() => acceptConnection(item._id)} style={styles.iconStyle}>
            <Ionicons name="checkmark-outline" size={22} color="#0072b1" />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ConnectionRequest;

const styles = StyleSheet.create({
  requestContainer: {
    marginHorizontal: 15,
    marginVertical: 5,
  },
  imageStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    resizeMode: "cover",
  },
  textStyle: {
    width: 200,
    color: '#f1f1f1'
  },
  iconStyle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    position: "absolute",
    right: 10,
    // top: 10,
  },
});
