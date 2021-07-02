import React, { useLayoutEffect, useState, useEffect } from "react";
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native";
import {} from "react-native-gesture-handler";
import { colors } from "../src/Colors";
import { Avatar } from "react-native-elements";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";

import CustomListItem from "../src/components/CustomListItem";
import { auth, db } from "../firebase";
import { TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";

const Home = ({ navigation }) => {
  const [chats, setChats] = useState([]);

  const logout = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login");
      })
      .catch((error) => alert(error.message));
  };

  useEffect(() => {
    const unsubscribe = db.collection("chats").onSnapshot((snapshot) => {
      setChats(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
    return unsubscribe;
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chats",
      headerStyle: {
        backgroundColor: colors.primary,
      },
      headerTitleStyle: { color: "#fff" },
      headerTintColor: "#ffff",
      headerLeft: () => (
        <View style={styles.avatarContainer}>
          <TouchableOpacity activeOpacity={0.5} style={styles.touchable}>
            <Avatar
              rounded
              source={{
                uri: auth?.currentUser?.photoURL,
              }}
            />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.rightIconContainer}>
            <AntDesign name="camerao" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={() => navigation.navigate("AddChat")}
          >
            <SimpleLineIcons name="pencil" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.rightIconContainer}>
            <AntDesign name="export" size={24} color="white" onPress={logout} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);


  const enterChat = (id,chatName) => {
    navigation.navigate("Chat", {
      id,
      chatName
    })


    
  }
  return (
    <SafeAreaView>
      <StatusBar style="light" />
      <ScrollView style={styles.scrollView}>
        {chats.map(({ id, data: { chatName } }) => (
          <CustomListItem
            key={id}
            id={id}
            chatName={chatName}
            enterChat={enterChat}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  avatarContainer: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    padding: 3,
    marginLeft: 20,
    display: "flex",
    flexDirection: "row",
  },
  touchable: {},
  headerRight: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: 120,
    marginRight: 20,
  },
  scrollView: {
    height: "100%",
  },
});
