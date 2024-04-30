import { StyleSheet, Text } from "react-native";
import React from "react";
import { COLORS, FONTSIZE, SPACING } from "../theme/theme";

const CategoryHeader = (props: any) => {
  return <Text style={styles.categoryTitleStyle}>{props.title}</Text>;
};

export default CategoryHeader;

const styles = StyleSheet.create({
  categoryTitleStyle: {
    fontSize: FONTSIZE.size_20,
    color: COLORS.White,
    paddingHorizontal: SPACING.space_36,
    paddingVertical: SPACING.space_28,
    fontWeight: "bold",
  },
});
