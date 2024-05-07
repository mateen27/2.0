import {
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from "expo-image-picker";
import { responsiveScreenWidth } from "react-native-responsive-dimensions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import JWT from "expo-jwt";
import { secretKey } from "../../private/secret";
import { useNavigation } from "@react-navigation/native";

const AddPost = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Image", value: "image" },
    { label: "Reel", value: "reel" },
    { label: "Post", value: "post" },
  ]);
  const [selectedType, setSelectedType] = useState("");
  const [image, setImage] = useState(null);
  const [cloudinaryImage, setCloudinaryImage] = useState("");
  const [description, setDescription] = useState("");
  const [userID, setUserID] = useState('');

  // Access user data from the Async Storage
//   const userID = useSelector((state: RootState) => state.user.data);
//   console.log("userData of the user", userID);

  const fetchUserID = async () => {
    try {
        const userID: any = await AsyncStorage.getItem('userID');
        // decoding the userID
        const decodedID: any = JWT.decode(userID, secretKey)
        console.log('decodedID of the user', decodedID.userID);
        

        // setting the user ID to the state
        setUserID(decodedID.userID)
    } catch (error) {
        console.log('error fetching the UserID from the Async Storage', error);
        
    }
  }

  useEffect(() => {
    fetchUserID();
  }, [])

//   navigation
const navigation = useNavigation();

  //   function for uploading the post
  const handleSubmitPost = async () => {
    try {
      let cloudinaryUrl = "";
      // Upload the image to Cloudinary and get the URL
      if (value === "post") {
        
        //   Prepare the postData
        const postData = {
          type: value,
          contentUrl: cloudinaryUrl,
          contentDescription: description,
          userID: userID,
        };

        // console.log('description', postData);

        // Make a POST request to upload the post data to the server using Axios
        const response = await axios.post(
          `http://192.168.29.181:3001/api/user/upload-post/${userID}`,
          postData
        );

        // Check if the request was successful
        if (response.status !== 200 && response.status !== 201) {
          throw new Error("Failed to upload post. Please try again.");
        }

        // Post uploaded successfully
        console.log("Post uploaded successfully.");
        Alert.alert('Post uploaded successfully');
        navigation.navigate('Home');
        

        // Clear the state and reset the form
        setValue(null);
        setImage(null);
        setDescription("");
        setCloudinaryImage("");
        setOpen(false); // Close the dropdown picker
      } else {
        cloudinaryUrl = await uploadImageToCloudinary();

        //   Prepare the postData
        const postData = {
          type: value,
          contentUrl: cloudinaryUrl,
          contentDescription: description,
          userID: userID,
        };

        console.log('post  Data', postData);
        

        // Make a POST request to upload the post data to the server using Axios
        const response = await axios.post(
          `http://192.168.29.181:3001/api/user/upload-post/${userID}`,
          postData
        );

        // Check if the request was successful
        if (response.status !== 200 && response.status !== 201) {
          throw new Error("Failed to upload post. Please try again.");
        }

        // Post uploaded successfully
        console.log("Post uploaded successfully.");
        Alert.alert('Post uploaded successfully');
        navigation.navigate('Home');

        // Clear the state and reset the form
        setValue(null);
        setImage(null);
        setDescription("");
        setCloudinaryImage("");
        setOpen(false); // Close the dropdown picker
      }
    } catch (error) {
      console.log("error uploading the post to the server", error);
      throw error; // Rethrow the error for further handling if needed
    }
  };

  //   function for picking up the image from the gallery
  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  //   upload image to cloudinary server
  const uploadImageToCloudinary = async () => {
    // Ensure an image is selected
    if (image) {
      const data = new FormData();
      data.append("file", {
        uri: image,
        type: `image/${image.split(".").pop()}`,
        name: `test.${image.split(".").pop()}`,
      });
      data.append("upload_preset", "ShowStarter"); // Replace with your Cloudinary upload preset

      try {
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dvvnup3nh/image/upload",
          {
            method: "post",
            body: data,
          }
        );

        if (response.status === 200) {
          const data = await response.json();
          if (data.secure_url) {
            // Image uploaded successfully
            console.log("Image uploaded to Cloudinary: ", data.secure_url);
            return data.secure_url; // Return the Cloudinary URL
          }
        }
        console.log("Image upload to Cloudinary failed");
      } catch (error) {
        console.error("Error uploading to Cloudinary: ", error);
      }
    } else {
      Alert.alert("Please select an image before uploading.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000", padding: 15 }}>
      <View style={{ padding: 5 }}>
        <Text
          style={{
            fontSize: 15,
            color: "#f1f1f1",
            fontWeight: "500",
            marginBottom: 5,
          }}
        >
          Select the type of the Post
        </Text>
        {/* Dropdown Selector */}
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          theme="DARK"
          placeholder={"Choose a Post Type."}
        />
      </View>
      <View style={{ padding: 5, marginVertical: 10 }}>
        {value !== "post" ? (
          <View style={{ padding: 5 }}>
            <Text style={{ fontSize: 15, color: "#f1f1f1", fontWeight: "500" }}>
              Choose whether to upload a stunning reel or a captivating image!
            </Text>
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={handleImagePicker}
            >
              <Text style={styles.uploadButton}>Upload</Text>
            </TouchableOpacity>
            <View style={{ padding: 5, marginVertical: 10 }}>
              <Text
                style={{
                  color: "#f1f1f1",
                  fontSize: 15,
                  fontWeight: "500",
                  marginBottom: 5,
                }}
              >
                Description
              </Text>
              <TextInput
                value={description}
                onChangeText={(description) => setDescription(description)}
                placeholder="Enter the description"
                placeholderTextColor={"#c6c6c6"}
                style={styles.descriptionBox}
                multiline
                textAlignVertical="top" // Align text to the top of the box
              />
            </View>
            {/* <TouchableOpacity
              style={{ alignItems: "center", marginTop: 30 }}
              onPress={handleSubmitPost}
            >
              <Text style={styles.uploadButton}>Share Post</Text>
            </TouchableOpacity> */}
          </View>
        ) : (
          <View style={{ padding: 5 }}>
            <Text
              style={{
                color: "#f1f1f1",
                fontSize: 15,
                fontWeight: "500",
                marginBottom: 5,
              }}
            >
              Description
            </Text>
            <TextInput
            value={description}
            onChangeText={(description) => setDescription(description)}
              placeholder="Enter the description"
              placeholderTextColor={"#c6c6c6"}
              style={styles.descriptionBox}
              multiline
              textAlignVertical="top" // Align text to the top of the box
            />
          </View>
        )}
      </View>
      <TouchableOpacity
        style={{ alignItems: "center", marginTop: 30 }}
        onPress={handleSubmitPost}
      >
        <Text style={styles.uploadButton}>Share Post</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddPost;

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },
  uploadButton: {
    color: "white",
    backgroundColor: "#222432",
    padding: "4%",
    borderRadius: 30,
    width: responsiveScreenWidth(90),
    textAlign: "center",
    fontWeight: "700",
    marginTop: 10,
    alignItems: "center",
    // width: '100%'
  },
  descriptionBox: {
    borderWidth: 1,
    borderColor: "#fff",
    minHeight: 150, // Adjust the minimum height as needed
    padding: 10,
    color: "#fff",
    borderRadius: 5,
    fontSize: 15,
    backgroundColor: "#222432",
  },
});
