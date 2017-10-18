ALTER TABLE `pw`   
  ADD COLUMN `profitLoses` DECIMAL(10,2) NULL AFTER `verified`;

UPDATE pw SET reference = TRIM(reference);