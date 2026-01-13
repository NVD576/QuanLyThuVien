import React, { useReducer, useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Login from "./components/Login";
import BookDetail from "./components/Book/BookDetail ";
import { MyDispatchContext, MyUserContext } from "./configs/MyContext";
import MyAccountReducer from "./configs/MyAccountReducer";
import { authApis, endpoints } from "./configs/APIs";
import EditProfile from "./components/EditProfile ";
import Sidebar from "./components/Sidebar";
import ChangePasswordScreen from "./components/ChangePasswordScreen ";
import RegisterScreen from "./components/RegisterScreen";
import BookList from "./components/Book/BookList ";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, dispatch] = useReducer(MyAccountReducer, null);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const res = await authApis(token).get(endpoints["current-user"]);
          dispatch({ type: "login", payload: res.data });
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.log("Failed to check login:", err);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    dispatch({ type: "logout" });
    setIsLoggedIn(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <MyUserContext.Provider value={user}>
      <MyDispatchContext.Provider value={dispatch}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Main">
              {() => <Sidebar user={user} onLogout={handleLogout} />}
            </Stack.Screen>
            <Stack.Screen name="Login">
              {(props) => (
                <Login
                  {...props}
                  onLoginSuccess={() => setIsLoggedIn(true)}
                />
              )}
            </Stack.Screen>
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="change_password" component={ChangePasswordScreen} />
            <Stack.Screen name="BookDetail" component={BookDetail} />
          </Stack.Navigator>
        </NavigationContainer>
      </MyDispatchContext.Provider>
    </MyUserContext.Provider>
  );
}
