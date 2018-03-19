/*
SQLyog Enterprise - MySQL GUI v8.12 
MySQL - 5.6.21 : Database - calories
*********************************************************************
*/
/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

CREATE DATABASE /*!32312 IF NOT EXISTS*/`calories` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `calories`;

/*Table structure for table `calories` */

DROP TABLE IF EXISTS `calories`;

CREATE TABLE `calories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `meal` varchar(50) NOT NULL,
  `calories` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8;

/*Data for the table `calories` */

insert  into `calories`(`id`,`date`,`time`,`meal`,`calories`,`user_id`) values (23,'2017-12-12','04:30:00','meal',230,0),(27,'2016-11-16','18:00:00','edited',545,4),(30,'2016-11-15','00:00:00','edited',333,4),(38,'2016-11-15','15:00:00','fd',232,4),(53,'2016-11-09','04:00:00','aaatest',333,4),(57,'2016-11-22','05:00:00','asd',333,4),(58,'2016-11-15','05:00:00','test',333,4),(59,'2016-11-24','05:00:00','test3',333,4),(62,'2016-09-26','00:35:00','meat',24,4),(63,'2016-10-19','07:36:00','cake',525,4);

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `setting` int(11) DEFAULT NULL,
  `role` varchar(1) NOT NULL,
  `auth_token` varchar(32) DEFAULT NULL,
  `auth_expire` bigint(20) DEFAULT NULL,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8;

/*Data for the table `users` */

insert  into `users`(`id`,`username`,`password`,`setting`,`role`,`auth_token`,`auth_expire`) values (1,'admin','21232f297a57a5a743894a0e4a801fc3',123,'0','55c7b141da81f54a85fa1a209ad81259',1479217787),(3,'usermanager','f9a67e8dcd4c90ed2c0916f3e86c424c',459,'1','57cd807c12f7b0cd9bd5e82a637482a2',1479217158),(4,'regularuser','7f4f225298a70f22e1e46645d3f5e60f',4321,'2','58fb541a7228e7e8ed8575346e0f5541',1479216970),(7,'regularuser2','regularuser2',300,'2',NULL,NULL),(33,'paul','6c63212ab48e8401eaf6b59b95d816a9',389,'2',NULL,NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
