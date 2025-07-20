// src/data/mockData.js
export const initialBooks = [
  { id: 1, title: 'Nhà Giả Kim', author: 'Paulo Coelho', genre: 'Tiểu thuyết', quantity: 10 },
  { id: 2, title: 'Đắc Nhân Tâm', author: 'Dale Carnegie', genre: 'Kỹ năng sống', quantity: 5 },
  { id: 3, title: 'Clean Code', author: 'Robert C. Martin', genre: 'Lập trình', quantity: 7 },
  { id: 4, title: 'Lược sử loài người', author: 'Yuval Noah Harari', genre: 'Lịch sử', quantity: 8 },
];

export const initialMembers = [
  { id: 101, name: 'Nguyễn Văn A', email: 'a.nv@example.com', joinDate: '2023-01-15' },
  { id: 102, name: 'Trần Thị B', email: 'b.tt@example.com', joinDate: '2023-02-20' },
];

export const initialBorrows = [
    { id: 1001, bookId: 3, memberId: 101, borrowDate: '2024-05-01', dueDate: '2024-05-15', status: 'Đang mượn' },
    { id: 1002, bookId: 1, memberId: 102, borrowDate: '2024-04-20', dueDate: '2024-05-04', status: 'Đã trả' },
];
