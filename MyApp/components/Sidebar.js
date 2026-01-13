import React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { Image, View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from 'expo-linear-gradient';

import BookList from "./Book/BookList ";
import CurrentBorrows from "./CurrentBorrows";
import BorrowHistory from "./BorrowHistory ";
import Profile from "./Profile";
import Category from "./Category";
import ChatScrees from "./ChatScreen"

const Drawer = createDrawerNavigator();

const COLORS = {
  primary: "#6366f1",
  secondary: "#8b5cf6",
  background: "#ffffff",
  cardBackground: "#f8fafc",
  text: "#1e293b",
  textSecondary: "#64748b",
  active: "#6366f1",
  activeBackground: "#eff6ff",
  logout: "#ef4444",
  border: "#e2e8f0",
};

function CustomDrawerContent({ user, onLogout, ...props }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={styles.gradientHeader}
      >
        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: user?.avatar,
              }}
              style={styles.avatar}
            />
            <View style={styles.onlineIndicator} />
          </View>
          <Text style={styles.userName}>
            {user ? `${user.firstName} ${user.lastName}` : "Khách"}
          </Text>
          <Text style={styles.userEmail}>{user?.email || "Vui lòng đăng nhập"}</Text>
        </View>
      </LinearGradient>

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>MENU CHÍNH</Text>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      <View style={styles.footer}>
        {user ? (
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <LinearGradient
              colors={['#fef2f2', '#fee2e2']}
              style={styles.logoutGradient}
            >
              <Icon name="logout-variant" size={20} color={COLORS.logout} />
              <Text style={styles.logoutText}>Đăng xuất</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => props.navigation.navigate('Login')}
          >
            <LinearGradient
              colors={['#eff6ff', '#dbeafe']}
              style={styles.loginGradient}
            >
              <Icon name="login" size={20} color={COLORS.active} />
              <Text style={styles.loginText}>Đăng nhập</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

export default function Sidebar({ user, onLogout }) {
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent {...props} user={user} onLogout={onLogout} />
      )}
      screenOptions={{
        headerTintColor: COLORS.primary,
        headerStyle: {
          backgroundColor: COLORS.background,
          elevation: 0,
          shadowOpacity: 0,
        },
        drawerType: "slide",
        drawerStyle: {
          backgroundColor: COLORS.background,
          width: 280,
        },
        drawerActiveBackgroundColor: COLORS.activeBackground,
        drawerActiveTintColor: COLORS.active,
        drawerInactiveTintColor: COLORS.textSecondary,
        drawerLabelStyle: styles.drawerLabel,
        drawerItemStyle: styles.drawerItem,
      }}
    >
      <Drawer.Screen
        name="Tủ Sách"
        component={BookList}
        options={{
          drawerIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Icon name="bookshelf" color={focused ? '#ffffff' : color} size={22} />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="Thể Loại"
        component={Category}
        options={{
          drawerIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Icon name="shape-outline" color={focused ? '#ffffff' : color} size={22} />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="Sách Đăng Kí Mượn"
        component={CurrentBorrows}
        options={{
          drawerIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Icon name="book-clock-outline" color={focused ? '#ffffff' : color} size={22} />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="Lịch Sử Mượn"
        component={BorrowHistory}
        options={{
          drawerIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Icon name="history" color={focused ? '#ffffff' : color} size={22} />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="Thông Tin Cá Nhân"
        component={Profile}
        options={{
          drawerIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Icon name="account-circle-outline" color={focused ? '#ffffff' : color} size={22} />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="Hỗ trợ"
        component={ChatScrees}
        options={{
          drawerIcon: ({ color, size, focused }) => (
            <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
              <Icon name="headset" color={focused ? '#ffffff' : color} size={22} />
            </View>
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  gradientHeader: {
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  scrollContent: {
    paddingTop: 0,
  },
  menuSection: {
    paddingTop: 20,
    paddingHorizontal: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    letterSpacing: 1,
    marginLeft: 16,
    marginBottom: 12,
  },
  drawerItem: {
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: 12,
    paddingLeft: 8,
  },
  drawerLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: -8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  iconContainerActive: {
    backgroundColor: COLORS.active,
    shadowColor: COLORS.active,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.cardBackground,
  },
  logoutButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.logout,
    marginLeft: 8,
  },
  loginButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  loginGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  loginText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.active,
    marginLeft: 8,
  },
});