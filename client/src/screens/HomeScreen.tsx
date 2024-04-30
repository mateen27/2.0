import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import DrawerNavigator from '../navigation/drawer/DrawerNavigator'

const HomeScreen = () => {
  return (
    <View style = {{flex : 1}}>
      <DrawerNavigator/>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})