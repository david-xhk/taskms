-- Database --
DROP DATABASE IF EXISTS `tms`;
CREATE DATABASE `tms` DEFAULT CHARACTER SET 'utf8mb4';
USE `tms`;

-- Tables --
DROP TABLE IF EXISTS `Note`;
DROP TABLE IF EXISTS `Task`;
DROP TABLE IF EXISTS `Plan`;
DROP TABLE IF EXISTS `App_Permit`;
DROP TABLE IF EXISTS `Application`;
DROP TABLE IF EXISTS `User_Group`;
DROP TABLE IF EXISTS `Group`;
DROP TABLE IF EXISTS `User`;

CREATE TABLE `User` (
  `username` VARCHAR(32) NOT NULL,
  `password` BINARY(60) NOT NULL,
  `email` VARCHAR(254) NULL,
  `active` BOOLEAN NULL DEFAULT TRUE,
  `groups` TEXT NULL,
  `created_at` TIMESTAMP(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` TIMESTAMP(3) NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`username`),
  UNIQUE INDEX `email_index` (`email` ASC) VISIBLE
);

CREATE TABLE `Application` (
  `App_Acronym` VARCHAR(32) NOT NULL,
  `App_Description` TEXT NULL,
  `App_Rnumber` INT NULL DEFAULT 1,
  `App_startDate` DATE NULL,
  `App_endDate` DATE NULL,
  `App_permit_Create` TEXT NULL,
  `App_permit_Open` TEXT NULL,
  `App_permit_toDoList` TEXT NULL,
  `App_permit_Doing` TEXT NULL,
  `App_permit_Done` TEXT NULL,
  `num_plans` INT NULL DEFAULT 0,
  `num_tasks` INT NULL DEFAULT 0,
  `created_by` VARCHAR(32) NOT NULL,
  `created_at` TIMESTAMP(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` TIMESTAMP(3) NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`App_Acronym`),
  FOREIGN KEY (`created_by`) REFERENCES `User` (`username`) ON DELETE RESTRICT
);

CREATE TABLE `Plan` (
  `Plan_MVP_name` VARCHAR(32) NOT NULL,
  `Plan_startDate` DATE NULL,
  `Plan_endDate` DATE NULL,
  `Plan_app_Acronym` VARCHAR(32) NOT NULL,
  `colour` VARCHAR(9) NOT NULL,
  `num_tasks` INT NULL DEFAULT 0,
  `created_by` VARCHAR(32) NOT NULL,
  `created_at` TIMESTAMP(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` TIMESTAMP(3) NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`Plan_app_Acronym`, `Plan_MVP_name`),
  FOREIGN KEY (`Plan_app_Acronym`) REFERENCES `Application` (`App_Acronym`) ON DELETE RESTRICT,
  FOREIGN KEY (`created_by`) REFERENCES `User` (`username`) ON DELETE RESTRICT
);

CREATE TABLE `Task` (
  `Task_name` VARCHAR(32) NOT NULL,
  `Task_description` TEXT NULL,
  `Task_notes` TEXT NOT NULL,
  `Task_id` VARCHAR(43) NOT NULL,
  `Task_plan` VARCHAR(32) NULL,
  `Task_app_Acronym` VARCHAR(32) NOT NULL,
  `Task_state` ENUM ('open', 'todo', 'doing', 'done', 'closed') NULL,
  `Task_creator` VARCHAR(32) NOT NULL,
  `Task_owner` VARCHAR(32) NOT NULL,
  `Task_createDate` TIMESTAMP(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
  `Task_color` VARCHAR(9) NULL,
  `num_notes` INT NOT NULL,
  `updated_at` TIMESTAMP(3) NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`Task_id`),
  FOREIGN KEY (`Task_app_Acronym`) REFERENCES `Application` (`App_Acronym`) ON DELETE RESTRICT,
  FOREIGN KEY (`Task_app_Acronym`, `Task_plan`) REFERENCES `Plan` (`Plan_app_Acronym`, `Plan_MVP_name`) ON DELETE RESTRICT,
  FOREIGN KEY (`Task_creator`) REFERENCES `User` (`username`) ON DELETE RESTRICT,
  FOREIGN KEY (`Task_owner`) REFERENCES `User` (`username`) ON DELETE RESTRICT
);


-- Peripheral Tables --
CREATE TABLE `Group` (
  `group` VARCHAR(32) NOT NULL,
  `num_users` INT NULL DEFAULT 0,
  `created_at` TIMESTAMP(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`group`)
);

CREATE TABLE `User_Group` (
  `username` VARCHAR(32) NOT NULL,
  `group` VARCHAR(32) NOT NULL,
  `created_at` TIMESTAMP(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`username`, `group`),
  FOREIGN KEY (`username`) REFERENCES `User` (`username`) ON DELETE CASCADE,
  FOREIGN KEY (`group`) REFERENCES `Group` (`group`) ON DELETE CASCADE
);

CREATE TABLE `App_Permit` (
  `App_Acronym` VARCHAR(32) NOT NULL,
  `permit` ENUM ('create', 'open', 'todo', 'doing', 'done') NOT NULL,
  `group` VARCHAR(32) NOT NULL,
  `created_at` TIMESTAMP(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`App_Acronym`, `permit`, `group`),
  FOREIGN KEY (`App_Acronym`) REFERENCES `Application` (`App_Acronym`) ON DELETE CASCADE,
  FOREIGN KEY (`group`) REFERENCES `Group` (`group`) ON DELETE CASCADE
);

CREATE TABLE `Note` (
  `Task_id` VARCHAR(43) NULL,
  `note_id` VARCHAR(54) NOT NULL,
  `content` TEXT NOT NULL,
  `task_state` ENUM ('open', 'todo', 'doing', 'done', 'closed') NULL,
  `note_type` ENUM ('new task', 'update task', 'user note') NOT NULL,
  `created_by` VARCHAR(32) NOT NULL,
  `created_at` TIMESTAMP(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`note_id`),
  FOREIGN KEY (`Task_id`) REFERENCES `Task` (`Task_id`) ON DELETE RESTRICT,
  FOREIGN KEY (`created_by`) REFERENCES `User` (`username`) ON DELETE RESTRICT
);


-- Procedures --
DROP PROCEDURE IF EXISTS `update_user_group`;
DROP PROCEDURE IF EXISTS `update_app_permit`;

DELIMITER //
CREATE PROCEDURE `update_user_group`(
  IN `username` VARCHAR(32),
  IN `group` VARCHAR(32),
  IN `statement` ENUM('insert', 'delete')
)
BEGIN
  UPDATE `User`
  SET `groups` = (
    SELECT GROUP_CONCAT(`User_Group`.`group` ORDER BY `User_Group`.`created_at` SEPARATOR ',')
    FROM `User_Group`
    WHERE `User_Group`.`username` = `username`
  )
  WHERE `User`.`username` = `username`;
  CASE `statement`
    WHEN 'insert' THEN
	  UPDATE `Group` SET `num_users` = `num_users` + 1 WHERE `Group`.`group` = `group`;
    ELSE
	  UPDATE `Group` SET `num_users` = `num_users` - 1 WHERE `Group`.`group` = `group`;
  END CASE;
END //

CREATE PROCEDURE `update_app_permit`(
  IN `App_Acronym` VARCHAR(32),
  IN `permit` ENUM ('create', 'open', 'todo', 'doing', 'done')
)
BEGIN
  SET @`groups` = (
    SELECT GROUP_CONCAT(`App_Permit`.`group` ORDER BY `App_Permit`.`created_at` SEPARATOR ',')
    FROM `App_Permit`
    WHERE `App_Permit`.`App_Acronym` = `App_Acronym`
    AND `App_Permit`.`permit` = `permit`
  );
  CASE `permit`
    WHEN 'create' THEN
		UPDATE `Application` SET `App_permit_Create` = @`groups` WHERE `Application`.`App_Acronym` = `App_Acronym`;
    WHEN 'open' THEN
		UPDATE `Application` SET `App_permit_Open` = @`groups` WHERE `Application`.`App_Acronym` = `App_Acronym`;
    WHEN 'todo' THEN
		UPDATE `Application` SET `App_permit_toDoList` = @`groups` WHERE `Application`.`App_Acronym` = `App_Acronym`;
    WHEN 'doing' THEN
		UPDATE `Application` SET `App_permit_Doing` = @`groups` WHERE `Application`.`App_Acronym` = `App_Acronym`;
    ELSE
		UPDATE `Application` SET `App_permit_Done` = @`groups` WHERE `Application`.`App_Acronym` = `App_Acronym`;
  END CASE;
END //
DELIMITER ;


-- Triggers --
CREATE TRIGGER `user_group_after_insert`
AFTER INSERT ON `User_Group`
FOR EACH ROW
CALL `update_user_group`(NEW.`username`, NEW.`group`, 'insert');

CREATE TRIGGER `user_group_after_delete`
AFTER DELETE ON `User_Group`
FOR EACH ROW
CALL `update_user_group`(OLD.`username`, OLD.`group`, 'delete');

CREATE TRIGGER `app_permit_after_insert`
AFTER INSERT ON `App_Permit`
FOR EACH ROW
CALL `update_app_permit`(NEW.`App_Acronym`, NEW.`permit`);

CREATE TRIGGER `app_permit_after_delete`
AFTER DELETE ON `App_Permit`
FOR EACH ROW
CALL `update_app_permit`(OLD.`App_Acronym`, OLD.`permit`);

CREATE TRIGGER `plan_after_insert`
AFTER INSERT ON `Plan`
FOR EACH ROW
UPDATE `Application`
SET `num_plans` = `num_plans` + 1
WHERE `Application`.`App_Acronym` = NEW.`Plan_app_Acronym`;

DELIMITER //
CREATE TRIGGER `task_before_insert`
BEFORE INSERT ON `Task`
FOR EACH ROW
BEGIN
  SET @`App_Rnumber` = (
    SELECT `App_Rnumber`
    FROM `Application`
    WHERE `Application`.`App_Acronym` = NEW.`Task_app_Acronym`
  );
  SET NEW.`Task_id` = CONCAT(NEW.`Task_app_Acronym`, '_', @`App_Rnumber`);
  SET NEW.`Task_owner` = NEW.`Task_creator`;
  SET @`new_task_note` = CONCAT('Task name: ', NEW.`Task_name`, '\nTask app acronym: ', NEW.`Task_app_Acronym`, '\nTask plan: ', IFNULL(NEW.`Task_plan`, 'null'), '\nTask description:\n', NEW.`Task_description`);
  SET NEW.`Task_notes` = CONCAT('Logon UserID: ', NEW.`Task_creator`, '\nCurrent State: null\nCurrent Timestamp: ', NEW.`Task_createDate`, '\nNote Type: new task\nNote Content:\n', @`new_task_note`, '\n--END NOTE--\n\n');
  SET NEW.`num_notes` = 1;
  IF NEW.`Task_plan` IS NOT NULL THEN
    SET NEW.`Task_color` = (
      SELECT `colour`
      FROM `Plan`
      WHERE `Plan`.`Plan_app_Acronym` = NEW.`Task_app_Acronym`
      AND `Plan`.`Plan_MVP_name` = NEW.`Task_plan`
	);
  END IF;
  SET foreign_key_checks=0;
  INSERT INTO `Note`
    (`Task_id`, `content`, `note_type`, `created_by`)
  VALUES
    (NEW.`Task_id`, @`new_task_note`, 'new task', NEW.`Task_creator`);
  SET foreign_key_checks=1;
END //

CREATE TRIGGER `task_after_insert`
AFTER INSERT ON `Task`
FOR EACH ROW
BEGIN
  UPDATE `Application`
  SET
    `App_Rnumber` = `App_Rnumber` + 1,
    `num_tasks` = `num_tasks` + 1
  WHERE `Application`.`App_Acronym` = NEW.`Task_app_Acronym`;
  IF NEW.`Task_plan` IS NOT NULL THEN
	UPDATE `Plan`
    SET `num_tasks` = `num_tasks` + 1
    WHERE `Plan`.`Plan_app_Acronym` = NEW.`Task_app_Acronym`
    AND `Plan`.`Plan_MVP_name` = NEW.`Task_plan`;
  END IF;
END //

CREATE TRIGGER `task_before_update`
BEFORE UPDATE ON `Task`
FOR EACH ROW
BEGIN
  IF OLD.`Task_plan` != NEW.`Task_plan` THEN
    IF NEW.`Task_plan` IS NULL THEN
      SET NEW.`Task_color` = NULL;
    ELSE
      SET NEW.`Task_color` = (
        SELECT `colour`
        FROM `Plan`
        WHERE `Plan`.`Plan_app_Acronym` = NEW.`Task_app_Acronym`
        AND `Plan`.`Plan_MVP_name` = NEW.`Task_plan`
      );  
    END IF;
  END IF;
END //

CREATE TRIGGER `task_after_update`
AFTER UPDATE ON `Task`
FOR EACH ROW
BEGIN
  IF OLD.`Task_plan` != NEW.`Task_plan` THEN
    IF OLD.`Task_plan` IS NOT NULL THEN
      UPDATE `Plan`
      SET `num_tasks` = `num_tasks` - 1
      WHERE `Plan`.`Plan_app_Acronym` = OLD.`Task_app_Acronym`
      AND `Plan`.`Plan_MVP_name` = OLD.`Task_plan`;
    END IF;
    IF NEW.`Task_plan` IS NOT NULL THEN
      UPDATE `Plan`
      SET `num_tasks` = `num_tasks` + 1
      WHERE `Plan`.`Plan_app_Acronym` = NEW.`Task_app_Acronym`
      AND `Plan`.`Plan_MVP_name` = NEW.`Task_plan`;
    END IF;
  END IF;
END //

CREATE TRIGGER `note_before_insert`
BEFORE INSERT ON `Note`
FOR EACH ROW
BEGIN
  IF (SELECT EXISTS (SELECT 1 FROM `Task` WHERE `Task_id` = NEW.`Task_id`)) THEN
    SET @`Task_Rnumber` = (
      SELECT `num_notes`
      FROM `Task`
      WHERE `Task`.`Task_id` = NEW.`Task_id`
	);
    SET NEW.`note_id` = CONCAT(NEW.`Task_id`, '_', @`Task_Rnumber` + 1);
    SET NEW.`task_state` = (
      SELECT `Task_state`
      FROM `Task`
      WHERE `Task`.`Task_id` = NEW.`Task_id`
	);
  ELSE
    SET NEW.`note_id` = CONCAT(NEW.`Task_id`, '_', 0);
  END IF;
END //

CREATE TRIGGER `note_after_insert`
AFTER INSERT ON `Note`
FOR EACH ROW
BEGIN
  IF (SELECT EXISTS (SELECT 1 FROM `Task` WHERE `Task_id` = NEW.`Task_id`)) THEN
    UPDATE `Task`
    SET
      `Task_notes` = CONCAT('Logon UserID: ', NEW.`created_by`, '\nCurrent State: ', IFNULL(`Task_state`, 'null'), '\nCurrent Timestamp: ', NEW.`created_at`, '\nNote Type: ', NEW.`note_type`, '\nNote Content:\n', NEW.`content`, '\n--END NOTE--\n\n', `Task_notes`),
      `num_notes` = `num_notes` + 1
    WHERE `Task`.`Task_id` = NEW.`Task_id`;
  END IF;
END //
DELIMITER ;
