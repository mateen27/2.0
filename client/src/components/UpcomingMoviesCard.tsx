import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { BORDERRADIUS, COLORS, FONTSIZE, SPACING } from "../theme/theme";
// importing Icon of star
import { AntDesign } from '@expo/vector-icons';

const UpcomingMoviesCard = (props: any) => {
  const genres: any = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    18: "Drama",
    35: "Comedy",
    80: "Crime",
    99: "Documentry",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystry",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
    10759: "Action & Adventure",
    10762: "Kids",
    10763: "News",
    10764: "Reality",
    10765: "Sci-Fi & Fantasy",
    10766: "Soap",
    10767: "Talk",
    10768: "War & Politics",
  };

  return (
    <TouchableOpacity onPress={() => props.cardFunction()}>
      <View
        style={[
          styles.container,
          props.shoudlMarginatedAtEnd
            ? props.isFirst
              ? { marginLeft: SPACING.space_36 }
              : props.isLast
              ? { marginRight: SPACING.space_36 }
              : {}
            : {},
          props.shouldMarginatedAround ? { margin: SPACING.space_12 } : {},
          { maxWidth: props.cardWidth },
        ]}
      >
        <Image
          style={[styles.cardImage, { width: props.cardWidth }]}
          source={{ uri: props.imagePath }}
        />
        <View>
          <View style={styles.rateContainer}>
            <AntDesign name="like1" size={24} color="yellow" />
            <Text style={styles.voteText}>
              {(props.popularity).toFixed(1)}{"k likes"}
            </Text>
          </View>
        </View>
        <Text style={styles.textTitle} numberOfLines={1}>
          {" "}
          {props.title}{" "}
        </Text>

        <View style={styles.genresContainer}>
          {props.genre.map((item: any) => (
            <View key={item} style={styles.genreBox}>
              <Text style={styles.genreText}>{genres[item]}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: COLORS.Black,
  },
  cardImage: {
    aspectRatio: 2 / 3,
    borderRadius: BORDERRADIUS.radius_20,
  },
  textTitle: {
    //   fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_24,
    color: COLORS.White,
    textAlign: "center",
    paddingVertical: SPACING.space_10,
  },
  rateContainer: {
    flexDirection: "row",
    gap: SPACING.space_10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.space_10,
  },
  voteText: {
    fontSize: FONTSIZE.size_14,
    color: COLORS.White,
  },
  genresContainer: {
    // flex : 1 ,
    flexDirection: "row",
    gap: SPACING.space_20,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  genreBox: {
    borderColor: COLORS.WhiteRGBA50,
    borderWidth: 1,
    paddingVertical: SPACING.space_4,
    paddingHorizontal: SPACING.space_10,
    borderRadius: BORDERRADIUS.radius_25,
  },
  genreText: {
    fontSize: FONTSIZE.size_10,
    color: COLORS.WhiteRGBA75,
  },
});

export default UpcomingMoviesCard;
