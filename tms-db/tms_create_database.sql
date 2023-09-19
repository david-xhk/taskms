-- CREATE DATABASE IF NOT EXISTS `tms` DEFAULT CHARACTER SET utf8mb4;

-- USE `tms`;

DROP TABLE IF EXISTS `user_groups`;
DROP TABLE IF EXISTS `groups`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `username` VARCHAR(32) NOT NULL,
  UNIQUE INDEX `username_idx` (`username` ASC) VISIBLE,  
  `email` VARCHAR(255),
  UNIQUE INDEX `email_idx` (`email` ASC) VISIBLE,
  `password` BINARY(60) NOT NULL,
  `active` BOOLEAN NOT NULL DEFAULT TRUE,
  `user_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO `users` (`username`, `email`, `password`, `active`) VALUES
	("admin", "admin@example.com", "$2a$10$Iw9uaPO1FHnDIcvnzCyST.yxTi2FhlVwdnZJiC.9ptqkasceNb3UG", true),
	("admin2", "admin2@example.com", "$2a$10$Iw9uaPO1FHnDIcvnzCyST.yxTi2FhlVwdnZJiC.9ptqkasceNb3UG", true),
  ("inactive", "inactive@example.com", "$2a$10$Iw9uaPO1FHnDIcvnzCyST.yxTi2FhlVwdnZJiC.9ptqkasceNb3UG", false),
  ("user", "user@example.com", "$2a$10$Iw9uaPO1FHnDIcvnzCyST.yxTi2FhlVwdnZJiC.9ptqkasceNb3UG", true),
  ("user1", "user1@example.com", "$2a$10$Iw9uaPO1FHnDIcvnzCyST.yxTi2FhlVwdnZJiC.9ptqkasceNb3UG", true),
  ("user2", "user2@example.com", "$2a$10$Iw9uaPO1FHnDIcvnzCyST.yxTi2FhlVwdnZJiC.9ptqkasceNb3UG", true),
  ("user3", "user3@example.com", "$2a$10$Iw9uaPO1FHnDIcvnzCyST.yxTi2FhlVwdnZJiC.9ptqkasceNb3UG", true);

CREATE TABLE `groups` (
  `group` VARCHAR(50) NOT NULL,
  UNIQUE INDEX `group_idx` (`group` ASC) VISIBLE,
  `group_id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO `groups` (`group`) VALUES ("admin"), ("user");

CREATE TABLE `user_groups` (
  `username` VARCHAR(32) NOT NULL,
  FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE,
  `group` VARCHAR(50) NOT NULL,
  FOREIGN KEY (`group`) REFERENCES `groups` (`group`) ON DELETE CASCADE,
  PRIMARY KEY (`username`, `group`),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO `user_groups` (`username`, `group`) VALUES
  ("admin", "admin"),
  ("admin2", "admin"),
  ("user", "user");
