import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation'


import * as firebase from 'firebase';
// Initialize Firebase
const firebaseConfig = {
    // ADD YOUR FIREBASE CREDENTIALS
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
};

firebase.initializeApp(firebaseConfig);


import LoginScreen from './LoginScreen'
import SendPushNotification from './SendPushNotification'

const AppNavigator = StackNavigator({
    LoginScreen: { screen: LoginScreen },
    SendPushNotificationScreen: { screen: SendPushNotification }
})

export default AppNavigator
