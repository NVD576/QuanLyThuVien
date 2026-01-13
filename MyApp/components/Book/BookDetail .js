import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import APIs, { authApis, endpoints } from "../../configs/APIs";
import { MyUserContext } from "../../configs/MyContext";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from "@react-navigation/native";

moment.locale('vi');

const COLORS = {
  primary: '#005A7A',
  lightPrimary: '#E0E8F0',
  background: '#F0F2F5',
  card: '#FFFFFF',
  text: '#333333',
  textSecondary: '#666666',
  white: '#FFFFFF',
  green: '#28A745',
  red: '#DC3545',
  disabled: '#D1D5DB',
  star: '#FFC107', 
};

const StarDisplay = ({ rating = 0, size = 16, style }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5; 
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center' }, style]}>
      {[...Array(fullStars)].map((_, i) => <Icon key={`full_${i}`} name="star" size={size} color={COLORS.star} />)}
      {halfStar && <Icon key="half" name="star-half-full" size={size} color={COLORS.star} />}
      {[...Array(emptyStars)].map((_, i) => <Icon key={`empty_${i}`} name="star-outline" size={size} color={COLORS.star} />)}
    </View>
  );
};

const BookDetail = ({ route }) => {
  const { bookId } = route.params;
  const [book, setBook] = useState(null);
  const [comments, setComments] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [userRating, setUserRating] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [borrowing, setBorrowing] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = useContext(MyUserContext);
  const navigation = useNavigation();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await AsyncStorage.getItem("token");
      const client = token ? authApis(token) : APIs;

      const [bookRes, commentsRes, avgRatingRes] = await Promise.all([
        client.get(endpoints['book-id'](bookId)),
        client.get(endpoints['comment-bookId'](bookId)),
        client.get(endpoints['rating-book-average'](bookId))
      ]);

      setBook(bookRes.data);
      setComments(commentsRes.data);
      setAverageRating(avgRatingRes.data || 0);

      if (user && user.id && token) {
        try {
          const userRatingRes = await authApis(token).get(endpoints['rating-book-user'](bookId, user.id));
          setUserRating(userRatingRes.data || null);
          setNewRating(userRatingRes.data?.ratingValue || 0);
        } catch (e) {
          setUserRating(null);
          setNewRating(0);
        }
      } else {
        setUserRating(null);
        setNewRating(0);
      }
    } catch (err) {
      console.error("Failed to load data", err);
      setError("Không thể tải thông tin. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [bookId]);

  const handleBorrow = async () => {
    if (!user) {
      Alert.alert(
        "Yêu cầu đăng nhập",
        "Bạn cần đăng nhập để mượn sách.",
        [
          { text: "Huỷ" },
          { text: "Đăng nhập", onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }
    setBorrowing(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const userId = user.id;

      const printBookListRes = await authApis(token).get(endpoints["printBook-bookid"](book.id));
      const availablePrintBook = printBookListRes.data?.find(pb => pb.status?.toLowerCase() === "available");

      if (!availablePrintBook) {
        Alert.alert("Thông báo", "Hiện không có bản in nào khả dụng để mượn.");
        return;
      }

      const payload = {
        userId: parseInt(userId),
        printBookId: availablePrintBook.id,
        status: "Pending",
        borrowDate: moment().toISOString()
      };

      await authApis(token).post(endpoints["borrow-add"], payload);
      Alert.alert("Thành công", "Đăng ký mượn thành công! Vui lòng chờ thủ thư xác nhận.");
      fetchData();
    } catch (err) {
      Alert.alert("Thất bại", "Không thể đăng ký mượn: " + (err.response?.data || err.message));
    } finally {
      setBorrowing(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      Alert.alert(
        "Yêu cầu đăng nhập",
        "Bạn cần đăng nhập để gửi đánh giá/bình luận.",
        [
          { text: "Huỷ" },
          { text: "Đăng nhập", onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }
    if (!userRating && newRating === 0) {
      Alert.alert("Lỗi", "Vui lòng chọn số sao để đánh giá.");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = await AsyncStorage.getItem("token");

      const commentPayload = {
        bookId: bookId,
        userId: user.id,
        commentText: newComment,
        commentDate: moment().toISOString(),
      };

      const promises = [authApis(token).post(endpoints['comment-add'], commentPayload)];

      if (!userRating) {
        const ratingPayload = {
          bookId: bookId,
          userId: user.id,
          ratingValue: newRating,
          ratingDate: moment().toISOString()
        };
        promises.push(authApis(token).post(endpoints['rating-add'], ratingPayload));
      }

      await Promise.all(promises);

      Alert.alert("Thành công", "Cảm ơn bạn đã gửi đánh giá!");
      setNewComment("");
      if (!userRating) setNewRating(0);
      fetchData();
    } catch (err) {
      console.error("Submit review failed", err.response?.data || err.message);
      Alert.alert("Thất bại", "Không thể gửi đánh giá/bình luận.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />;
  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchData}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  if (!book) return null;

  const isAvailable = book.availableCopies > 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: book.image || "https://via.placeholder.com/200x300?text=No+Image" }}
            style={styles.bookCover}
            resizeMode="contain"
          />
        </View>

        <View style={styles.detailsContainer}>
          <View style={[styles.statusBadge, { backgroundColor: isAvailable ? '#EAF7EE' : '#FDEDED' }]}>
            <Icon name={isAvailable ? "check-circle" : "close-circle"} size={16} color={isAvailable ? COLORS.green : COLORS.red} />
            <Text style={[styles.statusText, { color: isAvailable ? COLORS.green : COLORS.red }]}>
              {isAvailable ? "Sẵn sàng cho mượn" : "Đã hết"}
            </Text>
          </View>

          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>bởi {book.author || "Đang cập nhật"}</Text>

          <View style={styles.avgRatingContainer}>
            <StarDisplay rating={averageRating} size={20} />
            <Text style={styles.avgRatingText}>{averageRating.toFixed(1)}/5 ({comments.length} bình luận)</Text>
          </View>

          <View style={styles.metaGrid}>
            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>Nhà xuất bản</Text>
              <Text style={styles.metaValue}>{book.publisher || "N/A"}</Text>
            </View>
            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>Năm XB</Text>
              <Text style={styles.metaValue}>{book.publicationYear || "N/A"}</Text>
            </View>
            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>Còn lại</Text>
              <Text style={styles.metaValue}>{book.availableCopies}/{book.totalCopies}</Text>
            </View>
          </View>

          {book.categories?.length > 0 && (
            <View style={styles.sectionNoBorder}>
              <Text style={styles.sectionTitle}>Thể loại</Text>
              <View style={styles.categoryContainer}>
                {book.categories.map((cat) => (
                  <View key={cat.id} style={styles.categoryTag}>
                    <Text style={styles.categoryText}>{cat.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.sectionNoBorder}>
            <Text style={styles.sectionTitle}>Mô tả</Text>
            <Text style={styles.description}>{book.description || "Không có mô tả."}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Đánh giá & Bình luận</Text>

            {user ? (
              <View style={styles.addReviewContainer}>
                <Text style={styles.addReviewTitle}>Để lại đánh giá của bạn</Text>

                <View style={styles.starInputContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity 
                      key={star} 
                      onPress={() => !userRating && setNewRating(star)}
                    >
                      <Icon 
                        name={star <= newRating ? "star" : "star-outline"} 
                        size={32} 
                        color={COLORS.star} 
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                {userRating && <Text style={{textAlign:'center', color:COLORS.textSecondary, marginBottom:8}}>Bạn đã đánh giá {userRating.ratingValue} sao</Text>}

                <TextInput
                  style={styles.commentInput}
                  placeholder="Viết bình luận của bạn..."
                  placeholderTextColor={COLORS.textSecondary}
                  value={newComment}
                  onChangeText={setNewComment}
                  multiline
                />
                <TouchableOpacity 
                  style={[styles.submitButton, isSubmitting && styles.disabledButton]}
                  onPress={handleSubmitReview}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color={COLORS.white} />
                  ) : (
                    <Text style={styles.submitButtonText}>Gửi</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.loginPrompt}>
                <Text style={styles.loginPromptText}>Đăng nhập để đánh giá và bình luận.</Text>
                <TouchableOpacity style={styles.loginPromptButton} onPress={() => navigation.navigate('Login')}>
                  <Icon name="login" size={18} color={COLORS.primary} />
                  <Text style={styles.loginPromptButtonText}>Đăng nhập</Text>
                </TouchableOpacity>
              </View>
            )}

            {comments.length === 0 ? (
              <Text style={styles.noCommentsText}>Chưa có bình luận nào. Hãy là người đầu tiên!</Text>
            ) : (
              comments.map((comment) => (
                <View key={comment.id} style={styles.reviewItem}>
                  <Image source={{ uri: comment.user.avatar || 'https://www.gravatar.com/avatar/?d=mp' }} style={styles.reviewAvatar} />
                  <View style={styles.reviewContent}>
                    <View style={styles.reviewHeader}>
                      <Text style={styles.reviewUser}>{comment.user.firstName} {comment.user.lastName}</Text>
                      <Text style={styles.reviewDate}>{moment(comment.commentDate).format("DD/MM/YYYY HH:mm")}</Text>
                    </View>
                    <Text style={styles.reviewText}>{comment.commentText}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {user ? (
          <TouchableOpacity
            style={[styles.borrowButton, (!isAvailable || borrowing) && styles.disabledButton]}
            onPress={handleBorrow}
            disabled={!isAvailable || borrowing}
          >
            {borrowing ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Icon name="book-plus-outline" size={22} color={COLORS.white} />
                <Text style={styles.borrowButtonText}>Đặt Mượn Sách</Text>
              </>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.loginBorrowButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Icon name="login" size={20} color={COLORS.primary} />
            <Text style={styles.loginBorrowButtonText}>Đăng nhập để mượn sách</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: COLORS.red, textAlign: 'center' },
  retryButton: { backgroundColor: COLORS.primary, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginTop: 12 },
  retryButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '600' },
  
  imageContainer: {
    backgroundColor: COLORS.lightPrimary,
    paddingVertical: 20,
    alignItems: 'center',
  },
  bookCover: {
    width: 200,
    height: 300,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  detailsContainer: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    padding: 24,
    paddingBottom: 120,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    marginBottom: 16,
  },
  statusText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  author: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  avgRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avgRatingText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  metaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  metaBox: {
    alignItems: 'center',
    flex: 1,
  },
  metaLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  section: {
    marginTop: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingTop: 16,
  },
  sectionNoBorder: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryTag: {
    backgroundColor: COLORS.lightPrimary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
    color: COLORS.textSecondary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 30, // Thêm padding cho các thiết bị có tai thỏ
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  borrowButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  borrowButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  addReviewContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  addReviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  starInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 10,
  },
  commentInput: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
    fontSize: 15,
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginPrompt: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginPromptText: {
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  loginPromptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F0F6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  loginPromptButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: 8,
  },
  reviewItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewContent: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewUser: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  reviewDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  reviewText: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  noCommentsText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: COLORS.disabled,
  },
  loginBorrowButton: {
    backgroundColor: '#E6F0F6',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  loginBorrowButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default BookDetail;