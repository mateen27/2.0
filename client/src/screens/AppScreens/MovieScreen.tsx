import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Video, ResizeMode } from "expo-av";
import io from 'socket.io-client';
import { Button } from 'react-native';


interface Movie {
    link: string;
    name: string;
  }
  
  interface VideoStatus {
    positionMillis: number;
    // Other video status properties as needed
  }

const MovieScreen = ({route}: any) => {

//   console.log('inside of the MovieScreen', route.params);
  

const video = React.useRef<Video | null>(null);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [roomID, setRoomID] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [movieName, setMovieName] = useState('');

  // Accessing the room ID and the selected Movies by the user
  if (route.params) {
    // console.log('rrrr', route.params)

    const { link, id, name } = route.params.selectedMovies
    
    setIsHost(true);
    setRoomID(route.params.roomID);
    setSelectedMovie(route.params.selectedMovies.link);
    setMovieName(route.params.selectedMovies.name);
  }

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
        setPlaybackPosition(currentStatus.positionMillis); // Update only playbackPosition
      } catch (error) {
        console.error('Error getting video status:', error);
      }
    }
  };

  const pauseVideo = () => {
    console.log('playback position', playbackPosition);
    socket.emit('pause', playbackPosition);
    setIsPaused(true);
  };

  const resumeVideo = () => {
    socket.emit('resume', playbackPosition);
    setIsPaused(false);
  };

  const HostControls = React.memo(() => (
    <View>
      <Button title="Pause Video" onPress={pauseVideo} disabled={isPaused} />
      <Button title="Resume Video" onPress={resumeVideo} disabled={!isPaused} />
    </View>
  ));
  

  return (
    <View style = {{ flex: 1 , backgroundColor: '#000' }}>
      {isHost ? (
      <View>
      <Video
          ref={video}
          style={styles.video}
          source={{
            uri: selectedMovie.link,
          }}
          useNativeControls //for the controllers which are coming below
          // resizeMode="contain"
          resizeMode={ResizeMode.CONTAIN}
          isLooping
          volume={1.0}
          // width = {300}
          // showPoster = {true}
          // controls={true}
        //   onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          onPlaybackStatusUpdate={updatePlaybackPosition}
          shouldPlay={!isPaused}
          
        />

        <View style={styles.hostControls}>
          <Button title="Pause Video" onPress={pauseVideo} disabled={isPaused} />
          <Button title="Resume Video" onPress={resumeVideo} disabled={!isPaused} />
        </View>
        </View>
      ) : (
        <View style={styles.userControls}>
          {/* Render controls for users who are not the host */}
        </View>
      )}

        <Text style = {{ color: '#f2f2f2', fontSize: 22 , fontWeight: '600', textAlign : 'center', marginTop : 20 }}>{ selectedMovies.name }</Text>
    </View>
  )
}

export default MovieScreen

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