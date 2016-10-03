ALTER TABLE `gdespa`.`user`   
  ADD COLUMN `perAdm` BOOL NULL AFTER `lang`,
  ADD COLUMN `perGes` BOOL NULL AFTER `perAdm`,
  ADD COLUMN `perStore` BOOL NULL AFTER `perGes`;
