USE librarydb;

CREATE TABLE IF NOT EXISTS Category (
    CategoryID INT AUTO_INCREMENT PRIMARY KEY,
    CategoryName VARCHAR(100) NOT NULL,
    Description TEXT
);

CREATE TABLE IF NOT EXISTS Book (
    BookID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Publisher VARCHAR(100),
    PublicationYear INT,
    CategoryID INT,
    Image VARCHAR(255),
    TotalCopies INT NOT NULL DEFAULT 0,
    AvailableCopies INT NOT NULL DEFAULT 0,
    Status ENUM('Available', 'Borrowed', 'Lost', 'Damaged') DEFAULT 'Available',
    Description TEXT,
    Price DECIMAL(10, 2),
    FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID),
    CONSTRAINT check_copies CHECK (AvailableCopies <= TotalCopies)
);

CREATE TABLE IF NOT EXISTS User (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(100) NOT NULL,
    Avatar VARCHAR(255),
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Phone VARCHAR(15),
    Address VARCHAR(255),
    DateOfBirth DATE,
    Role ENUM('Admin', 'Librarian', 'Member') DEFAULT 'Member',
    Status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active'
);

CREATE TABLE IF NOT EXISTS Author (
    AuthorID INT AUTO_INCREMENT PRIMARY KEY,
    AuthorName VARCHAR(100) NOT NULL,
    Biography TEXT,
    BirthYear INT
);
CREATE TABLE IF NOT EXISTS Book_Author (
    BookID INT,
    AuthorID INT,
    PRIMARY KEY (BookID, AuthorID),
    FOREIGN KEY (BookID) REFERENCES Book(BookID),
    FOREIGN KEY (AuthorID) REFERENCES Author(AuthorID)
);

CREATE TABLE IF NOT EXISTS Borrow (
    BorrowID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    BookID INT NOT NULL,
    BorrowDate DATE DEFAULT (DATE(NOW())),
    DueDate DATE NOT NULL,
    ReturnDate DATE,
    Status ENUM('Borrowed', 'Returned', 'Overdue') DEFAULT 'Borrowed',
    FOREIGN KEY (UserID) REFERENCES User(UserID),
    FOREIGN KEY (BookID) REFERENCES Book(BookID)
);

CREATE TABLE IF NOT EXISTS Fine (
    FineID INT AUTO_INCREMENT PRIMARY KEY,
    BorrowID INT NOT NULL,
    UserID INT NOT NULL,
    Amount DECIMAL(10, 2) NOT NULL,
    Reason VARCHAR(255),
    IssueDate DATE DEFAULT (DATE(NOW())),
    PaidDate DATE,
    Status ENUM('Pending', 'Paid', 'Waived') DEFAULT 'Pending',
    FOREIGN KEY (BorrowID) REFERENCES Borrow(BorrowID),
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);


