USE librarydb;

-- Bảng category: Lưu thông tin thể loại sách
CREATE TABLE IF NOT EXISTS category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Bảng book: Lưu thông tin chung của sách
CREATE TABLE IF NOT EXISTS book (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author varchar(255) ,
	total_copies INT NOT NULL ,
    available_copies INT NOT NULL ,
    publisher VARCHAR(100),
    publication_year INT,
    image VARCHAR(255),
    description varchar(500),
    price DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT check_copies CHECK (available_copies <= total_copies)
);

-- Bảng ebook: Lưu thông tin đặc thù của sách điện tử
CREATE TABLE IF NOT EXISTS ebook (
    ebook_id INT PRIMARY KEY,
    book_id INT NOT NULL,
    file_format VARCHAR(50),
    file_size DECIMAL(10, 2),
    download_url VARCHAR(255) ,
    FOREIGN KEY (book_id) REFERENCES book(book_id) on delete cascade
);

-- Bảng print_book: Lưu thông tin sách in
CREATE TABLE IF NOT EXISTS print_book (
    print_book_id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT NOT NULL,
    status ENUM('Available', 'Borrowed') ,
    FOREIGN KEY (book_id) REFERENCES book(book_id) on delete cascade
);

-- Bảng book_category: nhiều thể loại cho một sách
CREATE TABLE IF NOT EXISTS book_category (
    book_id INT,
    category_id INT,
    PRIMARY KEY (book_id, category_id),
    FOREIGN KEY (book_id) REFERENCES book(book_id) on delete cascade,
    FOREIGN KEY (category_id) REFERENCES category(category_id) on delete cascade
);


-- Bảng user: người dùng hệ thống
CREATE TABLE IF NOT EXISTS user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    avatar VARCHAR(500),
    email VARCHAR(100) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    address VARCHAR(255),
    created_at DATETIME ,
    role ENUM('Admin', 'Librarian', 'Reader') ,
    is_active BOOLEAN DEFAULT TRUE
);

-- Các bảng phụ theo role
CREATE TABLE IF NOT EXISTS admin (
    admin_id INT PRIMARY KEY,
    FOREIGN KEY (admin_id) REFERENCES user(user_id) on delete cascade 
);

CREATE TABLE IF NOT EXISTS librarian (
    librarian_id INT PRIMARY KEY,
    start_date DATE NOT NULL,
    FOREIGN KEY (librarian_id) REFERENCES user(user_id) on delete cascade 
);

CREATE TABLE IF NOT EXISTS reader (
    reader_id INT PRIMARY KEY,
    membership_level ENUM('Basic', 'Premium') ,
    FOREIGN KEY (reader_id) REFERENCES user(user_id) on delete cascade 
);

-- Bảng rating
CREATE TABLE IF NOT EXISTS rating (
    rating_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    rating_value TINYINT NOT NULL CHECK (rating_value BETWEEN 1 AND 5),
    rating_date DATETIME ,
    FOREIGN KEY (user_id) REFERENCES user(user_id) on delete cascade,
    FOREIGN KEY (book_id) REFERENCES book(book_id) on delete cascade,
    CONSTRAINT unique_user_book_rating UNIQUE (user_id, book_id)
);

-- Bảng comment
CREATE TABLE IF NOT EXISTS comment (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    comment_text TINYTEXT ,
    comment_date DATETIME ,
    FOREIGN KEY (user_id) REFERENCES user(user_id) on delete cascade,
    FOREIGN KEY (book_id) REFERENCES book(book_id) on delete cascade
);

-- Bảng borrow
CREATE TABLE IF NOT EXISTS borrow (
    borrow_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
	print_book_id INT NOT NULL,
    borrow_date DATE ,
    due_date DATE ,
    return_date DATE,
    status ENUM('Pending','Cancelled','Borrowed', 'Returned', 'Overdue') ,
    FOREIGN KEY (user_id) REFERENCES user(user_id) on delete cascade,
    FOREIGN KEY (print_book_id) REFERENCES print_book(print_book_id) on delete cascade
);

-- Bảng fine
CREATE TABLE IF NOT EXISTS fine (
    fine_id INT AUTO_INCREMENT PRIMARY KEY,
    borrow_id INT NOT NULL,
    amount DECIMAL(10, 2),
    reason VARCHAR(255),
    paid_date DATE,
    status ENUM('Pending', 'Paid', 'Waived'),
    FOREIGN KEY (borrow_id) REFERENCES borrow(borrow_id) on delete cascade
);

CREATE TABLE IF NOT EXISTS payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    fine_id INT,  
    payment_type ENUM('Fine', 'Membership', 'Other') ,
    amount DECIMAL(10, 2) ,
    payment_method ENUM('Cash', 'CreditCard', 'BankTransfer', 'EWallet') ,
    payment_date DATETIME,
    status ENUM('Successful', 'Failed', 'Pending') ,
    note VARCHAR(255),

    FOREIGN KEY (user_id) REFERENCES user(user_id) on delete cascade,
    FOREIGN KEY (fine_id) REFERENCES fine(fine_id) on delete cascade
);



-- Trigger cập nhật số lượng sách khi mượn/trả
DELIMITER //

CREATE TRIGGER after_payment_insert
AFTER INSERT ON payment
FOR EACH ROW
BEGIN
    -- Nếu là thanh toán phạt và thành công
    IF NEW.payment_type = 'Fine' AND NEW.fine_id IS NOT NULL AND NEW.status = 'Successful' THEN
        UPDATE fine
        SET status = 'Paid',
            paid_date = NEW.payment_date
        WHERE fine_id = NEW.fine_id AND status = 'Pending';
    END IF;
END//

-- CREATE TRIGGER after_borrow_insert
-- AFTER INSERT ON borrow
-- FOR EACH ROW
-- BEGIN
--     -- Cập nhật trạng thái bản in
--     UPDATE print_book 
--     SET status = 'Borrowed'
--     WHERE print_book_id = NEW.print_book_id;
--     
--     -- Giảm số lượng sách có sẵn trong bảng book
--     UPDATE book b
--     JOIN print_book pb ON b.book_id = pb.book_id
--     SET b.available_copies = b.available_copies - 1
--     WHERE pb.print_book_id = NEW.print_book_id;
-- END//

-- CREATE TRIGGER after_borrow_update
-- AFTER UPDATE ON borrow
-- FOR EACH ROW
-- BEGIN
--     IF NEW.status = 'Returned' AND OLD.status != 'Returned' THEN
--         -- Cập nhật trạng thái bản in
--         UPDATE print_book 
--         SET status = 'Available'
--         WHERE print_book_id = NEW.print_book_id;
--         
--         -- Tăng số lượng sách có sẵn trong bảng book
--         UPDATE book b
--         JOIN print_book pb ON b.book_id = pb.book_id
--         SET b.available_copies = b.available_copies + 1
--         WHERE pb.print_book_id = NEW.print_book_id;
--     END IF;
-- END//
-- DELIMITER ;

-- Thêm dữ liệu vào bảng category
INSERT INTO category (name, description) VALUES
('Tiểu thuyết', 'Các tác phẩm văn học dài, thường là hư cấu'),
('Khoa học', 'Sách về các chủ đề khoa học tự nhiên và xã hội'),
('Lập trình', 'Sách về phát triển phần mềm và công nghệ thông tin'),
('Kinh doanh', 'Sách về quản lý, khởi nghiệp và tài chính'),
('Lịch sử', 'Sách về các sự kiện lịch sử');


-- Thêm dữ liệu vào bảng book (20 bản ghi)
INSERT INTO book 
(title, author, total_copies, available_copies, publisher, publication_year, image, description, price, is_active) 
VALUES
('Đắc Nhân Tâm', 'Dale Carnegie', 3, 3, 'NXB Tổng hợp TP.HCM', 1936, 'dac-nhan-tam.jpg', 'Nghệ thuật thu phục lòng người', 120000.00, 1),
('Nhà Giả Kim', 'Paulo Coelho', 3, 3, 'NXB Văn học', 1988, 'nha-gia-kim.jpg', 'Hành trình tìm kiếm vận mệnh', 95000.00, 1),
('Tuổi Trẻ Đáng Giá Bao Nhiêu', 'Rosie Nguyễn', 3, 3, 'NXB Hội Nhà Văn', 2016, 'tuoi-tre-dang-gia-bao-nhieu.jpg', 'Sách dành cho người trẻ', 85000.00, 1),
('Tôi Tài Giỏi Bạn Cũng Thế', 'Adam Khoo', 3, 3, 'NXB Phụ nữ', 2009, 'toi-tai-gioi.jpg', 'Phát triển bản thân', 110000.00, 1),
('Cà Phê Cùng Tony', 'Tony Buổi Sáng', 3, 3, 'NXB Trẻ', 2013, 'ca-phe-cung-tony.jpg', 'Những triết lý sống', 75000.00, 1),
('Đời Ngắn Đừng Ngủ Dài', 'Robin Sharma', 3, 3, 'NXB Thế giới', 2015, 'doi-ngan-dung-ngu-dai.jpg', 'Tận hưởng cuộc sống', 88000.00, 1),
('Bố Già', 'Mario Puzo', 3, 3, 'NXB Văn học', 1969, 'bo-gia.jpg', 'Tiểu thuyết kinh điển', 135000.00, 1),
('Sherlock Holmes Toàn Tập', 'Arthur Conan Doyle', 3, 3, 'NXB Kim Đồng', 1892, 'sherlock-holmes.jpg', 'Tuyển tập trinh thám', 250000.00, 1),
('Trên Đường Băng', 'Tony Buổi Sáng', 3, 3, 'NXB Trẻ', 2017, 'tren-duong-bang.jpg', 'Sách cho người trẻ khởi nghiệp', 90000.00, 1),
('Hạt Giống Tâm Hồn', 'Nhiều Tác Giả', 3, 3, 'NXB Tổng hợp TP.HCM', 2004, 'hat-giong-tam-hon.jpg', 'Tập hợp những câu chuyện ý nghĩa', 80000.00, 1),
('Đọc Vị Bất Kỳ Ai', 'David J. Lieberman', 3, 3, 'NXB Lao động', 2007, 'doc-vi-bat-ky-ai.jpg', 'Nghệ thuật thấu hiểu người khác', 150000.00, 1),
('Nghệ Thuật Tinh Tế Của Việc Đếch Quan Tâm', 'Mark Manson', 3, 3, 'NXB Thế giới', 2016, 'nghe-thuat-tinh-te.jpg', 'Cách sống thoải mái hơn', 110000.00, 1),
('Chiến Binh Cầu Vồng', 'Andrea Hirata', 3, 3, 'NXB Hội Nhà Văn', 2005, 'chien-binh-cau-vong.jpg', 'Câu chuyện cảm động về giáo dục', 95000.00, 1),
('Lược Sử Thời Gian', 'Stephen Hawking', 3, 3, 'NXB Trẻ', 1988, 'luoc-su-thoi-gian.jpg', 'Khám phá vũ trụ học', 180000.00, 1),
('Hoàng Tử Bé', 'Antoine de Saint-Exupéry', 3, 3, 'NXB Kim Đồng', 1943, 'hoang-tu-be.jpg', 'Tác phẩm văn học thiếu nhi kinh điển', 70000.00, 1),
('Clean Code', 'Robert C. Martin', 3, 3, 'Prentice Hall', 2008, 'clean-code.jpg', 'Sách lập trình dành cho developer', 350000.00, 1),
('Sapiens: Lược Sử Loài Người', 'Yuval Noah Harari', 3, 3, 'NXB Thế giới', 2011, 'sapiens.jpg', 'Lịch sử phát triển của nhân loại', 200000.00, 1),
('Atomic Habits', 'James Clear', 3, 3, 'Avery', 2018, 'atomic-habits.jpg', 'Xây dựng thói quen nhỏ để thành công lớn', 250000.00, 1),
('Những Người Khốn Khổ', 'Victor Hugo', 3, 3, 'NXB Văn học', 1862, 'nhung-nguoi-khon-kho.jpg', 'Tiểu thuyết kinh điển của Victor Hugo', 160000.00, 1),
('Trí Tuệ Do Thái', 'Eran Katz', 3, 3, 'NXB Lao động', 2010, 'tri-tue-do-thai.jpg', 'Khám phá bí quyết thành công', 120000.00, 1);

-- Thêm dữ liệu vào bảng book_category
INSERT INTO book_category (book_id, category_id) VALUES
(1, 4), (2, 1), (3, 4), (4, 4), (5, 1),
(6, 4), (7, 1), (8, 1), (9, 4), (10, 4),
(11, 4), (12, 4), (13, 1), (14, 2), (15, 1),
(16, 3), (17, 2), (18, 4), (19, 1), (20, 4);



-- Thêm dữ liệu vào bảng print_book (3 bản in cho mỗi sách)
INSERT INTO print_book (print_book_id, book_id, status) VALUES
-- Sách 1
(1, 1, 'Available'),
(2, 1, 'Available'),
(3, 1, 'Available'),

-- Sách 2
(4, 2, 'Available'),
(5, 2, 'Available'),
(6, 2, 'Available'),

-- Sách 3
(7, 3, 'Available'),
(8, 3, 'Available'),
(9, 3, 'Available'),

-- Sách 4
(10, 4, 'Available'),
(11, 4, 'Available'),
(12, 4, 'Available'),

-- Sách 5
(13, 5, 'Available'),
(14, 5, 'Available'),
(15, 5, 'Available'),

-- Sách 6
(16, 6, 'Available'),
(17, 6, 'Available'),
(18, 6, 'Available'),

-- Sách 7
(19, 7, 'Available'),
(20, 7, 'Available'),
(21, 7, 'Available'),

-- Sách 8
(22, 8, 'Available'),
(23, 8, 'Available'),
(24, 8, 'Available'),

-- Sách 9
(25, 9, 'Available'),
(26, 9, 'Available'),
(27, 9, 'Available'),

-- Sách 10
(28, 10, 'Available'),
(29, 10, 'Available'),
(30, 10, 'Available'),

-- Sách 11
(31, 11, 'Available'),
(32, 11, 'Available'),
(33, 11, 'Available'),

-- Sách 12
(34, 12, 'Available'),
(35, 12, 'Available'),
(36, 12, 'Available'),

-- Sách 13
(37, 13, 'Available'),
(38, 13, 'Available'),
(39, 13, 'Available'),

-- Sách 14
(40, 14, 'Available'),
(41, 14, 'Available'),
(42, 14, 'Available'),

-- Sách 15
(43, 15, 'Available'),
(44, 15, 'Available'),
(45, 15, 'Available'),

-- Sách 16
(46, 16, 'Available'),
(47, 16, 'Available'),
(48, 16, 'Available'),

-- Sách 17
(49, 17, 'Available'),
(50, 17, 'Available'),
(51, 17, 'Available'),

-- Sách 18
(52, 18, 'Available'),
(53, 18, 'Available'),
(54, 18, 'Available'),

-- Sách 19
(55, 19, 'Available'),
(56, 19, 'Available'),
(57, 19, 'Available'),

-- Sách 20
(58, 20, 'Available'),
(59, 20, 'Available'),
(60, 20, 'Available');

-- Thêm dữ liệu vào bảng user
INSERT INTO user (first_name, last_name, email, username, password, phone, address, role) VALUES
('Admin', 'System', 'admin@library.com', 'admin', '$2a$10$Okh2cGnAQ1jAGnUnxhEqluSm.FhhJn6JMMe7hOdGZjz2iaUjcdOMG', '0123456789', '123 Đường ABC', 'Admin'),
('Librarian', 'One', 'librarian1@library.com', 'librarian1', '$2a$10$Okh2cGnAQ1jAGnUnxhEqluSm.FhhJn6JMMe7hOdGZjz2iaUjcdOMG', '0987654321', '456 Đường XYZ', 'Librarian'),
('Nguyễn Văn', 'A', 'reader1@email.com', 'reader1', '$2a$10$Okh2cGnAQ1jAGnUnxhEqluSm.FhhJn6JMMe7hOdGZjz2iaUjcdOMG', '0901234567', '789 Đường QWE', 'Reader'),
('Trần Thị', 'B', 'reader2@email.com', 'reader2', '$2a$10$Okh2cGnAQ1jAGnUnxhEqluSm.FhhJn6JMMe7hOdGZjz2iaUjcdOMG', '0912345678', '321 Đường RTY', 'Reader'),
('Lê Văn', 'C', 'reader3@email.com', 'reader3', '$2a$10$Okh2cGnAQ1jAGnUnxhEqluSm.FhhJn6JMMe7hOdGZjz2iaUjcdOMG', '0923456789', '654 Đường UIO', 'Reader');

-- Thêm dữ liệu vào bảng admin
INSERT INTO admin (admin_id) VALUES (1);

-- Thêm dữ liệu vào bảng librarian
INSERT INTO librarian (librarian_id, start_date) VALUES (2, '2020-01-15');

-- Thêm dữ liệu vào bảng reader
INSERT INTO reader (reader_id, membership_level) VALUES 
(3, 'Basic'),
(4, 'Premium'),
(5, 'Basic');

-- Thêm dữ liệu vào bảng borrow
-- INSERT INTO borrow (user_id, print_book_id, borrow_date, due_date, return_date, status) VALUES
-- (3, 1, '2023-10-01', '2023-10-15', '2023-10-14', 'Returned'),
-- (3, 4, '2023-10-10', '2023-10-24', NULL, 'Borrowed'),
-- (4, 7, '2023-10-05', '2023-10-19', NULL, 'Overdue'),
-- (5, 10, '2023-10-15', '2023-10-29', NULL, 'Borrowed');

-- Thêm dữ liệu vào bảng rating
INSERT INTO rating (user_id, book_id, rating_value) VALUES
(3, 1, 5),
(4, 2, 4),
(5, 3, 5),
(3, 4, 4),
(4, 5, 3);

-- Thêm dữ liệu vào bảng comment
INSERT INTO comment (user_id, book_id, comment_text) VALUES
(3, 1, 'Truyện rất hay, đáng đọc'),
(4, 2, 'Truyện kinh dị đúng chất Stephen King'),
(5, 3, 'Sách rất hữu ích cho developer'),
(3, 4, 'Cuốn sách thay đổi cách nhìn về lịch sử loài người'),
(4, 5, 'Nội dung sâu sắc, dễ hiểu');

-- Thêm dữ liệu vào bảng fine
-- INSERT INTO fine (borrow_id, amount, reason, status) VALUES
-- (3,  50000.00, 'Trả sách quá hạn', 'Pending');

-- Thêm dữ liệu vào bảng payment: thanh toán phạt
-- INSERT INTO payment (user_id, fine_id, payment_type, amount, payment_method, status, note)
-- VALUES 
-- (4, 1, 'Fine', 50000.00, 'Cash', 'Successful', 'Thanh toán tiền phạt trả sách trễ');


-- Thêm dữ liệu thanh toán nâng cấp tài khoản
INSERT INTO payment (user_id, payment_type, amount, payment_method, status, note)
VALUES
(3, 'Membership', 100000.00, 'EWallet', 'Successful', 'Nâng cấp từ Basic lên Premium');

