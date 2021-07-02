import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { colors } from "../src/Colors";
import { Input, Button } from "react-native-elements";
import { Icons } from "react-native-vector-icons";
import { db } from "../firebase";

const AddChat = ({ navigation }) => {
  const [input, setInput] = useState("");
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add a new Chat",
      headerBackTitle: "Home",
      headerStyle: {
        backgroundColor: colors.primary,
      },
      headerTitleStyle: { color: colors.textColor },
      headerTintColor: colors.textColor,

      headerRight: () => <View style={styles.headerRight}></View>,
    });
  }, [navigation]);

  const createChat = async () => {
    await db
      .collection("chats")
      .add({
        chatName: input,
      })
      .then(() => {
        navigation.goBack();
      })
      .catch((error) => alert(error.message));
  };

  return (
    <View style={styles.container}>
      <Input
        type="text"
        value={input}
        onChangeText={(text) => setInput(text)}
      />
      <Button disabled={!input} onPress={createChat} title="Create new chat" />
    </View>
  );
};

export default AddChat;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});
