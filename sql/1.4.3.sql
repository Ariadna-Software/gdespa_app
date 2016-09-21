ALTER TABLE `gdespa`.`worker`   
  ADD COLUMN `blood_type` VARCHAR(255) NULL AFTER `department`;
ALTER TABLE `gdespa`.`worker`   
  CHANGE `blood_type` `bloodType` VARCHAR(255) CHARSET utf8 COLLATE utf8_general_ci NULL;
