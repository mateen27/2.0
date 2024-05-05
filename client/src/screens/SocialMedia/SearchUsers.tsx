import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useCallback, useState } from "react";
import axios from "axios";
import { COLORS, FONTSIZE, SPACING } from "../../theme/theme";
import { AntDesign } from "@expo/vector-icons";

const SearchUser = (props: any) => {
  // state Variable
  const [searchText, setSearchText] = useState<string>("");
  const [searchedUsers, setSearchedUsers] = useState([]);

  // Function to fetch searched users
  const fetchSearchedUsers = useCallback(async (searchText: string) => {
    try {
      const response = await axios.post(
        "http://192.168.29.181:3001/api/user/search",
        {
          keyword: searchText,
        }
      );
      setSearchedUsers(response.data.users);
    } catch (error) {
      console.log("Error fetching users from search service:", error);
      throw new Error("Error fetching users from search service");
    }
  }, []);

  // Function to handle search
  const handleSearch = useCallback(() => {
    fetchSearchedUsers(searchText);
  }, [fetchSearchedUsers, searchText]);

  return (
    <View style={{ flex: 1, backgroundColor: "#000000" }}>
      <View style={styles.inputBox}>
        <TextInput
          placeholder="Search the Users..."
          style={styles.textInput}
          onChangeText={(textInput) => setSearchText(textInput)}
          placeholderTextColor={COLORS.WhiteRGBA32}
          value={searchText}
        />
        <Pressable style={styles.searchIcon} onPress={handleSearch}>
          <AntDesign
            name="search1"
            size={FONTSIZE.size_20}
            color={COLORS.Orange}
          />
        </Pressable>
      </View>

      <ScrollView>
        {searchedUsers.map((user: any) => (
          <Pressable
            key={user._id}
            style={styles.userContainer}
            onPress={() => {
              // Handle user click here
              console.log("Clicked user:", user);
            }}
          >
            <Image source={{ uri: user?.image }} style={styles.imageStyle} />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

export default SearchUser;

const styles = StyleSheet.create({
  inputBox: {
    display: "flex",
    flexDirection: "row",
    paddingVertical: SPACING.space_8,
    paddingHorizontal: SPACING.space_24,
    borderWidth: 2,
    borderColor: COLORS.WhiteRGBA15,
    borderRadius: 25,
    backgroundColor: "#000000",
    marginHorizontal: SPACING.space_20,
    marginBottom: SPACING.space_20,
  },
  textInput: {
    flex: 1,
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
  },
  searchIcon: {
    justifyContent: "center",
    padding: SPACING.space_10,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.space_16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.WhiteRGBA15,
  },
  imageStyle: {
    width: 60,
    height: 60,
    borderRadius: 60 / 2,
    borderWidth: 2,
    borderColor: COLORS.WhiteRGBA15,
  },
  userInfo: {
    marginLeft: SPACING.space_16,
  },
  userName: {
    color: COLORS.White,
    fontSize: FONTSIZE.size_16,
  },
  userEmail: {
    color: COLORS.Grey,
    fontSize: FONTSIZE.size_14,
  },
});
