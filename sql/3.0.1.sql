ALTER TABLE `wo`   
  ADD COLUMN `thirdParty` BOOL DEFAULT FALSE NULL AFTER `closureId`,
  ADD COLUMN `thirdPartyCompany` VARCHAR(255) NULL AFTER `thirdParty`;
