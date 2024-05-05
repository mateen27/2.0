import { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, ScrollView, Pressable } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JWT from 'expo-jwt';
import { secretKey } from '../../private/secret';
import { AntDesign, Entypo } from '@expo/vector-icons';
import ConnectionRequest from './ConnectionRequest';
import UserProfile from './UserProfile';

const People = () => {

// state management
  const [friendRequests, setFriendRequests] = useState([]);
  const [userID, setUserID] = useState('');
  const [ allUsers, setAllUsers ] = useState([]);

//   fetching the userID of the current user
  const fetchUserID = useCallback(async () => {
    try {
        const userID: any = await AsyncStorage.getItem('userID');
        // decoding the userID
        const decodedID: any = JWT.decode(userID, secretKey)
        console.log('decodedID of the user', decodedID.userID);
        

        // setting the user ID to the state
        setUserID(decodedID.userID)
    } catch (error) {
        console.log('error fetching the UserID from the Async Storage', error);
        
    }
  }, [])

  useEffect(() => {
    fetchUserID();
  }, [fetchUserID])

  // Define fetchFriendRequests as a memoized callback using useCallback
  const fetchFriendRequests = useCallback(async () => {
    try {
      // Make API call to fetch friend requests for the current user
      const response = await axios.get(`http://192.168.29.181:3001/api/user/friendRequests/${userID}`);
      console.log('friends requests', response?.data?.users);
      
      // Assuming the response data is an array of friend requests
      setFriendRequests(response?.data?.users);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  }, [userID]);

  useEffect(() => {
    // Fetch friend requests when component mounts or userID changes
    fetchFriendRequests();
  }, [fetchFriendRequests]); // Include fetchFriendRequests in dependency array

//   fetching the users of the application instead of the logged in ones and the people who are in friendRequests
  const fetchAllUsers = useCallback(async () => {
    try {
      // Make API call to fetch all users
      const response = await axios.get(`http://192.168.29.181:3001/api/user/fetchAllUsers/${userID}`);
      console.log('all users', response?.data?.users);
      
      // Assuming the response data is an array of all users
      setAllUsers(response?.data?.users);
    } catch (error) {
      console.error('Error fetching all users:', error);
    }
  }, [userID]);

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  return (
    <ScrollView style={styles.container}>

              {/* for the heading text */}
      <Pressable
        // onPress={() => router.push("/network/connections")}
        style={styles.manageNetworkStyle}
      >
        <Text style={styles.manageTextStyle}>Sent Requests</Text>
        <AntDesign name="arrowright" size={22} color="#f3f3f3" />
      </Pressable>

            {/* creating the seperation */}
            <View
        style={{ borderColor: "#e0e0e0", borderWidth: 1, marginVertical: 10 }}
      />

      {/* for the invitation text and arrow button */}
      <View style={styles.invitationContainer}>
        <Text style={styles.invitationTextStyle}>
          Pending Requests ( {friendRequests?.length} )
        </Text>
        <AntDesign name="arrowright" size={22} color="black" />
      </View>

      {/* creating the seperation */}
      <View
        style={{ borderColor: "#e0e0e0", borderWidth: 1, marginVertical: 10 }}
      />

      {/* for showing all the connection requests */}
      <View>
        {friendRequests?.map((item, index) => (
          <ConnectionRequest
            item={item}
            key={index}
            connectionRequest={friendRequests}
            setConnectionRequest={setFriendRequests}
            userId={userID}
          />
        ))}
      </View>

      {friendRequests.length > 0 && (
        <View
          style={{ borderColor: "#e0e0e0", borderWidth: 1, marginVertical: 10 }}
        />
      )}

      {/* for showing the people who are not connected */}
      <View style={styles.growNetworkContainer}>
        <View style={styles.growNetworkStyle}>
          <Text style = {{ color : '#fff', fontSize: 16, fontWeight: '500'}}>People you may know!</Text>
          {/* <Entypo name="cross" size={24} color="black" /> */}
        </View>
      </View>

      {/* list of users apart from the logged-in user! */}
      <FlatList
        data={allUsers}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        numColumns={2}
        keyExtractor={(item) => item._id}
        renderItem={({ item, key }: any) => (
          <UserProfile userID={userID} item={item} key={key} />
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  manageNetworkStyle: {
    marginTop: 10,
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  manageTextStyle: {
    fontSize: 16,
    fontWeight: "600",
    color: '#ffffff'
  },
  invitationContainer: {
    marginTop: 10,
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  invitationTextStyle: {
    fontSize: 16,
    fontWeight: "600",
    color: '#fff'
  },
  growNetworkContainer: {
    marginHorizontal: 15,
  },
  growNetworkStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  premiumBadgeContainer: {
    backgroundColor: "#FFC72C",
    width: 140,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 25,
    marginTop: 8,
  },
  premiumTextStyle: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },
});

export default People;
