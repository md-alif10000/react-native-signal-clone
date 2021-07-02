import React, { useState, useEffect } from "react";
import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { Image, Input, Button } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import { colors } from "../src/Colors";
import { auth } from "../firebase";


const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        navigation.replace("Home");
      }
    });
    return unsubscribe;
  }, []);

  const login = () => {
    auth.signInWithEmailAndPassword(email,password).catch(error=>alert(error.message))


  };

  const toRegister = () => {
    navigation.navigate("Register");
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
      <View style={styles.inputContainer}>
        <Input
          style={styles.input}
          placeholder="Email"
          autoFocus
          type="email"
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          type="password"
          onSubmitEditing={login}
          onChangeText={(text) => setPassword(text)}
        />
        <Button
          containerStyle={styles.loginBtn}
          color={colors.primary}
          onPress={login}
          title="Login"
        />
        <Button
          containerStyle={styles.registerBtn}
          type="outline"
          title="Register"
          onPress={toRegister}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    padding: 20,
    width: "100%",
  },
  input: {},
  loginBtn: {
    marginBottom: 10,
    borderRadius: 40,
    borderColor: "red",
    backgroundColor: colors.primary,
    color: colors.textColor,
  },
  registerBtn: {
    marginBottom: 10,
    borderColor: "red",
    color: colors.textColor,
  },
});
