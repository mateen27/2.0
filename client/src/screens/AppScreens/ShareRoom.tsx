import { StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import JWT from 'expo-jwt';
import { secretKey } from '../../private/secret';
import axios from 'axios';

const ShareRoom = ({ route }: any) => {

    const { roomID } = route.params;

    const [userID, setUserID] = useState('');
    const [userName, setUserName] = useState('');

    const fetchUserID = async () => {
        try {
            const userID: any = await AsyncStorage.getItem('userID');
            const decodedID: any = JWT.decode(userID, secretKey);
            setUserID(decodedID.userID);
        } catch (error) {
            console.log('error fetching the UserID from the Async Storage', error);
        }
    }

    const fetchUserByID = async () => {
        try {
            const response = await axios.get(`http://192.168.29.181:3001/api/user/userByID/${userID}`);
            setUserName(response.data.user.name);
        } catch (error) {
            console.log('error fetching fetch user details', error);
            throw new Error('Error fetching the user details of the user');
        }
    }

    useEffect(() => {
        fetchUserID();
    }, []);

    useEffect(() => {
        if (userID) {
            fetchUserByID();
        }
    }, [userID]);

    return (
        <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, color: '#f1f1f1', fontWeight: '600', justifyContent: 'center' }}>Share Room Details</Text>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '500', marginTop: 25 }}>Room HOST</Text>
            <TextInput
                placeholder={userName}
                placeholderTextColor={"#f2f2f2"}
                editable={false}
                style={{
                    width: "80%",
                    height: 50,
                    borderRadius: 10,
                    borderWidth: 0.5,
                    alignSelf: "center",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingLeft: 15,
                    paddingRight: 15,
                    backgroundColor: "#333",
                    color: "#ffffff",
                    marginVertical: 12,
                    textAlign: 'center'
                }}
            />
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '500', marginTop: 10 }}>Room ID</Text>
            <TextInput
                placeholder={roomID}
                placeholderTextColor={"#f2f2f2"}
                editable={false}
                style={{
                    width: "80%",
                    height: 50,
                    borderRadius: 10,
                    borderWidth: 0.5,
                    alignSelf: "center",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingLeft: 15,
                    paddingRight: 15,
                    backgroundColor: "#333",
                    color: "#ffffff",
                    marginVertical: 8,
                    textAlign: 'center'
                }}
            />
        </View>
    )
}

export default ShareRoom

const styles = StyleSheet.create({})
