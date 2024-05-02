import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import JWT from 'expo-jwt';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { secretKey } from '../../private/secret';
import { useFocusEffect } from '@react-navigation/native';

const User = () => {

    // state management
    const [ userID, setUserID ] = useState('');
    const [ userFollowing, setUserFollowing ] = useState(null);
    const [ userFollowers, setUserFollowers ] = useState(null);
    const [ userPosts, setUserPosts ] = useState(null);
    const [ userName, setUserName ] = useState('');
    const [ userEmail, setUserEmail ] = useState('')

    useEffect(() => {
        const fetchUserID = async () => {
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
        }
        fetchUserID();
    }, [userID]);
    
    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                try {
                    const followingResponse = await axios.get(`http://192.168.29.181:3001/api/user/followings/${userID}`);
                    setUserFollowing(followingResponse.data.length);

                    const followersResponse = await axios.get(`http://192.168.29.181:3001/api/user/followers/${userID}`);
                    setUserFollowers(followersResponse.data.length);

                    const postsResponse = await axios.get(`http://192.168.29.181:3001/api/user/userPosts/${userID}`);
                    // console.log('posts', postsResponse.data.post[0].userID.name);
                    setUserName(postsResponse.data.post[0].userID.name);
                    setUserEmail(postsResponse.data.post[0].userID.email);
                    
                    setUserPosts(postsResponse.data.post.length);
                } catch (error) {
                    console.log('error fetching data', error);
                }
            }
    
            fetchData();
        }, [userID]) // Include dependencies if needed
    );

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
            <View style = { styles.detailsContainer}>
                <Text style = {{ color : 'white', fontSize: 14, fontWeight: '500' }}>{userName}</Text>
                <Text style = {{ color : 'grey', fontSize: 12, fontWeight: '500', marginTop: 2 }}>{userEmail}</Text>
            </View>
        </View>
        
      )
    }
    
    export default User
    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#000000',
            // alignItems: 'center',
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 5, // Adjust this value to reduce the vertical gap
        },
        profileImage: {
            backgroundColor: 'white',
            width: 80,
            height: 80,
            borderRadius: 40,
            margin: 20, // Adjust this value to reduce the gap between the profile image and stats
            marginRight: 25,
            marginLeft: 25
        },
        stats: {
            alignItems: 'center',
            // justifyContent: 'space-between',
            marginRight: 20, // Adjust this value to reduce the gap between each stats
            marginLeft: 25
        },
        statText: {
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold',
        },
        statLabel: {
            color: 'grey',
            fontSize: 14,
        },
        spacer: {
            // flex: 1, // Fill remaining space
        },
        detailsContainer: {
            position: 'absolute', left: 10, top: 115
        }
    });