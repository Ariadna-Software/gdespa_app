ALTER TABLE `gdespa`.`closure_line`   
  ADD COLUMN `amount` DECIMAL(12,2) NULL AFTER `done`,
  ADD COLUMN `lastClosure` DECIMAL(5,2) NULL AFTER `amount`;
