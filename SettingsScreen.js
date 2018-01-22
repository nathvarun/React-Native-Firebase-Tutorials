import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image
} from "react-native";

import { Icon, Button, Container, Header, Content, Left } from 'native-base'

class SettingsScreen extends Component {

    static navigationOptions = {
        drawerIcon: (
            <Image source={require('./assets/DrawerIcons/settings.png')}
                style={{ height: 24, width: 24 }} />
        )
    }
    render() {
        return (
            <Container>

                <Header>
                    <Left>
                        <Icon name="ios-menu" onPress={() => this.props.navigation.navigate('DrawerOpen')} />
                    </Left>
                </Header>
                <Content contentContainerStyle={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'

                }}>
                    <Text>Settings Screen</Text>
                </Content>
            </Container>
        );
    }
}
export default SettingsScreen;