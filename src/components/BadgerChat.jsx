import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import CS571 from '@cs571/mobile-client'
import * as SecureStore from 'expo-secure-store';
import BadgerChatroomScreen from './screens/BadgerChatroomScreen';
import BadgerRegisterScreen from './screens/BadgerRegisterScreen';
import BadgerLoginScreen from './screens/BadgerLoginScreen';
import BadgerLandingScreen from './screens/BadgerLandingScreen';
import BadgerLogoutScreen from './screens/BadgerLogoutScreen';

const ChatDrawer = createDrawerNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [chatrooms, setChatrooms] = useState([]);

  useEffect(() => {
    const fetchChatrooms = async () => {
      try {
        const response = await fetch('https://cs571api.cs.wisc.edu/rest/su24/hw9/chatrooms', {
          headers: {
            "X-CS571-ID": 'bid_df051622b70ef7cf7f20560edecc4602025360d751eff54748be5c8cfc7938de',
            'Content-Type': 'application/json'
          }
        });
        if (response.ok) {
          const data = await response.json();
          setChatrooms(data);
        } else {
          console.error("Failed to fetch chatrooms");
        }
      } catch (error) {
        console.error("Error fetching chatrooms:", error);
      }
    };

    fetchChatrooms();
  }, []);

  const handleLogin = async (username, pin) => {
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
        setIsLoggedIn(true);
        setIsGuest(false);
      } else {
        console.error("Login failed");
        setIsLoggedIn(false);
        setIsGuest(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsLoggedIn(false);
      setIsGuest(false);
    }
  };

  const handleSignup = async (username, pin) => {
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
        await SecureStore.setItemAsync('jwt', data.token);
        setIsLoggedIn(true);
        setIsGuest(false);
      } else {
        console.error("Registration failed");
        setIsLoggedIn(true);
        setIsGuest(false);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setIsLoggedIn(false);
      setIsGuest(false);
    }
  };

  const handleGuestAccess = () => {
    setIsLoggedIn(true);
    setIsGuest(true);
  };

  if (isLoggedIn) {
    return (
      <NavigationContainer>
        <ChatDrawer.Navigator>
          <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
          {
            chatrooms.map(chatroom => {
              return <ChatDrawer.Screen key={chatroom} name={chatroom}>
                {(props) => <BadgerChatroomScreen name={chatroom} isGuest={isGuest} />}
              </ChatDrawer.Screen>
            })
          }
          <ChatDrawer.Screen name="Logout" >
            {(props) => <BadgerLogoutScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
          </ChatDrawer.Screen>
        </ChatDrawer.Navigator>
      </NavigationContainer>
    );
  } else if (isRegistering) {
    return <BadgerRegisterScreen handleSignup={handleLogin} setIsRegistering={setIsRegistering} />
  } else {
    return <BadgerLoginScreen handleLogin={handleLogin} setIsRegistering={setIsRegistering} handleGuestAccess={handleGuestAccess} />
  }
}