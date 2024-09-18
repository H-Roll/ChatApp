import { Alert, Button, StyleSheet, Text, View, TextInput } from "react-native";
import React, { useState } from 'react';
import * as SecureStore from 'expo-secure-store';

function BadgerRegisterScreen(props) {
    const [username, setUsername] = useState('');
    const [pin, setPin] = useState('');
    const [repeatPin, setRepeatPin] = useState('');

    const handleSignup = async () => {
        if (pin === '' || repeatPin === '') {
            Alert.alert("Error", "Please enter a pin.");
            return;
        }

        if (pin !== repeatPin) {
            Alert.alert("Error", "Pins do not match.");
            return;
        }

        if (pin.length !== 7) {
            Alert.alert("Error", "A pin must be 7 digits.");
            return;
        }

        try {
            const response = await fetch('https://cs571api.cs.wisc.edu/rest/su24/hw9/register', {
                method: 'POST',
                headers: {
                    "X-CS571-ID": 'bid_df051622b70ef7cf7f20560edecc4602025360d751eff54748be5c8cfc7938de',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, pin }),
            });
            if (response.ok) {
                const data = await response.json();
                props.handleSignup(username, pin);
                await SecureStore.setItemAsync('jwt', data.token);
            } else if (response.status === 409) {
                Alert.alert("Error", "Username is already taken.");
            } else {
                Alert.alert("Error", "An error occurred. Please try again 1 .");
            }
        } catch (error) {
            console.error("Login error:", error);
            Alert.alert("Error", "An error occurred. Please try again 2 .");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 36 }}>Join BadgerChat!</Text>
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
            <TextInput
                style={styles.input}
                placeholder="Repeat Pin"
                value={repeatPin}
                onChangeText={setRepeatPin}
                keyboardType="number-pad"
                maxLength={7}
                secureTextEntry
            />
            <Button color="crimson" title="Signup" onPress={handleSignup} />
            <Button color="grey" title="Nevermind!" onPress={() => props.setIsRegistering(false)} />
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

export default BadgerRegisterScreen;