ALTER TABLE `pw`   
  ADD COLUMN `profitLoses` DECIMAL(10,2) NULL AFTER `verified`;

UPDATE pw SET reference = TRIM(reference);


ALTER TABLE `doc_type`   
  ADD COLUMN `needToOpen` BOOL DEFAULT FALSE NULL AFTER `name`,
  ADD COLUMN `needToClose` BOOL DEFAULT FALSE NULL AFTER `needToOpen`;