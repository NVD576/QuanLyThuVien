import axios from "axios";
import cookie from "js-cookie";

export const BASE_URL = "http://localhost:8080/api/"

export const endpoints = {
    'categories': '/categories',
    'category-add': '/categories/add',
    'category-update': '/categories/update',
    'category-delete': (id) => `/categories/${id}/delete`,

    'books': '/books',
    'book-add': '/books/add',
    'book-update': '/books/update',
    'book-delete': (id) => `/books/${id}/delete`,

    'printBooks': '/printBooks',
    'printBook-id':(id) => `/printBook/${id}`,
    'printBook-bookid':(id) => `/printBook/${id}/bookId`,
    'printBook-add': '/printbook/add',
    'printBook-update': '/printBook/update',
    'printBook-delete' : (id) => `/printBook/${id}/delete`,

    'login': '/login',
    'current-user': '/secure/profile',
    'update-profile': (id) => `/users/${id}/update`,
    'user-delete': (id) => `/users/${id}/delete`,
    'register': '/register',

    "admins": "/admins",
    'admin-detail': (id) => `/admins/${id}`,
    'admin-add': "/admins/add",
    'admin-update': '/admins/update',
    'admin-delete': (id) => `/admins/${id}/delete`,

    'members': '/readers',
    'member-add': '/reader/add',
    'customers-by-id': (id) => `/users/${id}`,

    'borrows': '/borrows',
    'borrow-add': '/borrow/add',
    'borrow-update':  `/borrow/update`,
    'borrow-user': (id) => `/borrow/${id}/userid`,
    'borrow-delete': (id) => `/borrow/${id}/delete`,
    'borrow-search': `/borrow/search`,    


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