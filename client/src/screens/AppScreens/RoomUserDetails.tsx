import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from "@react-navigation/native";
import axios from 'axios';

const RoomUserDetails = ({ route }: any) => {
  const { roomID } = route.params;

  // State to hold host details
  const [hostName, setHostName] = useState("");

  // Fetch room details when the screen is focused
  useFocusEffect(
    React.useCallback(() => {
      // Function to fetch room details from the server
      const fetchRoomDetails = async () => {
        try {
          const response = await axios.get(
            `http://192.168.29.181:3001/api/user/get-room-details/${roomID}`
          );

          console.log("Log inside the room users", response.data);

          // Extract host name from response data
          const host = response.data.host;
          if (host && host.length > 0) {
            const { name } = host[0]; // Assuming there's only one host
            setHostName(name);
          }
        } catch (error) {
          console.log("Error fetching the room details", error);
        }
      };

      fetchRoomDetails();
    }, [roomID])
  );

  return (
    <ScrollView style={styles.container}>
      <Text style = {{ fontSize: 18, fontWeight: '800', marginVertical: 20, color: '#fff', textAlign: 'center' }}>Room Users</Text>
      <Text style = {{ fontSize: 15, fontWeight: '600', color: '#fff', backgroundColor: '#333', padding: 20, borderRadius: 10}}>{hostName}</Text>
      <Text style = {{ fontSize: 15, fontWeight: '600', color: '#fff', backgroundColor: '#333', padding: 20, borderRadius: 10, marginTop: 10}}>{hostName}</Text>
    </ScrollView>
  );
};

export default RoomUserDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
});
