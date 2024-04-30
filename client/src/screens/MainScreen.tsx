import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import BottomNavigator from '../navigation/bottom/BottomNavigator'

const MainScreen = () => {
  return (
    <View style = {{flex : 1}}>
      <BottomNavigator/>
    </View>
  )
}

export default MainScreen

const styles = StyleSheet.create({})