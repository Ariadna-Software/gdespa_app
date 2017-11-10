ALTER TABLE `pw`   
  ADD COLUMN `latitude` DECIMAL(10,7) NULL AFTER `isMeaMo`,
  ADD COLUMN `longitude` DECIMAL(10,7) NULL AFTER `latitude`;

UPDATE pw SET latitude = 8.9936000, longitude =  -79.5197300;