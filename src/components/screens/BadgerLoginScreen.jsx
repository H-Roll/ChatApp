import { Alert, Button, StyleSheet, Text, View, TextInput } from "react-native";
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';

function BadgerLoginScreen(props) {
    const [username, setUsername] = useState('');
    const [pin, setPin] = useState('');

    const handleLogin = async () => {
        if (username === '' || pin === '') {
            Alert.alert("Error", "Please enter both username and pin.");
            return;
        }

        try {
            const response = await fetch('https://cs571api.cs.wisc.edu/rest/su24/hw9/login', {
                method: 'POST',
                headers: {
                    "X-CS571-ID": 'bid_df051622b70ef7cf7f20560edecc4602025360d751eff54748be5c8cfc7938de',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, pin }),
            });
            if (response.ok) {
                const data = await response.json();
                await SecureStore.setItemAsync('jwt', data.token);
                await SecureStore.setItemAsync('username', username);
                console.log("Stored Token:", data.token);
                props.handleLogin(username, pin);
            } else {
                Alert.alert("Error", "Incorrect login, please try again.");
            }
        } catch (error) {
            console.error("Login error:", error);
            Alert.alert("Error", "An error occurred. Please try again.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 36 }}>BadgerChat Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Pin"
                value={pin}
                onChangeText={setPin}
                keyboardType="number-pad"
                maxLength={7}
                secureTextEntry
            />

            <Button color="crimson" title="Login" onPress={handleLogin} />
            <Button color="grey" title="Signup" onPress={() => props.setIsRegistering(true)} />
            <Button color="blue" title="Continue As Guest" onPress={props.handleGuestAccess} />
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
        width: '80%',
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
});

export default BadgerLoginScreen;