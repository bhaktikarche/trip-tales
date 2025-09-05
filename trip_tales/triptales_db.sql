-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: triptales_db
-- ------------------------------------------------------
-- Server version	8.0.38

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `announcements`
--

DROP TABLE IF EXISTS `announcements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcements` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcements`
--

LOCK TABLES `announcements` WRITE;
/*!40000 ALTER TABLE `announcements` DISABLE KEYS */;
INSERT INTO `announcements` VALUES (2,'New features','New features are added for like and comments','2025-09-04 09:22:29'),(5,'Post Features','New post features are added','2025-09-04 11:22:26');
/*!40000 ALTER TABLE `announcements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookmarks`
--

DROP TABLE IF EXISTS `bookmarks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookmarks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `post_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookmarks`
--

LOCK TABLES `bookmarks` WRITE;
/*!40000 ALTER TABLE `bookmarks` DISABLE KEYS */;
INSERT INTO `bookmarks` VALUES (1,2,2,'2025-08-07 12:49:58'),(2,1,5,'2025-08-07 13:23:52'),(7,3,2,'2025-08-16 09:26:52'),(8,2,9,'2025-08-29 15:12:21'),(9,7,9,'2025-09-04 11:04:28'),(10,3,1,'2025-09-04 11:09:01');
/*!40000 ALTER TABLE `bookmarks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_participants`
--

DROP TABLE IF EXISTS `chat_participants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_participants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `chat_id` int NOT NULL,
  `user_id` int NOT NULL,
  `last_seen` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `unread_count` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_chat_user` (`chat_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `chat_participants_ibfk_1` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chat_participants_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_participants`
--

LOCK TABLES `chat_participants` WRITE;
/*!40000 ALTER TABLE `chat_participants` DISABLE KEYS */;
INSERT INTO `chat_participants` VALUES (1,1,3,'2025-09-04 11:19:34','2025-09-04 11:19:09',0),(2,1,7,'2025-09-04 11:19:09','2025-09-04 11:19:09',0),(3,2,1,NULL,'2025-09-04 11:19:17',1),(4,2,7,'2025-09-04 11:19:17','2025-09-04 11:19:17',0),(5,3,3,'2025-09-04 11:25:58','2025-09-04 11:19:41',2),(6,3,7,'2025-09-04 11:25:23','2025-09-04 11:19:41',0),(7,2,3,'2025-09-04 11:23:12','2025-09-04 11:23:12',0);
/*!40000 ALTER TABLE `chat_participants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chats`
--

DROP TABLE IF EXISTS `chats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chats` (
  `id` int NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `post_id` (`post_id`),
  CONSTRAINT `chats_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chats`
--

LOCK TABLES `chats` WRITE;
/*!40000 ALTER TABLE `chats` DISABLE KEYS */;
INSERT INTO `chats` VALUES (1,9,'2025-09-04 11:19:09'),(2,2,'2025-09-04 11:19:17'),(3,8,'2025-09-04 11:19:41');
/*!40000 ALTER TABLE `chats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `user_id` int NOT NULL,
  `comment_text` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,1,2,'Thanks for sharing','2025-08-07 12:44:36'),(2,5,1,'This is good','2025-08-07 13:24:08'),(4,2,7,'Wow','2025-08-29 15:06:48'),(5,9,1,'Thanks for sharing !!','2025-09-03 05:01:07'),(6,2,3,'Amaizing','2025-09-04 11:09:27'),(7,1,3,'Useful','2025-09-04 11:24:34');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `experience_summary`
--

DROP TABLE IF EXISTS `experience_summary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `experience_summary` (
  `id` int NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `generated_link` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('Active','Inactive','Pending') DEFAULT 'Active',
  `summary_text` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `generated_link` (`generated_link`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `experience_summary`
--

LOCK TABLES `experience_summary` WRITE;
/*!40000 ALTER TABLE `experience_summary` DISABLE KEYS */;
INSERT INTO `experience_summary` VALUES (1,1,'f78ede8b','2025-08-07 12:44:10','Active','This monsoon trek to Harishchandragad offered breathtaking views from Konkan Kada and a mesmerizing experience exploring ancient caves and temples amidst mist and waterfalls. Despite the modest budget, the trip provided an incredibly scenic and memorable adventure perfect for those who enjoy trekking in the rain.'),(2,2,'2ca749d7','2025-08-14 06:05:35','Active','Kyoto is a captivating blend of ancient traditions and stunning beauty, making for an unforgettable 6-day trip. Exploring historic districts like Gion, with its charming tea houses and breathtaking cherry blossoms, offers a unique immersion into Japanese culture. From the temples to the iconic Fushimi Inari, Kyoto is an experience you don\'t want to miss.'),(3,8,'110d111e','2025-08-29 15:06:59','Active','A 14-day Himalayan adventure offers a budget-friendly escape filled with breathtaking views, trekking through stunning landscapes, and serene monastery visits. Enjoy the warmth of local culture while camping under starry skies and savoring delicious mountain cuisine, creating unforgettable memories in this spiritual haven.'),(4,8,'8b12cac3','2025-08-30 17:05:27','Active','A Himalayan adventure offers 14 days of unforgettable experiences with breathtaking views, authentic local cuisine, and a blend of serene monasteries and thrilling treks. With a budget of ₹60000, you\'ll enjoy comfortable stays, and immerse yourself in the warmth of mountain villages and the magic of camping under the stars, creating memories to last a lifetime.'),(5,8,'af557a36','2025-08-30 17:10:03','Active','A 14-day Himalayan adventure offers breathtaking views, from snow-capped peaks to starry skies, on a ₹60,000 budget. Enjoy trekking through pine forests, visiting peaceful monasteries, and savoring local cuisine while experiencing the warmth of mountain villages – creating memories that last a lifetime.'),(6,8,'966d05b4','2025-08-30 17:10:04','Active','A Himalayan adventure offers an unforgettable escape with breathtaking views and trekking through stunning landscapes. For 14 days, you can expect to explore monasteries, camp under starry skies, and enjoy the warmth of mountain villages on a budget of ₹60000.00.'),(7,9,'246f03db','2025-09-04 11:03:57','Active','Escape to Okura Village in Yamagata for a rejuvenating 10-day spring getaway amidst stunning cherry blossoms, serene mountain trails, and therapeutic hot springs. Indulge in cozy ryokans, savor local soba and mountain vegetables, and enjoy a magical Mogami River cruise surrounded by breathtaking views, all within a budget of ₹100000.'),(8,9,'6b66bb4d','2025-09-04 11:09:05','Active','Escape to Okura Village for a rejuvenating 10-day spring getaway filled with stunning cherry blossom views, tranquil mountain hikes, and restorative onsen experiences. Indulge in cozy ryokan stays, savor authentic soba noodles and local mountain vegetables, and enjoy a magical river cruise amidst the lush landscapes, all within a ₹100000 budget.'),(9,9,'6c7dc9e9','2025-09-04 11:09:07','Active','Escape to Okura Village for a rejuvenating 10-day spring getaway amidst stunning cherry blossoms and tranquil mountain scenery. Indulge in authentic Japanese cuisine and unwind in luxurious ryokans, while enjoying activities like river cruises and rejuvenating hot springs. This unforgettable trip promises a harmonious blend of scenic views, cultural immersion, and relaxation.'),(10,1,'d2ca6f82','2025-09-04 11:24:16','Active','This budget-friendly, two-day monsoon trek to Harishchandragad offered breathtaking views from Konkan Kada, where clouds floated below.  Exploring the fort\'s ancient caves and temples amidst heavy rainfall and misty waterfalls created an unforgettable and scenic adventure, perfect for those seeking a unique experience.');
/*!40000 ALTER TABLE `experience_summary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `helpfuls`
--

DROP TABLE IF EXISTS `helpfuls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `helpfuls` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `post_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `helpfuls`
--

LOCK TABLES `helpfuls` WRITE;
/*!40000 ALTER TABLE `helpfuls` DISABLE KEYS */;
INSERT INTO `helpfuls` VALUES (1,2,1,'2025-08-07 12:44:07'),(2,1,5,'2025-08-07 13:23:56'),(4,2,8,'2025-08-29 15:12:11'),(5,2,9,'2025-08-29 15:12:15'),(6,7,9,'2025-09-04 11:04:29'),(7,3,2,'2025-09-04 11:23:10'),(8,3,1,'2025-09-04 11:24:12');
/*!40000 ALTER TABLE `helpfuls` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `post_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES (1,2,2,'2025-08-07 12:44:02'),(2,5,1,'2025-08-07 13:23:50'),(4,1,2,'2025-08-08 17:59:12'),(6,8,7,'2025-08-29 15:06:16'),(7,1,7,'2025-08-29 15:06:56'),(8,9,2,'2025-08-29 15:12:07'),(9,8,2,'2025-08-29 15:12:09'),(10,9,1,'2025-09-03 05:00:33'),(11,9,7,'2025-09-04 11:04:27'),(13,2,3,'2025-09-04 11:23:08'),(14,1,3,'2025-09-04 11:24:09');
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `chat_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `body` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `chat_id` (`chat_id`),
  KEY `sender_id` (`sender_id`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`chat_id`) REFERENCES `chats` (`id`) ON DELETE CASCADE,
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,2,7,'Hello','2025-09-04 11:19:21'),(2,3,7,'Hello','2025-09-04 11:19:44'),(3,3,3,'yes','2025-09-04 11:20:19'),(4,3,7,'I want to discuss about your trip','2025-09-04 11:25:39'),(5,3,3,'Yes go ahead','2025-09-04 11:25:58');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `receiver_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `post_id` int NOT NULL,
  `type` enum('comment') NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_images`
--

DROP TABLE IF EXISTS `post_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `post_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `post_id` int NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `caption` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_images`
--

LOCK TABLES `post_images` WRITE;
/*!40000 ALTER TABLE `post_images` DISABLE KEYS */;
INSERT INTO `post_images` VALUES (1,1,'/uploads/7dee6eae-7d3b-49ba-8516-1b21000213fc.jpeg',NULL),(2,2,'/uploads/6662d3b8-0170-4c47-b96a-39691c36d794.jpeg',NULL),(9,8,'/uploads/e51cb7db-0e43-460c-b5f6-bb8d8afb6373.jpeg',NULL),(10,8,'/uploads/7796ad80-9dfe-4e54-9c57-56f82c062e78.jpg',NULL),(11,9,'/uploads/b58d7f81-6357-48eb-8834-a24b3f845c91.jpg',NULL);
/*!40000 ALTER TABLE `post_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `location_name` varchar(255) NOT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `experience` text NOT NULL,
  `budget` decimal(10,2) NOT NULL,
  `duration_days` int DEFAULT NULL,
  `best_season` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,1,'Monsoon Trek to Harishchandragad','Harishchandragad Fort, Junnar Darwaza, Junnar, Pune, Maharashtra, India',19.391453,73.793874,'We started our trek early in the morning amid heavy rainfall. The trail was covered with mist and waterfalls, making the entire route incredibly scenic. The view from Konkan Kada was absolutely breathtaking with clouds floating below us. The fort\'s ancient caves and temples were fascinating, and the weather made the experience even more memorable. I highly recommend this for adventure seekers who enjoy monsoon treks.',1500.00,2,'Monsoon','2025-08-07 12:27:26'),(2,1,'Exploring the Streets of Kyoto','Kyoto, Japan',NULL,NULL,'Wandering through the Gion district was like stepping back in time. The temples, tea houses, and cherry blossoms made this trip unforgettable. Don\'t miss Fushimi Inari!',65000.00,6,'Any','2025-08-07 12:40:22'),(8,3,'🏔️ The Himalayas – Travel Information','Himalaya',30.5231861,80.5727039,'Visiting the Himalayas is an unforgettable blend of adventure and serenity. The towering snow-capped peaks, winding rivers, and peaceful monasteries create a perfect escape from city life. Trekking through pine forests, camping under starry skies, and sipping hot tea in mountain villages make the journey magical. The warmth of the locals, the spiritual aura, and the breathtaking sunrise over the mountains give you memories that last a lifetime.',60000.00,14,'Any','2025-08-29 14:26:40'),(9,3,'🌸 Okura Spring Escape – Sakura & Hot Springs','Okura Village, Yamagata Prefecture, Japan',NULL,NULL,'Spring in Okura is like living inside a Japanese painting. The village comes alive with cherry blossoms, peaceful mountain trails, and the soothing warmth of open-air hot springs. A cruise along the Mogami River surrounded by fresh greenery feels magical. Evenings in a cozy ryokan, enjoying local soba noodles and seasonal mountain vegetables, make the trip unforgettable.',100000.00,10,'Spring','2025-08-29 15:02:05');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `travel_logs`
--

DROP TABLE IF EXISTS `travel_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `travel_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `location` varchar(255) NOT NULL,
  `experience` text NOT NULL,
  `budget` decimal(10,2) NOT NULL,
  `suggestions` text,
  `photos` json NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `travel_logs`
--

LOCK TABLES `travel_logs` WRITE;
/*!40000 ALTER TABLE `travel_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `travel_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_experiences`
--

DROP TABLE IF EXISTS `user_experiences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_experiences` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `experience` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `rating` tinyint DEFAULT NULL,
  `approved` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_experience` (`user_id`),
  CONSTRAINT `user_experiences_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_experiences`
--

LOCK TABLES `user_experiences` WRITE;
/*!40000 ALTER TABLE `user_experiences` DISABLE KEYS */;
INSERT INTO `user_experiences` VALUES (3,3,'Very good website','2025-08-16 09:47:57','2025-09-04 11:25:01',NULL,0),(6,4,'This is very good website','2025-08-26 20:30:48','2025-08-26 20:30:48',NULL,0),(7,7,'TripTales made sharing my travel stories so easy, and I love how I can tag locations and add photos — it feels like reliving my journey!','2025-08-30 16:50:31','2025-08-30 16:50:31',NULL,0),(8,1,'I found TripTales really easy to use – I could share my journey, upload photos, and add location details without any hassle.','2025-09-03 05:03:21','2025-09-03 05:03:21',NULL,0);
/*!40000 ALTER TABLE `user_experiences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_blocked` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'User','user@mail.com','User1','$2b$10$G.gsyiJLnB8LLolqIZinIeceTC.bsKg.8iXpP/toOo99TJQYydvoi','female','2004-12-12','India','user','2025-08-07 12:22:02',0),(2,'User2','user2@mail.com','User2','$2b$10$RCFoi86cTOW3Edzq2ZjZEOoUjOYjzM2vJOpwx5rhS3Vk/.szwQfxS','Male','2001-02-12','India','user','2025-08-07 12:43:41',0),(3,'Bhakti','bhaktikarche3@gmail.com','bhakti','$2b$10$AbOuJIH4qdHqtK5aKV9cHuGYCl.e0TDJCI6r.rxffIcp1TJZq1lde','female','2004-07-23','India','user','2025-08-08 16:35:26',0),(4,'xyz','xyz@gmail.com','xyz','$2b$10$RYMxbq2vbZySz.VILyQbSOcptZX5cTJkZSTD3CLe/FOgcUixsJp5u','male','2004-07-23','India','user','2025-08-18 08:50:52',0),(5,'payal','payal@gmail.com','payal','$2b$10$bfzoit6lMN9cTTKRSU5W1eLzpgHXmtdm1a0YRgWenG5/WGn7Kc3Wm','female','2004-03-12','India','user','2025-08-20 09:18:02',0),(7,'Sakshi Jadhav','sakshi@gmail.com','sakshi','$2b$10$ASzcBmqwk2xzKmw8YZ6UrOMwrcvPG.nU4Kc6o.hMZxOPWC8yr55R6','female','2004-11-10','India','user','2025-08-29 15:05:46',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-05 13:54:37
