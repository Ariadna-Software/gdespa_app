# clean up old test records
DELETE FROM user WHERE name LIKE '%Test%';
DELETE FROM user_group WHERE name LIKE '%Test%';
# because we need a user group in order to create a user
INSERT INTO user_group (`userGroupId`, `name`) VALUES ('2', 'TestUserGroup'); 