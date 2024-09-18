import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, RefreshControl, Button, Modal, TextInput, Alert } from "react-native";
import BadgerChatMessage from '../helper/BadgerChatMessage';
import * as SecureStore from 'expo-secure-store';

function BadgerChatroomScreen(props) {
    console.log(props);
    //console.log(props.route.params.name);
    const [messages, setMessages] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [posterName, setPosterName] = useState('');

    const fetchMessages = async () => {
        try {
            const response = await fetch(`https://cs571api.cs.wisc.edu/rest/su24/hw6/messages?chatroom=${props.name}`, {
                method: 'GET',
                headers: {
                    "X-CS571-ID": 'bid_df051622b70ef7cf7f20560edecc4602025360d751eff54748be5c8cfc7938de',
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                const data = await response.json();
                setMessages(data.messages);
            } else {
                console.error("Failed to fetch messages");
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const createPost = async () => {
        const token = await SecureStore.getItemAsync('jwt');
        if (!token) {
            console.error("No token found");
            Alert.alert("Error", "You must be logged in to create a post.");
            return;
        }
        console.log("Retrieved Token:", token);
        try {
            const response = await fetch(`https://cs571api.cs.wisc.edu/rest/su24/hw9/messages?chatroom=${props.name}`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "X-CS571-ID": 'bid_df051622b70ef7cf7f20560edecc4602025360d751eff54748be5c8cfc7938de',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content: body }),
            });
            const responseData = await response.json();
            console.log("Response Data:", responseData);
            console.log("Response Status:", response.status);
            console.log("Response Headers:", response.headers);

            if (response.ok) {
                Alert.alert("Success", "Your post was successful!");
                fetchMessages();
                setModalVisible(false);
                setTitle('');
                setBody('');
            } else {
                console.error("Failed to create post", responseData);
            }
        } catch (error) {
            console.error("Error creating post:", error);
        }
    };

    const handleDelete = (id) => {
        setMessages(messages.filter(message => message.id !== id));
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    useEffect(() => {
        const fetchPosterName = async () => {
            const name = await SecureStore.getItemAsync('username');
            setPosterName(name);
        };
        fetchPosterName();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchMessages().then(() => setRefreshing(false));
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <BadgerChatMessage
                            id={item.id}
                            title={item.title}
                            author={item.poster}
                            content={item.content}
                            date={item.created}
                            isOwner={item.poster === posterName}
                            onDelete={handleDelete}
                        />
                    </View>
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
            {!props.isGuest && (
                <View style={{ marginBottom: 20, padding: 10 }}>
                    <Button title="Create Post" onPress={() => setModalVisible(true)} />
                </View>
            )}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Create a Post</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Title"
                            placeholderTextColor="#888"
                            value={title}
                            onChangeText={setTitle}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Body"
                            placeholderTextColor="#888"
                            value={body}
                            onChangeText={setBody}
                            multiline
                        />
                        <View style={styles.buttonContainer}>
                            <Button
                                title="Cancel"
                                onPress={() => {
                                    setModalVisible(false);
                                }}
                            />
                            <Button
                                title="Create Post"
                                onPress={createPost}
                                disabled={!title || !body}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    list: {
        width: '100%',
    },
    messageContainer: {
        width: '100%',
        paddingHorizontal: 10,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        marginVertical: 5,
        marginHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
});

export default BadgerChatroomScreen;