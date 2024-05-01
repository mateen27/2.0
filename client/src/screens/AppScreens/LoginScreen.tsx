import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome";
import { Feather } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome6 } from '@expo/vector-icons';
import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveScreenFontSize,
} from "react-native-responsive-dimensions";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../redux/store/slices/UserSlice";

const LoginScreen = ({ navigation, route }: any) => {
  // state management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  // redux
  const dispatch = useDispatch();

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // for checking if the device supports biometric or not!
  useEffect(() => {
    (async () => {
      const isBiometricSupported = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(isBiometricSupported);
    })();
  }, []);

  // function handling the biometric scene
  const fallBackToDefaultAuth = () => {
    console.log("Fallback to password authentication");
  };

  const alertComponent = (title: any, mess: any, btnTxt: any, btnFunc: any) => {
    return Alert.alert(title, mess, [
      {
        text: btnTxt,
        onPress: btnFunc,
      },
    ]);
  };

  const TwoButtonAlert = () => {
    Alert.alert("Welcome to Show Starter", "Logged in as Guest User!", [
      {
        text: "Back",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => navigation.navigate("Home"),
      },
    ]);
  };

  // main logic for biometric functonality
  const handleBiometricAuth = async () => {
    AsyncStorage.removeItem("authToken");
    const isBiometricSupported = await LocalAuthentication.hasHardwareAsync();

    if (!isBiometricSupported) {
      return alertComponent(
        "Please Enter Your Password",
        "Biometric Auth not Supported",
        "Ok",
        () => fallBackToDefaultAuth()
      );
    }

    // const supportedBiometrics = await LocalAuthentication.supportedAuthenticationTypesAsync();
    const savedBiometrics = await LocalAuthentication.isEnrolledAsync();

    if (!savedBiometrics) {
      return alertComponent(
        "Biometric record not found",
        "Please login with Password",
        "OK",
        () => fallBackToDefaultAuth()
      );
    }

    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: "Login with Biometrics",
      cancelLabel: "Cancel",
      disableDeviceFallback: true,
    });

    if (biometricAuth.success) {
      TwoButtonAlert();
    }
  };

  // function for handling the login button
  const handleLogin = async () => {
    try {
      const user = {
        email: email,
        password: password,
      };

      // making the request to the backend to check if the user exists or not
      const response = await axios.post(
        "http://192.168.29.181:3001/api/user/login",
        user
      );

      if (response) {
        console.log(response);
        const token = response.data.token;
        console.log("token ", token);
        // need access to the async-storage in order to store the token
        AsyncStorage.setItem("authToken", token);

        const userID = response.data.user._id;
        console.log("response json: ", userID);

        // storing the userID in store of redux
        dispatch(setUser(userID));

        const userName = response.data.user.name;
        console.log('userName', userName);
        
        Alert.alert("Login Success", `Welcome ${userName}`);

        setEmail("");
        setPassword("");

        // navigating to the HomeScreen once the user is authenticated
        navigation.navigate("Home");
      }
    } catch (error) {
      Alert.alert("Login Error", "Invalid Email or Password!");
      console.log("Login Error", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* for the image */}
        <View style={styles.imageContainer}>
          <Image
            source={require("../../../images/women.png")}
            style={styles.image}
          />
        </View>

        {/* for the heading and subHeading */}
        <View style={styles.textContainer}>
          <Text style={styles.heading}>Welcome Back!</Text>
          <Text style={styles.subHeading}>Login to your existing account</Text>
        </View>

        {/* for textInput Fields */}
        <View style={styles.textInputContainer}>
          <AntDesign name="user" size={24} color="white" />
          <TextInput
            style={styles.textbox}
            placeholder="Email"
            placeholderTextColor="gray"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View style={styles.textInputContainer}>
          <Feather name="unlock" size={24} color="white" />
          <TextInput
            style={styles.textbox}
            placeholder="Password"
            placeholderTextColor="gray" // Change this to the color you want
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={toggleShowPassword}
            style={styles.showPasswordButton}
          >
            <Icon
              name={showPassword ? "unlock" : "lock"}
              size={20}
              color="white"
            />
          </TouchableOpacity>
        </View>

        {/* Forgot Password */}
        <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity>
            <Text style={styles.forgotText}>Forgot Password!</Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <View style={styles.loginButtonContainer}>
          {/* button for the login */}
          <TouchableOpacity onPress={() => handleLogin()}>
            <Text style={styles.loginButton}>Login</Text>
          </TouchableOpacity>

          {/* button for guest login with the biometric */}
          <TouchableOpacity onPress={() => handleBiometricAuth()}>
            <Text style={[styles.loginButton, { backgroundColor: "#007260" }]}>
              Guest Login
            </Text>
          </TouchableOpacity>
        </View>

        {/* Connect Using Section */}
        <View style={styles.connectContainer}>
          <Text style={styles.connectText}>Or Connect using</Text>
        </View>

        {/* Social Media Buttons */}
        <View style={styles.connectContainer}>
          {/* Facebook Icon */}
          <TouchableOpacity style={styles.socialIconContainer}>
            <FontAwesome name="facebook" size={22} color="white" />
            <Text style={styles.socialText}>Facebook</Text>
          </TouchableOpacity>
          {/* Gmail Icon */}
          <TouchableOpacity
            style={[styles.socialIconContainer, { backgroundColor: "#DF5146" }]}
          >
            <MaterialCommunityIcons name="gmail" size={24} color="white" />
            <Text style={styles.socialText}>Gmail</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "5%",
          }}
        >
          <Text
            style={{ marginHorizontal: 2, color: "#ffffff", fontWeight: "900" }}
          >
            Don't Have An Account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
            <Text style={{ color: "#007260", fontWeight: "800" }}>Signup</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: "5%",
  },
  image: {
    width: 250,
    height: 250,
  },
  textContainer: {
    alignItems: "center",
  },
  heading: {
    fontSize: responsiveScreenFontSize(5),
    marginBottom: "5%",
    color: "#ffffff",
  },
  subHeading: {
    fontSize: responsiveScreenFontSize(2.3),
    color: "grey",
    marginBottom: "2%",
  },
  textInputContainer: {
    flexDirection: "row",
    //   padding : '-5%',
    margin: "3%",
    // backgroundColor : 'orange' ,
    alignItems: "center", // Horizontally center the content
    justifyContent: "center", // Vertically center the content
    // paddingVertical: 5, // Add padding instead of fixed height
    borderColor: "#ffffff",
    borderWidth: 2,
    borderRadius: 50,
    //   justifyContent: "center",
    position: "relative", // Add position relative to the container ,
    color: "#ffffff",
    // backgroundColor : 'grey'
  },
  textbox: {
    fontSize: responsiveScreenFontSize(2),
    width: responsiveScreenWidth(60),
    height: responsiveScreenHeight(8),
    textAlign: "center",
    color: "#ffffff", // Text color when typing
    // margin  : 1
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginRight: "8%",
  },
  forgotText: {
    color: "grey",
    fontWeight: "700",
  },
  loginButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    margin: "5%",
  },
  loginButton: {
    color: "white",
    backgroundColor: "#333",
    padding: "4%",
    borderRadius: 30,
    width: responsiveScreenWidth(40),
    textAlign: "center",
    fontWeight: "700",
  },
  connectContainer: {
    justifyContent: "center",
    flexDirection: "row",
  },
  connectText: {
    color: "grey",
    fontWeight: "700",
  },
  socialIconContainer: {
    flexDirection: "row",
    margin: "2%",
    backgroundColor: "#4867AA",
    padding: "1%",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  socialText: {
    color: "white",
    fontWeight: "700",
    margin: "3%",
  },
  showPasswordButton: {
    position: "absolute",
    right: "3%", // Adjust the right position
    top: "50%", // Vertically center based on container's height
    transform: [{ translateY: -10 }], // Adjust to center align the icon
    // alignSelf: "flex-end", // Horizontally center within the container
  },
});

export default LoginScreen;
