import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Video, ResizeMode } from "expo-av";
import io from 'socket.io-client';
import { Button } from 'react-native';

const MovieRoom = ({route}: any) => {

  // console.log('inside of the MovieRoom', route.params.roomDetails[0].movieLink);
  

  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const [isPaused, setIsPaused] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  
  // accessing the room ID and the selected Movies by the user
  const { roomID, movieLink, movieID, movieName } = route.params.roomDetails[0];
  // console.log('room', roomID, selectedMovies);
  // console.log('selected movies', movieLink);
  
  
  // Connect to the Socket.IO server
  const socket = io('http://192.168.29.181:3001/');

  useEffect(() => {
    socket.on('pause', (position: number) => {
      setIsPaused(true);
      setPlaybackPosition(position);
    });

    socket.on('resume', (position: number) => {
      setIsPaused(false);
      setPlaybackPosition(position);
    });

    return () => {
      socket.off('pause');
      socket.off('resume');
    };
  }, []);

  const updatePlaybackPosition = async (): Promise<void> => {
    if (video.current) {
      try {
        const currentStatus = await video.current.getStatusAsync();
        setStatus(currentStatus);
        setPlaybackPosition(currentStatus.positionMillis);
      } catch (error) {
        console.error('Error getting video status:', error);
      }
    }
  };

  const pauseVideo = () => {
    console.log('playback position', playbackPosition); // Add semicolon here
    socket.emit('pause', playbackPosition);
    setIsPaused(true);
  };

  const resumeVideo = () => {
    socket.emit('resume', playbackPosition);
    setIsPaused(false);
  };

  return (
    <View style = {{ flex: 1 , backgroundColor: '#000' }}>
      <Video
          ref={video}
          style={styles.video}
          source={{
            uri: movieLink,
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
          // onPlaybackStatusUpdate={updatePlaybackPosition}
          shouldPlay={!isPaused}
          
        />
        

<View style={styles.buttonContainer}>
        <Button title="Pause Video" onPress={pauseVideo} disabled={isPaused} />
        <Button title="Resume Video" onPress={resumeVideo} disabled={!isPaused} />
      </View>

        <Text style = {{ color: '#f2f2f2', fontSize: 22 , fontWeight: '600', textAlign : 'center', marginTop : 20 }}>{ movieName }</Text>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
})