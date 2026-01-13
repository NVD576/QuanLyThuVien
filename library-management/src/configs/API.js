import axios from "axios";
import cookie from "js-cookie";

export const BASE_URL = "http://localhost:8080/api/"

export const endpoints = {
  'categories': '/categories',
  'category-add': '/categories/add',
  'category-update': '/categories/update',
  'category-delete': (id) => `/categories/${id}/delete`,

  'books': '/books',
  'book-all': '/book/all',
  'book-id':(id)=> `/books/${id}`,
  'book-add': '/books/add',
  'book-update': '/books/update',
  'book-delete': (id) => `/books/${id}/delete`,

  'printBooks': '/printBooks',
  'printBook-id':(id) => `/printBook/${id}`,
  'printBook-bookid':(id) => `/printBook/${id}/bookId`,
  'printBook-add': '/printBook/add',
  'printBook-update': '/printBook/update',
  'printBook-delete' : (id) => `/printBook/${id}/delete`,

  'login': '/login',
  'users': '/users',
  'current-user': '/secure/profile',
  'update-profile': (id) => `/users/${id}/update`,
  'user-delete': (id) => `/users/${id}/delete`,
  'register': '/register',

  "admins": "/admins",
  'admin-detail': (id) => `/admins/${id}`,
  'admin-add': "/admins/add",
  'admin-update': '/admins/update',
  'admin-delete': (id) => `/admins/${id}/delete`,

  "librarians": "/librarians",
  'librarian-detail': (id) => `/librarian/${id}`,
  'librarian-add': "/librarian/add",
  'librarian-update': '/librarian/update',
  'librarian-delete': (id) => `/librarian/${id}/delete`,

  'members': '/readers',
  'member-add': '/reader/add',
  'member-update': '/reader/update',
  'member-detail': (id) => `/reader/${id}`,
  'member-upgrade': "/reader/upgradeLevel",

  'borrows': '/borrows',
  'borrow-add': '/borrow/add',
  'borrow-update':  `/borrow/update`,
  'borrow-user': (id) => `/borrow/${id}/userid`,
  'borrow-delete': (id) => `/borrow/${id}/delete`,
  'borrow-search': `/borrow/search`,    

  'fines': '/fines',                    
  'fine-id': (id) => `/fine/${id}`,  
  'fine-user':(id) =>`/fine/${id}/user`,    
  'fine-borrow':(id) =>`/fine/${id}/borrow`,
  'fine-add': '/fine/add',              
  'fine-update': '/fine/update',         
  'fine-delete': (id) => `/fine/${id}/delete`,

  'comments': '/comments',
  'comment-id': (id) => `/comment/${id}`,
  'comment-bookId': (id) => `/comment/${id}/bookId`,
  'comment-add': '/comment/add',
  'comment-update': '/comment/update',
  'comment-delete': (id) => `/comment/${id}/delete`,

  'ratings': '/ratings',                       
  'rating-id': (id) => `/rating/${id}`,          
  'rating-add': '/rating/add',                  
  'rating-update': '/rating/update',            
  'rating-delete': (id) => `/rating/${id}/delete`,
  'rating-book-average': (id) => `/rating/${id}/average`,

  'payments': '/payments',
  'payment-id': (id) => `/payment/${id}`,
  'payment-bookId': (id) => `/payment/${id}/userId`,
  'payment-add': '/payment/add',
  'payment-update': '/payment/update',
  'payment-delete': (id) => `/payment/${id}/delete`,
  
  "payment-create": "/payment/create",

  "statistics": '/statistics',
  
}

export const authApis = () => {
  const token = cookie.get("token");
  return axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default axios.create({
  baseURL: BASE_URL,
});