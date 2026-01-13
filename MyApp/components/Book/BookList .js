import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { authApis, endpoints } from "../../configs/APIs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const COLORS = {
  primary: "#005A7A",
  lightPrimary: "#E0E8F0",
  background: "#F0F2F5",
  card: "#FFFFFF",
  text: "#333333",
  textSecondary: "#777777",
  inactive: "#E5E7EB",
  white: "#FFFFFF",
  black: "#000000",
  available: "#28A745",
  unavailable: "#DC3545",
};
const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

const BookCard = React.memo(({ item, navigation }) => (
  <TouchableOpacity
    style={styles.cardContainer}
    onPress={() => navigation.navigate("BookDetail", { bookId: item.id })}
  >
    <Image
      source={{
        uri: item.image || "https://via.placeholder.com/150x220?text=No+Image",
      }}
      style={styles.cardImage}
      resizeMode="cover"
    />
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.cardAuthor} numberOfLines={1}>
        {item.author || "Không rõ tác giả"}
      </Text>
      <View
        style={[
          styles.availabilityBadge,
          {
            backgroundColor:
              item.availableCopies > 0 ? COLORS.lightPrimary : "#FFEBEB",
          },
        ]}
      >
        <Text
          style={[
            styles.availabilityText,
            {
              color:
                item.availableCopies > 0 ? COLORS.primary : COLORS.unavailable,
            },
          ]}
        >
          {item.availableCopies > 0
            ? `Còn ${item.availableCopies} cuốn`
            : "Đã hết"}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
));

const BookList = ({ navigation, route }) => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBooks = async (isNewSearch = false) => {
    if (isNewSearch) setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const currentPage = isNewSearch ? 0 : page;
      const params = {
        page: currentPage,
        search: searchText,
        sort: "id,desc",
        ...(selectedCategory && { category: selectedCategory }),
      };
      const queryParams = new URLSearchParams(params);
      const res = await authApis(token).get(
        `${endpoints["books"]}?${queryParams}`
      );
      setBooks(
        (isNewSearch
          ? res.data.content
          : [...books, ...res.data.content]
        ).filter((b) => b.isActive === true)
      );

      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Failed to load books", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await authApis(token).get(endpoints["categories"]);
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBooks(true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (
        route.params?.selectedCategory &&
        route.params.selectedCategory !== selectedCategory
      ) {
        setSearchText("");
        setSelectedCategory(route.params.selectedCategory);
        navigation.setParams({ selectedCategory: undefined });
      }
    }, [route.params?.selectedCategory])
  );

  useEffect(() => {
    if (!loading) {
      setPage(0);
      fetchBooks(true);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (page > 0) fetchBooks(false);
  }, [page]);

  const handleSearch = () => {
    setPage(0);
    fetchBooks(true);
  };

  const handleSelectCategory = (categoryName) => {
    if (categoryName !== selectedCategory) {
      setSearchText("");
      setSelectedCategory(categoryName);
    }
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="book-off-outline" size={60} color={COLORS.textSecondary} />
      <Text style={styles.emptyText}>Không tìm thấy sách nào.</Text>
      <Text style={styles.emptySubText}>
        Vui lòng thử lại với từ khóa hoặc thể loại khác.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon
          name="magnify"
          size={24}
          color={COLORS.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Tìm sách theo tên hoặc tác giả..."
          placeholderTextColor={COLORS.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>
      <FlatList
        data={books}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <BookCard item={item} navigation={navigation} />
        )}
        numColumns={2}
        contentContainerStyle={styles.listContentContainer}
        ListHeaderComponent={
          <FlatList
            horizontal
            data={[{ id: null, name: "Tất cả" }, ...categories]}
            keyExtractor={(item) => item.id?.toString() || "all"}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  handleSelectCategory(
                    item.name === "Tất cả" ? null : item.name
                  )
                }
                style={[
                  styles.categoryPill,
                  selectedCategory === item.name ||
                  (selectedCategory === null && item.name === "Tất cả")
                    ? styles.activeCategoryPill
                    : {},
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === item.name ||
                    (selectedCategory === null && item.name === "Tất cả")
                      ? styles.activeCategoryText
                      : {},
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
          />
        }
        ListEmptyComponent={!loading ? renderEmpty : null}
        ListFooterComponent={
          loading && books.length > 0 ? (
            <ActivityIndicator
              size="large"
              color={COLORS.primary}
              style={{ margin: 20 }}
            />
          ) : null
        }
        onEndReached={() => {
          if (!loading && page < totalPages - 1) setPage((prev) => prev + 1);
        }}
        onEndReachedThreshold={0.5}
      />
      {loading && books.length === 0 && (
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
          style={StyleSheet.absoluteFill}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: COLORS.text },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 12,
    margin: 16,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 48, fontSize: 16, color: COLORS.text },
  categoryList: { paddingHorizontal: 16, paddingVertical: 12 },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: COLORS.inactive,
    borderRadius: 20,
  },
  activeCategoryPill: { backgroundColor: COLORS.primary },
  categoryText: { fontSize: 14, fontWeight: "500", color: COLORS.text },
  activeCategoryText: { color: COLORS.white },
  listContentContainer: { paddingBottom: 20, paddingLeft: 7 },
  cardContainer: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    margin: 8,
    elevation: 3,
    shadowColor: COLORS.black,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    overflow: "hidden",
  },
  cardImage: { width: "100%", height: CARD_WIDTH * 1.4 },
  cardContent: { padding: 12 },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 4,
  },
  cardAuthor: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 8 },
  availabilityBadge: {
    alignSelf: "flex-start",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  availabilityText: { fontSize: 12, fontWeight: "600" },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.textSecondary,
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: "center",
  },
});

export default BookList;
