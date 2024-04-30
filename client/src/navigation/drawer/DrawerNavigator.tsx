import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import MainScreen from '../../screens/MainScreen'
import CustomDrawer from './CustomDrawer'

const DrawerNavigator = () => {

    const Drawer = createDrawerNavigator()

  return (
    <Drawer.Navigator drawerContent={props => <CustomDrawer {...props}/>}>
        <Drawer.Screen name = 'Main' component={MainScreen} options={{headerShown : false}}/>
    </Drawer.Navigator>
  )
}

export default DrawerNavigator

const styles = StyleSheet.create({})