import {
  StyleSheet,
  Text,
  SafeAreaView,
  Dimensions,
  StatusBar,
  FlatList,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useRef, useState } from "react";

// getting width and height of the screen
const { width, height } = Dimensions.get("window");

// defing the colors
const COLORS = { primary: "#282534", white: "#fff" };

// creating the list of the Slides
const slides = [
  {
    id: 1,
    image: require("../../../images/image1.png"),
    title: "Endless Choices",
    subtitle: "Discover a vast array of movies",
  },
  {
    id: 2,
    image: require("../../../images/image2.png"),
    title: "Discover & Reserve",
    subtitle: "Explore a vast library of movies, concerts, and events.",
  },
  {
    id: 3,
    image: require("../../../images/image3.png"),
    title: "Social Entertainment",
    subtitle: "Connect with friends, discuss & enjoy movies together!",
  },
];

const OnBoardingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  // setting the state for the active index
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  //   taking up the ref i.e useRef for going to the next slide
  const ref = useRef(null);

  // containg the dots below for the Pagination Purpose.
  const Footer = () => {
    return (
      <View
        style={{
          height: height * 0.25,
          justifyContent: "space-between",
          paddingHorizontal: 20,
        }}
      >
        {/* View for the Indicators */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicators,
                currentSlideIndex == index && {
                  backgroundColor: COLORS.white,
                  width: 25,
                },
              ]}
            />
          ))}
        </View>

        {/* View for the Buttons */}
        <View style={{ marginBottom: 20 }}>
          {
            // for Getting Started Button on Next Slide
            currentSlideIndex == slides.length - 1 ? (
              <View style={{ height: 50 }}>
                <TouchableOpacity
                  style={[styles.btn]}
                  onPress={() => navigation.replace("Login")}
                >
                  <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                    GET STARTED
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              // SKIP Button
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={[
                    styles.btn,
                    {
                      backgroundColor: "transparent",
                      borderWidth: 1,
                      borderColor: "white",
                    },
                  ]}
                  onPress={skipSlides}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 15,
                      color: COLORS.white,
                    }}
                  >
                    SKIP
                  </Text>
                </TouchableOpacity>

                {/* for the space between the SKIP Button and the NEXT Button */}
                <View style={{ width: 15 }}></View>
                <TouchableOpacity style={[styles.btn]} onPress={goToNextSlide}>
                  <Text style={{ fontWeight: "bold", fontSize: 15 }}>NEXT</Text>
                </TouchableOpacity>
              </View>
            )
          }
        </View>
      </View>
    );
  };

  // Slide Component for rendering the FLATLIST component
  const Slide = ({ item }) => {
    return (
      <View style={{ alignItems: "center" }}>
      <Image
        source={item.image}
        style={{ height: "75%", width, resizeMode: "contain" }}
      />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </View>
    );
  };

  //   function for taking care of the sliders index and slide styling
  const updateCurrentSlideIndex = (e) => {
    // console.log(e)
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    // console.log(contentOffsetX) // can say its a width of the screen
    const currentIndex = Math.round(contentOffsetX / width);
    // console.log(currentIndex)
    setCurrentSlideIndex(currentIndex);
  };

  // function to go to the next slide on Next Button Click
  const goToNextSlide = () => {
    // calculating the next slide Index
    const nextSlideIndex = currentSlideIndex + 1;
    if (nextSlideIndex != slides.length) {
      const offset = nextSlideIndex * width;
      ref?.current?.scrollToOffset({ offset });
      // for updating the indicators
      setCurrentSlideIndex(nextSlideIndex);
    }
  };

  // function for skipping the Slides
  const skipSlides = () => {
    // want to get the last slide Index
    const lastSlideIndex = slides.length - 1; // will give last slide Index
    // want lastSlide Offset now
    const offset = lastSlideIndex * width;
    // for going to the lastSlide on Skip Button Click
    ref?.current?.scrollToOffset({ offset });
    setCurrentSlideIndex(lastSlideIndex);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <StatusBar backgroundColor={COLORS.primary} />

      <FlatList
        ref={ref}
        onMomentumScrollEnd={updateCurrentSlideIndex}
        pagingEnabled
        data={slides}
        contentContainerStyle={{ height: height * 0.75 }}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => <Slide item={item} />}
      />

      <Footer />
    </SafeAreaView>
  );
};

export default OnBoardingScreen;

const styles = StyleSheet.create({
  title: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  subtitle: {
    color: COLORS.white,
    fontSize: 13,
    maxWidth: "80%", // Adjusted maximum width for the subtitle text
    textAlign: "center",
    lineHeight: 23,
} ,
  indicators: {
    height: 2.5,
    width: 10,
    backgroundColor: "grey",
    marginHorizontal: 3,
    borderRadius: 2,
  },
  btn: {
    flex: 1,
    height: 50,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
});
