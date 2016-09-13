# because we need a user group in order to create a user
INSERT INTO user_group (`userGroupId`, `name`) VALUES ('-99', '*TS*GROUP'); 
# we create some users
INSERT INTO user (`userId`,`name`, `userGroupId`, `login`, `password`, `lang`) VALUES ('-99','*TS*USER1', '-99', 'login', 'password', 'es');
# create an api key allways correct for test purposes
INSERT INTO api_key (`apiKeyId`, `userId`, `getDateTime`, `expireDateTime`, `apiKey`) VALUES ('-99', '-99', '2001-01-01 00:00:00', '2100-01-01 00:00:00', '*TS*KEY');
