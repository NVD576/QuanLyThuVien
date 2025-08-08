USE librarydb;

-- Bảng category: Lưu thông tin thể loại sách
CREATE TABLE IF NOT EXISTS category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TINYTEXT
);

-- Bảng book: Lưu thông tin chung của sách
CREATE TABLE IF NOT EXISTS book (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    author varchar(255) ,
	total_copies INT NOT NULL DEFAULT 0,
    available_copies INT NOT NULL DEFAULT 0,
    publisher VARCHAR(100),
    publication_year INT,
    image VARCHAR(255),
    description TINYTEXT,
    price DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT TRUE,
    CONSTRAINT check_copies CHECK (available_copies <= total_copies)
);

-- Bảng ebook: Lưu thông tin đặc thù của sách điện tử
CREATE TABLE IF NOT EXISTS ebook (
    ebook_id INT PRIMARY KEY,
    book_id INT NOT NULL,
    file_format VARCHAR(50) NOT NULL,
    file_size DECIMAL(10, 2),
    download_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (book_id) REFERENCES book(book_id) on delete cascade
);

-- Bảng print_book: Lưu thông tin sách in
CREATE TABLE IF NOT EXISTS print_book (
    print_book_id INT PRIMARY KEY,
    book_id INT NOT NULL,
    status ENUM('Available', 'Borrowed') DEFAULT 'Available',
    FOREIGN KEY (book_id) REFERENCES book(book_id) on delete cascade
    
);

-- Bảng book_category: nhiều thể loại cho một sách
CREATE TABLE IF NOT EXISTS book_category (
    book_id INT,
    category_id INT,
    PRIMARY KEY (book_id, category_id),
    FOREIGN KEY (book_id) REFERENCES book(book_id),
    FOREIGN KEY (category_id) REFERENCES category(category_id)
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    role ENUM('Admin', 'Librarian', 'Reader') DEFAULT 'Reader',
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
    membership_level ENUM('Basic', 'Premium') DEFAULT 'Basic',
    FOREIGN KEY (reader_id) REFERENCES user(user_id) on delete cascade 
);

-- Bảng rating
CREATE TABLE IF NOT EXISTS rating (
    rating_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    rating_value TINYINT NOT NULL CHECK (rating_value BETWEEN 1 AND 5),
    rating_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id) on delete cascade,
    FOREIGN KEY (book_id) REFERENCES book(book_id) on delete cascade,
    CONSTRAINT unique_user_book_rating UNIQUE (user_id, book_id)
);

-- Bảng comment
CREATE TABLE IF NOT EXISTS comment (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    comment_text TINYTEXT NOT NULL,
    comment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id) on delete cascade,
    FOREIGN KEY (book_id) REFERENCES book(book_id) on delete cascade
);

-- Bảng borrow
CREATE TABLE IF NOT EXISTS borrow (
    borrow_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
	print_book_id INT NOT NULL,
    borrow_date DATE DEFAULT (CURRENT_DATE),
    due_date DATE NOT NULL,
    return_date DATE,
    status ENUM('Pending','Cancelled','Borrowed', 'Returned', 'Overdue') DEFAULT 'Borrowed',
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (print_book_id) REFERENCES print_book(print_book_id)
);

-- Bảng fine
CREATE TABLE IF NOT EXISTS fine (
    fine_id INT AUTO_INCREMENT PRIMARY KEY,
    borrow_id INT NOT NULL,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    reason VARCHAR(255),
    issue_date DATE DEFAULT (CURRENT_DATE),
    paid_date DATE,
    status ENUM('Pending', 'Paid', 'Waived') DEFAULT 'Pending',
    FOREIGN KEY (borrow_id) REFERENCES borrow(borrow_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);

CREATE TABLE IF NOT EXISTS payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    fine_id INT,  -- NULL nếu không phải thanh toán phạt
    payment_type ENUM('Fine', 'Membership', 'Other') DEFAULT 'Fine',
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('Cash', 'CreditCard', 'BankTransfer', 'EWallet') DEFAULT 'Cash',
    payment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Successful', 'Failed', 'Pending') DEFAULT 'Successful',
    note VARCHAR(255),

    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (fine_id) REFERENCES fine(fine_id)
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

CREATE TRIGGER after_borrow_insert
AFTER INSERT ON borrow
FOR EACH ROW
BEGIN
    -- Cập nhật trạng thái bản in
    UPDATE print_book 
    SET status = 'Borrowed'
    WHERE print_book_id = NEW.print_book_id;
    
    -- Giảm số lượng sách có sẵn trong bảng book
    UPDATE book b
    JOIN print_book pb ON b.book_id = pb.book_id
    SET b.available_copies = b.available_copies - 1
    WHERE pb.print_book_id = NEW.print_book_id;
END//

CREATE TRIGGER after_borrow_update
AFTER UPDATE ON borrow
FOR EACH ROW
BEGIN
    IF NEW.status = 'Returned' AND OLD.status != 'Returned' THEN
        -- Cập nhật trạng thái bản in
        UPDATE print_book 
        SET status = 'Available'
        WHERE print_book_id = NEW.print_book_id;
        
        -- Tăng số lượng sách có sẵn trong bảng book
        UPDATE book b
        JOIN print_book pb ON b.book_id = pb.book_id
        SET b.available_copies = b.available_copies + 1
        WHERE pb.print_book_id = NEW.print_book_id;
    END IF;
END//
DELIMITER ;
