import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import UserList from './UserList';

const Cards = () => {
  const [loggedUser, setLoggedUser] = useState('');
  const [chats, setChats] = useState('');

  const fetchChats = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('authToken');

      if (storedToken) {
        const config = {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${storedToken}`,
          },
        };

        const { data } = await axios.get('http://192.168.29.181:8080/api/chat', config);
        setChats(data);
      }
    } catch (error) {
      Alert.alert('Error Occurred', 'Failed to load Chats');
    }
  };

  useEffect(() => {
    const getLoggedUser = async () => {
      const userToken = await AsyncStorage.getItem('authToken');
      setLoggedUser(userToken);
    };

    getLoggedUser();
    fetchChats();
  }, []);

  // fetching the USERID from async Storage
  const getLoggedUserID =async () => {
    try {
      const storedToken = await AsyncStorage.getItem("loggedUserID");
      // console.log('jhjkchzjxkc' , storedToken);
      

      return storedToken;
    } catch (error) {
      console.log(`error fetching the userID of the user from async Storage ${error}` );
    }
  }

  const getSenderInfo = async (chat) => {
    try {
      const loggedUserID = await getLoggedUserID();
      console.log('Logged User ID:', loggedUserID);
      
      if (!chat.isGroupChat && chat.users.length > 1) {
        const sender = chat.users.find(user => user._id !== loggedUserID);
        return sender ? { name: sender.name, email: sender.email } : null;
      }
      return null;
    } catch (error) {
      console.log('Error getting sender information:', error);
      return null;
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.headerText}>
        <Text style={styles.text}>My Chats</Text>
      </View>
      <View>
      {chats ? (
  chats.map((chat) => (
    <UserList
      key={chat._id}
      user={chat}
      loggedUser={loggedUser}
      senderInfo={getSenderInfo(chat, loggedUser)}
    />
  ))
) : (
  <ActivityIndicator size="large" color="#00ff00" />
)}
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    marginTop: '3%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Cards;
