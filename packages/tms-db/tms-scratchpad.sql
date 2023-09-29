-- USE `tms`;

SELECT * FROM `users`;
SELECT * FROM `groups`;
SELECT * FROM `user_groups`;
SELECT * FROM `projects`;
SELECT * FROM `project_permits`;
SELECT * FROM `project_plans`;
SELECT * FROM `project_tasks`;
SELECT * FROM `task_notes`;

DELETE FROM `users` WHERE `username` IN ("new", "new1", "new2", "new3");
DELETE FROM `groups` WHERE `group` IN ("new", "new1", "new2");
DELETE FROM `user_groups` WHERE (`username`, `group`) IN (("user", "user"), ("new", "user"), ("new1", "user"), ("new2", "user"), ("admin", "admin"));

UPDATE `users` SET `active` = '0' WHERE `username` IN ('admin', 'admin2');

SELECT `username`, EXISTS (
	SELECT 1 FROM `users`
)
FROM `users` WHERE `username` IN ("user", "ba");

SELECT NOT EXISTS (
	SELECT 1 FROM `users` WHERE `username` = "aadmin"
) AS `available`;

SELECT NOT EXISTS(
	SELECT 1 FROM `users` WHERE `email` = 'admin@example.com'
) AS `notExists`;

SELECT COUNT(*) AS `count` FROM `user_groups`
WHERE `username` = "user1" AND `group` = "admin";

SELECT
	`users`.`username`,
    `email`,
    `active`,
    GROUP_CONCAT(`group` ORDER BY `user_groups`.`created_at` SEPARATOR ',') AS `groups`
FROM `users`
JOIN `user_groups`
	ON `users`.`username` = `user_groups`.`username`
WHERE `users`.`username` = "admin"
GROUP BY `users`.`username`;

SELECT `users`.*
FROM `users`
JOIN `user_groups`
ON `users`.`username` = `user_groups`.`username`
WHERE `group` IN ("admin");

SELECT NOT EXISTS (SELECT 1 FROM `users` WHERE `email` = "user@example.com") AS `notExists`;
