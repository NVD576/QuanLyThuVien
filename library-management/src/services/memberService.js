import axios from 'axios';

const API_URL = 'http://localhost:5000/api/members';

export const getMembers = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching members:', error);
    throw error;
  }
};

export const addMember = async (memberData) => {
  try {
    const response = await axios.post(API_URL, memberData);
    return response.data;
  } catch (error) {
    console.error('Error adding member:', error);
    throw error;
  }
};

// Thêm các hàm update và delete tương tự
