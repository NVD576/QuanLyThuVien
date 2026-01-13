import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Switch,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyDispatchContext } from "../configs/MyContext";
import APIs, { authApis, endpoints } from "../configs/APIs";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const InputField = ({
  label,
  icon,
  value,
  onChange,
  secure,
  error,
  editable,
  toggleSecure,
}) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputWrapper, error && styles.inputError]}>
      <Ionicons name={icon} size={20} color="#5d4037" />
      <TextInput
        style={styles.input}
        placeholder={`Nhập ${label.toLowerCase()}`}
        placeholderTextColor="#8d6e63"
        secureTextEntry={secure}
        value={value}
        onChangeText={onChange}
        editable={editable}
      />
      {toggleSecure && (
        <TouchableOpacity onPress={toggleSecure} disabled={!editable}>
          <Ionicons
            name={secure ? "eye-off-outline" : "eye-outline"}
            size={22}
            color="#5d4037"
          />
        </TouchableOpacity>
      )}
    </View>
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const Login = ({ navigation, onLoginSuccess }) => {
  const [user, setUser] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useContext(MyDispatchContext);

  const handleChange = (field) => (text) => setUser({ ...user, [field]: text });

  const validate = () => {
    const newErrors = {};
    if (!user.username.trim())
      newErrors.username = "Tên đăng nhập không được để trống";
    if (!user.password.trim())
      newErrors.password = "Mật khẩu không được để trống";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const login = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await APIs.post(endpoints["login"], user);
      const token = res?.data?.token;
      if (!token) throw new Error("Không nhận được token từ server");

      await AsyncStorage.setItem("token", token);
      if (remember) await AsyncStorage.setItem("rememberMe", "true");
      else await AsyncStorage.removeItem("rememberMe");

      const userRes = await authApis(token).get(endpoints["current-user"]);
      dispatch({ type: "login", payload: userRes.data });
      if (onLoginSuccess) onLoginSuccess();
      navigation.goBack();
    } catch (err) {
      const message = err?.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản/mật khẩu.";
      Alert.alert("Lỗi", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flex: 1 }}
      >
        <View style={styles.inner}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/library-logo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.title}>Hệ thống Thư viện NVD</Text>
            <Text style={styles.subtitle}>
              Kết nối tri thức - Mở rộng tương lai
            </Text>
          </View>

          <InputField
            label="Tên đăng nhập"
            icon="person-outline"
            value={user.username}
            onChange={handleChange("username")}
            error={errors.username}
            editable={!loading}
          />
          <InputField
            label="Mật khẩu"
            icon="lock-closed-outline"
            value={user.password}
            onChange={handleChange("password")}
            secure={!showPassword}
            toggleSecure={() => setShowPassword(!showPassword)}
            error={errors.password}
            editable={!loading}
          />

          <View style={styles.rememberContainer}>
            <Switch
              value={remember}
              onValueChange={setRemember}
              trackColor={{ false: "#d7ccc8", true: "#5d4037" }}
              thumbColor="#fff"
              disabled={loading}
            />
            <Text style={styles.rememberText}>Ghi nhớ đăng nhập</Text>
          </View>

          <TouchableOpacity
            onPress={login}
            disabled={loading}
            style={styles.buttonWrapper}
            activeOpacity={0.8}
          >
            {loading ? (
              <View style={styles.loadingWrapper}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.loadingText}>Đang đăng nhập...</Text>
              </View>
            ) : (
              <LinearGradient
                colors={["#5d4037", "#3e2723"]}
                style={styles.button}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>Đăng nhập</Text>
              </LinearGradient>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            style={styles.buttonWrapper}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#8d6e63", "#5d4037"]}
              style={styles.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Đăng ký</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Thư viện NVD Thành phố Hồ Chí Minh
            </Text>
            <Text style={styles.footerSubText}>
              © {new Date().getFullYear()} - Bản quyền thuộc NVD Library
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#efebe9",
  },
  inner: {
    flex: 1,
    padding: 32,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    marginTop: 16,
    fontSize: 24,
    fontWeight: "bold",
    color: "#3e2723",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#5d4037",
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#5d4037",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#a1887f",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: {
    borderColor: "#d32f2f",
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    marginLeft: 12,
    fontSize: 16,
    color: "#3e2723",
  },
  errorText: {
    color: "#d32f2f",
    marginTop: 4,
    fontSize: 12,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  rememberText: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: "500",
    color: "#5d4037",
  },
  buttonWrapper: {
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 20,
  },
  button: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  loadingText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
  footer: {
    marginTop: 40,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#8d6e63",
    textAlign: "center",
  },
  footerSubText: {
    fontSize: 11,
    color: "#a1887f",
    marginTop: 4,
    textAlign: "center",
  },
});

export default Login;
