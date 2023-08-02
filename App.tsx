import { StatusBar } from "expo-status-bar";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [userInfo, setUserInfo] = useState(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "88947238780-deq1tg67t1sccrgfm9jrg11l1jisi6k0.apps.googleusercontent.com",
    iosClientId:
      "88947238780-looko1vp7hp31iamr4v9hhaec9j8r49m.apps.googleusercontent.com",
    webClientId:
      "88947238780-splp4l4dqcchcl8h8s11lgoct60k1i0i.apps.googleusercontent.com",
  });

  useEffect(() => {
    hangleSignInWithGoogle();
  }, [response]);

  const hangleSignInWithGoogle = async () => {
    const user = await AsyncStorage.getItem("@user");
    if (!user) {
      if (response?.type === "success") {
        await getUserInfo(response.authentication?.accessToken);
      }
    } else {
      setUserInfo(JSON.parse(user));
    }
  };

  const getUserInfo = async (token: any) => {
    if (!token) return <Text>Hello, world</Text>;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      {/* <Text>Hello, world!</Text> */}
      {userInfo ? (
        <View>
          <Image
            source={{ uri: userInfo.picture }}
            resizeMode="cover"
            style={{
              borderColor: "white",
              borderWidth: 1,
              width: 100,
              height: 100,
              borderRadius: 100,
            }}
          />
          <Text>ID: {userInfo.id}</Text>
          <Text>Email: {userInfo.email}</Text>
          <Text>Full Name: {userInfo.name}</Text>
        </View>
      ) : (
        <Text>Please sign-in</Text>
      )}
      {/* <Home /> */}
      <Button title="Sign in with Google" onPress={() => promptAsync()} />
      <Button
        title="Delete Account"
        onPress={() => AsyncStorage.removeItem("@user")}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
