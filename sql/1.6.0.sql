ALTER TABLE `gdespa`.`user`   
  ADD COLUMN `perReport` BOOL DEFAULT FALSE NULL AFTER `perStore`;
ALTER TABLE `gdespa`.`user`   
  ADD COLUMN `modPw` BOOL DEFAULT FALSE NULL AFTER `inventoryGeneral`,
  ADD COLUMN `seeNotOwner` BOOL DEFAULT FALSE NULL AFTER `modPw`;
ALTER TABLE `gdespa`.`user`   
  ADD COLUMN `modWoClosed` BOOL DEFAULT FALSE NULL AFTER `seeNotOwner`;  
  