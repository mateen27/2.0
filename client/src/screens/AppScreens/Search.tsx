import { Dimensions, StatusBar, StyleSheet, Text, View , FlatList } from 'react-native'
import React, { useState } from 'react'
import { COLORS, SPACING } from '../../theme/theme'
import { API_KEY, baseImageURL } from '../../api/ApiCalls'
import InputHeader from '../../components/InputHeader'
import SubMovieCards from '../../components/SubMovieCards'

// importing width and height of the screen
const { width , height } = Dimensions.get('screen')

const Search = ({navigation}: any) => {

  // State Variables
  const [searchList , setSearchList] = useState([]);

  // function for searching the Movies / TV Shows
  const searchFunction = async (name: string) => {
    try {
      // const movieData = await getSearchedMovie(name);
      const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${name}`);
      const data = await response.json();
      setSearchList(data.results);
    } catch (error) {
      console.error(`Something went wrong in the searchFunction: ${error}`);
    }
  }
  

  return (
    <View style = {styles.container}>
      <StatusBar hidden/>

      <View>
      <FlatList
        data={searchList}
        keyExtractor={(item: any) => item.id.toString()}  // Updated keyExtractor
        numColumns={2}
        ListHeaderComponent={
          <View style={styles.inputHeaderContainer}>
            <InputHeader searchFunction={searchFunction} />
          </View>
        }
        showsHorizontalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={styles.centerContainer}
        renderItem={({ item, index }) => (
          <SubMovieCards
            shoudlMarginatedAtEnd={false}
            shoudlMarginatedAround={true}
            cardFunction={() => {
              navigation.push("MovieDetails", { movieid: item.id });
            }}
            cardWidth={width / 2 - (SPACING.space_12 * 2)}
            title={item.original_title}
            imagePath={baseImageURL("w780", item.poster_path)}
          />
        )}
      />
      </View>
    </View>
  )
}

export default Search

const styles = StyleSheet.create({
  container : {
    display : 'flex' , 
    flex : 1 , 
    width,
    alignItems : 'center' , 
    backgroundColor : COLORS.Black , 
  } , 
  inputHeaderContainer: {
    display :'flex' , 
    marginTop: SPACING.space_20,
    marginHorizontal: SPACING.space_36,
    marginBottom : SPACING.space_12
  }, 
  centerContainer: {
    alignItems : 'center'
  }
})