import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Video, ResizeMode } from "expo-av";

const MovieRoom = ({route}: any) => {

  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  
  // accessing the room ID and the selected Movies by the user
  const { roomID, selectedMovies } = route.params;
  // console.log('room', roomID, selectedMovies);
  // console.log('selected movies', selectedMovies.link);
  
  
  

  return (
    <View style = {{ flex: 1 , backgroundColor: '#000' }}>
      <Video
          ref={video}
          style={styles.video}
          source={{
            uri: selectedMovies.link,
          }}
          useNativeControls //for the controllers which are coming below
          // resizeMode="contain"
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          volume={1.0}
          // width = {300}
          // showPoster = {true}
          // controls={true}
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />

        <Text style = {{ color: '#f2f2f2', fontSize: 22 , fontWeight: '600', textAlign : 'center', marginTop : 20 }}>{ selectedMovies.name }</Text>
    </View>
  )
}

export default MovieRoom

const styles = StyleSheet.create({
  video: {
    alignSelf: "center",
    width: "100%",
    height: 300,
  },
})