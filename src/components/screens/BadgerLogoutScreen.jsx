import { Alert, Button, StyleSheet, Text, View } from "react-native";
import React from 'react';
import * as SecureStore from 'expo-secure-store';
function BadgerLogoutScreen(props) {
    const handleLogout = async () => {
        if (props.isGuest) {
            props.setIsLoggedIn(false);
            props.setIsGuest(false);
            props.navigation.navigate('Signup');
        } else {
            await SecureStore.deleteItemAsync('jwt');
            Alert.alert("Logged Out", "You have been logged out.");
            props.setIsLoggedIn(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 24, marginTop: -100 }}>Are you sure you're done?</Text>
            <Text>Come back soon!</Text>
            <Text />
            <Button title="Logout" color="darkred" onPress={handleLogout} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 40,
        width: "50%",
        margin: 12,
        borderWidth: 1,
        padding: 10,
    }
});

export default BadgerLogoutScreen;