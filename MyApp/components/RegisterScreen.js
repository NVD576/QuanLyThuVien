import React, { useState } from "react";
import APIs, { endpoints } from "../configs/APIs";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (name, value) => {
    if (name === 'phone') {
      value = value.replace(/[^0-9]/g, '');
    }
    
    if (name === 'email') {
      value = value.toLowerCase().trim();
    }

    setForm({ ...form, [name]: value });
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể chọn ảnh.");
    }
  };

  const validateForm = () => {
    if (!form.username.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên đăng nhập.");
      return false;
    }
    if (form.username.length < 3) {
      Alert.alert("Lỗi", "Tên đăng nhập phải có ít nhất 3 ký tự.");
      return false;
    }
    if (!form.password) {
      Alert.alert("Lỗi", "Vui lòng nhập mật khẩu.");
      return false;
    }
    if (form.password.length < 3) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự.");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu và nhập lại mật khẩu không khớp.");
      return false;
    }
    if (!form.email.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập email.");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      Alert.alert("Lỗi", "Email không hợp lệ.");
      return false;
    }
    
    if (!form.firstName.trim() || !form.lastName.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ họ và tên.");
      return false;
    }
    
    if (form.phone && form.phone.length < 10) {
      Alert.alert("Lỗi", "Số điện thoại phải có ít nhất 10 chữ số.");
      return false;
    }
    
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const formData = new FormData();
    
    for (let key in form) {
      if (key !== "confirmPassword") {
        formData.append(key, form[key]);
      }
    }
    
    if (image) {
      formData.append("file", {
        uri: image,
        type: "image/jpeg",
        name: "avatar.jpg",
      });
    }

    try {
      const res = await APIs.post(endpoints["register"], formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Alert.alert(
        "Thành công", 
        "Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.",
        [{ text: "OK", onPress: () => navigation.navigate("Login") }]
      );
    } catch (err) {
      const errorMsg = err.response?.data || "Đăng ký thất bại! Vui lòng thử lại.";
      Alert.alert("Thất bại", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const EmailSuggestions = ({ value, onSelect }) => {
    const domains = ['@gmail.com', '@yahoo.com', '@hotmail.com', '@outlook.com'];
    const atIndex = value.indexOf('@');
    
    if (atIndex === -1 && value.length > 0) {
      return (
        <View style={styles.suggestionsContainer}>
          {domains.map((domain, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionItem}
              onPress={() => onSelect(value + domain)}
            >
              <Text style={styles.suggestionText}>{value + domain}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }
    return null;
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
    >
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đăng ký tài khoản</Text>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <View style={styles.avatarSection}>
            <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Icon name="camera" size={32} color="#667eea" />
                  <Text style={styles.avatarText}>Chọn ảnh</Text>
                </View>
              )}
              <View style={styles.cameraIconContainer}>
                <Icon name="camera" size={16} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.inputSection}>
            <View style={styles.inputContainer}>
              <Icon name="person-outline" size={20} color="#667eea" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Tên đăng nhập"
                placeholderTextColor="#999"
                value={form.username}
                onChangeText={(t) => handleChange("username", t)}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="lock-closed-outline" size={20} color="#667eea" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                value={form.password}
                onChangeText={(t) => handleChange("password", t)}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Icon 
                  name={showPassword ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color="#999" 
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Icon name="lock-closed-outline" size={20} color="#667eea" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nhập lại mật khẩu"
                placeholderTextColor="#999"
                secureTextEntry={!showConfirmPassword}
                value={form.confirmPassword}
                onChangeText={(t) => handleChange("confirmPassword", t)}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Icon 
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                  size={20} 
                  color="#999" 
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Icon name="mail-outline" size={20} color="#667eea" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={form.email}
                onChangeText={(t) => handleChange("email", t)}
              />
            </View>
            <EmailSuggestions 
              value={form.email} 
              onSelect={(email) => handleChange("email", email)}
            />

            <View style={styles.nameRow}>
              <View style={[styles.inputContainer, styles.halfInput]}>
                <Icon name="person-outline" size={20} color="#667eea" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Họ"
                  placeholderTextColor="#999"
                  value={form.firstName}
                  onChangeText={(t) => handleChange("firstName", t)}
                />
              </View>
              <View style={[styles.inputContainer, styles.halfInput]}>
                <Icon name="person-outline" size={20} color="#667eea" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Tên"
                  placeholderTextColor="#999"
                  value={form.lastName}
                  onChangeText={(t) => handleChange("lastName", t)}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Icon name="call-outline" size={20} color="#667eea" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Số điện thoại"
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={form.phone}
                onChangeText={(t) => handleChange("phone", t)}
                maxLength={11}
              />
            </View>

            <View style={styles.inputContainer}>
              <Icon name="location-outline" size={20} color="#667eea" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Địa chỉ"
                placeholderTextColor="#999"
                value={form.address}
                onChangeText={(t) => handleChange("address", t)}
                multiline={true}
                numberOfLines={2}
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.registerButton, loading && styles.disabledButton]} 
            onPress={handleRegister}
            disabled={loading}
          >
            <LinearGradient
              colors={loading ? ['#ccc', '#999'] : ['#667eea', '#764ba2']}
              style={styles.buttonGradient}
            >
              {loading ? (
                <Text style={styles.buttonText}>Đang xử lý...</Text>
              ) : (
                <>
                  <Icon name="person-add" size={20} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Đăng ký</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginText}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.loginLink}>Đăng nhập ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerGradient: {
    paddingTop: StatusBar.currentHeight || 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    marginRight: 15,
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#667eea',
    borderStyle: 'dashed',
  },
  avatarText: {
    marginTop: 5,
    fontSize: 14,
    color: '#667eea',
    fontWeight: '500',
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#667eea',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  inputSection: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 15,
    color: '#333',
  },
  eyeIcon: {
    padding: 5,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  suggestionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionItem: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    fontSize: 14,
    color: '#667eea',
  },
  registerButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  disabledButton: {
    shadowOpacity: 0.1,
    elevation: 2,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: '#666',
  },
  loginLink: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
  },
});