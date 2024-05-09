import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MovieRoom from './MovieRoom';
import RoomUserDetails from './RoomUserDetails';
import ShareRoom from './ShareRoom';
// import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MovieScreen from './MovieScreen';

const UsersRoomNavigation = (route: any) => {

    console.log('users', route);

    const { roomID, selectedMovies } = route
    // console.log('roomID', selectedMovies);
    
    

    // const Tab = createBottomTabNavigator();
    const Tab = createMaterialTopTabNavigator();

  return (
      <Tab.Navigator initialRouteName='Streaming'>
        <Tab.Screen name="Streaming" initialParams={{roomID}}  component={MovieScreen} options={{
            tabBarStyle: {
                backgroundColor: '#000'
            },
            tabBarActiveTintColor: '#f1f1f1',
            headerLeft: () => (
              <Ionicons
                name="arrow-back"
                size={26}
                color="white"
                style={{ padding: 10 }}
                onPress={() => {
                  // Handle navigation or any other action
                  navigation.goBack();
                }}
              />
            ),
        }}/>
        <Tab.Screen name="Users" component={RoomUserDetails} options={{
            tabBarStyle: {
                backgroundColor: '#000'
            },
            tabBarActiveTintColor: '#f1f1f1',
        }} />
        <Tab.Screen name="Share Details" initialParams={{roomID}} component={ShareRoom} options={{
            tabBarStyle: {
                backgroundColor: '#000'
            },
            tabBarActiveTintColor: '#f1f1f1'
        }}/>
      </Tab.Navigator>
  )
}

export default UsersRoomNavigation

const styles = StyleSheet.create({})