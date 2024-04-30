import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const AboutPage = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>About Application</Text>

      <View style={styles.section}>
        <Text style={styles.sectionHeading}>Welcome to StreamVibes!</Text>
        <Text style={styles.sectionText}>
          Experience the ultimate movie booking and streaming application. Whether you want to book pre-released movies, watch trailers, or create virtual rooms to watch movies with friends, we've got you covered.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeading}>Features</Text>
        <Text style={styles.sectionText}>
          - Book pre-released movies and secure your seat in advance.
        </Text>
        <Text style={styles.sectionText}>
          - Watch trailers of upcoming movies and get a sneak peek.
        </Text>
        <Text style={styles.sectionText}>
          - Stream your favorite movies directly in the app and enjoy the cinema experience.
        </Text>
        <Text style={styles.sectionText}>
          - Create virtual rooms, invite friends, and watch movies together. Chat in real-time.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeading}>Contact Us</Text>
        <Text style={styles.sectionText}>
          If you have any questions or feedback, feel free to reach out to us at khanmateen2712@gmail.com
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 15,
  },
});

export default AboutPage;
