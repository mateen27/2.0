import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS } from '../../theme/theme'
import Button from '../../components/Button'
import { StatusBar } from 'expo-status-bar'

const WelcomeRoomScreen = ( { navigation , routes } :any) => {
  return (
    <LinearGradient 
    style = {{flex : 1}} colors={[COLORS.blackSecondary , '#171717']}>

        <View style = {{flex : 1}}>

            <View>
                <Image source={require('../../../images/hero1.jpg')}
                style = {{height : 100 , width : 100 , borderRadius : 20 , position : 'absolute' , top : 10 , transform: [{ translateX : 30} , { translateY : 50} , { rotate : "-15deg"}]}}/>

                <Image source={require('../../../images/hero3.jpg')}
                style = {{height : 100 , width : 100 , borderRadius : 20 , position : 'absolute' , top : -30 , left : 100 , transform: [{ translateX : 60} , { translateY : 50} , { rotate : "-5deg"}]}}/>
                
                <Image source={require('../../../images/hero3.jpg')}
                style = {{height : 100 , width : 100 , borderRadius : 20 , position : 'absolute' , top : 130 , left : -50 , transform: [{ translateX : 80} , { translateY : 70} , { rotate : "15deg"}]}}/>
                
                <Image source={require('../../../images/hero2.jpg')}
                style = {{height : 200 , width : 200 , borderRadius : 20 , position : 'absolute' , top : 110 , left : 100 , transform: [{ translateX : 80} , { translateY : 50} , { rotate : "-15deg"}]}}/>
            </View>

            {/* content */}

            <View style = {{paddingHorizontal : 22 , position : 'absolute' , top : 400 , width : "100%" , paddingVertical : 10 }}>
                <Text style = {{fontSize : 50 , fontWeight : '800' , color : COLORS.White}}>
                    Let's Get
                </Text>
                <Text style = {{fontSize : 46 , fontWeight : '800' , color : COLORS.White}}>Started</Text>

                <View style = {{marginVertical : 25}}>
                    <Text style = {{fontSize : 16 , color : COLORS.White , marginVertical : 4}}>Connect with each other with chatting</Text>
                    <Text style = {{ fontSize : 16 , color : COLORS.White}}>Calling, Enjoy Safe and private texting</Text>
                    <Text style = {{ fontSize : 16 , color : COLORS.White , marginVertical : 4}}>while watching the Movie.</Text>
                </View>

                <Button
                    title = "Create Room"
                    onPress = {() => navigation.navigate("CreateRoom")}
                    style = {{
                        marginTop : 22 , 
                        width : '100%'
                    }}
                />

            </View>

        </View>
        <StatusBar style='dark'/>
    </LinearGradient>
  )
}

export default WelcomeRoomScreen

const styles = StyleSheet.create({})