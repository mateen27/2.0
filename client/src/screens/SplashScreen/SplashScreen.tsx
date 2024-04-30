import { StyleSheet, Text, View , Image } from 'react-native'
import React, { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar';

const Logo = require('../../../images/Logo.png');

interface SplashScreenProps {
  navigation: any;
}

const SplashScreen: React.FC<SplashScreenProps> = ({navigation}) => {
    useEffect(() => {
        setTimeout(() => {
            navigation.navigate('OnBoarding')
        }, 3000);
    } , [])
  return (
    <>
    <View style = {styles.container}>
      <Image source={Logo} style = {styles.splashImage} resizeMode='contain'/>
    </View>

    <StatusBar style='dark' hidden/>
    </>
  )
}

export default SplashScreen

const styles = StyleSheet.create({
  container : {
    backgroundColor : '#000000' , 
    flex : 1 , 
    alignItems : 'center' , 
    justifyContent : 'center'
  } , 
  splashImage : {
    height : '20%'
  },
})
