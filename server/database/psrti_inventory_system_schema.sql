-- MySQL dump 10.16  Distrib 10.1.14-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: psrti_inventory
-- ------------------------------------------------------
-- Server version	10.1.14-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- -----------------------------------------------------
-- Schema psrti_inventory
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `psrti_inventory` ;

-- -----------------------------------------------------
-- Schema psrti_inventory
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `psrti_inventory` DEFAULT CHARACTER SET utf8 ;
USE `psrti_inventory` ;


--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accounts` (
  `username` varchar(20) NOT NULL,
  `password` varchar(500) DEFAULT NULL,
  `isAdmin` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `delivery_receipt`
--

DROP TABLE IF EXISTS `delivery_receipt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `delivery_receipt` (
  `id` varchar(20) NOT NULL,
  `total_quantity` int(11) DEFAULT NULL,
  `total_amount` decimal(20,2) DEFAULT NULL,
  `date_added` date DEFAULT NULL,
  `fund_cluster_name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`,`fund_cluster_name`),
  KEY `fk_delivery_receipt_fund_cluster1_idx` (`fund_cluster_name`),
  CONSTRAINT `fk_delivery_receipt_fund_cluster1` FOREIGN KEY (`fund_cluster_name`) REFERENCES `fund_cluster` (`name`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `delivery_receipt_has_item`
--

DROP TABLE IF EXISTS `delivery_receipt_has_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `delivery_receipt_has_item` (
  `delivery_receipt_id` varchar(20) NOT NULL,
  `item_id` bigint(20) NOT NULL,
  `quantity_added` int(11) DEFAULT NULL,
  `price` decimal(20,4) DEFAULT NULL,
  `amount` decimal(20,4) DEFAULT NULL,
  PRIMARY KEY (`delivery_receipt_id`,`item_id`),
  KEY `fk_delivery_receipt_has_item_item1_idx` (`item_id`),
  KEY `fk_delivery_receipt_has_item_delivery_receipt1_idx` (`delivery_receipt_id`),
  CONSTRAINT `fk_delivery_receipt_has_item_delivery_receipt1` FOREIGN KEY (`delivery_receipt_id`) REFERENCES `delivery_receipt` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_delivery_receipt_has_item_item1` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `fund_cluster`
--

DROP TABLE IF EXISTS `fund_cluster`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fund_cluster` (
  `name` varchar(20) NOT NULL,
  `total_quantity` decimal(20,4) DEFAULT NULL,
  `total_amount` decimal(20,4) DEFAULT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `fund_cluster_has_item`
--

DROP TABLE IF EXISTS `fund_cluster_has_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fund_cluster_has_item` (
  `fund_cluster_name` varchar(20) NOT NULL,
  `item_id` bigint(20) NOT NULL,
  `quantity` int(11) DEFAULT NULL,
  `price` decimal(20,4) DEFAULT NULL,
  `amount` decimal(20,4) DEFAULT NULL,
  PRIMARY KEY (`fund_cluster_name`,`item_id`),
  KEY `fk_fund_cluster_has_item_item1_idx` (`item_id`),
  KEY `fk_fund_cluster_has_item_fund_cluster1_idx` (`fund_cluster_name`),
  CONSTRAINT `fk_fund_cluster_has_item_fund_cluster1` FOREIGN KEY (`fund_cluster_name`) REFERENCES `fund_cluster` (`name`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_fund_cluster_has_item_item1` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ics`
--

DROP TABLE IF EXISTS `ics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ics` (
  `id` varchar(20) NOT NULL,
  `division` varchar(45) DEFAULT NULL,
  `date_added` date DEFAULT NULL,
  `responsible` varchar(45) DEFAULT NULL,
  `total_quantity` int(11) DEFAULT NULL,
  `total_amount` decimal(20,4) DEFAULT NULL,
  `delivery_receipt_id` varchar(20) NOT NULL,
  `delivery_receipt_fund_cluster_name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`,`delivery_receipt_id`,`delivery_receipt_fund_cluster_name`),
  KEY `fk_ics_delivery_receipt1_idx` (`delivery_receipt_id`,`delivery_receipt_fund_cluster_name`),
  CONSTRAINT `fk_ics_delivery_receipt1` FOREIGN KEY (`delivery_receipt_id`, `delivery_receipt_fund_cluster_name`) REFERENCES `delivery_receipt` (`id`, `fund_cluster_name`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ics_has_item`
--

DROP TABLE IF EXISTS `ics_has_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ics_has_item` (
  `ics_id` varchar(20) NOT NULL,
  `item_id` bigint(20) NOT NULL,
  `quantity_subtracted` int(11) DEFAULT NULL,
  `price` decimal(20,4) DEFAULT NULL,
  `amount` decimal(20,4) DEFAULT NULL,
  PRIMARY KEY (`ics_id`,`item_id`),
  KEY `fk_ics_has_item_item1_idx` (`item_id`),
  KEY `fk_ics_has_item_ics1_idx` (`ics_id`),
  CONSTRAINT `fk_ics_has_item_ics1` FOREIGN KEY (`ics_id`) REFERENCES `ics` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_ics_has_item_item1` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `item`
--

DROP TABLE IF EXISTS `item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `item` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `description` varchar(500) DEFAULT NULL,
  `unit` varchar(45) DEFAULT NULL,
  `item_code` varchar(45) DEFAULT NULL,
  `category` varchar(45) DEFAULT NULL,
  `isArchived` int(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=392 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `par`
--

DROP TABLE IF EXISTS `par`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `par` (
  `id` varchar(20) NOT NULL,
  `date_added` date DEFAULT NULL,
  `person_in_charge` varchar(45) DEFAULT NULL,
  `total_quantity` int(11) DEFAULT NULL,
  `total_amount` decimal(20,4) DEFAULT NULL,
  `delivery_receipt_id` varchar(20) NOT NULL,
  `delivery_receipt_fund_cluster_name` varchar(20) NOT NULL,
  `remarks` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`,`delivery_receipt_id`,`delivery_receipt_fund_cluster_name`),
  KEY `fk_par_delivery_receipt1_idx` (`delivery_receipt_id`,`delivery_receipt_fund_cluster_name`),
  CONSTRAINT `fk_par_delivery_receipt1` FOREIGN KEY (`delivery_receipt_id`, `delivery_receipt_fund_cluster_name`) REFERENCES `delivery_receipt` (`id`, `fund_cluster_name`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `par_has_item`
--

DROP TABLE IF EXISTS `par_has_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `par_has_item` (
  `par_id` varchar(20) NOT NULL,
  `item_id` bigint(20) NOT NULL,
  `property_number` varchar(45) DEFAULT NULL,
  `quantity_subtracted` int(11) DEFAULT NULL,
  `price` decimal(20,4) DEFAULT NULL,
  `amount` decimal(20,4) DEFAULT NULL,
  `serviceable` tinyint(1) NOT NULL DEFAULT '1',
  `current_quantity` int(11) DEFAULT NULL,
  PRIMARY KEY (`par_id`,`item_id`),
  KEY `fk_par_has_item_item1_idx` (`item_id`),
  KEY `fk_par_has_item_par1_idx` (`par_id`),
  CONSTRAINT `fk_par_has_item_item1` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_par_has_item_par1` FOREIGN KEY (`par_id`) REFERENCES `par` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ris`
--

DROP TABLE IF EXISTS `ris`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ris` (
  `id` varchar(20) NOT NULL,
  `division` varchar(45) DEFAULT NULL,
  `date_added` date DEFAULT NULL,
  `responsible` varchar(45) DEFAULT NULL,
  `total_quantity` int(11) DEFAULT NULL,
  `total_amount` decimal(20,4) DEFAULT NULL,
  `delivery_receipt_id` varchar(20) NOT NULL,
  `delivery_receipt_fund_cluster_name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`,`delivery_receipt_id`,`delivery_receipt_fund_cluster_name`),
  KEY `fk_ris_delivery_receipt1_idx` (`delivery_receipt_id`,`delivery_receipt_fund_cluster_name`),
  CONSTRAINT `fk_ris_delivery_receipt1` FOREIGN KEY (`delivery_receipt_id`, `delivery_receipt_fund_cluster_name`) REFERENCES `delivery_receipt` (`id`, `fund_cluster_name`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ris_has_item`
--

DROP TABLE IF EXISTS `ris_has_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ris_has_item` (
  `ris_id` varchar(20) NOT NULL,
  `item_id` bigint(20) NOT NULL,
  `quantity_subtracted` int(11) DEFAULT NULL,
  `price` decimal(20,4) DEFAULT NULL,
  `amount` decimal(20,4) DEFAULT NULL,
  `current_quantity` int(11) DEFAULT NULL,
  PRIMARY KEY (`ris_id`,`item_id`),
  KEY `fk_ris_has_item_item1_idx` (`item_id`),
  KEY `fk_ris_has_item_ris1_idx` (`ris_id`),
  CONSTRAINT `fk_ris_has_item_item1` FOREIGN KEY (`item_id`) REFERENCES `item` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_ris_has_item_ris1` FOREIGN KEY (`ris_id`) REFERENCES `ris` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-06-29 10:53:24
