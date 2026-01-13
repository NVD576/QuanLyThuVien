import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../configs/APIs";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { MyUserContext } from "../configs/MyContext";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

dayjs.locale("vi");

const COLORS = {
  background: "#FDF6E3",
  card: "#FFFBF2",
  text: "#5C5346",
  textSecondary: "#8E806A",
  primary: "#005A7A",
  blue: "#1E88E5",
  orange: "#EF6C00",
  red: "#C62828",
  separator: "#EAE0C8",
  shadow: "#BBAA91",
};

const getStatusInfo = (status) => {
  if (status === "Pending") {
    return {
      text: "Chờ duyệt",
      color: COLORS.orange,
      icon: "book-clock-outline",
    };
  }
  return {
    text: "Đang mượn",
    color: COLORS.blue,
    icon: "book-account-outline",
  };
};

const BorrowItem = ({ item, onCancel }) => {
  const statusInfo = getStatusInfo(item.status);
  return (
    <View style={styles.card}>
      <View
        style={[
          styles.cardIconContainer,
          { backgroundColor: statusInfo.color },
        ]}
      >
        <Icon name={statusInfo.icon} size={28} color="#fff" />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.bookTitle} numberOfLines={2}>
          {item.bookTitle}
        </Text>
        <Text style={styles.dateText}>
          {item.status === "Pending" ? "Ngày đăng ký" : "Ngày mượn"}:{" "}
          {dayjs(item.borrowDate).format("DD/MM/YYYY")}
        </Text>
        {item.status !== "Pending" && (
          <Text style={styles.dateText}>
            Hạn trả dự kiến: {dayjs(item.dueDate).format("DD/MM/YYYY")}
          </Text>
        )}

        {item.status === "Pending" && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => onCancel(item.id)}
          >
            <Icon name="cancel" size={16} color={COLORS.red} />
            <Text style={styles.cancelButtonText}>Hủy đăng ký</Text>
          </TouchableOpacity>
        )}
      </View>
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: `${statusInfo.color}20` },
        ]}
      >
        <Text style={[styles.statusText, { color: statusInfo.color }]}>
          {statusInfo.text}
        </Text>
      </View>
    </View>
  );
};

const CurrentBorrows = () => {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const user = useContext(MyUserContext);
  const navigation = useNavigation();

  const loadBorrows = async () => {
    if (!loading) setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await authApis(token).get(
        endpoints["borrow-user-register"](user.id)
      );
      setBorrows(
        res.data.sort((a, b) =>
          dayjs(b.borrowDate).diff(dayjs(a.borrowDate))
        ) || []
      );
    } catch (error) {
      console.error("Failed to load current borrows", error);
      setBorrows([]);
    } finally {
      setLoading(false);
    }
  };

  const cancelBorrow = async (borrowId) => {
    Alert.alert(
      "Xác nhận hủy",
      "Bạn có chắc muốn hủy đăng ký mượn sách này không?",
      [
        { text: "Không", style: "cancel" },
        {
          text: "Hủy",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              await authApis(token).patch(endpoints["borrow-cancel"](borrowId));
              loadBorrows();
              Alert.alert("Thành công", "Đã hủy đăng ký mượn sách.");
            } catch (error) {
              console.error("Failed to cancel borrow", error);
              Alert.alert("Lỗi", "Không thể hủy đăng ký. Vui lòng thử lại.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

useFocusEffect(
  useCallback(() => {
    if (user) {
      loadBorrows();
    }
  }, [user])
);


  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadBorrows().finally(() => setRefreshing(false));
  }, []);

  const renderEmpty = () => (
    <View style={styles.centered}>
      <Icon
        name="book-remove-multiple-outline"
        size={80}
        color={COLORS.separator}
      />
      <Text style={styles.emptyTitle}>Không có sách</Text>
      <Text style={styles.emptySubtitle}>
        Các sách bạn đang mượn hoặc chờ duyệt sẽ xuất hiện ở đây.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Sách Của Bạn</Text>
      </View>
      {!user ? (
        <View style={styles.centered}>
          <Icon
            name="account-lock-outline"
            size={80}
            color={COLORS.separator}
          />
          <Text style={styles.emptyTitle}>Bạn chưa đăng nhập</Text>
          <Text style={styles.emptySubtitle}>
            Vui lòng đăng nhập để xem sách bạn đang mượn hoặc chờ duyệt.
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.primaryButtonText}>Đăng nhập</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.secondaryButtonText}>Đăng ký</Text>
          </TouchableOpacity>
        </View>
      ) : loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={borrows}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <BorrowItem item={item} onCancel={cancelBorrow} />
          )}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default CurrentBorrows;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.text,
    fontFamily: "serif",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 14,
  },
  dateText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  statusBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginTop: 8,
    backgroundColor: `${COLORS.red}1A`,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: COLORS.red,
    fontWeight: "bold",
    fontSize: 13,
    marginLeft: 6,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.text,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
