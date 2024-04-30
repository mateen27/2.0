import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Entypo } from '@expo/vector-icons';
import { BORDERRADIUS, COLORS, FONTSIZE, SPACING } from '../theme/theme';

const AppHeader = (props : any) => {
  return (
    <View style = {styles.container}>
      <TouchableOpacity style = {styles.iconBg} onPress={() => props.action()}>
        <Entypo name="circle-with-cross" size={FONTSIZE.size_24} color="white" />
      </TouchableOpacity>
      <Text style = {styles.headerText}>{props.header}</Text>
      <View style = {styles.emptyContainer}></View>
    </View>
  )
}

export default AppHeader

const styles = StyleSheet.create({
    container : {
        display : 'flex' , 
        flex : 1 , 
        flexDirection : 'row' , 
        alignItems : 'center' , 
        justifyContent : 'center'
    } , 
    headerText : {
        flex : 1 , 
        fontSize : FONTSIZE.size_20 , 
        textAlign : 'center' , 
        color : COLORS.White
    } , 
    emptyContainer : {
        height : SPACING.space_20 * 2 , 
        width : SPACING.space_20 * 2 , 
    } , 
    iconBg : {
        height : SPACING.space_20 * 2 , 
        width : SPACING.space_20 * 2 , 
        alignItems : 'center' , 
        justifyContent : 'center' , 
        borderRadius : BORDERRADIUS.radius_20 , 
        backgroundColor : COLORS.Orange
    }
})