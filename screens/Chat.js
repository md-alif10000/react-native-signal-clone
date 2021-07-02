import React, { useLayoutEffect, useState,useEffect,useRef } from "react";
import { TouchableOpacity } from "react-native";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { colors } from "react-native-elements";
import { Keyboard } from "react-native";
import { auth, db } from "../firebase";
import firebase from "firebase";
const Chat = ({ navigation, route }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const scrollViewRef = useRef();
  const ScrollToEnd = () => {
     scrollViewRef.current.scrollToEnd({ animated: true });
  }
  useEffect(() => {
    scrollViewRef.current.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = () => {
    Keyboard.dismiss();
    if (message == "") return;
    db.collection("chats").doc(route.params.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message,
      displayName: auth.currentUser.displayName,
      email: auth.currentUser.email,
      photoURL: auth.currentUser.photoURL,
    });
    setMessage("");
    ScrollToEnd()
  };

  useLayoutEffect(() => {
    const unsubscribe = db
      .collection("chats")
      .doc(route.params.id)
      .collection("messages")
      .orderBy("timestamp","asc")
      .onSnapshot((snapshot) =>
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );
    return unsubscribe;
  }, [route]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chat",
      headerBackTitleVisible: false,
      headerTitleAlign: "left",
      headerTitle: () => (
        <View style={styles.titleContainer}>
          <TouchableOpacity style={styles.headerAvatar}>
            <Avatar
              rounded
              source={{
                uri:messages[0]?.data.photoURL || "https://avatars.githubusercontent.com/u/70016863?s=60&v=4",
              }}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            {route.params.chatName.slice(0, 11)}..
          </Text>
        </View>
      ),

      headerRight: () => (
        <View style={styles.headerRightContainer}>
          <TouchableOpacity>
            <FontAwesome name="video-camera" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="call-sharp" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation,messages]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <ScrollView
              contentContainerStyle={{ padding: 10 }}
              ref={scrollViewRef}
              scrollsToTop={true}
            >
              {messages.map(({ id, data }) =>
                data.email === auth.currentUser.email ? (
                  <View key={id} style={styles.receiver}>
                    <Avatar
                      style={styles.receiverAvatar}
                      rounded
                      source={{
                        uri: data.photoURL,
                      }}
                    />
                    <Text style={styles.receiverText}> {data.message} </Text>
                  </View>
                ) : (
                  <View key={id} style={styles.sender}>
                    <Avatar
                      style={styles.senderAvatar}
                      rounded
                      source={{
                        uri: data.photoURL,
                      }}
                    />
                    <Text style={styles.senderText}> {data.message} </Text>
                  </View>
                )
              )}
            </ScrollView>
            <View style={styles.footer}>
              <TextInput
                placeholder="Your messages"
                style={styles.textInput}
                value={message}
                onChangeText={(text) => setMessage(text)}
              />
              <TouchableOpacity onPress={sendMessage} activeOpacity={0.5}>
                <Ionicons name="send" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  headerTitle: {
    fontSize: 16,
    color: "#fff",
  },
  headerAvatar: {
    marginRight: 10,
  },
  headerRightContainer: {
    display: "flex",
    flexDirection: "row",
    width: 80,
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: 20,
  },
  textInput: {
    width: "90%",
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    backgroundColor: "#ECECEC",
    padding: 10,
    color: "grey",
    borderRadius: 30,
  },
  container: {
    flex: 1,
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
  },

  receiver: {
    padding: 8,
    backgroundColor: colors.primary,
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "75%",
    position: "relative",
  },
  receiverText: {
    color: "#ffff",
  },
  receiverAvatar: {
    width: 20,
    height: 20,
    right: -8,
    bottom: -8,
    position: "absolute",
  },
  sender: {
    padding: 8,
    backgroundColor: "#ececec",
    alignSelf: "flex-start",
    borderRadius: 20,
    marginLeft: 15,
    marginBottom: 20,
    maxWidth: "75%",
    position: "relative",
  },
  senderAvatar: {
    width: 20,
    height: 20,
    left: -8,
    bottom: -8,
    position: "absolute",
  },
  senderText: {
    color: "grey",
  },
});
