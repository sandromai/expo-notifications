import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, SafeAreaView, ScrollView, TextInput, StyleSheet, Dimensions, BackHandler } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
});

export default function Home() {
  const deviceWidth = Dimensions.get('window').width;
  const deviceHeight = Dimensions.get('window').height;

  const [notification, setNotification] = useState({ to: '', title: '', body: '' });

  const notificationListener = useRef();
  const responseListener = useRef();

  function handleSubmit() {
    sendNotification();
  }

  async function sendNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body
      },
      trigger: { seconds: 1 },
    });
  }

  async function registerForPushNotificationsAsync() {
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

    if (status !== 'granted') {
      alert('Oops, we need permission to send notifications...');

      const { status: finalStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

      if (finalStatus !== 'granted') {
        BackHandler.exitApp();
        return;
      }
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    setNotification({ ...notification, to: token });

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }

  useEffect(() => {
    registerForPushNotificationsAsync();

    notificationListener.current = Notifications.addNotificationReceivedListener();

    responseListener.current = Notifications.addNotificationResponseReceivedListener();

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return (
    <ScrollView>
      <SafeAreaView style={{ width: deviceWidth, height: deviceHeight, ...styles.container }}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Image style={{ marginLeft: 10 }} source={require('../../assets/expo.png')} />
            <Text style={styles.title}>Notifications</Text>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder='Title'
              onChangeText={text => setNotification({ ...notification, title: text })}
              style={styles.textInputContainer}
              placeholderTextColor="#807826"
            />

            <TextInput
              placeholder='Message'
              onChangeText={text => setNotification({ ...notification, body: text })}
              style={styles.textInputContainer}
              placeholderTextColor="#807826"
            />
          </View>

          <RectButton style={styles.buttonContainer} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Send Notification</Text>
          </RectButton>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#CCCCCC'
  },

  content: {
    width: '90%'
  },

  header: {
    margin: 0,
    padding: 0
  },

  title: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 44,
    textAlign: 'center',
    color: '#FFEA00'
  },

  inputContainer: {
    marginTop: 42,
    marginBottom: 21,
    padding: 0
  },

  textInputContainer: {
    width: '95%',
    height: 48,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 21,
    backgroundColor: '#E5E5E5',
    alignSelf: 'center'
  },

  buttonContainer: {
    width: '95%',
    height: 52,
    borderRadius: 5,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF04D'
  },

  buttonText: {
    textAlign: 'center',
    color: '#666666',
    fontFamily: 'Poppins_500Medium',
    fontSize: 18
  }
});