import React from 'react';
import { StyleSheet, Text, View, StatusBar, ListView } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label, Icon, List, ListItem } from 'native-base'

import * as firebase from 'firebase';
var data = []

import { Permissions, Notifications } from 'expo';

export default class App extends React.Component {


    static navigationOptions = {
        header: null
    }
    constructor(props) {
        super(props);

        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

        this.state = {
            listViewData: data,
            newContact: "",
            currentUser: ""
        }

    }

    componentDidMount() {

        // var messages = []

        // return the main promise
        // firebase.database().ref('/users').once('value').then(function (snapshot) {
        //     snapshot.forEach(function (childSnapshot) {

        //         // var childKey = childSnapshot.value;

        //         console.log(childSnapshot.val().expoToken)
        //         return

        //         messages.push({
        //             "to": childSnapshot.val().expoToken,
        //             "sound": "default",
        //             "body": "New Note Added"
        //         });
        //     });
        //     //firebase.database then() respved a single promise that resolves
        //     //once all the messages have been resolved 
        //     return Promise.all(messages)

        // }).then(messages => {
        //     console.log(messages)
        // })
        //     .catch(error => {
        //         console.log(error)
        //     })


        var currentUser
        var that = this
        listener = firebase.auth().onAuthStateChanged(function (user) {
            if (user != null) {

                currentUser = user

                that.registerForPushNotificationsAsync(currentUser)
            }

            listener();

        });

        firebase.database().ref('/contacts').on('child_added', function (data) {

            var newData = [...that.state.listViewData]
            newData.push(data)
            that.setState({ listViewData: newData })

        })
    }

    loadSubscribers = () => {
        var messages = []

        //return the main promise
        return firebase.database().ref('/subscribers').once('value').then(function (snapshot) {
            snapshot.forEach(function (childSnapshot) {

                var childKey = childSnapshot.key;

                messages.push({
                    "to": childKey,
                    "sound": "default",
                    "body": "New Note Added"
                });
            });
            //firebase.database then() respved a single promise that resolves
            //once all the messages have been resolved 
            return Promise.all(messages)

        }).catch(error => {
            console.log(error)
        })

    }

    registerForPushNotificationsAsync = async (currentUser) => {
        const { existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        let finalStatus = existingStatus;

        // only ask if permissions have not already been determined, because
        // iOS won't necessarily prompt the user a second time.
        if (existingStatus !== 'granted') {
            // Android remote notification permissions are granted during the app
            // install, so this will only ask on iOS
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }

        // Stop here if the user did not grant permissions
        if (finalStatus !== 'granted') {
            return;
        }

        // Get the token that uniquely identifies this device
        let token = await Notifications.getExpoPushTokenAsync();

        // POST the token to our backend so we can use it to send pushes from there
        var updates = {}
        updates['/expoToken'] = token
        await firebase.database().ref('/users/' + currentUser.uid).update(updates)
        //call the push notification 
    }


    addRow(data) {

        var key = firebase.database().ref('/contacts').push().key
        firebase.database().ref('/contacts').child(key).set({ name: data })
    }

    async deleteRow(secId, rowId, rowMap, data) {

        await firebase.database().ref('contacts/' + data.key).set(null)



        rowMap[`${secId}${rowId}`].props.closeRow();
        var newData = [...this.state.listViewData];
        newData.splice(rowId, 1)
        this.setState({ listViewData: newData });

    }

    showInformation() {

    }

    render() {
        return (
            <Container style={styles.container} >
                <Header style={{ marginTop: StatusBar.currentHeight }}>
                    <Content>
                        <Item>
                            <Input
                                onChangeText={(newContact) => this.setState({ newContact })}
                                placeholder="Add Note"
                            />
                            <Button onPress={() => this.addRow(this.state.newContact)}>
                                <Icon name="add" />
                            </Button>
                        </Item>
                    </Content>
                </Header>

                <Content>
                    <List
                        enableEmptySections
                        dataSource={this.ds.cloneWithRows(this.state.listViewData)}
                        renderRow={data =>
                            <ListItem>
                                <Text> {data.val().name}</Text>
                            </ListItem>
                        }
                        renderLeftHiddenRow={data =>
                            <Button full onPress={() => this.addRow(data)} >
                                <Icon name="information-circle" />
                            </Button>
                        }
                        renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                            <Button full danger onPress={() => this.deleteRow(secId, rowId, rowMap, data)}>
                                <Icon name="trash" />
                            </Button>

                        }

                        leftOpenValue={-75}
                        rightOpenValue={-75}

                    />

                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',

    },
});
