ALTER TABLE `status`   
  ADD COLUMN `order` INT(11) NULL AFTER `name`;
  INSERT INTO `status` (`statusId`, `name`) VALUES ('6', 'INTERCONEXION');
  INSERT INTO `status` (`statusId`, `name`) VALUES ('7', 'CALIDAD');
  UPDATE `status` SET `order` = '0' WHERE `statusId` = '0';
  UPDATE `status` SET `order` = '1' WHERE `statusId` = '1';
  UPDATE `status` SET `order` = '2' WHERE `statusId` = '2';
  UPDATE `status` SET `order` = '3' WHERE `statusId` = '6';
  UPDATE `status` SET `order` = '4' WHERE `statusId` = '3';
  UPDATE `status` SET `order` = '5' WHERE `statusId` = '4'; 
  UPDATE `status` SET `order` = '6' WHERE `statusId` = '5';
  UPDATE `status` SET `order` = '7' WHERE `statusId` = '7';

ALTER TABLE `pw`   
  ADD COLUMN `itxDate` DATE NULL AFTER `longitude`,
  ADD COLUMN `itxInCharge` INT(11) NULL AFTER `itxDate`,
  ADD COLUMN `itxRef` VARCHAR(255) NULL AFTER `itxInCharge`,
  ADD COLUMN `qlyDate` DATE NULL AFTER `itxRef`,
  ADD COLUMN `qlyInCharge` INT(11) NULL AFTER `qlyDate`,
  ADD COLUMN `qlyRef` VARCHAR(255) NULL AFTER `qlyInCharge`,
  ADD CONSTRAINT `ref_pw_itx` FOREIGN KEY (`itxInCharge`) REFERENCES `worker`(`workerId`),
  ADD CONSTRAINT `ref_pw_qly` FOREIGN KEY (`qlyInCharge`) REFERENCES `worker`(`workerId`);
