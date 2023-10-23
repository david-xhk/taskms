USE `tms`;

SELECT * FROM `User`;
SELECT * FROM `Group`;
SELECT * FROM `User_Group`;
SELECT * FROM `Application`;
SELECT * FROM `App_Permit`;
SELECT * FROM `Plan`;
SELECT * FROM `Task`;
SELECT * FROM `Note`;

DELETE FROM `User` WHERE `username` IN ("new", "new1", "new2", "new3");
DELETE FROM `Group` WHERE `group` IN ("new", "new1", "new2");
DELETE FROM `User_Group` WHERE (`username`, `group`) IN (("user", "user"), ("new", "user"), ("new1", "user"), ("new2", "user"), ("admin", "admin"));

UPDATE `User` SET `active` = '0' WHERE `username` IN ('admin', 'admin2');

SELECT `username`, EXISTS (
	SELECT 1 FROM `User`
)
FROM `User` WHERE `username` IN ("user", "ba");

SELECT NOT EXISTS (
	SELECT 1 FROM `User` WHERE `username` = "aadmin"
) AS `available`;

SELECT NOT EXISTS(
	SELECT 1 FROM `User` WHERE `email` = 'admin@example.com'
) AS `notExists`;

SELECT COUNT(*) AS `count` FROM `User_Group`
WHERE `username` = "user1" AND `group` = "admin";

SELECT
	`User`.`username`,
    `email`,
    `active`,
    GROUP_CONCAT(`group` ORDER BY `User_Group`.`created_at` SEPARATOR ',') AS `Group`
FROM `User`
JOIN `User_Group`
	ON `User`.`username` = `User_Group`.`username`
WHERE `User`.`username` = "admin"
GROUP BY `User`.`username`;

SELECT `User`.*
FROM `User`
JOIN `User_Group`
ON `User`.`username` = `User_Group`.`username`
WHERE `group` IN ("admin");

SELECT NOT EXISTS (SELECT 1 FROM `User` WHERE `email` = "user@example.com") AS `notExists`;

SELECT NOT EXISTS (SELECT 1 FROM `Plan` WHERE `Plan_app_Acronym` = 'project' AND `Plan_MVP_name` = 'unknown') AS `notExists`;
