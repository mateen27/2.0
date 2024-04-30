import { StyleSheet, Text, View , Image } from 'react-native'
import React from 'react'
import { BORDERRADIUS, COLORS, FONTSIZE, SPACING } from '../theme/theme'

const CastCard = (props:any) => {
  return (
    <View style = {[styles.container , props.shouldMarginatedAtEnd ? props.isFirst?{marginLeft: SPACING.space_24}: props.isLast?{marginRight : SPACING.space_24}:{}:{} , {maxWidth : props.cardWidth}]}>
        <Image style = {[styles.cardImage , {width : props.cardWidth}]} source={{uri: props.imagePath}}/>
        <Text style={styles.title} numberOfLines={1}>{props.title}</Text>
        <Text style={styles.subTitle} numberOfLines={1}>{props.subTitle}</Text>
    </View>
  )
}

export default CastCard

const styles = StyleSheet.create({
    container : {
        alignItems : 'center'
    } , 
    cardImage : {
        aspectRatio : 1920 / 2880 , 
        borderRadius : BORDERRADIUS.radius_25 * 4 , 
    } , 
    title : {
        alignSelf : 'stretch' , 
        fontSize : FONTSIZE.size_12 , 
        color : COLORS.White , 
    } , 
    subTitle : {
        alignSelf : 'stretch' , 
        fontSize : FONTSIZE.size_10 , 
        color : COLORS.White , 
    }
})