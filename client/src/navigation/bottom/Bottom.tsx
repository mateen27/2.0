import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import Notification from '../../screens/AppScreens/Notification'; // Import your Notification component here
import Home from '../../screens/SocialMedia/Home';
import FriendRequests from '../../screens/SocialMedia/FriendRequests';
import SearchUsers from '../../screens/SocialMedia/SearchUsers';
import User from '../../screens/SocialMedia/User';
import { View } from 'react-native';

const Tab = createBottomTabNavigator();

const Bottom = () => {
  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Notification') {
              iconName = focused ? 'notifications' : 'notifications-outline';
            } 
            if ( route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            }
            if ( route.name === 'Friends') {
              iconName = focused ? 'people' : 'people-outline';
            }
            if ( route.name === "Search") {
              iconName = focused ?'search' :'search-outline';
            }
            if ( route.name === 'User' ) {
              iconName = focused ? 'person-circle' : 'person-circle-outline';
            }

            // You can return any component here like an image or a custom icon
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: 'black',
          },

        })}
      >
        <Tab.Screen name="Home" component={Home} options={{ headerShown: false }}/>
        <Tab.Screen name="Search" component={SearchUsers} options={{ headerShown: false }}/>
        <Tab.Screen name="Friends" component={FriendRequests} options={{ headerShown: false }}/>
        <Tab.Screen name="User" component={User} options={{ headerShown: false }}/>
      </Tab.Navigator>
      </View>
  );
};

export default Bottom;
