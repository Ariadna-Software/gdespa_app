ALTER TABLE `gdespa`.`item_stock`   
  ADD  UNIQUE INDEX `idx_stock_store_item` (`storeId`, `itemId`);
CREATE TABLE `gdespa`.`inventory`(  
  `inventoryId` INT(11) NOT NULL AUTO_INCREMENT,
  `inventoryDate` DATE,
  `storeId` INT(11),
  `workerId` INT(11),
  `comments` TEXT,
  PRIMARY KEY (`inventoryId`),
  CONSTRAINT `ref_inv_store` FOREIGN KEY (`storeId`) REFERENCES `gdespa`.`store`(`storeId`),
  CONSTRAINT `ref_inv_worker` FOREIGN KEY (`workerId`) REFERENCES `gdespa`.`worker`(`workerId`)
);
CREATE TABLE `gdespa`.`inventory_line`(  
  `inventoryLineId` INT(11) NOT NULL AUTO_INCREMENT,
  `inventoryId` INT(11),
  `itemId` INT(11),
  `oldStock` DECIMAL(10,2),
  `newStock` DECIMAL(10,2),
  PRIMARY KEY (`inventoryLineId`),
  CONSTRAINT `ref_invl_inv` FOREIGN KEY (`inventoryId`) REFERENCES `gdespa`.`inventory`(`inventoryId`) ON DELETE CASCADE,
  CONSTRAINT `ref_invl_item` FOREIGN KEY (`itemId`) REFERENCES `gdespa`.`item`(`itemId`)
);
  
ALTER TABLE `gdespa`.`item_stock`   
  ADD COLUMN `lastInvDate` DATE NULL AFTER `stock`,
  ADD COLUMN `lastInvId` INT NULL AFTER `lastInvDate`,
  ADD CONSTRAINT `ref_stock_inv` FOREIGN KEY (`lastInvId`) REFERENCES `gdespa`.`inventory`(`inventoryId`);

ALTER TABLE `gdespa`.`inventory`   
ADD COLUMN `close` BOOL NULL AFTER `comments`;

ALTER TABLE `gdespa`.`inventory`   
  CHANGE `close` `close` TINYINT(1) DEFAULT 0 NULL;
