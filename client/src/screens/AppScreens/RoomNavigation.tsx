import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import UsersRoomNavigation from './UsersRoomNavigation'

const RoomNavigation = ({route}: any) => {

    // const { roomID, selectedMovies } = route.params
    // console.log('routes inside room navigation', route.params);
    console.log('routes inside room navigation', route.params.roomID, route.params.selectedMovies );

    const { roomID, selectedMovies } = route.params;
    
    

//   console.log(roomID)

  return (
    <UsersRoomNavigation roomID = {roomID} selectedMovies = {selectedMovies} />
  )
}

export default RoomNavigation

const styles = StyleSheet.create({})