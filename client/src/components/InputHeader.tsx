import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from "../theme/theme";
// icons import
import { AntDesign } from "@expo/vector-icons";

const InputHeader = (props: any) => {
  // state Variable
  const [searchText, onChangeSearchText] = useState<string>("");
  return (
    <View style={styles.inputBox}>
      <TextInput
        placeholder="Search your Movies/TV Shows..."
        style={styles.textInput}
        onChangeText={(textInput) => onChangeSearchText(textInput)}
        placeholderTextColor={COLORS.WhiteRGBA32}
        value={searchText}
      />
      <TouchableOpacity
        style={styles.searchIcon}
        onPress={() => props.searchFunction(searchText)}
      >
        <AntDesign
          name="search1"
          size={FONTSIZE.size_20}
          color={COLORS.Orange}
        />
      </TouchableOpacity>
    </View>
  );
};

export default InputHeader;

const styles = StyleSheet.create({
  inputBox: {
    display: "flex",
    paddingVertical: SPACING.space_8,
    paddingHorizontal: SPACING.space_24,
    borderWidth: 2,
    borderColor: COLORS.WhiteRGBA15,
    borderRadius: BORDERRADIUS.radius_25,
    flexDirection: "row",
  },
  textInput: {
    width: "90%",
    // fontFamily : FONTFAMILY.poppins_regular ,
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
  },
  searchIcon: {
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.space_10,
  },
});
