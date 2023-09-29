-- Database --
DROP DATABASE IF EXISTS `tms`;
CREATE DATABASE `tms` DEFAULT CHARACTER SET "utf8mb4";
USE `tms`;

-- Tables --
DROP TABLE IF EXISTS `task_notes`;
DROP TABLE IF EXISTS `project_tasks`;
DROP TABLE IF EXISTS `project_plans`;
DROP TABLE IF EXISTS `project_permits`;
DROP TABLE IF EXISTS `projects`;
DROP TABLE IF EXISTS `user_groups`;
DROP TABLE IF EXISTS `groups`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `username` VARCHAR(32) NOT NULL,
  `email` VARCHAR(255) NULL,
  `password` BINARY(60) NOT NULL,
  `active` BOOLEAN NULL DEFAULT TRUE,
  `groups` TEXT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`username`),
  UNIQUE INDEX `email_index` (`email` ASC) VISIBLE
);

CREATE TABLE `groups` (
  `group` VARCHAR(32) NOT NULL,
  `num_users` INT NULL DEFAULT 0,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`group`)
);

CREATE TABLE `user_groups` (
  `username` VARCHAR(32) NOT NULL,
  `group` VARCHAR(32) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`username`, `group`),
  FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE,
  FOREIGN KEY (`group`) REFERENCES `groups` (`group`) ON DELETE CASCADE
);

CREATE TABLE `projects` (
  `project_name` VARCHAR(32) NOT NULL,
  `running_num` INT NULL DEFAULT 1,
  `permit_create` TEXT NULL,
  `permit_open` TEXT NULL,
  `permit_todo` TEXT NULL,
  `permit_doing` TEXT NULL,
  `permit_done` TEXT NULL,
  `start_date` DATE NULL,
  `end_date` DATE NULL,
  `description` TEXT NULL,
  `num_plans` INT NULL DEFAULT 0,
  `num_tasks` INT NULL DEFAULT 0,
  `created_by` VARCHAR(32) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`project_name`),
  FOREIGN KEY (`created_by`) REFERENCES `users` (`username`) ON DELETE RESTRICT
);

CREATE TABLE `project_permits` (
  `project_name` VARCHAR(32) NOT NULL,
  `permit` ENUM ("create", "open", "todo", "doing", "done") NOT NULL,
  `group` VARCHAR(32) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`project_name`, `permit`, `group`),
  FOREIGN KEY (`project_name`) REFERENCES `projects` (`project_name`) ON DELETE CASCADE,
  FOREIGN KEY (`group`) REFERENCES `groups` (`group`) ON DELETE CASCADE
);

CREATE TABLE `project_plans` (
  `project_name` VARCHAR(32) NOT NULL,
  `plan_name` VARCHAR(32) NOT NULL,
  `colour` VARCHAR(9) NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `num_tasks` INT NULL DEFAULT 0,
  `created_by` VARCHAR(32) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`project_name`, `plan_name`),
  FOREIGN KEY (`project_name`) REFERENCES `projects` (`project_name`) ON DELETE RESTRICT,
  FOREIGN KEY (`created_by`) REFERENCES `users` (`username`) ON DELETE RESTRICT
);

CREATE TABLE `project_tasks` (
  `project_name` VARCHAR(32) NOT NULL,
  `task_id` VARCHAR(43) NOT NULL,
  `task_name` VARCHAR(32) NOT NULL,
  `description` TEXT NOT NULL,
  `state` ENUM ("open", "todo", "doing", "done", "closed") NOT NULL,
  `plan_name` VARCHAR(32) NULL,
  `num_notes` INT NULL DEFAULT 0,
  `created_by` VARCHAR(32) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` VARCHAR(32) NOT NULL,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`task_id`),
  FOREIGN KEY (`project_name`) REFERENCES `projects` (`project_name`) ON DELETE RESTRICT,
  FOREIGN KEY (`project_name`, `plan_name`) REFERENCES `project_plans` (`project_name`, `plan_name`) ON DELETE RESTRICT,
  FOREIGN KEY (`created_by`) REFERENCES `users` (`username`) ON DELETE RESTRICT,
  FOREIGN KEY (`updated_by`) REFERENCES `users` (`username`) ON DELETE RESTRICT
);

CREATE TABLE `task_notes` (
  `task_id` VARCHAR(43) NOT NULL,
  `note_id` VARCHAR(54) NOT NULL,
  `content` TEXT NOT NULL,
  `created_by` VARCHAR(32) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`note_id`),
  FOREIGN KEY (`task_id`) REFERENCES `project_tasks` (`task_id`) ON DELETE RESTRICT,
  FOREIGN KEY (`created_by`) REFERENCES `users` (`username`) ON DELETE RESTRICT
);


-- Procedures --
DROP PROCEDURE IF EXISTS `update_user_groups`;
DROP PROCEDURE IF EXISTS `update_project_permits`;

DELIMITER //
CREATE PROCEDURE `update_user_groups`(
  IN `username` VARCHAR(32),
  IN `group` VARCHAR(32),
  IN `statement` ENUM("insert", "delete")
)
BEGIN
  UPDATE `users`
  SET `groups` = (
    SELECT GROUP_CONCAT(`user_groups`.`group` ORDER BY `user_groups`.`created_at` SEPARATOR ',')
    FROM `user_groups`
    WHERE `user_groups`.`username` = `username`
  )
  WHERE `users`.`username` = `username`;
  CASE `statement`
    WHEN "insert" THEN
	  UPDATE `groups` SET `num_users` = `num_users` + 1 WHERE `groups`.`group` = `group`;
    ELSE
	  UPDATE `groups` SET `num_users` = `num_users` - 1 WHERE `groups`.`group` = `group`;
  END CASE;
END //

CREATE PROCEDURE `update_project_permits`(
  IN `project_name` VARCHAR(32),
  IN `permit` ENUM ("create", "open", "todo", "doing", "done")
)
BEGIN
  SET @`groups` = (
    SELECT GROUP_CONCAT(`project_permits`.`group` ORDER BY `project_permits`.`created_at` SEPARATOR ',')
    FROM `project_permits`
    WHERE `project_permits`.`project_name` = `project_name`
    AND `project_permits`.`permit` = `permit`
  );
  CASE `permit`
    WHEN "create" THEN
		UPDATE `projects` SET `permit_create` = @`groups` WHERE `projects`.`project_name` = `project_name`;
    WHEN "open" THEN
		UPDATE `projects` SET `permit_open` = @`groups` WHERE `projects`.`project_name` = `project_name`;
    WHEN "todo" THEN
		UPDATE `projects` SET `permit_todo` = @`groups` WHERE `projects`.`project_name` = `project_name`;
    WHEN "doing" THEN
		UPDATE `projects` SET `permit_doing` = @`groups` WHERE `projects`.`project_name` = `project_name`;
    ELSE
		UPDATE `projects` SET `permit_done` = @`groups` WHERE `projects`.`project_name` = `project_name`;
  END CASE;
END //
DELIMITER ;


-- Triggers --
CREATE TRIGGER `user_groups_after_insert`
AFTER INSERT ON `user_groups`
FOR EACH ROW
CALL `update_user_groups`(NEW.`username`, NEW.`group`, "insert");

CREATE TRIGGER `user_groups_after_delete`
AFTER DELETE ON `user_groups`
FOR EACH ROW
CALL `update_user_groups`(OLD.`username`, OLD.`group`, "delete");

CREATE TRIGGER `project_permits_after_insert`
AFTER INSERT ON `project_permits`
FOR EACH ROW
CALL `update_project_permits`(NEW.`project_name`, NEW.`permit`);

CREATE TRIGGER `project_permits_after_delete`
AFTER DELETE ON `project_permits`
FOR EACH ROW
CALL `update_project_permits`(OLD.`project_name`, OLD.`permit`);

CREATE TRIGGER `project_plans_after_insert`
AFTER INSERT ON `project_plans`
FOR EACH ROW
UPDATE `projects`
SET `num_plans` = `num_plans` + 1
WHERE `projects`.`project_name` = NEW.`project_name`;

DELIMITER //
CREATE TRIGGER `project_tasks_before_insert`
BEFORE INSERT ON `project_tasks`
FOR EACH ROW
BEGIN
  SET @`running_num` = (SELECT `running_num` FROM `projects` WHERE `projects`.`project_name` = NEW.`project_name`);
  SET NEW.`task_id` = CONCAT(NEW.`project_name`, "_", @`running_num`);
  SET NEW.`state` = "open";
  SET NEW.`updated_by` = NEW.`created_by`;
END //

CREATE TRIGGER `project_tasks_after_insert`
AFTER INSERT ON `project_tasks`
FOR EACH ROW
BEGIN
  UPDATE `projects`
  SET
    `running_num` = `running_num` + 1,
    `num_tasks` = `num_tasks` + 1
  WHERE `projects`.`project_name` = NEW.`project_name`;
  IF NEW.`plan_name` IS NOT NULL THEN
	UPDATE `project_plans`
    SET `num_tasks` = `num_tasks` + 1
    WHERE `project_plans`.`project_name` = NEW.`project_name`
    AND `project_plans`.`plan_name` = NEW.`plan_name`;
  END IF;
END //

CREATE TRIGGER `project_tasks_before_update`
BEFORE UPDATE ON `project_tasks`
FOR EACH ROW
BEGIN
  IF OLD.`plan_name` IS NULL AND NEW.`plan_name` IS NOT NULL THEN
	UPDATE `project_plans`
    SET `num_tasks` = `num_tasks` + 1
    WHERE `project_plans`.`project_name` = NEW.`project_name`
    AND `project_plans`.`plan_name` = NEW.`plan_name`;
  ELSEIF OLD.`plan_name` IS NOT NULL AND NEW.`plan_name` IS NULL THEN
	UPDATE `project_plans`
    SET `num_tasks` = `num_tasks` - 1
    WHERE `project_plans`.`project_name` = NEW.`project_name`
    AND `project_plans`.`plan_name` = NEW.`plan_name`;
  END IF;
END //

CREATE TRIGGER `task_notes_before_insert`
BEFORE INSERT ON `task_notes`
FOR EACH ROW
BEGIN
  SET @`running_num` = (SELECT `num_notes` FROM `project_tasks` WHERE `project_tasks`.`task_id` = NEW.`task_id`);
  SET NEW.`note_id` = CONCAT(NEW.`task_id`, "_", @`running_num` + 1);
END //
DELIMITER ;

CREATE TRIGGER `task_notes_after_insert`
AFTER INSERT ON `task_notes`
FOR EACH ROW
UPDATE `project_tasks`
SET `num_notes` = `num_notes` + 1
WHERE `project_tasks`.`task_id` = NEW.`task_id`;


-- Default values --
INSERT INTO `users`
  (`username`, `email`, `password`, `active`)
VALUES
  ("user", "user@example.com", "$2a$10$Iw9uaPO1FHnDIcvnzCyST.yxTi2FhlVwdnZJiC.9ptqkasceNb3UG", true),
  ("admin", "admin@example.com", "$2a$10$Iw9uaPO1FHnDIcvnzCyST.yxTi2FhlVwdnZJiC.9ptqkasceNb3UG", true),
  ("admin2", "admin2@example.com", "$2a$10$Iw9uaPO1FHnDIcvnzCyST.yxTi2FhlVwdnZJiC.9ptqkasceNb3UG", true),
  ("pl", "pl@example.com", "$2a$10$Iw9uaPO1FHnDIcvnzCyST.yxTi2FhlVwdnZJiC.9ptqkasceNb3UG", true),
  ("pl2", "pl2@example.com", "$2a$10$Iw9uaPO1FHnDIcvnzCyST.yxTi2FhlVwdnZJiC.9ptqkasceNb3UG", true),
  ("pm", "pm@example.com", "$2a$10$Iw9uaPO1FHnDIcvnzCyST.yxTi2FhlVwdnZJiC.9ptqkasceNb3UG", true),
  ("pm2", "pm2@example.com", "$2a$10$Iw9uaPO1FHnDIcvnzCyST.yxTi2FhlVwdnZJiC.9ptqkasceNb3UG", true),
  ("dev", "dev@example.com", "$2a$10$Iw9uaPO1FHnDIcvnzCyST.yxTi2FhlVwdnZJiC.9ptqkasceNb3UG", true),
  ("dev2", "dev2@example.com", "$2a$10$Iw9uaPO1FHnDIcvnzCyST.yxTi2FhlVwdnZJiC.9ptqkasceNb3UG", true),
  ("inactive", "inactive@example.com", "$2a$10$Iw9uaPO1FHnDIcvnzCyST.yxTi2FhlVwdnZJiC.9ptqkasceNb3UG", false);

INSERT INTO `groups`
  (`group`)
VALUES
  ("admin"),
  ("pl"),
  ("pm"),
  ("devops");

INSERT INTO `user_groups`
  (`username`, `group`)
VALUES
  ("admin", "admin"),
  ("admin2", "admin"),
  ("inactive", "admin"),
  ("inactive", "pl"),
  ("inactive", "pm"),
  ("pl", "pl"),
  ("pl2", "pl"),
  ("pm", "pm"),
  ("pm2", "pm"),
  ("dev", "devops"),
  ("dev2", "devops");

INSERT INTO `projects`
  (`project_name`, `running_num`, `created_by`)
VALUES
  ("project", 1, "pl");

INSERT INTO `project_permits`
  (`project_name`, `permit`, `group`)
VALUES
  ("project", "create", "pl"),
  ("project", "open", "pm"),
  ("project", "todo", "devops"),
  ("project", "doing", "devops"),
  ("project", "done", "pl");

INSERT INTO `project_plans`
  (`project_name`, `plan_name`, `colour`, `start_date`, `end_date`, `created_by`)
VALUES
  ("project", "plan", "#ffffff", "2023-09-01", "2023-10-01", "pm");

INSERT INTO `project_tasks`
  (`project_name`, `task_name`, `plan_name`, `description`, `created_by`)
VALUES
  ("project", "task", "plan", "description", "pl"),
  ("project", "task_doing", "plan", "description", "pl");

UPDATE `project_tasks`
SET `state` = "doing"
WHERE `task_id` = "project_2";

INSERT INTO `task_notes`
  (`task_id`, `content`, `created_by`)
VALUES
  ("project_1", "note", "pl");
