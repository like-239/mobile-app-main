/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  StyleSheet
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FlashMessage from 'react-native-flash-message';
import MonthChart from './app/screens/MonthChart';
import AddTransaction from './app/screens/AddTransaction';
import BottomTabNavigation from './app/screens/BottomTabNavigation';
import Home from './app/screens/Home';
import Login from './app/screens/Login';
import Profile from './app/screens/Profile';
import ProgressBar from './app/screens/ProgressBar';
import Signup from './app/screens/Signup';
import TransactionDetails from './app/screens/TransactionDetails';
import Budget from './app/screens/Budget';
import BudgetStatus from './app/screens/BudgetStatus';
import BudgetDetails from './app/screens/BudgetDetails';
const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
      <Stack.Screen
          name="BottomTabNavigation"
          component={BottomTabNavigation}
          options={{headerShown: false}}
        />
      <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
      <Stack.Screen
          name="SignUp"
          component={Signup}
          options={{headerShown: false}}
        />
    <Stack.Screen
          name="AddTransaction"
          component={AddTransaction}
          options={{headerShown: false}}
        />    
           <Stack.Screen
          name="Profile"
          component={Profile}
          options={{headerShown: false}}
        />
          <Stack.Screen
          name="MonthChart"
          component={MonthChart}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name="TransactionDetails"
          component={TransactionDetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Budget"
          component={Budget}
          options={{headerShown: false}}
        />
           <Stack.Screen
          name="BudgetStatus"
          component={BudgetStatus}
          options={{headerShown: false}}
        />
         <Stack.Screen
          name="ProgressBar"
          component={ProgressBar}
          options={{headerShown: false}}
        />
          <Stack.Screen
          name="BudgetDetails"
          component={BudgetDetails}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
      <FlashMessage position={"bottom"} />
    </NavigationContainer>
    
  );

}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
