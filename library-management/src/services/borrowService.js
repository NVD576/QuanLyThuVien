import axios from 'axios';

const API_URL = 'http://localhost:5000/api/borrows';

export const getBorrows = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching borrows:', error);
    throw error;
  }
};

export const borrowBook = async (borrowData) => {
  try {
    const response = await axios.post(API_URL, borrowData);
    return response.data;
  } catch (error) {
    console.error('Error borrowing book:', error);
    throw error;
  }
};

export const returnBook = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/return`);
    return response.data;
  } catch (error) {
    console.error('Error returning book:', error);
    throw error;
  }
};
