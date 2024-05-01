import React from 'react';
import { TouchableOpacity, Text, View, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming you are using Ionicons for icons
import { useNavigation } from '@react-navigation/native';

const Notification = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Notification Screen</Text>
    </View>
  );
};

export default Notification;
