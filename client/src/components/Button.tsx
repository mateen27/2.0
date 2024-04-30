import { StyleSheet, Text, View , TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS } from '../theme/theme'

const Button = (props: any) => {
    const filledBgColor = props.color || COLORS.blackSecondary;
    const outlinedColor = COLORS.White; 
    const bgColor = props.filled ? filledBgColor : outlinedColor;
    const textColor = props.filled ? COLORS.White :COLORS.blackSecondary;
  return (
    <TouchableOpacity
        onPress={props.onPress}
        style = {{...styles.button , ...{backgroundColor: bgColor} , ...props.style }}
    >
        <Text style = {{fontSize : 18 , ... { color : textColor } }}>{props.title}</Text>
    </TouchableOpacity>
  )
}

export default Button

const styles = StyleSheet.create({
    button : {
        paddingBottom : 16 , 
        paddingVertical : 10 , 
        borderColor : COLORS.BlackRGB10 , 
        borderWidth : 2 , 
        borderRadius : 12 , 
        alignItems : 'center' , 
        justifyContent : 'center'
    }
})