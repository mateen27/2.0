import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MovieRoom from './MovieRoom';
import RoomUserDetails from './RoomUserDetails';
import ShareRoom from './ShareRoom';

const UsersRoomNavigation = () => {

    const Tab = createBottomTabNavigator();

  return (
      <Tab.Navigator>
        <Tab.Screen name="MovieRoom" component={MovieRoom} />
        <Tab.Screen name="RoomUsers" component={RoomUserDetails} />
        <Tab.Screen name="ShareRoom" component={ShareRoom} />
      </Tab.Navigator>
  )
}

export default UsersRoomNavigation

const styles = StyleSheet.create({})