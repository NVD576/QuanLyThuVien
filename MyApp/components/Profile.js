import React, { useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { MyDispatchContext, MyUserContext } from "../configs/MyContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';

const COLORS = {
  primary: "#6366f1",
  secondary: "#8b5cf6",
  background: "#f8fafc",
  card: "#ffffff",
  text: "#1e293b",
  textSecondary: "#64748b",
  textLight: "#94a3b8",
  white: "#ffffff",
  red: "#ef4444",
  separator: "#e2e8f0",
  success: "#10b981",
  warning: "#f59e0b",
};

const InfoRow = ({ icon, label, value, iconBackground }) => (
  <View style={styles.infoRow}>
    <View style={[styles.iconContainer, { backgroundColor: iconBackground }]}>
      <Icon name={icon} size={20} color={COLORS.white} />
    </View>
    <View style={styles.infoTextContainer}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || "Chưa cập nhật"}</Text>
    </View>
    <Icon name="chevron-right" size={20} color={COLORS.textLight} />
  </View>
);

const StatCard = ({ icon, value, label, gradient }) => (
  <View style={styles.statCard}>
    <LinearGradient colors={gradient} style={styles.statGradient}>
      <View style={styles.statIconContainer}>
        <Icon name={icon} size={24} color={COLORS.white} />
      </View>
      <View style={styles.statTextContainer}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </LinearGradient>
  </View>
);

const Profile = ({ navigation }) => {
  const user = useContext(MyUserContext);

  if (!user) {
    return (
      <View style={styles.centered}>
        <Icon name="account-off-outline" size={64} color={COLORS.textLight} />
        <Text style={styles.errorText}>Không tìm thấy thông tin người dùng</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <LinearGradient colors={[COLORS.primary, COLORS.secondary]} style={styles.headerGradient}>
          <View style={styles.headerContainer}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarContainer}>
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
                <View style={styles.onlineIndicator} />
              </View>
            </View>
            <Text style={styles.name}>
              {user.firstName} {user.lastName}
            </Text>
            <View style={styles.roleContainer}>
              <Icon name="crown" size={16} color={COLORS.warning} />
              <Text style={styles.role}>{user.role}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.contentContainer}>


          <View style={styles.infoCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Thông tin cá nhân</Text>
              <TouchableOpacity onPress={() => navigation.navigate("EditProfile")}>
                <Icon name="pencil" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            
            <InfoRow 
              icon="email" 
              label="Email" 
              value={user.email}
              iconBackground="#ef4444"
            />
            <InfoRow
              icon="phone"
              label="Số điện thoại"
              value={user.phone}
              iconBackground="#10b981"
            />
            <InfoRow
              icon="map-marker"
              label="Địa chỉ"
              value={user.address}
              iconBackground="#f59e0b"
            />
            <InfoRow
              icon="account"
              label="Tên đăng nhập"
              value={user.username}
              iconBackground="#6366f1"
            />
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate("EditProfile")}
            >
              <LinearGradient
                colors={[COLORS.primary, COLORS.secondary]}
                style={styles.buttonGradient}
              >
                <Icon name="pencil-outline" size={20} color={COLORS.white} />
                <Text style={styles.primaryButtonText}>Chỉnh sửa thông tin</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate("change_password")}
            >
              <View style={styles.secondaryButtonContent}>
                <Icon name="lock-reset" size={20} color={COLORS.primary} />
                <Text style={styles.secondaryButtonText}>Đổi mật khẩu</Text>
              </View>
            </TouchableOpacity>
          </View>

         
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
  headerGradient: {
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  avatarWrapper: {
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.success,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  name: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  role: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '600',
    marginLeft: 4,
    textTransform: "capitalize",
  },
  contentContainer: {
    marginTop: -20,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  statIconContainer: {
    marginRight: 12,
  },
  statTextContainer: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.white,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.separator,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: "600",
    marginTop: 2,
  },
  actionsContainer: {
    marginBottom: 32,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8,
  },
  secondaryButton: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.primary,
    overflow: 'hidden',
  },
  secondaryButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8,
  },
  quickActions: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },
  quickActionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionItem: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
});