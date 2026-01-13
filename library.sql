CREATE DATABASE  IF NOT EXISTS `librarydb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `librarydb`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: librarydb
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS admin;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  admin_id int NOT NULL,
  PRIMARY KEY (admin_id),
  CONSTRAINT admin_ibfk_1 FOREIGN KEY (admin_id) REFERENCES `user` (user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

INSERT INTO admin VALUES (1);

--
-- Table structure for table `book`
--

DROP TABLE IF EXISTS book;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE book (
  book_id int NOT NULL AUTO_INCREMENT,
  title varchar(255) NOT NULL,
  author varchar(255) DEFAULT NULL,
  total_copies int NOT NULL,
  available_copies int NOT NULL,
  publisher varchar(100) DEFAULT NULL,
  publication_year int DEFAULT NULL,
  image varchar(255) DEFAULT NULL,
  `description` tinytext,
  price decimal(10,2) DEFAULT NULL,
  is_active tinyint(1) DEFAULT '1',
  PRIMARY KEY (book_id),
  CONSTRAINT check_copies CHECK ((`available_copies` <= `total_copies`))
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book`
--

INSERT INTO book VALUES (1,'Đắc Nhân Tâm','Dale Carnegie',3,3,'NXB Tổng hợp TP.HCM',1936,'dac-nhan-tam.jpg','Nghệ thuật thu phục lòng người',120000.00,1);
INSERT INTO book VALUES (2,'Nhà Giả Kim','Paulo Coelho',3,3,'NXB Văn học',1988,'nha-gia-kim.jpg','Hành trình tìm kiếm vận mệnh',95000.00,1);
INSERT INTO book VALUES (3,'Tuổi Trẻ Đáng Giá Bao Nhiêu','Rosie Nguyễn',3,3,'NXB Hội Nhà Văn',2016,'tuoi-tre-dang-gia-bao-nhieu.jpg','Sách dành cho người trẻ',85000.00,1);
INSERT INTO book VALUES (4,'Tôi Tài Giỏi Bạn Cũng Thế','Adam Khoo',3,3,'NXB Phụ nữ',2009,'toi-tai-gioi.jpg','Phát triển bản thân',110000.00,1);
INSERT INTO book VALUES (5,'Cà Phê Cùng Tony','Tony Buổi Sáng',3,3,'NXB Trẻ',2013,'ca-phe-cung-tony.jpg','Những triết lý sống',75000.00,1);
INSERT INTO book VALUES (6,'Đời Ngắn Đừng Ngủ Dài','Robin Sharma',3,3,'NXB Thế giới',2015,'doi-ngan-dung-ngu-dai.jpg','Tận hưởng cuộc sống',88000.00,1);
INSERT INTO book VALUES (7,'Bố Già','Mario Puzo',3,3,'NXB Văn học',1969,'bo-gia.jpg','Tiểu thuyết kinh điển',135000.00,1);
INSERT INTO book VALUES (8,'Sherlock Holmes Toàn Tập','Arthur Conan Doyle',3,3,'NXB Kim Đồng',1892,'sherlock-holmes.jpg','Tuyển tập trinh thám',250000.00,1);
INSERT INTO book VALUES (9,'Trên Đường Băng','Tony Buổi Sáng',3,3,'NXB Trẻ',2017,'tren-duong-bang.jpg','Sách cho người trẻ khởi nghiệp',90000.00,1);
INSERT INTO book VALUES (10,'Hạt Giống Tâm Hồn','Nhiều Tác Giả',3,3,'NXB Tổng hợp TP.HCM',2004,'hat-giong-tam-hon.jpg','Tập hợp những câu chuyện ý nghĩa',80000.00,1);
INSERT INTO book VALUES (11,'Đọc Vị Bất Kỳ Ai','David J. Lieberman',3,3,'NXB Lao động',2007,'doc-vi-bat-ky-ai.jpg','Nghệ thuật thấu hiểu người khác',150000.00,1);
INSERT INTO book VALUES (12,'Nghệ Thuật Tinh Tế Của Việc Đếch Quan Tâm','Mark Manson',3,3,'NXB Thế giới',2016,'nghe-thuat-tinh-te.jpg','Cách sống thoải mái hơn',110000.00,1);
INSERT INTO book VALUES (13,'Chiến Binh Cầu Vồng','Andrea Hirata',3,3,'NXB Hội Nhà Văn',2005,'chien-binh-cau-vong.jpg','Câu chuyện cảm động về giáo dục',95000.00,1);
INSERT INTO book VALUES (14,'Lược Sử Thời Gian','Stephen Hawking',3,3,'NXB Trẻ',1988,'luoc-su-thoi-gian.jpg','Khám phá vũ trụ học',180000.00,1);
INSERT INTO book VALUES (15,'Hoàng Tử Bé','Antoine de Saint-Exupéry',3,3,'NXB Kim Đồng',1943,'hoang-tu-be.jpg','Tác phẩm văn học thiếu nhi kinh điển',70000.00,1);
INSERT INTO book VALUES (16,'Clean Code','Robert C. Martin',3,3,'Prentice Hall',2008,'clean-code.jpg','Sách lập trình dành cho developer',350000.00,1);
INSERT INTO book VALUES (17,'Sapiens: Lược Sử Loài Người','Yuval Noah Harari',3,2,'NXB Thế giới',2011,'sapiens.jpg','Lịch sử phát triển của nhân loại',200000.00,1);
INSERT INTO book VALUES (18,'Atomic Habits','James Clear',3,2,'Avery',2018,'atomic-habits.jpg','Xây dựng thói quen nhỏ để thành công lớn',250000.00,1);
INSERT INTO book VALUES (19,'Những Người Khốn Khổ','Victor Hugo',3,2,'NXB Văn học',1862,'nhung-nguoi-khon-kho.jpg','Tiểu thuyết kinh điển của Victor Hugo',160000.00,1);
INSERT INTO book VALUES (20,'Trí Tuệ Do Thái','Eran Katz',3,2,'NXB Lao động',2010,'tri-tue-do-thai.jpg','Khám phá bí quyết thành công',120000.00,1);
INSERT INTO book VALUES (21,'Trung Xô Mỹ Cuộc Đối Đầu Lịch Sử',' Lý Kiện, StreetLib',4,4,'NXB Thanh Niên',NULL,'http://books.google.com/books/content?id=xfvcEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api','Ngày 9 tháng 5 năm 1945, Matxcơva rợp trời cờ đỏ, đua nở trăm hoa và những hàng cây nghiêng bóng. Màn đêm buông xuống. Mátxcơva hoa đăng rực rỡ. Những',0.00,1);
INSERT INTO book VALUES (22,'Sự chính thống của Hội thánh','Suối Nước Sống',0,0,'Suối Nước Sống',2023,'http://books.google.com/books/content?id=LOizEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api','Những sứ điệp trong sách này đã được rao giảng và xuất bản vào năm 1945 tại Trùng Khánh. Các sứ điệp ấy hết sức sáng tỏ và rõ ràng. Bên cạnh nhiều điể',0.00,1);
INSERT INTO book VALUES (23,'LTPH Sự xây dựng Hội thánh là Thân thể Đấng Christ cách nội tại và hữu cơ','Suối nước sống',0,0,'Suối Nước Sống',2021,'http://books.google.com/books/content?id=ctRHEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api','Quyển sách này nhằm hỗ trợ tín đồ trong việc phát triển thời gian phấn hưng buổi sáng hằng ngày với Chúa trong lời Ngài. Đồng thời, sách cũng giúp ôn ',0.00,1);
INSERT INTO book VALUES (24,'Nếp sống Hội thánh Cơ đốc bình thường','Suối nước sống, Watchman Nee ',0,0,'Suối Nước Sống',2023,'http://books.google.com/books/content?id=8creEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api','Ngoại trừ vài chỗ điều chỉnh nhỏ nhặt cho đúng với cách chấm câu, lối nói, thành ngữ và chính tả tiếng Anh, nội dung tác phẩm này trực tiếp lấy từ ấn ',0.00,1);
INSERT INTO book VALUES (25,'Kinh ngạc vì Đức Chúa Trời','John Piper',0,0,'Tien Phong Ministries',2021,'http://books.google.com/books/content?id=1BZ2EAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api','Hơn ba mươi năm, John Piper đã giữ vai trò mục sư trong nhiều hoàn cảnh cam go và cam bất thường tại thành phố Minneapolis, rao giảng cho hội chúng củ',0.00,1);
INSERT INTO book VALUES (26,'Thiên Chúa của con người, kế hoạch của Thiên Chúa','Harald Lark',0,0,'Word to the World Ministries',2020,'http://books.google.com/books/content?id=zp7YDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api','Cuốn sách này hỗ trợ kinh thánh là lời Chúa và đưa ra một tài khoản của các sự kiện thực, lịch sử. Cuốn sách thảo luận về đặc biệt sáng tạo như là ngu',0.00,1);
INSERT INTO book VALUES (27,'Cách Mạng','Emmanuel Macron',0,0,'First News',NULL,'http://books.google.com/books/content?id=ChEVEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api','Cách Mạng được xuất bản ngày 24-11-2016, đã bán được gần 200.000 bản và là một trong những quyển sách bán chạy nhất nước Pháp tr',0.00,1);
INSERT INTO book VALUES (28,'Tìm hiểu kinh bốn mươi hai chương','Thích Nhật Từ',0,0,'Tủ sách Đạo Phật Ngày Nay',2017,'http://books.google.com/books/content?id=hvh4DwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api','Phật pháp vốn không sinh diệt, không biến đổi, nhưng giáo lý Đức Thế Tôn dạy ta lại vô cùng khế lý, khế cơ. Kinh điển về Phật pháp ngày nay được lưu h',0.00,1);

--
-- Table structure for table `book_category`
--

DROP TABLE IF EXISTS book_category;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE book_category (
  book_id int NOT NULL,
  category_id int NOT NULL,
  PRIMARY KEY (book_id,category_id),
  KEY category_id (category_id),
  CONSTRAINT book_category_ibfk_1 FOREIGN KEY (book_id) REFERENCES book (book_id) ON DELETE CASCADE,
  CONSTRAINT book_category_ibfk_2 FOREIGN KEY (category_id) REFERENCES category (category_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book_category`
--

INSERT INTO book_category VALUES (2,1);
INSERT INTO book_category VALUES (5,1);
INSERT INTO book_category VALUES (7,1);
INSERT INTO book_category VALUES (8,1);
INSERT INTO book_category VALUES (13,1);
INSERT INTO book_category VALUES (15,1);
INSERT INTO book_category VALUES (19,1);
INSERT INTO book_category VALUES (14,2);
INSERT INTO book_category VALUES (17,2);
INSERT INTO book_category VALUES (16,3);
INSERT INTO book_category VALUES (1,4);
INSERT INTO book_category VALUES (3,4);
INSERT INTO book_category VALUES (4,4);
INSERT INTO book_category VALUES (6,4);
INSERT INTO book_category VALUES (9,4);
INSERT INTO book_category VALUES (10,4);
INSERT INTO book_category VALUES (11,4);
INSERT INTO book_category VALUES (12,4);
INSERT INTO book_category VALUES (18,4);
INSERT INTO book_category VALUES (20,4);

--
-- Table structure for table `borrow`
--

DROP TABLE IF EXISTS borrow;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE borrow (
  borrow_id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  print_book_id int NOT NULL,
  borrow_date date DEFAULT NULL,
  due_date date DEFAULT NULL,
  return_date date DEFAULT NULL,
  `status` tinytext,
  PRIMARY KEY (borrow_id),
  KEY user_id (user_id),
  KEY print_book_id (print_book_id),
  CONSTRAINT borrow_ibfk_1 FOREIGN KEY (user_id) REFERENCES `user` (user_id) ON DELETE CASCADE,
  CONSTRAINT borrow_ibfk_2 FOREIGN KEY (print_book_id) REFERENCES print_book (print_book_id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `borrow`
--

INSERT INTO borrow VALUES (20,5,1,'2025-09-07','2025-09-21','2025-09-06','Returned');
INSERT INTO borrow VALUES (21,5,2,'2025-09-07','2025-09-21','2025-09-06','Returned');
INSERT INTO borrow VALUES (22,5,1,'2025-09-07','2025-09-21','2025-09-06','Returned');
INSERT INTO borrow VALUES (23,5,1,'2025-09-07','2025-09-21','2025-09-06','Returned');
INSERT INTO borrow VALUES (24,5,1,'2025-09-07','2025-09-21','2025-09-06','Returned');
INSERT INTO borrow VALUES (28,5,1,'2025-09-07','2025-09-21','2025-09-06','Returned');
INSERT INTO borrow VALUES (29,5,1,'2025-09-07','2025-09-21','2025-09-06','Returned');
INSERT INTO borrow VALUES (30,5,1,'2025-09-07','2025-09-21','2025-09-06','Returned');
INSERT INTO borrow VALUES (31,5,1,'2025-09-07','2025-09-21','2025-09-06','Returned');
INSERT INTO borrow VALUES (32,5,1,'2025-09-07','2025-09-21','2025-09-06','Returned');
INSERT INTO borrow VALUES (33,3,58,'2025-09-07','2025-09-21','2025-09-06','Returned');
INSERT INTO borrow VALUES (34,3,67,'2025-09-07','2025-09-21','2025-09-07','Returned');
INSERT INTO borrow VALUES (35,3,58,'2025-09-07','2025-09-21',NULL,'Borrowed');
INSERT INTO borrow VALUES (36,1,67,'2025-09-08',NULL,NULL,'Cancelled');
INSERT INTO borrow VALUES (37,1,67,'2025-09-08',NULL,NULL,'Cancelled');
INSERT INTO borrow VALUES (38,3,67,'2025-09-08',NULL,NULL,'Cancelled');
INSERT INTO borrow VALUES (39,3,55,'2025-09-09','2025-09-23',NULL,'Borrowed');
INSERT INTO borrow VALUES (40,3,67,'2025-09-08',NULL,NULL,'Pending');
INSERT INTO borrow VALUES (41,3,52,'2025-09-09','2025-09-23',NULL,'Borrowed');
INSERT INTO borrow VALUES (42,3,49,'2025-09-09','2025-09-23',NULL,'Borrowed');

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS category;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE category (
  category_id int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` tinytext,
  PRIMARY KEY (category_id)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

INSERT INTO category VALUES (1,'Tiểu thuyết','Các tác phẩm văn học dài, thường là hư cấu');
INSERT INTO category VALUES (2,'Khoa học','Sách về các chủ đề khoa học tự nhiên và xã hội');
INSERT INTO category VALUES (3,'Lập trình','Sách về phát triển phần mềm và công nghệ thông tin');
INSERT INTO category VALUES (4,'Kinh doanh','Sách về quản lý, khởi nghiệp và tài chính');
INSERT INTO category VALUES (5,'Lịch sử','Sách về các sự kiện lịch sử');

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS comment;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment` (
  comment_id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  book_id int NOT NULL,
  comment_text tinytext,
  comment_date datetime DEFAULT NULL,
  PRIMARY KEY (comment_id),
  KEY user_id (user_id),
  KEY book_id (book_id),
  CONSTRAINT comment_ibfk_1 FOREIGN KEY (user_id) REFERENCES `user` (user_id) ON DELETE CASCADE,
  CONSTRAINT comment_ibfk_2 FOREIGN KEY (book_id) REFERENCES book (book_id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

INSERT INTO comment VALUES (1,3,1,'Truyện rất hay, đáng đọc',NULL);
INSERT INTO comment VALUES (2,4,2,'Truyện kinh dị đúng chất Stephen King',NULL);
INSERT INTO comment VALUES (3,5,3,'Sách rất hữu ích cho developer',NULL);
INSERT INTO comment VALUES (4,3,4,'Cuốn sách thay đổi cách nhìn về lịch sử loài người',NULL);
INSERT INTO comment VALUES (5,4,5,'Nội dung sâu sắc, dễ hiểu',NULL);
INSERT INTO comment VALUES (6,3,21,'qua binh thuong','2025-09-07 10:22:03');
INSERT INTO comment VALUES (7,1,21,'Good','2025-09-08 16:58:32');

--
-- Table structure for table `ebook`
--

DROP TABLE IF EXISTS ebook;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE ebook (
  ebook_id int NOT NULL,
  book_id int NOT NULL,
  file_format varchar(50) DEFAULT NULL,
  file_size decimal(10,2) DEFAULT NULL,
  download_url varchar(255) DEFAULT NULL,
  PRIMARY KEY (ebook_id),
  KEY book_id (book_id),
  CONSTRAINT ebook_ibfk_1 FOREIGN KEY (book_id) REFERENCES book (book_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ebook`
--


--
-- Table structure for table `fine`
--

DROP TABLE IF EXISTS fine;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE fine (
  fine_id int NOT NULL AUTO_INCREMENT,
  borrow_id int NOT NULL,
  amount decimal(10,2) DEFAULT NULL,
  reason varchar(255) DEFAULT NULL,
  paid_date date DEFAULT NULL,
  `status` tinytext,
  issue_date date DEFAULT NULL,
  PRIMARY KEY (fine_id),
  KEY borrow_id (borrow_id),
  CONSTRAINT fine_ibfk_1 FOREIGN KEY (borrow_id) REFERENCES borrow (borrow_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fine`
--


--
-- Table structure for table `librarian`
--

DROP TABLE IF EXISTS librarian;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE librarian (
  librarian_id int NOT NULL,
  start_date date NOT NULL,
  PRIMARY KEY (librarian_id),
  CONSTRAINT librarian_ibfk_1 FOREIGN KEY (librarian_id) REFERENCES `user` (user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `librarian`
--

INSERT INTO librarian VALUES (2,'2020-01-15');

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS payment;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE payment (
  payment_id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  fine_id int DEFAULT NULL,
  payment_type tinytext,
  amount decimal(10,2) DEFAULT NULL,
  payment_method tinytext,
  payment_date date DEFAULT NULL,
  `status` tinytext,
  note varchar(255) DEFAULT NULL,
  PRIMARY KEY (payment_id),
  KEY user_id (user_id),
  KEY fine_id (fine_id),
  CONSTRAINT payment_ibfk_1 FOREIGN KEY (user_id) REFERENCES `user` (user_id) ON DELETE CASCADE,
  CONSTRAINT payment_ibfk_2 FOREIGN KEY (fine_id) REFERENCES fine (fine_id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

INSERT INTO payment VALUES (1,3,NULL,'Membership',100000.00,'EWallet',NULL,'Successful','Nâng cấp từ Basic lên Premium');

--
-- Table structure for table `print_book`
--

DROP TABLE IF EXISTS print_book;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE print_book (
  print_book_id int NOT NULL AUTO_INCREMENT,
  book_id int NOT NULL,
  `status` tinytext,
  PRIMARY KEY (print_book_id),
  KEY book_id (book_id),
  CONSTRAINT print_book_ibfk_1 FOREIGN KEY (book_id) REFERENCES book (book_id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `print_book`
--

INSERT INTO print_book VALUES (1,1,'Available');
INSERT INTO print_book VALUES (2,1,'Available');
INSERT INTO print_book VALUES (3,1,'Available');
INSERT INTO print_book VALUES (4,2,'Available');
INSERT INTO print_book VALUES (5,2,'Available');
INSERT INTO print_book VALUES (6,2,'Available');
INSERT INTO print_book VALUES (7,3,'Available');
INSERT INTO print_book VALUES (8,3,'Available');
INSERT INTO print_book VALUES (9,3,'Available');
INSERT INTO print_book VALUES (10,4,'Available');
INSERT INTO print_book VALUES (11,4,'Available');
INSERT INTO print_book VALUES (12,4,'Available');
INSERT INTO print_book VALUES (13,5,'Available');
INSERT INTO print_book VALUES (14,5,'Available');
INSERT INTO print_book VALUES (15,5,'Available');
INSERT INTO print_book VALUES (16,6,'Available');
INSERT INTO print_book VALUES (17,6,'Available');
INSERT INTO print_book VALUES (18,6,'Available');
INSERT INTO print_book VALUES (19,7,'Available');
INSERT INTO print_book VALUES (20,7,'Available');
INSERT INTO print_book VALUES (21,7,'Available');
INSERT INTO print_book VALUES (22,8,'Available');
INSERT INTO print_book VALUES (23,8,'Available');
INSERT INTO print_book VALUES (24,8,'Available');
INSERT INTO print_book VALUES (25,9,'Available');
INSERT INTO print_book VALUES (26,9,'Available');
INSERT INTO print_book VALUES (27,9,'Available');
INSERT INTO print_book VALUES (28,10,'Available');
INSERT INTO print_book VALUES (29,10,'Available');
INSERT INTO print_book VALUES (30,10,'Available');
INSERT INTO print_book VALUES (31,11,'Available');
INSERT INTO print_book VALUES (32,11,'Available');
INSERT INTO print_book VALUES (33,11,'Available');
INSERT INTO print_book VALUES (34,12,'Available');
INSERT INTO print_book VALUES (35,12,'Available');
INSERT INTO print_book VALUES (36,12,'Available');
INSERT INTO print_book VALUES (37,13,'Available');
INSERT INTO print_book VALUES (38,13,'Available');
INSERT INTO print_book VALUES (39,13,'Available');
INSERT INTO print_book VALUES (40,14,'Available');
INSERT INTO print_book VALUES (41,14,'Available');
INSERT INTO print_book VALUES (42,14,'Available');
INSERT INTO print_book VALUES (43,15,'Available');
INSERT INTO print_book VALUES (44,15,'Available');
INSERT INTO print_book VALUES (45,15,'Available');
INSERT INTO print_book VALUES (46,16,'Available');
INSERT INTO print_book VALUES (47,16,'Available');
INSERT INTO print_book VALUES (48,16,'Available');
INSERT INTO print_book VALUES (49,17,'Borrowed');
INSERT INTO print_book VALUES (50,17,'Available');
INSERT INTO print_book VALUES (51,17,'Available');
INSERT INTO print_book VALUES (52,18,'Borrowed');
INSERT INTO print_book VALUES (53,18,'Available');
INSERT INTO print_book VALUES (54,18,'Available');
INSERT INTO print_book VALUES (55,19,'Borrowed');
INSERT INTO print_book VALUES (56,19,'Available');
INSERT INTO print_book VALUES (57,19,'Available');
INSERT INTO print_book VALUES (58,20,'Borrowed');
INSERT INTO print_book VALUES (59,20,'Available');
INSERT INTO print_book VALUES (60,20,'Available');
INSERT INTO print_book VALUES (67,21,'Available');
INSERT INTO print_book VALUES (69,21,'Available');
INSERT INTO print_book VALUES (71,21,'Available');
INSERT INTO print_book VALUES (72,21,'Available');

--
-- Table structure for table `rating`
--

DROP TABLE IF EXISTS rating;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE rating (
  rating_id int NOT NULL AUTO_INCREMENT,
  user_id int NOT NULL,
  book_id int NOT NULL,
  rating_value tinyint NOT NULL,
  rating_date date DEFAULT NULL,
  PRIMARY KEY (rating_id),
  UNIQUE KEY unique_user_book_rating (user_id,book_id),
  KEY book_id (book_id),
  CONSTRAINT rating_ibfk_1 FOREIGN KEY (user_id) REFERENCES `user` (user_id) ON DELETE CASCADE,
  CONSTRAINT rating_ibfk_2 FOREIGN KEY (book_id) REFERENCES book (book_id) ON DELETE CASCADE,
  CONSTRAINT rating_chk_1 CHECK ((`rating_value` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rating`
--

INSERT INTO rating VALUES (1,3,1,5,NULL);
INSERT INTO rating VALUES (2,4,2,4,NULL);
INSERT INTO rating VALUES (3,5,3,5,NULL);
INSERT INTO rating VALUES (4,3,4,4,NULL);
INSERT INTO rating VALUES (5,4,5,3,NULL);
INSERT INTO rating VALUES (6,3,21,3,'2025-09-07');
INSERT INTO rating VALUES (7,1,21,4,'2025-09-08');

--
-- Table structure for table `reader`
--

DROP TABLE IF EXISTS reader;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE reader (
  reader_id int NOT NULL,
  membership_level tinytext,
  PRIMARY KEY (reader_id),
  CONSTRAINT reader_ibfk_1 FOREIGN KEY (reader_id) REFERENCES `user` (user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reader`
--

INSERT INTO reader VALUES (3,'Basic');
INSERT INTO reader VALUES (4,'Premium');
INSERT INTO reader VALUES (5,'Basic');

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS user;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  user_id int NOT NULL AUTO_INCREMENT,
  first_name varchar(50) DEFAULT NULL,
  last_name varchar(50) DEFAULT NULL,
  avatar varchar(500) DEFAULT NULL,
  email varchar(100) NOT NULL,
  username varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  phone varchar(15) DEFAULT NULL,
  address varchar(255) DEFAULT NULL,
  created_at datetime DEFAULT NULL,
  `role` tinytext,
  is_active tinyint(1) DEFAULT '1',
  PRIMARY KEY (user_id),
  UNIQUE KEY email (email),
  UNIQUE KEY username (username)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

INSERT INTO user VALUES (1,'Admin','System',NULL,'admin@library.com','admin','$2a$10$Okh2cGnAQ1jAGnUnxhEqluSm.FhhJn6JMMe7hOdGZjz2iaUjcdOMG','0123456789','123 Đường ABC',NULL,'Admin',1);
INSERT INTO user VALUES (2,'Librarian','One','https://res.cloudinary.com/dqpoa9ukn/image/upload/v1757352785/lmsj3eve51fgvhzvepnb.png','librarian1@library.com','librarian1','$2a$10$Okh2cGnAQ1jAGnUnxhEqluSm.FhhJn6JMMe7hOdGZjz2iaUjcdOMG','0987654321','456 Đường XYZ',NULL,'Librarian',1);
INSERT INTO user VALUES (3,'Nguyễn Văn','A','https://res.cloudinary.com/dqpoa9ukn/image/upload/v1757240743/gh4wpuest6mi9yk32nel.jpg','reader1@email.com','reader1','$2a$10$Okh2cGnAQ1jAGnUnxhEqluSm.FhhJn6JMMe7hOdGZjz2iaUjcdOMG','0901234567','789 Đường QWE',NULL,'Reader',1);
INSERT INTO user VALUES (4,'Trần Thị','B',NULL,'reader2@email.com','reader2','$2a$10$Okh2cGnAQ1jAGnUnxhEqluSm.FhhJn6JMMe7hOdGZjz2iaUjcdOMG','0912345678','321 Đường RTY',NULL,'Reader',1);
INSERT INTO user VALUES (5,'Lê Văn','C',NULL,'reader3@email.com','reader3','$2a$10$Okh2cGnAQ1jAGnUnxhEqluSm.FhhJn6JMMe7hOdGZjz2iaUjcdOMG','0923456789','654 Đường UIO',NULL,'Reader',1);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed
