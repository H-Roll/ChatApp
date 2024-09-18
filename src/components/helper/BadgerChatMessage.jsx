import { StyleSheet, Text, View, Button, Alert } from "react-native";
import BadgerCard from "./BadgerCard"
import React from 'react';
import * as SecureStore from 'expo-secure-store';

function BadgerChatMessage(props) {
    const handleDelete = async () => {
        const token = await SecureStore.getItemAsync('jwt');
        if (!token) {
            Alert.alert("Error", "You must be logged in to delete a post.");
            return;
        }

        try {
            const response = await fetch(`https://cs571api.cs.wisc.edu/rest/su24/hw9/messages?id=${props.id}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-CS571-ID": 'bid_df051622b70ef7cf7f20560edecc4602025360d751eff54748be5c8cfc7938de',
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                Alert.alert("Success", "Post deleted successfully.");
                props.onDelete(props.id);

            } else {
                const errorData = await response.json();
                Alert.alert("Error", errorData.msg);
            }
        } catch (error) {
            console.error("Delete error:", error);
            Alert.alert("Error", "An error occurred. Please try again.");
        }
    };

    return (
        <BadgerCard style={{ marginTop: 16, padding: 8, marginLeft: 8, marginRight: 8 }}>
            <Text style={styles.title}>{props.title}</Text>
            <Text style={styles.author}>By: {props.author} | Posted on: {new Date(props.date).toLocaleString()}</Text>
            <Text style={styles.content}>{props.content}</Text>
            {props.isOwner && (
                <Button title="Delete" color="red" onPress={handleDelete} />
            )}
        </BadgerCard>
    );
}

const styles = StyleSheet.create({
    messageContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    author: {
        fontSize: 14,
        color: '#555',
        marginBottom: 10,
    },
    content: {
        fontSize: 16,
        marginVertical: 5,
    },
});

export default BadgerChatMessage;