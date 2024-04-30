import { StyleSheet, Text, SafeAreaView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
// importing the bars image
import { Entypo } from '@expo/vector-icons';

import Menu from '../../images/menuu.png'
// importing notification icon
import { Ionicons } from '@expo/vector-icons';
// responsive font imports
import {
    responsiveScreenHeight,
    responsiveScreenWidth,
    responsiveScreenFontSize
  } from "react-native-responsive-dimensions";

//   importing a screen
// import Notification from '../screens/AppScreens/Notification';

const HeaderComponent: React.FC<{navigation: any , props: any}> = ({ navigation , props }) => {
  return (
    <SafeAreaView style = {styles.headerContainer}>
        {/* Menu Bar Icon */}
      <TouchableOpacity
      onPress={() => navigation.openDrawer()}
      ><Image 
      source={Menu}
      style = {styles.headerMenu}
      /></TouchableOpacity>

      {/* Page Name Text */}
      <Text style = {styles.headerText}>{props}</Text>

      {/* Notification Icon */} 
      <TouchableOpacity
      onPress={() => navigation.navigate('Notification')}
      ><Ionicons name="chatbox-outline" size={25} color="#f5f6fa" /></TouchableOpacity>
    </SafeAreaView>
  )
}

export default HeaderComponent

const styles = StyleSheet.create({
    headerContainer : {
        marginVertical : '5%' , 
        marginHorizontal : '5%' , 
        flexDirection : 'row' , 
        justifyContent : 'space-between' , 
        alignItems : 'center'
    } , 
    headerText : {
        fontSize : responsiveScreenFontSize(2.5) , 
        fontWeight : "bold" , 
        color : '#f5f6fa' , //#0D0D0D  //#f5f6fa //#CAD5E2
    } , 
    headerMenu : {
        height: 22,
        width: 32, 
    }
})