import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  FlatList
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../theme/theme";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { ChatState } from "../../context/ChatProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import ChatLoading from "../../components/ChatLoading";
import UserListItem from "../../components/UserListItem";
import Cards from "../../components/Cards";

const Notification = () => {
  const navigation = useNavigation();
  const { user , setSelectedChat , selectedChat ,  chats , setChats } = ChatState();

  const [showSearch, setShowSearch] = useState(false);
  const [tokenAvailable, setTokenAvailable] = useState(false);
  const [value, setValue] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [ loadingChat , setLoadingChat ] = useState();

  // console.log('User' ,user);
  

  const toggleSearch = () => {
    setShowSearch((prev) => !prev);
  };

  const backHandler = () => {
    navigation.goBack();
  };

  //   searching the users
  const handleSearch = async () => {
    // if (!search) {
    //   Alert.alert("Please enter UserName to search users!");
    // }

    // searching users
    // searching users
    try {
      setLoading(true);

      const storedToken = await AsyncStorage.getItem("authToken");
      // console.log(storedToken);
      
      if (storedToken) {
        const config = {
          headers: {
            Authorization: `Bearer ${storedToken}`, // Use the token from AsyncStorage
          },
        };

        // getting the data
        const { data } = await axios.get(`http://192.168.29.181:8080/api/user?search=${search}`, config);

        setLoading(false);
        setSearchResult(data);
      } else {
        // Handle if the token is not available
      }
    } catch (error) {
      console.log("Error occurred to load search results!", error);
    }
  };

  // function for accessing the chats
  const accessChat = async (userId: any) => {
    try { 
      setLoading(true);

      const storedToken = await AsyncStorage.getItem("authToken");
      if (storedToken) {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },
        };

        const { data } = await axios.post(
          `http://192.168.29.181:8080/api/chat`,
          { userId },
          config
        );

        if (!chats.find((c) => c._id === data._id)) 
          {setChats([data, ...chats]);}

        setSelectedChat(data);
        setLoadingChat(false);
      }
    } catch (error) {
      Alert.alert('Error fetching chat');
    }
  };

  useEffect(() => {
    const checkingLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        // console.log(token);

        if (token) {
          if (token !== null && token !== undefined) {
            setTokenAvailable(true);
          }
          navigation.navigate("Notification");
        } else {
          const value = Alert.alert("You are logged in as Guest!", "Login Now");
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    checkingLoginStatus();
  }, []);

  // console.log('search result' , searchResult)

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconContainer} onPress={backHandler}>
          <Ionicons name="chevron-back-sharp" size={26} color={COLORS.White} />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          {showSearch ? (
            <TextInput
              style={styles.searchInput}
              placeholder="Search Friends"
              placeholderTextColor={"#f1f1f1"}
              autoFocus={true}
              onBlur={toggleSearch}
              value={search}
              onChangeText={(text) => {
                setSearch(text);
                handleSearch();
              }}
            />
          ) : (
            <Text style={styles.title}>Chats</Text>
          )}
        </View>
        <TouchableOpacity style={styles.iconContainer} onPress={toggleSearch}>
          {showSearch ? (
            <Ionicons name="close" size={26} color={COLORS.White} />
          ) : (
            <Ionicons name="search" size={26} color={COLORS.White} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
      {showSearch ? (
  loading ? (
    <ActivityIndicator size="large" color="#00ff00" />
  ) : (
    searchResult.map((item) => (
      <TouchableOpacity key={item._id} onPress={() => accessChat(item._id)}>
        {loadingChat === item._id ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={COLORS.White} />
          </View>
        ) : (
          <UserListItem user={item} handleFunction={() => accessChat(item._id)} />
        )}
      </TouchableOpacity>
    ))
  )
) : (
  <View style={{ marginTop: '15%' }}>
    <Cards />
  </View>
)}

      </View>

      { !showSearch && tokenAvailable && (
        <TouchableOpacity style={styles.groupButton}>
          <Ionicons
            name="people"
            size={24}
            color={COLORS.White}
            style={styles.groupIcon}
          />
          <Text style={styles.groupText}>New Group</Text>
        </TouchableOpacity>
      )}

      { !showSearch && tokenAvailable && (
        <TouchableOpacity style={styles.callButton}>
          <Ionicons
            name="call"
            size={24}
            color={COLORS.White}
            style={styles.callIcon}
          />
          <Text style={styles.callText}>Calls</Text>
        </TouchableOpacity>
      )}

      <StatusBar style="dark" />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.Orange,
    height: 60,
    paddingHorizontal: 10,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    color: COLORS.White,
    fontWeight: "500",
  },
  iconContainer: {
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor : COLORS.Black
  },
  groupButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.White,
    borderRadius: 5,
    padding: 10,
    position: "absolute",
    top: 70,
    right: 10,
  },
  groupIcon: {
    marginRight: 10,
  },
  groupText: {
    color: COLORS.White,
    fontSize: 16,
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.White,
    borderRadius: 5,
    padding: 10,
    position: "absolute",
    top: 70,
    left: 10,
  },
  callIcon: {
    marginRight: 10,
  },
  callText: {
    color: COLORS.White,
    fontSize: 16,
  },
  searchInput: {
    color: COLORS.White,
    fontSize: 18,
    borderBottomColor: COLORS.White,
    borderBottomWidth: 1,
    width: 200, // Adjust the width as needed
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  }
});

export default Notification;
