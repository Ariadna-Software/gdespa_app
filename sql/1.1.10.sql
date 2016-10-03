ALTER TABLE `gdespa`.`closure`   
  ADD COLUMN `close` BOOL NULL AFTER `comments`;
ALTER TABLE `gdespa`.`closure` CHANGE `close` `close` TINYINT(1) DEFAULT 0 NULL; 
UPDATE closure SET close = 0;