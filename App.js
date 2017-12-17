import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


import { Container, Content, Header, Form, Input, Item, Button, Label } from 'native-base'

export default class App extends React.Component {



  render() {
    return (
      <Container style={styles.container}>
        <View>
          <Text> Welcome to the React Native Firebase Tutorial Series!</Text>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 10
  },
});
