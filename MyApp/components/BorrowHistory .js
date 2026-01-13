import React, { useEffect, useState, useCallback, useContext } from "react";
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  RefreshControl, 
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../configs/APIs";
import dayjs from "dayjs";
import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';
import { MyUserContext } from "../configs/MyContext";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from "@react-navigation/native";

dayjs.extend(relativeTime);
dayjs.locale('vi');

const COLORS = {
  background: '#FDF6E3',
  card: '#FFFBF2',
  text: '#5C5346',
  textSecondary: '#8E806A',
  primary: '#005A7A',
  green: '#2E7D32',
  red: '#C62828',
  orange: '#EF6C00',
  separator: '#EAE0C8',
  shadow: '#BBAA91',
};

const getStatusInfo = (item) => {
  if (item.status === 'Returned') {
    return { text: 'Đã trả', color: COLORS.green, icon: 'book-check-outline' };
  }
  if (item.status === 'Cancelled') {
    return { text: 'Đã bị từ chối', color: COLORS.red, icon: 'close-circle-outline' };
  }
  if (item.status === 'Pending') {
    return { text: 'Đang yêu cầu', color: COLORS.shadow, icon: 'clock-outline' };
  }
  if (dayjs().isAfter(dayjs(item.dueDate))) {
    return { text: 'Quá hạn', color: COLORS.red, icon: 'book-alert-outline' };
  }
  return { text: 'Đang mượn', color: COLORS.primary, icon: 'book-clock-outline' };
};


const HistoryItem = ({ item }) => {
  const statusInfo = getStatusInfo(item);
  return (
    <View style={styles.card}>
      <View style={[styles.cardIconContainer, { backgroundColor: statusInfo.color }]}>
        <Icon name={statusInfo.icon} size={28} color="#fff" />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.bookTitle} numberOfLines={2}>{item.bookTitle}</Text>
        <View style={styles.dateRow}>
          <Text style={styles.dateText}>Mượn: {dayjs(item.borrowDate).format("DD/MM/YYYY")}</Text>
          <Text style={styles.dateText}>Hạn trả: {dayjs(item.dueDate).format("DD/MM/YYYY")}</Text>
        </View>
        {item.returnDate && (
          <Text style={styles.returnDateText}>
            Đã trả vào {dayjs(item.returnDate).format("DD/MM/YYYY")}
          </Text>
        )}
      </View>
      <View style={[styles.statusBadge, { backgroundColor: `${statusInfo.color}20` }]}>
        <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.text}</Text>
      </View>
    </View>
  );
};

const BorrowHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const user = useContext(MyUserContext);
  const navigation = useNavigation();
  const fetchHistory = async () => {
    if (!loading) setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await authApis(token).get(endpoints["borrow-user"](user.id));
      setHistory(res.data.sort((a, b) => dayjs(b.borrowDate).diff(dayjs(a.borrowDate))) || []);
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử mượn:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(user) {
        fetchHistory();
    }
  }, [user]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHistory().finally(() => setRefreshing(false));
  }, []);

  const renderEmpty = () => (
    <View style={styles.centered}>
      <Icon name="history" size={80} color={COLORS.separator} />
      <Text style={styles.emptyTitle}>Chưa có lịch sử</Text>
      <Text style={styles.emptySubtitle}>
        Mọi cuốn sách bạn mượn sẽ được ghi lại ở đây.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Lịch Sử Mượn Sách</Text>
      </View>
      {!user ? (
        <View style={styles.centered}>
          <Icon name="account-lock-outline" size={80} color={COLORS.separator} />
          <Text style={styles.emptyTitle}>Bạn chưa đăng nhập</Text>
          <Text style={styles.emptySubtitle}>Vui lòng đăng nhập để xem lịch sử mượn sách của bạn.</Text>
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
          data={history}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <HistoryItem item={item} />}
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

export default BorrowHistory;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: 'serif',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 8,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  returnDateText: {
    fontSize: 13,
    color: COLORS.green,
    fontWeight: '500',
    marginTop: 4,
  },
  statusBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
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
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});
