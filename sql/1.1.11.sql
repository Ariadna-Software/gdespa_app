ALTER TABLE `gdespa`.`user`   
  ADD COLUMN `pwGeneral` BOOL DEFAULT 0 NULL AFTER `perStore`,
  ADD COLUMN `woGeneral` BOOL DEFAULT 0 NULL AFTER `pwGeneral`,
  ADD COLUMN `closureGeneral` BOOL DEFAULT 0 NULL AFTER `woGeneral`,
  ADD COLUMN `deliveryGeneral` BOOL DEFAULT 0 NULL AFTER `closureGeneral`,
  ADD COLUMN `itemInGeneral` BOOL DEFAULT 0 NULL AFTER `deliveryGeneral`,
  ADD COLUMN `itemOutGeneral` BOOL DEFAULT 0 NULL AFTER `itemInGeneral`,
  ADD COLUMN `inventoryGeneral` BOOL DEFAULT 0 NULL AFTER `itemOutGeneral`;
UPDATE USER SET pwGeneral = 0, woGeneral = 0, closureGeneral = 0, deliveryGeneral = 0, itemInGeneral = 0, itemOutGeneral = 0, inventoryGeneral = 0;