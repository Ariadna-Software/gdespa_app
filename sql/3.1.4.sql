ALTER TABLE `wo_worker`   
  ADD COLUMN `extraHoursMix` DECIMAL(10,2) NULL AFTER `expenses`;

ALTER TABLE `mo_worker`   
  ADD COLUMN `extraHoursMix` DECIMAL(10,2) NULL AFTER `expenses`;