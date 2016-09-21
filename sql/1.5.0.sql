CREATE TABLE `gdespa`.`delivery`(  
  `deliveryId` INT(11) NOT NULL AUTO_INCREMENT,
  `pwId` INT(11),
  `lastDate` DATE,
  `workerId` INT(11),
  `comments` TEXT,
  PRIMARY KEY (`deliveryId`),
  CONSTRAINT `ref_dly_pw` FOREIGN KEY (`pwId`) REFERENCES `gdespa`.`pw`(`pwId`),
  CONSTRAINT `ref_dly_worker` FOREIGN KEY (`workerId`) REFERENCES `gdespa`.`worker`(`workerId`)
);
CREATE TABLE `gdespa`.`delivery_line`(  
  `deliveryLineId` INT(11) NOT NULL AUTO_INCREMENT,
  `deliveryId` INT(11),
  `itemId` INT(11),
  `estimate` DECIMAL(10,2),
  `done` DECIMAL(10,2),
  `quantity` DECIMAL(10,2),
  PRIMARY KEY (`deliveryLineId`),
  CONSTRAINT `ref_dlyl_dly` FOREIGN KEY (`deliveryId`) REFERENCES `gdespa`.`delivery`(`deliveryId`) ON DELETE CASCADE,
  CONSTRAINT `ref_dlyl_item` FOREIGN KEY (`itemId`) REFERENCES `gdespa`.`item`(`itemId`)
);
ALTER TABLE `gdespa`.`delivery`   
  ADD COLUMN `storeId` INT(11) NULL AFTER `workerId`,
  ADD CONSTRAINT `ref_dly_store` FOREIGN KEY (`storeId`) REFERENCES `gdespa`.`store`(`storeId`);