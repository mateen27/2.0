import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Post = ({ post }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: post.contentUrl }} style={styles.image} />
      <Text>{post.contentDescription}</Text>
      {/* You can add more components to display likes, comments, etc. */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default Post;
