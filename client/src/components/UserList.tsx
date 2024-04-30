import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "../theme/theme";
import { getSender } from "../config/ChatLogics";
import jwtDecode from 'jwt-decode';

const UserList = ({ user, loggedUser, handleFunction }: any) => {
    const getOtherUser = ({ users, loggedUser }: any) => {
        // console.log(loggedUser._id);
        console.log(user);
        
        // Ensure users exists and is an array
        if (users && Array.isArray(users)) {
            // Find the user that is not the logged-in user
            return users.find(user => user._id !== loggedUser._id);
        }
        return null;
    };

    // Find the other user based on 'user' data and 'loggedUser'
    const otherUser = getOtherUser({ users: user.users, loggedUser });

    return (
        <View style={styles.mainContainer}>
            {otherUser && (
                <TouchableOpacity style={styles.card} onPress={handleFunction}>
                    <View style={styles.profileContainer}>
                        <Image source={{ uri: otherUser.pic }} style={styles.profileImage} />
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.username}>
                            {!user.isGroupChat ? otherUser.name : user.chatName}
                        </Text>
                        <Text style={styles.email}>{otherUser.email}</Text>
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    // margin : 5 ,
    // flex : 1 ,
    borderBottomWidth: 1,
    paddingBottom: 10,
    backgroundColor: '#333',
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
  mainContainer : {
    // marginTop : '20%' , 
    // flexDirection : 'row'
    // position : 'absolute' , 
    // marginVertical : '10%'
  }
});

export default UserList;
