import React, { useState, useLayoutEffect } from "react";
import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { Image, Input, Button, Text } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import { colors } from "../src/Colors";
import { auth } from "../firebase";

const Register = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Login",
    });
  }, [navigation]);

  const register = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        const updatedUser = authUser.user.updateProfile({
          displayName: displayName,
          photoURL:
            imageUrl ||
            "https://i.pinimg.com/236x/38/aa/95/38aa95f88d5f0fc3fc0f691abfaeaf0c.jpg",
        });
      })
      .catch((error) => alert(error.message));
  };

  const toLogin = () => {
    navigation.navigate("Login");
  };
  return (
    <KeyboardAvoidingView behavior="padding" enabled style={styles.container}>
      <StatusBar style="light" />
      <Image
        style={{ width: 100, height: 100 }}
        source={{
          uri: "https://logowik.com/content/uploads/images/signal-messenger-icon9117.jpg",
        }}
      />
      <Text h4 style={styles.title}>
        Create an account !
      </Text>
      <View style={styles.inputContainer}>
        <Input
          style={styles.input}
          placeholder="Name"
          autoFocus
          value={displayName}
          onChangeText={(text) => setDisplayName(text)}
        />
        <Input
          style={styles.input}
          placeholder="Email"
          type="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          type="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <Input
          style={styles.input}
          placeholder="Image URL"
          type="text"
          value={imageUrl}
          onChangeText={(text) => setImageUrl(text)}
          onSubmitEditing={register}
        />
        <Button
          raised
          containerStyle={styles.registerBtn}
          color={colors.primary}
          onPress={register}
          title="Register"
        />
        <Text h5 style={styles.shortTitle}>
          Already have an account?
        </Text>
        <Button
          containerStyle={styles.loginBtn}
          type="outline"
          title="login"
          onPress={toLogin}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: colors.primary,
    fontWeight: "bold",
  },
  inputContainer: {
    padding: 20,
    marginTop: 20,
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
  input: {},
  registerBtn: {
    width: "100%",
    marginBottom: 10,
    borderRadius: 40,
    borderColor: "red",
    backgroundColor: colors.primary,
    color: colors.textColor,
  },
  loginBtn: {
    width: "100%",
    marginBottom: 10,
    borderColor: "red",
    color: colors.textColor,
  },
  shortTitle: {
    marginHorizontal: "auto",
    fontWeight: "bold",
  },
});
