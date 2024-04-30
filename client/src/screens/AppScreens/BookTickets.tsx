import {
  FlatList,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { ScrollView, TouchableOpacity , ToastAndroid } from "react-native";
import { BORDERRADIUS, COLORS, FONTSIZE, SPACING } from "../../theme/theme";
import { LinearGradient } from "expo-linear-gradient";
import AppHeader from "../../components/AppHeader";

import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';

// times array for the movie shows
const timeArray: string[] = [
  "10:30",
  "12:30",
  "14:30",
  "15:00",
  "16:45",
  "18:00",
  "19:30",
  "21:00",
  "23:40",
];

// generating current date and further dates..!
const generateDate = () => {
  // for generating today's date
  const date = new Date();
  // hardcoding the week day's
  let weekDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let weekDays = [];
  for (let i = 0; i < 7; i++) {
    let tempDate = {
      date: new Date(date.getTime() + i * 24 * 60 * 60 * 1000).getDate(),
      day: weekDay[new Date(date.getTime() + i * 24 * 60 * 60 * 1000).getDay()],
    };
    weekDays.push(tempDate);
  }
  return weekDays;
};

const generateSeats = () => {
  let numRow = 8;
  let numCols = 3;

  let rowArray = [];
  let start = 1;
  let reachnine = false;

  for (let i = 0; i < numRow; i++) {
    let columnArray = [];
    for (let j = 0; j < numCols; j++) {
      let seatObject = {
        number: start,
        taken: Boolean(Math.round(Math.random())),
        selected: false,
      };
      columnArray.push(seatObject);
      start++;
    }
    if (i == 3) {
      numCols += 2;
    }
    if (numCols < 9 && !reachnine) {
      numCols += 2;
    } else {
      reachnine = true;
      numCols -= 2;
    }
    rowArray.push(columnArray);
  }
  return rowArray;
};

const BookTickets = ({ navigation, route }: any) => {
  const [dateArray, setDateArray] = useState<any[]>(generateDate());
  const [selectedDateIndex, setSelectedDateIndex] = useState<any>();
  const [price, setPrice] = useState<number>(0);
  const [twoDSeatArray, setTwoDSeatArray] = useState<any[][]>(generateSeats());
  const [selectedSeatArray, setSelectedSeatArray] = useState([]);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState<any>();

  // console.log(JSON.stringify(twoDSeatArray, null , 2))

  // selected seat function
  const selectSeat = (index: number, subindex: number, num: number) => {
    if (!twoDSeatArray[index][subindex].taken) {
      // we need empty one
      let array: any = [...selectedSeatArray];
      let temp = [...twoDSeatArray];
      temp[index][subindex].selected = !temp[index][subindex].selected;

      if (!array.includes(num)) {
        array.push(num);
        setSelectedSeatArray(array);
      } else {
        const tempIndex = array.indexOf(num);
        if (tempIndex > -1) {
          array.splice(tempIndex, 1);
          setSelectedSeatArray(array);
        }
      }
      setPrice(array.length * 350.0);
      setTwoDSeatArray(temp);
    }
  };

  // function to book seats
  const BookSeats = async () => {
    if(selectedSeatArray.length !== 0 && timeArray[selectedTimeIndex] !== undefined && dateArray[selectedDateIndex] !== undefined){
      // saving the data inside of the encrypted storage
      try {
        await AsyncStorage.setItem('ticket' , JSON.stringify({
          seatArray : selectedSeatArray , 
          time : timeArray[selectedTimeIndex] , 
          date : dateArray[selectedDateIndex] , 
          ticketImage : route.params.posterImage
        }))
      } catch (error) {
        console.error(`Something went wrong while Buying Tickets ${error}`);
      }
      navigation.navigate('Ticket' , {
          seatArray : selectedSeatArray , 
          time : timeArray[selectedTimeIndex] , 
          date : dateArray[selectedDateIndex] , 
          ticketImage : route.params.posterImage
      })
    }
    else {
      // console.log('hi');
      ToastAndroid.showWithGravity('Please select Seats, Date and Time of the Show', ToastAndroid.SHORT, ToastAndroid.BOTTOM);
    }
  }
  return (
    <ScrollView
      style={styles.container}
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar hidden />
      {/* Image Background */}
      <View>
        <ImageBackground
          source={{ uri: route.params?.bgImage }}
          style={styles.ImageBackground}
        >
          <LinearGradient
            colors={[COLORS.BlackRGB10, COLORS.Black]}
            style={styles.linearGradient}
          >
            <View style={styles.appHeaderContainer}>
              <AppHeader
                name="close"
                header={"Movie Details"}
                action={() => navigation.goBack()}
              />
            </View>
          </LinearGradient>
        </ImageBackground>
        <Text style={styles.screenText}>Screen this side</Text>
      </View>

      <View style={styles.seatContainer}>
        <View style={styles.containerGap20}>
          {twoDSeatArray?.map((item, index) => {
            return (
              <View key={index} style={styles.seatRow}>
                {item?.map((subItem, subIndex) => {
                  return (
                    <TouchableOpacity
                      key={subItem.number}
                      onPress={() => {
                        selectSeat(index, subIndex, subItem.number);
                      }}
                    >
                      <MaterialIcons
                        name="event-seat"
                        size={24}
                        color="white"
                        style={[
                          styles.seatIcon,
                          subItem.taken ? { color: COLORS.Grey } : {},
                          subItem.selected ? { color: COLORS.Orange } : {},
                        ]}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          })}
        </View>

        <View style={styles.seatRadioContainer}>
          <View style={styles.radioContainer}>
            <MaterialIcons
              name="event-seat"
              size={24}
              color="white"
              // style={styles.radio}
            />
            <Text style={styles.radioText}>Available</Text>
          </View>
          <View style={styles.radioContainer}>
            <MaterialIcons
              name="event-seat"
              size={24}
              color="#333333"
              // style={styles.radio}
            />
            <Text style={styles.radioText}>Taken</Text>
          </View>
          <View style={styles.radioContainer}>
            <MaterialIcons
              name="event-seat"
              size={24}
              color="#FF0000"
              // style={styles.radio}
            />
            <Text style={styles.radioText}>Selected</Text>
          </View>
        </View>
      </View>

      {/* Date Section */}
      <View>
        <FlatList
          data={dateArray}
          keyExtractor={(item) => item.date}
          horizontal
          bounces={false}
          contentContainerStyle={styles.containerGap24}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity onPress={() => setSelectedDateIndex(index)}>
                <View
                  style={[
                    styles.dateContainer,
                    index == 0
                      ? { marginLeft: SPACING.space_24 }
                      : index == dateArray.length - 1
                      ? { marginRight: SPACING.space_24 }
                      : {},
                    index == selectedDateIndex
                      ? { backgroundColor: COLORS.Orange }
                      : {},
                  ]}
                >
                  <Text style={styles.dateText}>{item.date}</Text>
                  <Text style={styles.dayText}>{item.day}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Time Section */}
      <View style = {styles.timeOuterContainer}>
        <FlatList
          data={timeArray}
          keyExtractor={(item) => item}
          horizontal
          bounces={false}
          contentContainerStyle={styles.containerGap24}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity onPress={() => setSelectedTimeIndex(index)}>
                <View
                  style={[
                    styles.timeContainer,
                    index == 0
                      ? { marginLeft: SPACING.space_24 }
                      : index == dateArray.length - 1
                      ? { marginRight: SPACING.space_24 }
                      : {},
                    index == selectedTimeIndex
                      ? { backgroundColor: COLORS.Orange }
                      : {},
                  ]}
                >
                  <Text style={styles.timeText}>{item}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Price and Buy Tickets Section */}
      <View style = {styles.buttonPriceContainer}>
        <View style = {styles.priceContainer}>
          <Text style = {styles.totalPriceText}>Total Price</Text>
          <Text style = {styles.price}>₹ {price}.00</Text>
        </View>
        <TouchableOpacity onPress={() => {BookSeats()}}>
          <Text style = {styles.buyTicketText}>Buy Tickets</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default BookTickets;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  ImageBackground: {
    width: "100%",
    aspectRatio: 3072 / 1727,
  },
  linearGradient: {
    height: "100%",
  },
  appHeaderContainer: {
    marginHorizontal: SPACING.space_36,
    marginTop: SPACING.space_20 * 2,
  },
  screenText: {
    textAlign: "center",
    fontSize: FONTSIZE.size_12,
    color: COLORS.Grey,
  },
  seatContainer: {
    marginVertical: SPACING.space_20,
  },
  containerGap20: {
    gap: SPACING.space_20,
  },
  seatRow: {
    flexDirection: "row",
    gap: SPACING.space_20,
    justifyContent: "center",
  },
  seatIcon: {
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
  },
  seatRadioContainer: {
    marginTop: SPACING.space_15 * 2,
    marginBottom: SPACING.space_2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  radioContainer: {
    // flexDirection : 'row' ,
    gap: SPACING.space_10,
    alignItems: "center",
  },
  radioIcon: {
    fontSize: FONTSIZE.size_20,
    color: COLORS.White,
  },
  radioText: {
    fontSize: FONTSIZE.size_12,
    color: COLORS.White,
  },
  containerGap24: { gap: SPACING.space_24 },
  dateContainer: {
    width: SPACING.space_10 * 7,
    height: SPACING.space_10 * 10,
    borderRadius: SPACING.space_10 * 10,
    backgroundColor: COLORS.DarkGrey,
    alignItems: "center",
    justifyContent: "center",
  },
  dateText: {
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
  },
  dayText: {
    fontSize: FONTSIZE.size_12,
    color: COLORS.White,
  },
  timeOuterContainer : {
    marginVertical : SPACING.space_24
  } ,
  timeContainer : {
    paddingVertical : SPACING.space_10 , 
    borderWidth : 1 , 
    borderColor : COLORS.WhiteRGBA50 , 
    paddingHorizontal : SPACING.space_20 , 
    borderRadius : BORDERRADIUS.radius_25 , 
    backgroundColor : COLORS.DarkGrey , 
    alignItems : 'center' , 
    justifyContent : 'center'
  } , 
  timeText : {
    fontSize : FONTSIZE.size_14 , 
    color : COLORS.White
  } , 
  buttonPriceContainer : {
    flexDirection : 'row' , 
    justifyContent : 'space-between' , 
    alignItems : 'center' , 
    padding : SPACING.space_24 , 
    paddingBottom : SPACING.space_24
  } , 
  priceContainer : {
    alignItems : 'center'
  } , 
  totalPriceText : {
    fontSize : FONTSIZE.size_14 , 
    color : COLORS.Grey
  } , 
  price : {
    fontSize : FONTSIZE.size_24 , 
    color : COLORS.White
  } , 
  buyTicketText : {
    borderRadius : BORDERRADIUS.radius_25 , 
    paddingHorizontal : SPACING.space_24 , 
    paddingVertical : SPACING.space_10 , 
    fontSize : FONTSIZE.size_16 , 
    color : COLORS.White , 
    backgroundColor : COLORS.Orange
  }
});
