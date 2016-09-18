#------------------------
CREATE TABLE `gdespa`.`item_stock`(  
  `itemStockId` INT(11) NOT NULL AUTO_INCREMENT,
  `storeId` INT(11),
  `itemId` INT(11),
  `stock` DECIMAL(12,2),
  PRIMARY KEY (`itemStockId`),
  CONSTRAINT `ref_stock_store` FOREIGN KEY (`storeId`) REFERENCES `gdespa`.`store`(`storeId`),
  CONSTRAINT `ref_stock_item` FOREIGN KEY (`itemId`) REFERENCES `gdespa`.`item`(`itemId`)
);
#-----------------------
CREATE TABLE `gdespa`.`item_in`(  
  `itemInId` INT(11) NOT NULL AUTO_INCREMENT,
  `storeId` INT(11),
  `dateIn` DATE,
  `workerId` INT,
  `comments` TEXT,
  PRIMARY KEY (`itemInId`),
  CONSTRAINT `ref_itemin_store` FOREIGN KEY (`storeId`) REFERENCES `gdespa`.`store`(`storeId`),
  CONSTRAINT `ref_itemin_worker` FOREIGN KEY (`workerId`) REFERENCES `gdespa`.`worker`(`workerId`)
);
CREATE TABLE `gdespa`.`item_in_line`(  
  `itemInLineId` INT NOT NULL AUTO_INCREMENT,
  `itemInId` INT,
  `itemId` INT,
  `quantity` DECIMAL(10,2),
  PRIMARY KEY (`itemInLineId`),
  CONSTRAINT `ref_iteminline_itemin` FOREIGN KEY (`itemInId`) REFERENCES `gdespa`.`item_in`(`itemInId`),
  CONSTRAINT `ref_iteminline_item` FOREIGN KEY (`itemId`) REFERENCES `gdespa`.`item`(`itemId`)
);
#-----------------------
CREATE TABLE `gdespa`.`item_out`(  
  `itemOutId` INT(11) NOT NULL AUTO_INCREMENT,
  `storeId` INT(11),
  `dateOut` DATE,
  `workerId` INT,
  `comments` TEXT,
  PRIMARY KEY (`itemOutId`),
  CONSTRAINT `ref_itemout_store` FOREIGN KEY (`storeId`) REFERENCES `gdespa`.`store`(`storeId`),
  CONSTRAINT `ref_itemout_worker` FOREIGN KEY (`workerId`) REFERENCES `gdespa`.`worker`(`workerId`)
);
CREATE TABLE `gdespa`.`item_out_line`(  
  `itemOutLineId` INT NOT NULL AUTO_INCREMENT,
  `itemOutId` INT,
  `itemId` INT,
  `quantity` DECIMAL(10,2),
  PRIMARY KEY (`itemOutLineId`),
  CONSTRAINT `ref_itemoutline_itemin` FOREIGN KEY (`itemOutId`) REFERENCES `gdespa`.`item_out`(`itemOutId`),
  CONSTRAINT `ref_itemoutline_item` FOREIGN KEY (`itemId`) REFERENCES `gdespa`.`item`(`itemId`)
);
