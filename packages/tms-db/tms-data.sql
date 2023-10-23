USE `tms`;

INSERT INTO `User`
  (`username`, `password`, `email`, `active`)
VALUES
  -- ('user', '$2a$10$Iw9uaPO1FHnDIcvnzCyST.yxTi2FhlVwdnZJiC.9ptqkasceNb3UG', 'user@example.com', true),
  -- ('inactive', '$2a$10$Iw9uaPO1FHnDIcvnzCyST.yxTi2FhlVwdnZJiC.9ptqkasceNb3UG', 'inactive@example.com', false),
  ('admin', '$2a$10$Iw9uaPO1FHnDIcvnzCyST.yxTi2FhlVwdnZJiC.9ptqkasceNb3UG', 'admin@example.com', true),
  ('pl', '$2a$10$Iw9uaPO1FHnDIcvnzCyST.yxTi2FhlVwdnZJiC.9ptqkasceNb3UG', 'pl@example.com', true),
  ('pm', '$2a$10$Iw9uaPO1FHnDIcvnzCyST.yxTi2FhlVwdnZJiC.9ptqkasceNb3UG', 'pm@example.com', true),
  ('dev', '$2a$10$Iw9uaPO1FHnDIcvnzCyST.yxTi2FhlVwdnZJiC.9ptqkasceNb3UG', 'dev@example.com', true);

INSERT INTO `Group`
  (`group`)
VALUES
  ('admin'),
  ('pl'),
  ('pm'),
  ('dev');

INSERT INTO `User_Group`
  (`username`, `group`)
VALUES
--   ('inactive', 'admin'),
  ('admin', 'admin'),
  ('pl', 'pl'),
  ('pm', 'pm'),
  ('dev', 'dev');

-- INSERT INTO `Application`
--   (`App_Acronym`, `App_Rnumber`, `created_by`)
-- VALUES
--   ('animal', 1, 'pl');

-- INSERT INTO `App_Permit`
--   (`App_Acronym`, `permit`, `group`)
-- VALUES
--   ('animal', 'create', 'pl'),
--   ('animal', 'open', 'pm'),
--   ('animal', 'todo', 'dev'),
--   ('animal', 'doing', 'dev'),
--   ('animal', 'done', 'pl');

-- INSERT INTO `Plan`
--   (`Plan_app_Acronym`, `Plan_MVP_name`, `colour`, `created_by`)
-- VALUES
--   ('animal', 'bird', '#a9d6aa', 'pm'),
--   ('animal', 'fish', '#fbc6c6', 'pm');

-- INSERT INTO `Task`
--   (`Task_app_Acronym`, `Task_name`, `Task_plan`, `Task_description`, `Task_creator`)
-- VALUES
--   ('animal', 'crow', 'bird', 'greedy bird', 'pl'),
--   ('animal', 'koel', 'bird', 'noisy bird', 'pl'),
--   ('animal', 'parrot', 'bird', 'talkative bird', 'pl'),
--   ('animal', 'salmon', 'fish', 'delicious fish', 'pl'),
--   ('animal', 'tuna', 'fish', 'canned fish', 'pl');

-- UPDATE `Task`
-- SET `Task_state` = 'todo'
-- WHERE `Task_id` = 'animal_2';

-- UPDATE `Task`
-- SET `Task_state` = 'doing'
-- WHERE `Task_id` = 'animal_3';

-- UPDATE `Task`
-- SET `Task_state` = 'done'
-- WHERE `Task_id` = 'animal_4';

-- UPDATE `Task`
-- SET `Task_state` = 'closed'
-- WHERE `Task_id` = 'animal_5';

-- INSERT INTO `Note`
--   (`Task_id`, `content`, `created_by`, `created_at`)
-- VALUES
--   ('animal_1', 'better protect your chicken rice', 'pl', '2023-9-26 15:36:31'),
--   ('animal_1', 'always competing for our nasi lemak leftovers', 'pl', '2023-7-6 14:12:02'),
--   ('animal_1', 'they keep flying into my kopitiam, buay tahan', 'pl', '2023-7-6 14:12:02'),
--   ('animal_2', 'just when I thought it was quiet, they go again', 'pl', '2023-9-26 15:36:31'),
--   ('animal_2', 'stop ruining my beauty sleep', 'pl', '2023-7-6 14:12:02'),
--   ('animal_2', 'ooooooOOO ooooOOOOOOOOOO', 'pl', '2023-7-6 14:12:02'),
--   ('animal_3', 'never met a bird so chatty', 'pl', '2023-10-10 20:29:26'),
--   ('animal_3', 'noisier than my relatives during CNY', 'pl', '2023-9-26 15:36:31'),
--   ('animal_3', 'accidentally taught my parrot how to swear', 'pl', '2023-9-26 15:36:31'),
--   ('animal_4', 'got craving liao', 'pl', '2023-10-10 20:29:26'),
--   ('animal_4', 'yummy in my tummy', 'pl', '2023-9-26 15:36:31'),
--   ('animal_4', 'sashimi ai mai', 'pl', '2023-9-26 15:36:31'),
--   ('animal_5', 'tuna sandwiches, fast and tasty', 'pl', '2023-10-10 20:29:26'),
--   ('animal_5', 'quick and easy, perfect for a lazy lunch', 'pl', '2023-9-26 15:36:31'),
--   ('animal_5', 'keeps my wallet happy', 'pl', '2023-7-6 14:12:02');