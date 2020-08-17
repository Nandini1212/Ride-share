CREATE DATABASE  IF NOT EXISTS `D2R2` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `D2R2`;
-- MySQL dump 10.13  Distrib 8.0.19, for macos10.15 (x86_64)
--
-- Host: handshakedb.clco8f6rhzmw.us-east-1.rds.amazonaws.com    Database: D2R2
-- ------------------------------------------------------
-- Server version	5.7.22-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `driver_information`
--

DROP TABLE IF EXISTS `driver_information`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `driver_information` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `license_number` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `expiry_date` varchar(45) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_driver_information_users_idx` (`user_id`),
  CONSTRAINT `fk_driver_information_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `feedback`
--

DROP TABLE IF EXISTS `feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reservation_id` int(11) DEFAULT NULL,
  `experience` varchar(45) DEFAULT NULL,
  `car_condition` varchar(45) DEFAULT NULL,
  `comments` varchar(2000) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `membership`
--

DROP TABLE IF EXISTS `membership`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `membership` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `card_number` varchar(45) DEFAULT NULL,
  `expiry_date` varchar(45) DEFAULT NULL,
  `cvv` varchar(45) DEFAULT NULL,
  `card_holder_name` varchar(100) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_users_payment_idx` (`user_id`),
  CONSTRAINT `fk_users_payment` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `price`
--

DROP TABLE IF EXISTS `price`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `price` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `price_type` varchar(100) DEFAULT NULL,
  `price` int(5) DEFAULT NULL,
  `vehicle_type_id` int(11) NOT NULL,
  `late_fee` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_vehicletype_price_idx` (`vehicle_type_id`),
  CONSTRAINT `fk_vehicletype_price` FOREIGN KEY (`vehicle_type_id`) REFERENCES `vehicle_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rental_location`
--

DROP TABLE IF EXISTS `rental_location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rental_location` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `rental_vehicle_capacity` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reservation`
--

DROP TABLE IF EXISTS `reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reservation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vehicle_type_id` int(11) DEFAULT NULL,
  `vehicle_id` int(11) DEFAULT NULL,
  `reservation_date` varchar(50) DEFAULT NULL,
  `reservation_time` varchar(50) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `length_of_stay` int(11) DEFAULT NULL,
  `cancellled` tinyint(4) DEFAULT '0',
  `charge` tinyint(4) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `rental_location_id` int(11) DEFAULT NULL,
  `note` varchar(1000) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `returned_vehicle_cond` varchar(1000) DEFAULT NULL,
  `feedback_post_return` varchar(1000) DEFAULT NULL,
  `is_returned` int(11) DEFAULT '0',
  `is_deleted` int(11) DEFAULT '0',
  `reason_for_cancel` varchar(1000) DEFAULT NULL,
  `return_datetime` varchar(45) DEFAULT NULL,
  `fee_charged` int(11) DEFAULT NULL,
  `is_completed` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_user_reservation_idx` (`user_id`),
  KEY `fk_vehicle_reservation_idx` (`vehicle_id`),
  KEY `fk_rentallocation_reservation_idx` (`rental_location_id`),
  KEY `fk_vehicletype_reservation_idx` (`vehicle_type_id`),
  CONSTRAINT `fk_rentallocation_reservation` FOREIGN KEY (`rental_location_id`) REFERENCES `rental_location` (`id`),
  CONSTRAINT `fk_user_reservation` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_vehicle_reservation` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle` (`id`),
  CONSTRAINT `fk_vehicletype_reservation` FOREIGN KEY (`vehicle_type_id`) REFERENCES `vehicle_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_membership`
--

DROP TABLE IF EXISTS `user_membership`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_membership` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `membership_id` int(11) NOT NULL,
  `is_terminated` int(11) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_users_usermembership_idx` (`membership_id`),
  KEY `fk_user_usermembership_idx` (`user_id`),
  CONSTRAINT `fk_membership_usermembership` FOREIGN KEY (`membership_id`) REFERENCES `membership` (`id`),
  CONSTRAINT `fk_user_usermembership` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstname` varchar(45) DEFAULT NULL,
  `lastname` varchar(45) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(1000) DEFAULT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `date_of_birth` varchar(100) DEFAULT NULL,
  `is_deleted` int(11) DEFAULT '0',
  `is_admin` int(11) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `vehicle`
--

DROP TABLE IF EXISTS `vehicle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicle` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `vehicle_type_id` int(11) DEFAULT NULL,
  `make` varchar(45) DEFAULT NULL,
  `model` varchar(45) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `registration` varchar(45) DEFAULT NULL,
  `mileage` int(11) DEFAULT NULL,
  `last_time_of_service` varchar(45) DEFAULT NULL,
  `rental_location_id` int(11) DEFAULT NULL,
  `reserved` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_vehicletype_vehicle_idx` (`vehicle_type_id`),
  KEY `fk_rentallocation_vehicle_idx` (`rental_location_id`),
  CONSTRAINT `fk_rentallocation_vehicle` FOREIGN KEY (`rental_location_id`) REFERENCES `rental_location` (`id`),
  CONSTRAINT `fk_vehicletype_vehicle` FOREIGN KEY (`vehicle_type_id`) REFERENCES `vehicle_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `vehicle_type`
--

DROP TABLE IF EXISTS `vehicle_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vehicle_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-05-03 22:52:06
