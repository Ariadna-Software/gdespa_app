ALTER TABLE `parameters`   
  ADD COLUMN `initControlDocs` DATE NULL AFTER `heEHN`;

ALTER TABLE `pw`   
  ADD COLUMN `isMeaMo` BOOL DEFAULT FALSE NULL AFTER `profitLoses`;