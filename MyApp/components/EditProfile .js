import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../configs/APIs";
import { MyDispatchContext, MyUserContext } from "../configs/MyContext";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

const COLORS = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  background: '#f8fafc',
  card: '#ffffff',
  text: '#1e293b',
  textSecondary: '#64748b',
  textLight: '#94a3b8',
  white: '#ffffff',
  separator: '#e2e8f0',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  disabled: '#94a3b8',
};

const InputRow = ({ icon, label, value, onChangeText, placeholder, iconColor, ...props }) => (
  <View style={styles.inputRow}>
    <View style={[styles.iconContainer, { backgroundColor: iconColor }]}>
      <Icon name={icon} size={18} color={COLORS.white} />
    </View>
    <View style={styles.inputTextContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textLight}
        selectionColor={COLORS.primary}
        {...props}
      />
    </View>
  </View>
);

const EditProfile = ({ navigation }) => {
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || "");
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [isSaving, setIsSaving] = useState(false);

  const isValidEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(String(value).toLowerCase());
  };

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Cần quyền", "Bạn cần cấp quyền truy cập thư viện ảnh để thay đổi ảnh đại diện.");
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setAvatar(result.assets[0].uri);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Không thể chọn ảnh: " + err.message);
    }
  };

  const handleSave = async () => {
    const trimmedEmail = (email || "").trim().toLowerCase();
    if (!trimmedEmail) {
      Alert.alert("Lỗi", "Vui lòng nhập email.");
      return;
    }
    if (!isValidEmail(trimmedEmail)) {
      Alert.alert("Lỗi", "Email không hợp lệ. Vui lòng kiểm tra lại.");
      return;
    }
    setIsSaving(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) throw new Error("Token không tồn tại");

      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", trimmedEmail);
      formData.append("phone", phone);
      formData.append("address", address);

      if (avatar && avatar.startsWith("file://")) {
        formData.append("file", {
          uri: avatar,
          name: `avatar_${user.id}.jpg`,
          type: "image/jpeg",
        });
      }

      const res = await authApis(token).patch(
        endpoints["update-profile"](user.id),
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      dispatch({ type: "login", payload: res.data });
      Alert.alert("Thành công", "Cập nhật thông tin thành công!");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Lỗi", err.response?.data);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={styles.headerGradient}>
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-left" size={24} color={COLORS.white} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Chỉnh sửa thông tin</Text>
          
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.avatarSection}>
            <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
              <View style={styles.avatarWrapper}>
                <Image source={{ uri: avatar }} style={styles.avatar} />
                <LinearGradient 
                  colors={[COLORS.primary, COLORS.secondary]}
                  style={styles.cameraIcon}
                >
                  <Icon name="camera" size={20} color={COLORS.white} />
                </LinearGradient>
              </View>
            </TouchableOpacity>
            <Text style={styles.avatarHint}>Chạm để thay đổi ảnh đại diện</Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.sectionHeader}>
              <Icon name="account-edit" size={24} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
            </View>

            <InputRow 
              icon="account" 
              label="Họ" 
              value={firstName} 
              onChangeText={setFirstName} 
              placeholder="Nhập họ của bạn"
              iconColor={COLORS.primary}
            />
            <InputRow 
              icon="account-outline" 
              label="Tên" 
              value={lastName} 
              onChangeText={setLastName} 
              placeholder="Nhập tên của bạn"
              iconColor={COLORS.secondary}
            />
            <InputRow 
              icon="email" 
              label="Email" 
              value={email} 
              onChangeText={(t) => setEmail((t || "").toLowerCase())} 
              placeholder="Nhập email"
              iconColor={COLORS.error}
              keyboardType="email-address"
            />
            <InputRow 
              icon="phone" 
              label="Số điện thoại" 
              value={phone} 
              onChangeText={setPhone} 
              placeholder="Nhập số điện thoại"
              iconColor={COLORS.success}
              keyboardType="phone-pad"
            />
            <InputRow 
              icon="map-marker" 
              label="Địa chỉ" 
              value={address} 
              onChangeText={setAddress} 
              placeholder="Nhập địa chỉ"
              iconColor={COLORS.warning}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.saveButton, isSaving && styles.disabledButton]} 
              onPress={handleSave}
              disabled={isSaving}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={isSaving ? [COLORS.disabled, COLORS.disabled] : [COLORS.primary, COLORS.secondary]}
                style={styles.saveButtonGradient}
              >
                {isSaving ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <>
                    <Icon name="content-save" size={20} color={COLORS.white} />
                    <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelButtonText}>Hủy bỏ</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerGradient: {
    paddingBottom: 20,
    paddingTop:30
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
  },
  placeholder: {
    width: 40,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 30,
    marginTop: -10,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatarWrapper: {
    position: 'relative',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  avatarHint: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    marginHorizontal: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  inputTextContainer: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
    paddingVertical: 2,
  },
  buttonContainer: {
    paddingHorizontal: 20,
  },
  saveButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  disabledButton: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
  },
  cancelButton: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.separator,
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
    fontSize: 16,
  },
});