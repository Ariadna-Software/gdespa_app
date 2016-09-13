# clean up old test records tidily
DELETE FROM api_key WHERE NOT apiKey LIKE '%*TS*%';
DELETE FROM user WHERE NOT name LIKE '%*TS*%';
DELETE FROM user_group WHERE NOT name LIKE '%*TS*%';