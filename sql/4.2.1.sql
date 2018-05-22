ALTER TABLE `parameters`   
  ADD COLUMN `ucContaLumId` INT(11) NULL AFTER `initControlDocs`,
  ADD CONSTRAINT `ref_uccontalum` FOREIGN KEY (`ucContaLumId`) REFERENCES `cunit`(`cunitId`);
