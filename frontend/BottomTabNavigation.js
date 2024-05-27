import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Home from './Home';
import Profile from './Profile';
import Signup from './Signup';
const Tab = createBottomTabNavigator();
const screenOptions = {
  tabBarShowLabel: false,
  tabBarHideOnKeyboard: true,
  headerShown: false,
  tabbarStyle: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    elevation: 0,
    height: 70,
  },
};

const BottomTabNavigation = () => {
    return (
    <Tab.Navigator screenOptions={screenOptions}>
    <Tab.Screen
      name="Home"
      component={Home}
      options={{
        tabBarIcon: ({focused}) => {
          return <Ionicons name={focused ? "home" : "home-outline"}
          size = {24}
          color={focused ? "#008E97" : "black"}
          />
        }
      }}></Tab.Screen>
    <Tab.Screen
      name="Signup"
      component={Signup}
      options={{
        tabBarIcon: ({focused}) => {
          return <Ionicons name={focused ? "calculator" : "calculator-outline"}
          size = {24}
          color={focused ? "#008E97" : "black"}
          />
        }
      }}></Tab.Screen>
    <Tab.Screen
      name="Profile"
      component={Profile}
      options={{
        tabBarIcon: ({focused}) => {
          return <FontAwesome name={focused ? "user" : "user-o"}
          size = {24}
          color={focused ? "#008E97" : "black"}
          />
        }
      }}></Tab.Screen>
  </Tab.Navigator>
    );
};

export default BottomTabNavigation;
