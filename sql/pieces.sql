CREATE TABLE `gdespa`.`worker`(  
  `workerId` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255),
  `ssId` VARCHAR(255),
  `address` VARCHAR(255),
  `zip` VARCHAR(255),
  `city` VARCHAR(255),
  `province` VARCHAR(255),
  `state` VARCHAR(255),
  `userId` INT(11),
  PRIMARY KEY (`workerId`),
  CONSTRAINT `ref_user` FOREIGN KEY (`userId`) REFERENCES `gdespa`.`user`(`userId`)
);
ALTER TABLE `gdespa`.`worker`   
  ADD COLUMN `phone` VARCHAR(255) NULL AFTER `userId`,
  ADD COLUMN `email` VARCHAR(255) NULL AFTER `phone`;
  
 ALTER TABLE `gdespa`.`worker`   
  ADD COLUMN `code` INT(11) NULL AFTER `email`,
  ADD COLUMN `position` VARCHAR(255) NULL AFTER `code`,
  ADD COLUMN `department` VARCHAR(255) NULL AFTER `position`;
