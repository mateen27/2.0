import { useNavigation } from "@react-navigation/native";
import {View , Text , Button , StyleSheet, StatusBar, ImageBackground , Image} from 'react-native'
import { useState , useEffect } from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppHeader from "../../components/AppHeader";
import { BORDERRADIUS, COLORS, FONTSIZE, SPACING } from "../../theme/theme";
import { LinearGradient } from "expo-linear-gradient";

import { AntDesign } from '@expo/vector-icons';

const Ticket = ({navigation , route} : any) => {
  // const navigation = useNavigation();

  const [ticketData , setTicketData] = useState<any>(route.params)

  // taking out the data from the async storage
  useEffect(() => {
    (async () => {
      try {
        const ticket = await AsyncStorage.getItem('ticket');
        if(ticket !== undefined && ticket !== null){
          setTicketData(JSON.parse(ticket))
        }
      } catch (error) {
        console.error("Something went wrong while getting the data" , error)
      }
    })()
  } , [])

  // console.log('Ticket' , ticketData);
  
  if(ticketData == undefined || ticketData == null) {
    return (<View style = {styles.container}>
      <StatusBar hidden/>
      <View style={styles.appHeaderContainer}>
              <AppHeader
                name="close"
                header={"My Tickets"}
                action={() => navigation.goBack()}
              />
      </View>
    </View>)
  }
  return (
    <View style = {styles.container}>
      <StatusBar hidden/>
      <View style={styles.appHeaderContainer}>
              <AppHeader
                name="close"
                header={"My Tickets"}
                action={() => navigation.goBack()}
              />
      </View>

      <View style = {styles.ticketContainer}>
          <ImageBackground source={{uri : ticketData?.ticketImage}} style = {styles.ticketBGImage}>
            <LinearGradient colors={[COLORS.OrangeRGBA0 , COLORS.Orange]} style = {styles.linearGradient}></LinearGradient>
          </ImageBackground>
          <View style = {styles.linear}></View>
          
          <View style={styles.ticketFooter}>
          <View
            style={[
              styles.blackCircle,
              {position: 'absolute', top: -40, left: -40},
            ]}></View>
          <View
            style={[
              styles.blackCircle,
              {position: 'absolute', top: -40, right: -40},
            ]}></View>
          <View style={styles.ticketDateContainer}>
            <View style={styles.subtitleContainer}>
              <Text style={styles.dateTitle}>{ticketData?.date.date}</Text>
              <Text style={styles.subtitle}>{ticketData?.date.day}</Text>
            </View>
            <View style={styles.subtitleContainer}>
              <AntDesign name="clockcircleo" size={24} color="white" />
              <Text style={styles.subtitle}>{ticketData?.time}</Text>
            </View>
          </View>
          <View style={styles.ticketSeatContainer}>
            <View style={styles.subtitleContainer}>
              <Text style={styles.subheading}>Hall</Text>
              <Text style={styles.subtitle}>02</Text>
            </View>
            <View style={styles.subtitleContainer}>
              <Text style={styles.subheading}>Row</Text>
              <Text style={styles.subtitle}>04</Text>
            </View>
            <View style={styles.subtitleContainer}>
              <Text style={styles.subheading}>Seats</Text>
              <Text style={styles.subtitle}>
                {ticketData?.seatArray
                  .slice(0, 3)
                  .map((item: any, index: number, arr: any) => {
                    return item + (index == arr.length - 1 ? '' : ', ');
                  })}
              </Text>
            </View>
          </View>
          <Image
            source={require('../../../images/barcode.png')}
            style={styles.barcodeImage}
          />
        </View>
      </View>
    </View>
  );
};

export default Ticket;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  appHeaderContainer: {
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_20 * 2,
  },
  ticketContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  ticketBGImage: {
    alignSelf: 'center',
    width: 300,
    aspectRatio: 200 / 300,
    borderTopLeftRadius: BORDERRADIUS.radius_25,
    borderTopRightRadius: BORDERRADIUS.radius_25,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  linearGradient: {
    height: '70%',
  },
  linear: {
    borderTopColor: COLORS.Black,
    borderTopWidth: 3,
    width: 300,
    alignSelf: 'center',
    backgroundColor: COLORS.Orange,
    borderStyle: 'dashed',
  },
  ticketFooter: {
    backgroundColor: COLORS.Orange,
    width: 300,
    alignItems: 'center',
    paddingBottom: SPACING.space_36,
    alignSelf: 'center',
    borderBottomLeftRadius: BORDERRADIUS.radius_25,
    borderBottomRightRadius: BORDERRADIUS.radius_25,
  },
  ticketDateContainer: {
    flexDirection: 'row',
    gap: SPACING.space_36,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.space_10,
  },
  ticketSeatContainer: {
    flexDirection: 'row',
    gap: SPACING.space_36,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.space_10,
  },
  dateTitle: {
    // fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
  },
  subtitle: {
    // fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
  },
  subheading: {
    // fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_18,
    color: COLORS.White,
  },
  subtitleContainer: {
    alignItems: 'center',
  },
  clockIcon: {
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
    paddingBottom: SPACING.space_10,
  },
  barcodeImage: {
    height: 50,
    aspectRatio: 158 / 52,
  },
  blackCircle: {
    height: 80,
    width: 80,
    borderRadius: 80,
    backgroundColor: COLORS.Black,
  },
});