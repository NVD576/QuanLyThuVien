USE librarydb;

INSERT INTO Category (CategoryName, Description) VALUES
('Khoa học viễn tưởng', 'Sách về khoa học viễn tưởng và tương lai'),
('Trinh thám', 'Sách trinh thám, điều tra phá án'),
('Lịch sử', 'Sách về lịch sử các thời kỳ'),
('Kỹ năng sống', 'Sách phát triển bản thân và kỹ năng'),
('Kinh tế', 'Sách về kinh tế và tài chính'),
('Văn học', 'Tác phẩm văn học kinh điển và đương đại');

INSERT INTO Author (AuthorName, Biography, BirthYear) VALUES
('Nguyễn Nhật Ánh', 'Nhà văn Việt Nam chuyên viết cho tuổi mới lớn', 1955),
('George Orwell', 'Tiểu thuyết gia người Anh nổi tiếng với các tác phẩm phê phán xã hội', 1903),
('J.K. Rowling', 'Tác giả bộ truyện Harry Potter nổi tiếng', 1965),
('Dale Carnegie', 'Tác giả nổi tiếng với sách self-help', 1888),
('Adam Khoo', 'Doanh nhân, tác giả sách về thành công', 1974),
('Ngô Tất Tố', 'Nhà văn hiện thực phê phán Việt Nam', 1894);

INSERT INTO Book (Title, Publisher, PublicationYear, CategoryID, TotalCopies, AvailableCopies, Status, Description, Price) VALUES
('Cho tôi xin một vé đi tuổi thơ', 'NXB Trẻ', 2008, 6, 10, 8, 'Available', 'Truyện dài của Nguyễn Nhật Ánh', 75000),
('1984', 'Penguin Books', 1949, 1, 5, 3, 'Available', 'Tiểu thuyết dystopian của George Orwell', 120000),
('Harry Potter và Hòn đá Phù thủy', 'Bloomsbury', 1997, 1, 8, 5, 'Available', 'Tập đầu bộ truyện Harry Potter', 150000),
('Đắc Nhân Tâm', 'NXB Tổng hợp TP.HCM', 1936, 4, 12, 10, 'Available', 'Sách self-help kinh điển', 80000),
('Tôi tài giỏi, bạn cũng thế!', 'NXB Phụ nữ', 1998, 4, 7, 6, 'Available', 'Sách về phương pháp học tập', 95000),
('Tắt đèn', 'NXB Văn học', 1939, 6, 5, 4, 'Available', 'Tiểu thuyết hiện thực phê phán', 65000);

INSERT INTO Book_Author (BookID, AuthorID) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6);

INSERT INTO User (FullName, Email, Password, Phone, Address, DateOfBirth, Role, Status) VALUES
('Admin Quản trị', 'admin@library.com', '$2a$10$XptfskLsT1l/bRTLRiiCgejHqOpgXFreUnNUa35gJdCr2v2QbVFzu', '0987654321', '123 Đường ABC, TP.HCM', '1980-01-01', 'Admin', 'Active'),
('Thủ thư Ngọc', 'librarian@library.com', '$2a$10$XptfskLsT1l/bRTLRiiCgejHqOpgXFreUnNUa35gJdCr2v2QbVFzu', '0912345678', '456 Đường XYZ, TP.HCM', '1985-05-15', 'Librarian', 'Active'),
('Thành viên A', 'member1@email.com', '$2a$10$XptfskLsT1l/bRTLRiiCgejHqOpgXFreUnNUa35gJdCr2v2QbVFzu', '0901234567', '789 Đường DEF, TP.HCM', '1995-10-20', 'Member', 'Active'),
('Thành viên B', 'member2@email.com', '$2a$10$XptfskLsT1l/bRTLRiiCgejHqOpgXFreUnNUa35gJdCr2v2QbVFzu', '0913456789', '321 Đường GHI, TP.HCM', '1990-03-25', 'Member', 'Active');

INSERT INTO Borrow (UserID, BookID, BorrowDate, DueDate, ReturnDate, Status) VALUES
(3, 1, '2023-05-01', '2023-05-15', '2023-05-14', 'Returned'),
(3, 2, '2023-05-10', '2023-05-24', NULL, 'Borrowed'),
(4, 3, '2023-05-05', '2023-05-19', NULL, 'Borrowed'),
(4, 4, '2023-04-20', '2023-05-04', '2023-05-03', 'Returned');

INSERT INTO Fine (BorrowID, UserID, Amount, Reason, IssueDate, PaidDate, Status) VALUES
(1, 3, 50000, 'Trả sách bị rách trang 50', '2023-05-14', '2023-05-15', 'Paid'),
(4, 4, 20000, 'Quá hạn 1 ngày', '2023-05-04', NULL, 'Pending');