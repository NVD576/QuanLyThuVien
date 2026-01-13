import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
    SafeAreaView,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../configs/APIs";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const ChangePasswordScreen = ({ navigation }) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
    const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChangePassword = async () => {
        setError("");

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("Vui lòng nhập đầy đủ thông tin.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Mật khẩu mới và xác nhận không khớp.");
            return;
        }

        if (newPassword.length < 6) {
            setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
            return;
        }

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                throw new Error("Không tìm thấy token xác thực.");
            }
            await authApis(token).patch(endpoints.changePassword, {
                oldPassword: currentPassword,
                newPassword: newPassword,
            });
            Alert.alert("Thành công", "Đổi mật khẩu thành công!", [
                { text: "OK", onPress: () => navigation.goBack() },
            ]);
        } catch (err) {
            setError("Mật khẩu hiện tại không đúng hoặc đã có lỗi xảy ra.");
        } finally {
            setLoading(false);
        }
    };

    const renderPasswordInput = (placeholder, value, setValue, isVisible, setIsVisible, iconName) => (
        <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>{placeholder}</Text>
            <View style={styles.inputContainer}>
                <View style={styles.iconContainer}>
                    <Icon name={iconName} size={20} color="#6366f1" />
                </View>
                <TextInput
                    style={styles.input}
                    placeholder={`Nhập ${placeholder.toLowerCase()}`}
                    placeholderTextColor="#94a3b8"
                    secureTextEntry={!isVisible}
                    value={value}
                    onChangeText={setValue}
                    selectionColor="#6366f1"
                />
                <TouchableOpacity 
                    onPress={() => setIsVisible(!isVisible)} 
                    style={styles.eyeIcon}
                    activeOpacity={0.7}
                >
                    <Icon 
                        name={isVisible ? "eye-outline" : "eye-off-outline"} 
                        size={20} 
                        color="#94a3b8" 
                    />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.gradientBackground}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={styles.keyboardAvoidingView}
                    >
                        <View style={styles.header}>
                            <TouchableOpacity 
                                onPress={() => navigation.goBack()}
                                style={styles.backButton}
                                activeOpacity={0.8}
                            >
                                <Icon name="arrow-back" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.mainCard}>
                            <View style={styles.iconHeader}>
                                <LinearGradient
                                    colors={['#6366f1', '#8b5cf6']}
                                    style={styles.iconCircle}
                                >
                                    <Icon name="shield-checkmark" size={32} color="#fff" />
                                </LinearGradient>
                            </View>

                            <Text style={styles.title}>Đổi Mật Khẩu</Text>
                            <Text style={styles.subtitle}>
                                Bảo vệ tài khoản của bạn bằng cách cập nhật mật khẩu mạnh và an toàn
                            </Text>

                            <View style={styles.form}>
                                {renderPasswordInput(
                                    "Mật khẩu hiện tại", 
                                    currentPassword, 
                                    setCurrentPassword, 
                                    isCurrentPasswordVisible, 
                                    setIsCurrentPasswordVisible,
                                    "lock-closed"
                                )}
                                
                                {renderPasswordInput(
                                    "Mật khẩu mới", 
                                    newPassword, 
                                    setNewPassword, 
                                    isNewPasswordVisible, 
                                    setIsNewPasswordVisible,
                                    "key"
                                )}
                                
                                {renderPasswordInput(
                                    "Xác nhận mật khẩu mới", 
                                    confirmPassword, 
                                    setConfirmPassword, 
                                    isConfirmPasswordVisible, 
                                    setIsConfirmPasswordVisible,
                                    "checkmark-circle"
                                )}

                                <View style={styles.requirementsContainer}>
                                    <Text style={styles.requirementsTitle}>Yêu cầu mật khẩu:</Text>
                                    <View style={styles.requirementItem}>
                                        <Icon 
                                            name={newPassword.length >= 6 ? "checkmark-circle" : "ellipse-outline"} 
                                            size={16} 
                                            color={newPassword.length >= 6 ? "#10b981" : "#94a3b8"} 
                                        />
                                        <Text style={[
                                            styles.requirementText,
                                            newPassword.length >= 6 && styles.requirementTextValid
                                        ]}>
                                            Ít nhất 6 ký tự
                                        </Text>
                                    </View>
                                    <View style={styles.requirementItem}>
                                        <Icon 
                                            name={newPassword === confirmPassword && newPassword.length > 0 ? "checkmark-circle" : "ellipse-outline"} 
                                            size={16} 
                                            color={newPassword === confirmPassword && newPassword.length > 0 ? "#10b981" : "#94a3b8"} 
                                        />
                                        <Text style={[
                                            styles.requirementText,
                                            newPassword === confirmPassword && newPassword.length > 0 && styles.requirementTextValid
                                        ]}>
                                            Mật khẩu khớp nhau
                                        </Text>
                                    </View>
                                </View>

                                {error ? (
                                    <View style={styles.errorContainer}>
                                        <Icon name="alert-circle" size={16} color="#ef4444" />
                                        <Text style={styles.errorText}>{error}</Text>
                                    </View>
                                ) : null}

                                <TouchableOpacity
                                    style={[styles.button, loading && styles.buttonDisabled]}
                                    onPress={handleChangePassword}
                                    disabled={loading}
                                    activeOpacity={0.8}
                                >
                                    <LinearGradient
                                        colors={loading ? ['#94a3b8', '#94a3b8'] : ['#6366f1', '#8b5cf6']}
                                        style={styles.buttonGradient}
                                    >
                                        {loading ? (
                                            <ActivityIndicator size="small" color="#fff" />
                                        ) : (
                                            <>
                                                <Icon name="shield-checkmark" size={20} color="#fff" style={styles.buttonIcon} />
                                                <Text style={styles.buttonText}>Cập Nhật Mật Khẩu</Text>
                                            </>
                                        )}
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#667eea',
    },
    gradientBackground: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        minHeight: height,
    },
    keyboardAvoidingView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 0,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        backdropFilter: 'blur(10px)',
    },
    mainCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: 20,
        paddingHorizontal: 24,
        paddingTop: 40,
        paddingBottom: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -5,
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 10,
    },
    iconHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#6366f1',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1e293b',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
        paddingHorizontal: 16,
    },
    form: {
        flex: 1,
    },
    inputWrapper: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#e2e8f0',
        paddingHorizontal: 16,
        height: 56,
    },
    iconContainer: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#1e293b',
        fontWeight: '500',
    },
    eyeIcon: {
        padding: 8,
        marginLeft: 8,
    },
    requirementsContainer: {
        backgroundColor: '#f1f5f9',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    requirementsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 12,
    },
    requirementItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    requirementText: {
        fontSize: 14,
        color: '#64748b',
        marginLeft: 8,
    },
    requirementTextValid: {
        color: '#10b981',
        fontWeight: '500',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fef2f2',
        borderRadius: 12,
        padding: 12,
        marginBottom: 24,
        borderLeftWidth: 4,
        borderLeftColor: '#ef4444',
    },
    errorText: {
        color: '#dc2626',
        fontSize: 14,
        marginLeft: 8,
        fontWeight: '500',
        flex: 1,
    },
    button: {
        borderRadius: 16,
        overflow: 'hidden',
        marginTop: 8,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 24,
    },
    buttonIcon: {
        marginRight: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
});