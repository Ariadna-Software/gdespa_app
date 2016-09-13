# because we need a user group in order to create a user
INSERT INTO user_group (`userGroupId`, `name`) VALUES ('2', 'TestUserGroup'); 
# we create some users
INSERT INTO user (`name`, `userGroupId`, `login`, `password`,`lang`) VALUES ('User1', '2', 'login', 'password','es');
INSERT INTO user (`name`, `userGroupId`, `login`, `password`,`lang`) VALUES ('User2', '2', 'login', 'password','es');
INSERT INTO user (`name`, `userGroupId`, `login`, `password`,`lang`) VALUES ('User3', '2', 'login', 'password','es'); 