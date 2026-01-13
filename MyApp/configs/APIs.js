import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASE_URL = "http://10.0.2.2:8080/api"

export const endpoints = {
  'categories': '/categories',

  'books': '/books',
  'book-all': '/book/all',
  'book-id':(id)=> `/books/${id}`,

  'printBooks': '/printBooks',
  'printBook-id':(id) => `/printBook/${id}`,
  'printBook-bookid':(id) => `/printBook/${id}/bookId`,
  'printBook-add': '/printBook/add',

  'login': '/login',
  'current-user': '/secure/profile',
  'update-profile': (id) => `/users/${id}/update`,
  'user-delete': (id) => `/users/${id}/delete`,
  'register': '/register',
  'changePassword': "/secure/change-password",

  'members': '/readers',
  'member-add': '/reader/add',
  'member-update': '/reader/update',
  'member-detail': (id) => `/reader/${id}`,

  'borrows': '/borrows',
  'borrow-add': '/borrow/add',
  'borrow-update':  `/borrow/update`,
  'borrow-user': (id) => `/borrow/${id}/userid`,
  'borrow-search': `/borrow/search`,    
  'borrow-user-register' : (id) => `/borrow/user/${id}/register`,
  'borrow-cancel' : (id) => `/borrow/${id}/cancel`,

  'fines': '/fines',                    
  'fine-id': (id) => `/fine/${id}`,  
  'fine-user':(id) =>`/fine/${id}/user`,    
  'fine-add': '/fine/add',              

  'comments': '/comments',
  'comment-bookId': (id) => `/comment/${id}/bookId`,
  'comment-add': '/comment/add',
  'comment-update': '/comment/update',

  'ratings': '/ratings',                       
  'rating-add': '/rating/add',                
  'rating-book-average': (id) => `/rating/${id}/average`,
  'rating-book': (id) => `/ratings/book/${id}`,
  'rating-book-user': (bookId, userId) => `/rating/${bookId}/user/${userId}`,
}

export const authApis = (token) => {
  return axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export default axios.create({
    baseURL: BASE_URL
});